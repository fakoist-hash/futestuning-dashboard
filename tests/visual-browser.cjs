const fs=require('fs'),assert=require('assert');
(async()=>{let chromium,opts={headless:true};if(process.env.FT_LOCAL_BROWSER){chromium=require('/tmp/futes-browser/node_modules/playwright-core').chromium;const c=(await import('/tmp/futes-browser/node_modules/@sparticuz/chromium/build/index.js')).default;opts={args:c.args,executablePath:process.env.FT_CHROMIUM_PATH||"/tmp/chromium-futes",headless:true}}else chromium=require('playwright').chromium;
const b=await chromium.launch(opts),p=await b.newPage();await p.route('http://fixture.test/**',r=>r.fulfill({contentType:'text/html',body:'<body style="margin:0;background:#001321"><futestuning-card></futestuning-card></body>'}));await p.goto('http://fixture.test/futes/fooldal');await p.addScriptTag({content:fs.readFileSync('dist/futestuning-dashboard.js','utf8')});await p.evaluate(()=>{window.calls=[];window.c=document.querySelector('futestuning-card');c.setConfig({view:'home'});const states={};const st=(id,state,attributes={})=>states[id]={state,attributes};st(DATA.buffer,'58');st(DATA.alert,'off');DATA.circuits.forEach((x,i)=>{st(x[1],[28,27.3,23.8][i]+'');st(x[2],[50,35,50][i]+'',{min:10,max:80,step:1});st(x[3],i===2?'off':'on')});DATA.rooms.forEach((r,i)=>{if(r[2])st(r[2],(21+i*.1)+'');(ROOM_EXTRAS[r[1]]?.climates||[r[3]]).filter(Boolean).forEach(id=>st(id,'heat',{current_temperature:21,temperature:22,min_temp:5,max_temp:30,target_temp_step:.5,hvac_action:i%2?'idle':'heating',preset_modes:['eco','comfort','sleep','away'],preset_mode:'comfort'}))});Object.values(ROOM_EXTRAS).forEach(x=>{if(x.ac)st(x.ac,'cool',{temperature:23,current_temperature:22,hvac_modes:['off','heat','cool','auto'],fan_modes:['auto','low','high'],fan_mode:'auto',min_temp:16,max_temp:30})});st(BOILER.switch,'on');st(BOILER.power,'0');window.h={states,callService:async(...a)=>{calls.push(a)}};c.hass=h});fs.mkdirSync('test-results',{recursive:true});
await p.evaluate(()=>{const r=DATA.rooms.find(r=>c.isLivingRoom(r)),floor=DATA.circuits[1][3],rad=DATA.circuits[2][3],before=JSON.stringify(h.states),cfg={...c.cfg},count=calls.length;
for(const f of ['on','off','unavailable'])for(const d of ['on','off','unavailable'])for(const temp of ['29.9','30','34.9','35','unknown']){
 h.states[floor].state=f;h.states[rad].state=d;h.states[DATA.buffer].state=temp;
 const expectedPart=(d,limit)=>d==='off'?'idle':d==='unavailable'?'unknown':temp!=='unknown'&&Number(temp)>=limit?'heating':'demand';
 const a=expectedPart(f,30),b=expectedPart(d,35),expected=[a,b].includes('heating')?'heating':[a,b].includes('demand')?'demand':a==='idle'&&b==='idle'?'idle':'unknown';
 if(c.roomAppearance(r)!==expected)throw Error('Living OR '+f+'/'+d+'/'+temp);
 const parts=c.livingParts();if(parts[0].appearance!==a||parts[1].appearance!==b)throw Error('Living branch state');
 c.setConfig({view:'rooms'});c.hass=h;const tile=c.shadowRoot.querySelector('[data-room="'+r[1]+'"]').closest('article');if(!tile.classList.contains(expected)||(tile.querySelectorAll('.living-part').length!==2||tile.querySelectorAll('[data-tile-step]').length!==2))throw Error('Living rendered parts');if(tile.querySelectorAll('.heating-flame').length!==(expected==='heating'?1:0))throw Error('Flame must follow heating state');
}
// A real pump signal takes priority, independently for each heating circuit.
c.cfg.pump_feedback_entities={2:'binary_sensor.test_floor',3:'binary_sensor.test_rad'};h.states[floor].state='off';h.states[rad].state='off';h.states[DATA.buffer].state='20';h.states['binary_sensor.test_floor']={state:'on'};h.states['binary_sensor.test_rad']={state:'off'};if(c.roomAppearance(r)!=='heating'||c.livingParts()[1].appearance!=='idle')throw Error('Independent floor feedback');h.states['binary_sensor.test_floor'].state='off';h.states['binary_sensor.test_rad'].state='on';if(c.roomAppearance(r)!=='heating'||c.livingParts()[0].appearance!=='idle')throw Error('Independent radiator feedback');
h.states['binary_sensor.test_rad'].state='unavailable';h.states[rad].state='on';h.states[DATA.buffer].state='60';if(c.roomAppearance(r)!=='demand')throw Error('Lost pump feedback must not fall back');
// Direct floor SONOFF entity wins over an alias, including unavailable.
delete c.cfg.pump_feedback_entities;const direct='switch.padlo_szivattyu_mini_d_sonoff_10029bc9ca_1';h.states[direct]={state:'off'};h.states[floor].state='on';if(c.livingParts()[0].appearance!=='idle')throw Error('Direct floor priority');h.states[direct].state='unavailable';if(c.livingParts()[0].appearance!=='unknown')throw Error('Direct floor unavailable');
if(calls.length!==count)throw Error('State tests issued service call');h.states=JSON.parse(before);c.setConfig(cfg);c.hass=h;});

// Extension heating uses delayed binary feedback, never plug relay state.
await p.evaluate(()=>{const saved=JSON.stringify(h.states),cfg={...c.cfg},count=calls.length;
c.setConfig({view:'rooms'});
for(const [name,m] of Object.entries(EXTENSION_HEATING)){
 const r=DATA.rooms.find(r=>r[1]===name);
 h.states[ROOM_EXTRAS[name].pump]={state:'on'}; // Historical relay on + 0 W must still be idle.
 for(const state of ['on','off','unknown','unavailable',null]){
  h.states[m.power]={state:'10',attributes:{unit_of_measurement:'W'}};
  if(state===null)delete h.states[m.feedback];else h.states[m.feedback]={state};
  const expected=state==='on'?'heating':state==='off'?'idle':'unknown';
  c.hass=h;const tile=c.shadowRoot.querySelector('[data-room="'+name+'"]').closest('article');
  if(c.roomAppearance(r)!==expected||!tile.classList.contains(expected))throw Error('Extension state '+name+'/'+state);
  if(tile.querySelectorAll('.heating-flame').length!==(state==='on'?1:0))throw Error('Extension flame');
  if(tile.querySelectorAll('[data-tile-step]').length!==2)throw Error('Extension controls changed');
  if(c.roomStatus(r)!==({on:'Fűt',off:'Nem fűt'}[state]||'Nincs adat'))throw Error('Extension status');
 }
 h.states[m.power]={state:'0.0',attributes:{unit_of_measurement:'W'}};h.states[m.feedback]={state:'off'};if(c.roomAppearance(r)!=='idle')throw Error('Historical 0 W misread as heating');
 h.states[m.feedback]={state:'on'};
 for(const value of ['unknown','unavailable','',null,'NaN','Infinity','-1']){
  h.states[m.power]={state:value,attributes:{unit_of_measurement:'W'}};
  if(c.roomAppearance(r)!=='unknown')throw Error('Missing raw power must not show running or off');
 }
 delete h.states[m.power];if(c.roomAppearance(r)!=='unknown')throw Error('Absent power');
 h.states[m.power]={state:'10',attributes:{unit_of_measurement:'kWh'}};
 if(c.roomAppearance(r)!=='unknown')throw Error('Energy is not power');
 // Respect the server debounce in both directions; no immediate raw-power fallback.
 for(const [watts,binary,expected] of [['9.9','on','heating'],['10','off','idle'],['10','on','heating'],['0','off','idle']]){
  h.states[m.power]={state:watts,attributes:{unit_of_measurement:'W'}};h.states[m.feedback]={state:binary};
  if(c.roomAppearance(r)!==expected)throw Error('Server delay bypassed');
 }
}
if(calls.length!==count)throw Error('Extension display issued service call');
h.states=JSON.parse(saved);c.setConfig(cfg);c.hass=h;});

// Extension pumps and arrows share the room-card feedback and never command devices.
await p.evaluate(()=>{const saved=JSON.stringify(h.states),cfg={...c.cfg},count=calls.length;c.setConfig({view:'plant'});
const garage=EXTENSION_HEATING['Lenti garázs'],bedroom=EXTENSION_HEATING['Szülői háló'];
for(const a of ['on','off','unavailable'])for(const b of ['on','off','unavailable']){
 for(const [m,state] of [[garage,a],[bedroom,b]]){h.states[m.power]={state:'25',attributes:{unit_of_measurement:'W'}};h.states[m.feedback]={state};}
 const parse=s=>s==='on'?true:s==='off'?false:null,expected={garage:parse(a),bedroom:parse(b),charge:a==='on'||b==='on'?true:a==='off'&&b==='off'?false:null};
 if(JSON.stringify(c.extensionPumps())!==JSON.stringify(expected))throw Error('Extension OR state '+a+'/'+b);c.hass=h;
 for(const [key,state] of Object.entries(expected)){
  const pump=c.shadowRoot.querySelector('[data-extension-pump="'+key+'"]');if(!pump||pump.dataset.running!==(state===null?'unknown':String(state)))throw Error('Extension pump state '+key);
  if(!!pump.querySelector('.pump-spin')!==(state===true))throw Error('Extension rotor '+key);
  const flow=c.shadowRoot.querySelector('[data-extension-flow="'+key+'"]');if(!!flow!==(state===true))throw Error('Extension flow '+key);
  if(flow){if(flow.querySelectorAll('.flow-hot animateMotion').length!==3||flow.querySelectorAll('.flow-cold animateMotion').length!==3)throw Error('Missing hot/cold flow');}
 }
}
if(calls.length!==count)throw Error('Extension visualization sent a command');h.states=JSON.parse(saved);c.setConfig(cfg);c.hass=h;});

// Flow arrows use the same operation state as the rotating pumps.
await p.evaluate(()=>{const states=JSON.stringify(h.states),cfg={...c.cfg},count=calls.length;
c.setConfig({view:'plant',pump_feedback_entities:{1:'binary_sensor.test_pump1',2:'binary_sensor.test_pump2',3:'binary_sensor.test_pump3'}});
for(const pattern of [['off','off','off'],['on','off','off'],['off','on','off'],['off','off','on'],['on','on','on'],['unavailable','off','unavailable']]){
 pattern.forEach((state,i)=>h.states['binary_sensor.test_pump'+(i+1)]={state});c.hass=h;
 const svg=c.shadowRoot.querySelector('.plant-svg');if([...svg.querySelectorAll('path')].some(x=>/^m[0-9]+ (143|523)/.test(x.getAttribute('d'))))throw Error('Static pipe arrow remains');const expected=pattern.flatMap((v,i)=>v==='on'?[String(i+1)]:[]),actual=[...svg.querySelectorAll('[data-flow-circuit]')].map(x=>x.dataset.flowCircuit);
 if(JSON.stringify(expected)!==JSON.stringify(actual))throw Error('Flow must follow running pumps '+pattern);
 for(const node of svg.querySelectorAll('[data-flow-circuit]')){const i=Number(node.dataset.flowCircuit)-1,x=[480,675,870][i];for(const [selector,path] of [['.flow-hot',`M390 150H${x}V421`],['.flow-cold',`M${x+70} 466V530H390V430`]]){const motions=[...node.querySelectorAll(selector+' animateMotion')];if(motions.length!==5||motions.some(m=>m.getAttribute('path')!==path||m.getAttribute('rotate')!=='auto'))throw Error('Incorrect flow route '+selector)}}
}
h.states['binary_sensor.test_pump2'].state='on';c.hass=h;
if(calls.length!==count)throw Error('Flow animation sent device command');h.states=JSON.parse(states);c.setConfig(cfg);c.hass=h;});
// Verify real SVG movement without issuing any physical device commands.
await p.evaluate(()=>{c.setConfig({view:'plant'});c.hass=h;const svg=c.shadowRoot.querySelector('.plant-svg');svg.pauseAnimations();svg.setCurrentTime(2);window.ftMotionStart=svg.querySelector('animateMotion')?.parentNode.getCTM()?.e;svg.setCurrentTime(3);const moved=svg.querySelector('animateMotion')?.parentNode.getCTM()?.e;if(ftMotionStart===undefined||moved===ftMotionStart)throw Error('Flow arrows do not move');svg.unpauseAnimations()});
await p.emulateMedia({reducedMotion:'reduce'});assert(await p.evaluate(()=>getComputedStyle(c.shadowRoot.querySelector('.flow-arrows')).display==='none'),'reduced motion preference');await p.emulateMedia({reducedMotion:'no-preference'});
await p.evaluate(()=>{c.setConfig({view:'home'});c.hass=h});
for(const view of ['home','plant','rooms'])for(const width of [1440,1180,1024,820,390]){await p.setViewportSize({width,height:900});await p.evaluate(v=>{c.setConfig({view:v});c.hass=h},view);const bad=await p.evaluate(()=>[...c.shadowRoot.querySelectorAll('.zone,.summarybox,.dialtext,.preset,.detailhead')].filter(e=>e.scrollWidth>e.clientWidth+3).map(e=>({class:e.className,txt:e.innerText})));assert.deepEqual(bad,[],view+' '+width+' overflow');const overlap=await p.evaluate(()=>[...c.shadowRoot.querySelectorAll('.floor')].some(f=>{const a=f.querySelector('.floorlabel').getBoundingClientRect(),b=f.querySelector('.roomgrid').getBoundingClientRect();return Math.min(a.right,b.right)-Math.max(a.left,b.left)>2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2}));assert(!overlap,'floor label overlaps room cards');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),view+' page overflow '+width);if([1440,1180].includes(width))await p.screenshot({path:`test-results/${view}-${width}.png`,fullPage:true});}

