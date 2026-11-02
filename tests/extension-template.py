"""Validate YAML and template expressions; native HA timer lifecycle needs live HA."""
import math
from pathlib import Path
import yaml
from jinja2 import Environment

config = yaml.safe_load(Path('examples/extension-heating-package.yaml').read_text())
assert set(config) == {'template'}
sensors = config['template'][0]['binary_sensor']
assert len(sensors) == 2
assert len({s['unique_id'] for s in sensors}) == 2
for sensor in sensors:
    assert sensor['delay_on'] == sensor['delay_off'] == {'seconds': 5}
    assert sensor['default_entity_id'] == 'binary_sensor.' + sensor['unique_id']
    power = ('sensor.szuloi_halo_futesi_szivattyu_s60tpf_sonoff_1002a6b517_power'
             if 'szuloi' in sensor['unique_id'] else
             'sensor.lenti_garazs_futesi_szivattyu_sonoff_1002a6d5d3_power')
    for value, available, on in [('0.0', True, False), ('9.9', True, False),
            ('10', True, True), ('10.1', True, True), ('100', True, True),
            ('unknown', False, False), ('unavailable', False, False),
            ('', False, False), ('-1', False, False), ('NaN', False, False),
            ('Infinity', False, True)]:
        def number(v):
            try:
                return math.isfinite(float(v))
            except (ValueError, TypeError):
                return False
        env = Environment()
        env.globals.update(states=lambda entity: value if entity == power else 'unknown',
                           state_attr=lambda entity, key: 'W' if entity == power and key == 'unit_of_measurement' else None,
                           is_number=number)
        assert env.from_string(sensor['availability']).render() == str(available), (sensor['unique_id'], value)
        # An unavailable sensor cannot be mistaken for off, regardless of state expression.
        if available:
            assert env.from_string(sensor['state']).render() == str(on)
print('PASS: two templates; >=10 W boundary; invalid-data availability; both 5 s delays configured')
