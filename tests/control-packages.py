"""Execute the actual YAML sequences in a synthetic HA service/state model.
Does not import HA or connect to any real device; live integration is a separate gate.
"""
import math
from datetime import datetime
from pathlib import Path
import yaml
from jinja2.nativetypes import NativeEnvironment

def number(v):
    try: return math.isfinite(float(v))
    except (TypeError, ValueError): return False

class Stop(Exception): pass
class Model:
    def __init__(self, config):
        self.config=config; self.states={}; self.attrs={}; self.calls=[]; self.fail=None
        self.env=NativeEnvironment(); self.env.filters['is_number']=number
        self.env.filters['states']=lambda e:self.states.get(e,'unavailable')
    def value(self,v,variables):
        if isinstance(v,str) and ('{{' in v or '{%' in v):
            result=self.env.from_string(v).render(**variables,states=lambda e:self.states.get(e,'unavailable'),state_attr=lambda e,k:self.attrs.get(e,{}).get(k),is_number=number,now=lambda:datetime(2026,11,16,7,0))
            if isinstance(result,str):
                result=result.strip()
                if result in ['True','False']:return result=='True'
            return result
        return v
    def sequence(self,actions,variables=None):
        variables=dict(variables or {})
        for a in actions:
            if 'condition' in a:
                ok=(self.states.get(a['entity_id'])==a['state']) if a['condition']=='state' else bool(self.value(a['value_template'],variables))
                if not ok: raise Stop()
            elif 'variables' in a:
                for k,v in a['variables'].items():variables[k]=self.value(v,variables)
            elif 'choose' in a:
                for choice in a['choose']:
                    if self.value(choice['conditions'],variables):self.sequence(choice['sequence'],variables);break
            elif 'repeat' in a:
                for item in a['repeat']['for_each']:self.sequence(a['repeat']['sequence'],dict(variables,repeat={'item':item}))
            elif 'if' in a:
                if all(self.value(c['value_template'],variables) for c in a['if']):self.sequence(a['then'],variables)
            elif 'action' in a:
                action=a['action'];data={k:self.value(v,variables) for k,v in a.get('data',{}).items()}
                if action.startswith('script.'):
                    self.sequence(self.config['script'][action.split('.',1)[1]]['sequence'],data);continue
                entity=self.value(a.get('target',{}).get('entity_id'),variables)
                if self.fail==(action,entity):self.fail=None;raise RuntimeError('Injected service failure')
                self.calls.append((action,entity,data))
                if action.endswith('.set_value'):self.states[entity]=data['value']
                elif action.endswith('.turn_on'):self.states[entity]='on'
                elif action.endswith('.turn_off'):self.states[entity]='off'
            else:raise AssertionError(a)
    def script(self,name):
        try:self.sequence(self.config['script'][name]['sequence'])
        except Stop:pass

cfg=yaml.safe_load(Path('examples/electric-boiler-tech-package.yaml').read_text())
assert cfg['script']['futestuning_electric_tech_transition']['mode']=='single'
for key in ['on','off']:
    assert cfg['script']['futestuning_electric_tech_'+key]['sequence'][0]['action']=='script.futestuning_electric_tech_transition'
assert all('initial' not in v for v in cfg['input_number'].values())
ids=['number.wifi_rs_szivattyu_beallitasok_inditasi_homerseklet'+suffix for suffix in ['', '_2','_3']]
flag='input_boolean.futestuning_electric_mode'
def ready():
    m=Model(cfg);m.states[flag]='off';m.states.update(zip(ids,['35','30','40']));return m
m=ready();m.script('futestuning_electric_tech_on');assert [m.states[e] for e in ids]==[10,10,10];assert m.states[flag]=='on'
m.script('futestuning_electric_tech_on');m.script('futestuning_electric_tech_off');assert [m.states[e] for e in ids]==[35,30,40];assert m.states[flag]=='off'
for bad in ['unavailable','unknown','NaN','Infinity','9','81']:
    m=ready();m.states[ids[1]]=bad;m.script('futestuning_electric_tech_on');assert not m.calls,bad
m=ready();m.fail=('number.set_value',ids[1])
try:m.script('futestuning_electric_tech_on')
except RuntimeError:pass
assert m.states[flag]=='on';m.script('futestuning_electric_tech_off');assert [m.states[e] for e in ids]==[35,30,40]
assert all(action.startswith(('number.','input_number.','input_boolean.')) for action,_,_ in m.calls)
print('PASS: actual electric-mode YAML; save/10/restore, repeated enable, invalid inputs, partial-failure recovery and one shared lock')

cfg=yaml.safe_load(Path('examples/gree-weekly-schedule-package.yaml').read_text())
assert len(cfg['automation'])==4
for a in cfg['automation']:
    assert a['triggers']==[{'trigger':'time_pattern','minutes':'/1'}]
    enabled=a['conditions'][0]['entity_id'];actions=a['actions'];entity=next(x['target']['entity_id'] for x in actions if x.get('action')=='climate.set_hvac_mode')
    source='input_text.'+next(k for k in cfg['input_text'] if k in actions[0]['variables']['command'])
    for slot,active,expected in [('07:00,heat,22;22:00,off','on',2),('07:00,off','on',1),('07:00,heat,22','off',0),('08:00,heat,22','on',0),('07:00,heat,NaN','on',0),('07:00,heat,99','on',0),('07:00,bogus,22','on',0)]:
        m=Model(cfg);m.states.update({enabled:active,source:slot+'||||||',entity:'off'});m.attrs[entity]={'hvac_modes':['off','heat','cool','auto'],'min_temp':16,'max_temp':30}
        try:m.sequence(a['conditions']+actions)
        except Stop:pass
        assert len(m.calls)==expected,(a['id'],slot,m.calls)
        assert all(e==entity and action.startswith('climate.') for action,e,_ in m.calls)
print('PASS: all four actual weekly Gree YAML programs; enable, exact-minute trigger, off, invalid mode and invalid temperature')