// Leave room for HA's navigation bar and assert actual content fit, not clipped roots.
for(const view of ['home','plant'])for(const [width,height] of [[1024,768],[1112,834],[1180,820],[1024,700]])for(const sidebar of [0,240]){
 await p.setViewportSize({width,height});
 await p.evaluate(({view,sidebar})=>{document.body.style.paddingTop='64px';document.body.style.paddingLeft=sidebar+'px';c.setConfig({view});c.hass=h},{view,sidebar});
 const metrics=await p.evaluate(()=>{const root=c.shadowRoot.querySelector('main'),rr=root.getBoundingClientRect(),nodes=[...root.querySelectorAll('.zone,.summarybox,.mast,.banner,.plant-top,.plant-bottom,.diagram,.plant-svg')];return {bottom:rr.bottom,scroll:root.scrollHeight-root.clientHeight,bad:nodes.filter(x=>{const r=x.getBoundingClientRect();return r.bottom>rr.bottom+2||r.right>rr.right+2||x.scrollWidth>x.clientWidth+3||x.scrollHeight>x.clientHeight+3}).map(x=>({cl:x.className.baseVal||x.className,txt:x.textContent,sw:x.scrollWidth,cw:x.clientWidth,sh:x.scrollHeight,ch:x.clientHeight}))}});
 if(metrics.bad.length){console.log(JSON.stringify({view,width,height,sidebar,metrics}));await p.screenshot({path:'test-results/fit-error.png'})}assert(metrics.bottom<=height,view+' root height '+width);assert(metrics.scroll<=2,view+' hidden vertical content '+width+' sidebar '+sidebar);assert.deepEqual(metrics.bad,[],view+' content fit '+width+' sidebar '+sidebar);
 if(view==='plant'){assert.equal(await p.locator('.plant-svg').count(),1);assert.equal(await p.locator('.plant-svg [data-target]').count(),3)}
 if(!sidebar&&[1024,1112].includes(width))await p.screenshot({path:`test-results/${view}-ipad-${width}-${height}.png`});
}
await p.evaluate(()=>{document.body.style.paddingTop='0';document.body.style.paddingLeft='0'});
await p.setViewportSize({width:1180,height:900});await p.evaluate(()=>{c.setConfig({view:'home'});c.hass=h});await p.getByRole('button',{name:'Pince célhőmérséklet'}).click();await p.locator('#plus').click();await p.getByRole('button',{name:'Mentés',exact:true}).click();assert.deepEqual(await p.evaluate(()=>calls.pop()),['number','set_value',{entity_id:'number.wifi_rs_futeskor_1_szelep_beallitott_hom',value:51}]);await p.getByRole('button',{name:'Megnyitás ›'}).click();assert(p.url().endsWith('/futes/kazanhaz'));
await p.evaluate(()=>{c.setConfig({view:'rooms'});c.hass=h});await p.locator('[data-room="Gréta háló"]').click();await p.locator('[data-preset="eco"]').click();assert.equal((await p.evaluate(()=>calls.pop()))[1],'set_preset_mode');await p.getByRole('button',{name:'Célhőmérséklet növelése',exact:true}).click();assert.equal((await p.evaluate(()=>calls.pop()))[2].temperature,22.5);
await p.locator('[data-close-room]').first().click();await p.locator('[data-room="Nappali / konyha / étkező"]').click();await p.getByRole('button',{name:'Kikapcsolás',exact:true}).click();assert.equal((await p.evaluate(()=>calls.pop()))[2].hvac_mode,'off');await p.getByLabel('Klíma üzemmód').selectOption('heat');assert.equal((await p.evaluate(()=>calls.pop()))[2].hvac_mode,'heat');await p.getByLabel('Klíma ventilátor').selectOption('high');assert.equal((await p.evaluate(()=>calls.pop()))[2].fan_mode,'high');
await p.evaluate(async()=>{const before=calls.length;await c.service('switch','turn_on',{entity_id:DATA.circuits[0][3]});if(calls.length!==before)throw Error('Pump command escaped guard');h.states[DATA.buffer].state='unknown';if(c.pump(1).state!==null)throw Error('Unknown buffer');h.states[DATA.buffer].state='30';if(c.pump(1).state!==true)throw Error('30 degree boundary');h.states[DATA.buffer].state='30.1';if(c.pump(1).state!==true)throw Error('30.1 degree boundary');});await p.evaluate(()=>{const r=DATA.rooms[0],id=c.roomClimates(r)[0];h.states[id].attributes.preset_modes=[];c.selectedRoom=r[1];c.setConfig({view:'rooms'});c.hass=h;if([...c.shadowRoot.querySelectorAll('[data-preset]')].some(b=>!b.disabled))throw Error('Unsupported preset enabled');});await p.evaluate(()=>{const rooms=DATA.rooms.filter(r=>SHARED_RADIATOR_ROOMS.has(r[1])&&!c.isLivingRoom(r));if(rooms.length!==2)throw Error('Expected two radiator-only shared rooms');const sw=DATA.circuits[2][3];h.states[sw].state='on';for(const [temp,expected] of [['34.9',false],['35',true],['35.1',true],['unknown',null]]){h.states[DATA.buffer].state=temp;for(const r of rooms)if(c.pump(2).state!==expected)throw Error('Shared room threshold '+temp)}h.states[sw].state='off';h.states[DATA.buffer].state='50';for(const r of rooms)if(c.roomDemand(r)!==false)throw Error('No demand');c.cfg.pump_feedback_entities={3:'binary_sensor.test_radiator_pump'};h.states[sw].state='on';h.states['binary_sensor.test_radiator_pump']={state:'on'};h.states[DATA.buffer].state='20';for(const r of rooms)if(c.roomHeating(r)!==true)throw Error('TECH feedback must override estimate');h.states['binary_sensor.test_radiator_pump'].state='off';for(const r of rooms)if(c.roomHeating(r)!==false)throw Error('TECH off');delete c.cfg.pump_feedback_entities;});const downloadPromise=p.waitForEvent('download');await p.getByRole('button',{name:'Diagnosztika letöltése'}).click();const download=await downloadPromise;await download.saveAs('test-results/diagnostic-test.json');const diag=JSON.parse(fs.readFileSync('test-results/diagnostic-test.json','utf8'));assert.equal(diag.version,'0.6.15');assert(diag.entities['climate.greta_radiator_sonoff_1002c87029']);assert(!JSON.stringify(diag).includes('access_token'));await p.evaluate(()=>{const id=DATA.rooms[0][3];h.states[id].state='auto';h.states[id].attributes.hvac_modes=['heat','auto','off'];h.states[id].attributes.preset_modes=[];c.selectedRoom=DATA.rooms[0][1];c.roomDialogOpen=true;c.render();if(c.canAdjust(id))throw Error('Scheduled TRV must not silently accept manual adjustment');});await p.locator('[data-room-mode=heat]').click();assert.equal((await p.evaluate(()=>calls.pop()))[2].hvac_mode,'heat');
await p.evaluate(()=>{c.closeRoom();const id=DATA.rooms[0][3];h.states[id].state='heat';c.hass=h});
for(const [width,height] of [[1024,768],[1112,834],[1180,820],[768,768]]){
 await p.setViewportSize({width,height});
 await p.evaluate(()=>{document.body.style.paddingTop='64px';c.setConfig({view:'rooms'});c.hass=h});
 assert.equal(await p.locator('.roomcard').count(),10);
 assert.equal(await p.locator('[role=dialog]').count(),0);
 const layout=await p.evaluate(()=>({bottom:c.shadowRoot.querySelector('.view-rooms').getBoundingClientRect().bottom,overflow:[...c.shadowRoot.querySelectorAll('.roomcard,.room-open,.tilefoot,.roomreadings')].filter(x=>x.scrollWidth>x.clientWidth+2||x.scrollHeight>x.clientHeight+2).map(x=>({cl:x.className,txt:x.innerText})),touch:[...c.shadowRoot.querySelectorAll('.tilecontrols button')].every(x=>x.clientWidth>=42&&x.clientHeight>=42)}));
 assert(layout.bottom<=height,'iPad overview exceeds viewport '+width);assert.deepEqual(layout.overflow,[],'iPad tile overflow '+width);assert(layout.touch);
 await p.screenshot({path:`test-results/rooms-ipad-${width}.png`});
}
await p.evaluate(()=>{document.body.style.paddingTop='0';calls.length=0;for(const [id,request] of c.temperatureRequests||[])c.clearTemperatureRequest(id,request);c.render()});
// Exercise the room tile for all ten mappings, including rooms without a thermostat.
for(const [name,ids] of await p.evaluate(()=>DATA.rooms.map(r=>[r[1],c.roomControlIds(r)]))){
 const plus=p.getByRole('button',{name:name+' célérték növelése',exact:true});
 const minus=p.getByRole('button',{name:name+' célérték csökkentése',exact:true});
 if(!ids.length){assert(await plus.isDisabled());assert(await minus.isDisabled());continue}
 await p.evaluate(ids=>{calls.length=0;for(const id of ids){h.states[id].state='heat';h.states[id].attributes.temperature=22}c.hass=h},ids);
 await plus.click();
 await p.waitForFunction(n=>calls.length===n,ids.length);
 assert.deepEqual(await p.evaluate(()=>calls.splice(0)),ids.map(id=>['climate','set_temperature',{entity_id:id,temperature:22.5}]));
 await minus.click();
 await p.waitForFunction(n=>calls.length===n,ids.length);
 assert.deepEqual(await p.evaluate(()=>calls.splice(0)),ids.map(id=>['climate','set_temperature',{entity_id:id,temperature:22}]));
 assert.equal(await p.locator('[role=dialog]').count(),0);
}
const flora=await p.evaluate(()=>ROOM_EXTRAS['Flóra háló'].climates);
await p.evaluate(([first,second])=>{
 h.states[first].attributes.temperature=22;h.states[second].state='auto';c.hass=h;
},flora);
await p.locator('[data-room="Flóra háló"]').click();
assert(await p.getByRole('button',{name:'Radiátor 2 célérték növelése'}).isDisabled());
await p.getByRole('button',{name:'Célhőmérséklet növelése',exact:true}).click();
await p.waitForFunction(()=>calls.length===1);
assert.deepEqual(await p.evaluate(()=>calls.splice(0)),[['climate','set_temperature',{entity_id:flora[0],temperature:22.5}]]);
await p.getByRole('button',{name:'Radiátor 1 célérték növelése'}).click();
await p.waitForFunction(()=>calls.length===1);
assert.deepEqual(await p.evaluate(()=>calls.splice(0)),[['climate','set_temperature',{entity_id:flora[0],temperature:23}]]);
assert.match(await p.getByRole('dialog').locator('.setpoint').innerText(),/23,0/);
await p.keyboard.press('Escape');
const garage=await p.evaluate(()=>ROOM_EXTRAS['Garázs'].climates);
await p.evaluate(([first,second])=>{h.states[first].attributes.temperature=22;h.states[second].state='unavailable';c.hass=h},garage);
await p.getByRole('button',{name:'Garázs célérték növelése',exact:true}).click();
await p.waitForFunction(()=>calls.length===1);
assert.deepEqual(await p.evaluate(()=>calls.splice(0)),[['climate','set_temperature',{entity_id:garage[0],temperature:22.5}]]);
await p.evaluate(([first,second])=>{
 for(const id of [first,second]){h.states[id].state='heat';h.states[id].attributes.temperature=22}
 c.hass=h;
 window.normalService=h.callService;
 h.callService=async (...args)=>{if(args[2].entity_id===first)throw Error('fixture failed');return normalService(...args)};
},flora);
await p.getByRole('button',{name:'Flóra háló célérték növelése',exact:true}).click();
await p.waitForFunction(()=>calls.length===1&&c.error.includes('sikertelen'));
assert.equal((await p.evaluate(()=>calls.pop()))[2].entity_id,flora[1]);
await p.evaluate(()=>{h.callService=normalService;c.error='';c.render()});
await p.locator('[data-room="Gréta háló"]').click();
assert.equal(await p.locator('[role=dialog]').count(),1);await p.screenshot({path:'test-results/rooms-detail-ipad.png'});await p.evaluate(()=>{c.hass=h;if(!c.shadowRoot.activeElement?.hasAttribute('data-close-room'))throw Error('Modal focus lost during HA refresh')});await p.keyboard.press('Escape');assert.equal(await p.locator('[role=dialog]').count(),0);
await p.evaluate(()=>{h.states[DATA.circuits[2][3]].state='on';h.states[DATA.buffer].state='35';h.states[DATA.rooms[4][3]].attributes.hvac_action='idle';c.hass=h;if(c.roomAppearance(DATA.rooms[1])!=='heating'||c.roomAppearance(DATA.rooms[0])!=='heating'||c.roomAppearance(DATA.rooms[4])!=='idle')throw Error('State colors must differ')});

