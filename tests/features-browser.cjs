module.exports=async function(p,assert,fs){
 await p.evaluate(()=>{c.setConfig({view:'home'});TECH_CIRCUIT_ENABLE.forEach(id=>h.states[id]={state:'on'});c.hass=h;calls.length=0});
 // Actual TECH enable state gates both pump rotor and flowing arrows.
 await p.evaluate(()=>{
  for(let i=0;i<3;i++)for(const active of ['on','off','unavailable']){
   h.states[TECH_CIRCUIT_ENABLE[i]].state=active;c.cfg.pump_feedback_entities={[i+1]:'binary_sensor.fixture_pump'};h.states['binary_sensor.fixture_pump']={state:'on'};
   const expected=active==='on'?true:active==='off'?false:null;if(c.pump(i).state!==expected)throw Error('TECH enable gate');
   if(!c.zone(i).includes(active==='off'?'Inaktív':active==='unavailable'?'Nincs adat':'Aktív'))throw Error('TECH label');
   h.states[TECH_CIRCUIT_ENABLE[i]].state='on';
  }delete c.cfg.pump_feedback_entities;c.hass=h;
 });
 p.on('dialog',dialog=>dialog.accept());
 for(let i=0;i<3;i++){
  await p.evaluate(i=>{calls.length=0;c.editTarget(i)},i);await p.locator('#tech-switch').click();
  assert.deepEqual(await p.evaluate(()=>calls.splice(0)),[['switch','turn_off',{entity_id:await p.evaluate(i=>TECH_CIRCUIT_ENABLE[i],i)}]]);
  await p.locator('#close').click();
 }
 // Four independent weekly editors save only their own HA helpers.
 const acs=await p.evaluate(()=>Object.keys(GREE_WEEKLY));
 for(const id of acs){
  await p.evaluate(id=>{const slug=GREE_WEEKLY[id];h.states['input_text.gree_weekly_'+slug]={state:'||||||'};h.states['input_boolean.gree_weekly_'+slug+'_enabled']={state:'off'};calls.length=0;c.openAcSchedule(id)},id);
  await p.locator('#weekly-master').check();await p.locator('[data-weekly-day="0"]').check();
  await p.locator('[data-weekly-from="0"]').fill('07:00');await p.locator('[data-weekly-to="0"]').fill('22:00');await p.locator('[data-weekly-temp="0"]').fill('22');
  await p.locator('[data-save-weekly]').click();const calls=await p.evaluate(()=>window.calls.splice(0));const slug=await p.evaluate(id=>GREE_WEEKLY[id],id);
  assert.deepEqual(calls,[['input_text','set_value',{entity_id:'input_text.gree_weekly_'+slug,value:'07:00,heat,22;22:00,off||||||'}],['input_boolean','turn_on',{entity_id:'input_boolean.gree_weekly_'+slug+'_enabled'}]]);
 }
 // The electric button sends the intended script only, never a pump or boiler call.
 await p.evaluate(()=>{h.states[TECH_ELECTRIC.flag]={state:'off'};for(const id of [TECH_ELECTRIC.on,TECH_ELECTRIC.off,'script.futestuning_electric_tech_transition'])h.states[id]={state:'off'};TECH_ELECTRIC.numbers.forEach(id=>h.states[id]={state:'35'});calls.length=0;c.hass=h});
 await p.locator('[data-tech-electric]').click();assert.deepEqual(await p.evaluate(()=>calls.splice(0)),[['script','futestuning_electric_tech_on',{}]]);
 await p.evaluate(()=>{h.states[TECH_ELECTRIC.flag].state='on';c.hass=h});await p.locator('[data-tech-electric]').click();assert.deepEqual(await p.evaluate(()=>calls.splice(0)),[['script','futestuning_electric_tech_off',{}]]);
 // Read-only history: a real REST response shape, weather attributes, data gaps.
 await p.evaluate(()=>{
  c.setConfig({view:'home',outdoor_entity:'weather.fixture'});h.config={time_zone:'Europe/Budapest',unit_system:{temperature:'°C'}};
  h.states['weather.fixture']={entity_id:'weather.fixture',state:'cloudy',attributes:{temperature:8,temperature_unit:'°C'}};
  window.historyRequests=[];h.callApi=async(method,path)=>{
   historyRequests.push([method,path]);const ids=new URLSearchParams(path.split('?')[1]).get('filter_entity_id').split(',');
   const end=Date.now(),start=end-7*86400000;
   return ids.map(id=>[0,1,2,3].map((part)=>({entity_id:id,last_changed:new Date(start+part*3600000).toISOString(),last_updated:new Date(start+part*3600000).toISOString(),state:part===1?'unavailable':id.startsWith('switch.')?(part===2?'on':'off'):id.startsWith('weather.')?'cloudy':'40',attributes:id.startsWith('weather.')?{temperature:8,temperature_unit:'°C'}:{unit_of_measurement:'°C',current_temperature:21,temperature:22}})));
  };calls.length=0;c.hass=h;
 });
 await p.getByRole('button',{name:'Diagnosztika és előzmények'}).click();await p.getByRole('heading',{name:'Napi összehasonlítás · 7 nap'}).waitFor();
 assert.equal(await p.evaluate(()=>calls.length),0);const request=await p.evaluate(()=>historyRequests[0]);assert.equal(request[0],'GET');assert(request[1].startsWith('history/period/'));assert(!request[1].includes('szuloi'));assert(!request[1].includes('lenti_garazs'));
 assert.equal(await p.locator('.history-chart').count(),1);assert(await p.evaluate(()=>{const rgb=getComputedStyle(c.shadowRoot.querySelector('.history-table td')).color.match(/[\d.]+/g).slice(0,3).map(Number);const light=v=>v.map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4}).reduce((s,n,i)=>s+n*[.2126,.7152,.0722][i],0);return (light(rgb)+.05)/(light([6,39,64])+.05)>=4.5}),'Readable diagnostic table');assert(await p.locator('.history-table tbody tr').count()>=7);
 const dl=p.waitForEvent('download');await p.getByRole('button',{name:'Napi CSV',exact:true}).click();const download=await dl;await download.saveAs('test-results/history-test.csv');assert.match(fs.readFileSync('test-results/history-test.csv','utf8'),/confirmed_off_on/);
 for(const width of [1024,390]){await p.setViewportSize({width,height:768});assert(await p.evaluate(()=>{const d=c.shadowRoot.querySelector('.history-dialog');return d.getBoundingClientRect().right<=innerWidth&&d.scrollWidth<=d.clientWidth+2}));await p.evaluate(()=>{c.shadowRoot.querySelector('.history-dialog').scrollTop=0});await p.screenshot({path:`test-results/history-${width}.png`});}
 await p.keyboard.press('Escape');assert.equal(await p.locator('.history-dialog').count(),0);
 await p.evaluate(()=>{h.callApi=async()=>[]});await p.getByRole('button',{name:'Diagnosztika és előzmények'}).click();await p.getByRole('heading',{name:'Napi összehasonlítás · 7 nap'}).waitFor();assert.equal(await p.evaluate(()=>c.historyData.rows[0].demands[0].hours),null);await p.keyboard.press('Escape');
 await p.evaluate(()=>{h.callApi=async()=>{throw Error('Fixture permission denied')}});await p.getByRole('button',{name:'Diagnosztika és előzmények'}).click();await p.getByText('Fixture permission denied',{exact:true}).waitFor();await p.keyboard.press('Escape');
 console.log('PASS: TECH enable controls, four weekly editors, electric scripts, Recorder API, missing histories, CSV, permissions and responsive diagnostics');
};