// A SONOFF request and an independent operation signal are separate inputs.
await p.evaluate(()=>{
 const trv=DATA.rooms[0],shared=DATA.rooms.filter(r=>SHARED_RADIATOR_ROOMS.has(r[1])&&!c.isLivingRoom(r)),id=trv[3],relay=DATA.circuits[2][3],direct='switch.radiator_szivattyu_mini_d_sonoff_10029bc6bf_1',feedback='binary_sensor.test_tech_pump';
 const check=(r,expected,label)=>{if(c.roomAppearance(r)!==expected)throw Error(label+': '+c.roomAppearance(r))};
 for(const demand of [true,false,null])for(const operating of ['on','off','unavailable']){
  h.states[id].attributes.hvac_action=demand===true?'heating':demand===false?'idle':undefined;h.states[id].state='heat';
  h.states[relay].state=demand===true?'on':demand===false?'off':'unavailable';h.states[feedback]={state:operating};c.cfg.pump_feedback_entities={3:feedback};
  const expected=demand===null?'unknown':!demand?'idle':operating==='on'?'heating':'demand';
  for(const r of [trv,...shared])check(r,expected,'request/TECH '+demand+'/'+operating);
 }
 delete c.cfg.pump_feedback_entities;
 h.states[id].attributes.hvac_action='heating';h.states[relay].state='on';
 for(const temp of ['20','35','60','unknown']){h.states[DATA.buffer].state=temp;check(trv,temp!=='unknown'&&Number(temp)>=35?'heating':'demand','TRV uses same radiator circuit state');for(const r of shared){const limit=35;check(r,temp!=='unknown'&&Number(temp)>=limit?'heating':'demand','Shared room threshold '+r[1]+'/'+temp)}}
 for(const temp of ['29.9','30','30.1','34.9','35','35.1','unknown']){h.states[DATA.buffer].state=temp;for(const r of shared){const limit=35;check(r,temp!=='unknown'&&Number(temp)>=limit?'heating':'demand','Exact threshold '+r[1]+'/'+temp)}}
 h.states[direct]={state:'off'};h.states[relay].state='on';for(const r of shared)check(r,'idle','Prefer direct SONOFF relay');
 h.states[direct].state='unavailable';for(const r of shared)check(r,'unknown','Unavailable direct relay must not use stale alias');delete h.states[direct];
 const multi=DATA.rooms.find(r=>r[1]==='Flóra háló'),ids=c.roomControlIds(multi);h.states[ids[0]].attributes.hvac_action='idle';h.states[ids[1]].state='unavailable';check(multi,'unknown','Missing one valve');h.states[ids[0]].attributes.hvac_action='heating';check(multi,'demand','One active valve, buffer unknown');
 // Three simultaneous visual states and loss of feedback.
 h.states[id].attributes.hvac_action='idle';h.states[relay].state='on';h.states[feedback]={state:'on'};c.cfg.pump_feedback_entities={3:feedback};c.cfg.room_heating_entities={'Dolgozó':'binary_sensor.test_room_pump'};h.states['binary_sensor.test_room_pump']={state:'off'};h.states[DATA.rooms[4][3]].attributes.hvac_action='heating';c.setConfig({...c.cfg,view:'rooms'});c.hass=h;
});
await p.setViewportSize({width:1024,height:768});
const styles=await p.evaluate(()=>[...c.shadowRoot.querySelectorAll('.roomcard')].slice(0,5).map(e=>({class:e.className,bg:getComputedStyle(e).backgroundColor,fg:getComputedStyle(e.querySelector('.roomstate')).color})));
assert.notEqual(styles[0].bg,styles[1].bg);assert.notEqual(styles[1].bg,styles[4].bg);assert.notEqual(styles[0].bg,styles[4].bg);
function luminance(rgb){return rgb.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((v,n,i)=>v+n*[.2126,.7152,.0722][i],0)}
for(const v of styles){const a=luminance(v.bg),b=luminance(v.fg);assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,'Readable state text '+v.class)}
await p.screenshot({path:'test-results/rooms-grey-red-green.png'});
await p.evaluate(()=>{delete c.cfg.room_heating_entities;const feedback='binary_sensor.test_tech_pump';for(const d of ['on','off','unavailable'])for(const op of ['on','off','unavailable']){h.states[DATA.circuits[2][3]].state=d;h.states[feedback]={state:op};c.cfg.pump_feedback_entities={3:feedback};const expected=d==='off'?'idle':d==='unavailable'?'unknown':op==='on'?'heating':'demand';const node=document.createElement('div');node.innerHTML=c.zone(2);if(!node.firstElementChild.classList.contains(expected))throw Error('Home color '+d+'/'+op);const label=d==='off'?'Nem fűt':d==='unavailable'?'Nincs adat':op==='on'?'Fűt':'Hőigény';if(node.querySelector('.statusbar strong').textContent!==label)throw Error('Home label '+d+'/'+op)}delete c.cfg.pump_feedback_entities;h.states[DATA.circuits[2][3]].state='on';h.states[DATA.buffer].state='34.9';if(!c.zone(2).includes('zone demand'))throw Error('Home cold buffer');h.states[DATA.buffer].state='35';if(!c.zone(2).includes('zone heating'))throw Error('Home warm buffer');});
await p.evaluate(()=>{delete c.cfg.pump_feedback_entities;delete c.cfg.room_heating_entities;c.hass=h});
if(process.env.FT_SNAPSHOT_PATH){const snapshot=JSON.parse(fs.readFileSync(process.env.FT_SNAPSHOT_PATH,'utf8'));await p.evaluate(states=>{window.h={states,callService:async(...a)=>calls.push(a)};c.hass=h},snapshot.entities);for(const v of ['home','plant','rooms'])for(const width of [1180,1024,390]){await p.setViewportSize({width,height:900});await p.evaluate(view=>{c.setConfig({view});c.hass=h},v);const bad=await p.evaluate(()=>[...c.shadowRoot.querySelectorAll('.zone,.summarybox,.dialtext,.preset,.detailhead')].filter(e=>e.scrollWidth>e.clientWidth+3).map(e=>e.className));assert.deepEqual(bad,[],v+' uploaded snapshot overflow '+width)}}console.log('PASS: demand/operation/unknown matrix, direct SONOFF priority, multi-valve missing data, grey/red/green contrast, all views, four iPad sizes, tile/group controls, modal and focus, TECH targets, Eco/Gree, feedback colors, pump guards and thresholds.');await b.close()})().catch(e=>{console.error(e);process.exit(1)});


