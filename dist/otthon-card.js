/* Otthon dashboard 1.0.10 — independent of Fűtéstuning controls. */
(()=>{
const DEFAULT_LIGHTS=[
 {name:'Kanapé',entity:'switch.kanape_sonoff_10022d0f14_1',area:'Nappali',icon:'mdi:floor-lamp'},
 {name:'Cserépkályha',entity:'switch.cserepkalyha_sonoff_10022d0f04_1',area:'Nappali',icon:'mdi:lamp'},
 {name:'Medence',entity:'switch.medence_vilagitas_sonoff_10027529d7',area:'Kültér',icon:'mdi:pool'},
 {name:'Napozóterasz',entity:'switch.napozoterasz_vilagitas_sonoff_100275197e',area:'Kültér',icon:'mdi:weather-sunny'}];
const DEFAULT_GATES=[
 {name:'Nagykapu',entity:'switch.nagykapu_sonoff_100186696c',camera_name:'Kapu cam'},
 {name:'Lenti garázsajtó',entity:'switch.lenti_garazsajto_sonoff_1001de5ce9',camera_name:'Lenti garázs cam',camera:'camera.lenti_garazs_cam_profile_0'},
 {name:'Fenti garázsajtó',entity:'switch.fenti_garazsajto_sonoff_10018660b9',camera_name:'Fenti garázs cam',camera:'camera.garazs_fenti_garazs_cam_profile_0'},
 {name:'Fedett terasz garázsajtó',entity:'switch.fedett_terasz_garazsajto_sonoff_10016811d4',camera_name:null}
];
function gateDrawing(i){
 const begin='<svg class="gate-art" viewBox="0 0 500 240" role="img" aria-label="Fotó alapján készült sematikus kapurajz" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">';
 const finish='</g></svg>';
 const path=(d,w=1.7)=>'<path d="'+d+'" stroke-width="'+w+'"/>';
 const bricks=(x,y,w,h,step=11)=>{let o='';for(let yy=y+step;yy<y+h;yy+=step){o+=path('M'+x+' '+yy+'h'+w,.8);for(let xx=x+(Math.round((yy-y)/step)%2?10:1);xx<x+w-2;xx+=20)o+=path('M'+xx+' '+(yy-step)+'v'+step,.65);}return o;};
 const shrub=(x,y,k=1)=>{let d='M'+(x-30*k)+' '+y+'q'+(-9*k)+' '+(-13*k)+' '+(4*k)+' '+(-22*k)+'q'+(-3*k)+' '+(-19*k)+' '+(14*k)+' '+(-17*k)+'q'+(8*k)+' '+(-22*k)+' '+(23*k)+' '+(-9*k)+'q'+(21*k)+' '+(-7*k)+' '+(14*k)+' '+(14*k)+'q'+(22*k)+' '+(15*k)+' '+(-4*k)+' '+(21*k)+'Z';return path(d,1.3);};
 const light=(x,y)=>path('M'+x+' '+(y-14)+'v8m-11 17q3-13 11-13q8 0 11 13Z M'+(x-15)+' '+(y+12)+'h30',1.5);
 if(i===0){
  let o=path('M4 228h492',2)+path('M25 227V57h62v170M415 227V57h61v170',2.8);
  o+=bricks(25,57,62,170)+bricks(415,57,61,170);
  o+=path('M20 55h71v-10H20Z M411 55h70v-10h-70Z',2.6);
  o+=path('M89 227V110Q169 74 250 76Q327 76 413 110V227Z M251 78v149 M90 189h322 M90 209h322',2.7);
  for(let j=0;j<32;j++){let x=97+j*10;let y=111-35*Math.sin((x-90)/323*Math.PI);o+=path('M'+x+' '+y.toFixed(1)+'v78',1.4)+path('M'+(x-3)+' '+y.toFixed(1)+'l3 -12l3 12',1);}
  o+=path('M173 206q12-14 23 0q-9 17-23 0 M302 206q12-14 23 0q-9 17-23 0',1.1);
  o+=path('M37 109h19v30H37Z M43 116h7v7h-7Z M43 127h7v7h-7Z',1.5);
  o+=shrub(18,226,.55)+shrub(484,226,.54);
  return begin+o+finish;
 }
 if(i===2){
  let o=path('M6 228h488',2)+path('M32 226V42h434v184',2.7)+path('M24 43H474l-12-14H35Z M26 30H474',2.2);
  for(let x=48;x<467;x+=42)o+=path('M'+x+' 42v24l9 5v-24',1.1);
  o+=path('M73 226V89h356v137 M86 226V106h330v120 M86 132h330 M86 157h330 M86 182h330 M86 207h330',2);
  o+=light(172,74)+light(324,74);
  o+=shrub(20,227,.7)+shrub(475,227,.65);
  return begin+o+finish;
 }
 if(i===1){
  let o=path('M5 230h490',2)+path('M87 229V25L463 56V229 M75 22L468 55 M86 34L462 67',2.5);
  for(let x=100;x<462;x+=43)o+=path('M'+x+' '+(27+(x-86)*.08).toFixed(1)+'v12l11 5v-13',1);
  o+=path('M120 229V145h65v84 M128 229v-76h49v76 M220 229V146h201v83 M222 165h197 M222 186h197 M222 207h197',2.4);
  o+=path('M144 226l33-38 M135 187l40 39 M146 163l20 13',1.1);
  o+=path('M138 95h50v49h-50Z M145 101h36v36h-36Z M159 101v36',1.6);
  o+=light(278,127)+light(379,127);
  o+=path('M55 229V206h31 M88 229v-23',1.1)+shrub(65,230,.7);
  return begin+o+finish;
 }
 let o=path('M6 229h490',2);
 o+=path('M40 230V33h164 M40 60h160 M202 33V230',2.5)+bricks(40,60,160,170,12);
 o+=path('M203 57L476 101 M205 49L481 94 M193 29L480 84',2.4);
 for(let x=226;x<465;x+=35)o+=path('M'+x+' '+(51+(x-202)*.17).toFixed(1)+'l-4 11',1);
 o+=path('M198 107Q349 47 481 108',2.1);
 o+=path('M216 228V171Q226 119 285 111H452V229 M238 228V173Q257 138 288 137H445V229',2.5);
 o+=path('M238 171h207 M238 194h207 M238 213h207',1.45);
 o+=path('M116 115a27 27 0 1 0 54 0a27 27 0 1 0-54 0 M121 115h44 M143 88v54',2);
 o+=path('M61 170h94v49H61Z M72 177h72v35H72Z M72 211q21-32 41-5t31-5',1.3);
 for(let j=0;j<35;j++){let x=223+(j*31)%237,y=139-(j*17)%70;o+=path('M'+x+' '+y+'q-7 -9 2 -10q8 -3 11 8q8 5 0 12q-9 4 -13-3',.9);}
 o+=shrub(478,188,.55);
 return begin+o+finish;
}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=`
/* Otthon 1.0.10: approved 4-gate blueprint composition */
.root.gates-view{position:relative;background:radial-gradient(ellipse at 55% 0%,#102b49 0%,#061426 74%);border-radius:20px;min-height:min(100%,740px);padding:14px 18px 10px}
.root.gates-view header{display:flex;align-items:center;margin:0;position:absolute;left:32px;top:24px;z-index:1}
.root.gates-view header .brand{background:transparent;padding:0;color:#b5e9ff}
.root.gates-view header h1{font-size:21px;font-weight:600}
.root.gates-view header small{display:none}
.root.gates-view nav{height:56px;margin:0 0 14px;padding:5px 6px 5px min(200px,24%);display:flex;justify-content:center;gap:12px;align-items:stretch;border:1px solid #1c3c5a;border-radius:17px;background:linear-gradient(90deg,#0a2138,#112d4a)}
.root.gates-view nav button{background:transparent;border:1px solid transparent;border-radius:15px;min-height:44px;display:flex;align-items:center;justify-content:center;gap:8px;padding:7px 16px;font-weight:600;font-size:14px}
.root.gates-view nav button[aria-selected=true]{background:linear-gradient(165deg,#1d709f,#084467);border-color:#4ebced;box-shadow:0 0 14px rgba(46,173,242,.3)}
.root.gates-view h2{font-size:25px;font-weight:650;margin:4px 0 12px;letter-spacing:.1px}
.root.gates-view .gategrid{gap:14px;grid-template-columns:repeat(2,minmax(0,1fr))}
.root.gates-view .gate-illustrated{position:relative;min-height:260px;border-radius:19px;border:1px solid #3975a5;padding:16px 19px 12px;background:linear-gradient(150deg,#153451 2%,#0b1e33 75%);box-shadow:inset 0 1px 1px #4677a350,0 8px 20px #0003;overflow:hidden}
.root.gates-view .gate-top{min-height:32px;align-items:flex-start}
.root.gates-view .gate-top .name{font-size:21px;line-height:1.2;font-weight:700;letter-spacing:.1px}
.root.gates-view .camera-access,.root.gates-view .camera-pending{height:31px;min-height:31px;padding:5px 8px;border-radius:9px;background:#0c2e4d;border:1px solid #3976a2;color:#b3edff;opacity:1}
.root.gates-view .camera-access ha-icon,.root.gates-view .camera-pending ha-icon{--mdc-icon-size:21px}
.root.gates-view .gate-content{grid-template-columns:minmax(0,1fr) 82px;gap:7px;flex:1;align-items:center;min-height:185px}
.root.gates-view .gate-art{width:100%;height:auto;max-height:181px;color:#a2eaff;filter:drop-shadow(0 0 3px rgba(46,190,255,.8))}
.root.gates-view .gate-control{height:78px;width:78px;border:2px solid #67d3ff;font-weight:500;background:radial-gradient(circle at 40% 23%,#326b92 0%,#0d2948 70%);box-shadow:0 0 16px #269ced60,inset 0 0 14px #2c9ddc40}
.root.gates-view .gate-control ha-icon{--mdc-icon-size:34px}
.root.gates-view .gate-status{background:#113e5c;border-radius:9px;padding:3px 8px;color:#c4d6e5;font-size:11px;width:max-content;max-width:100%}
.root.gates-view footer{margin-top:6px;font-size:10px;opacity:.8}
@media(max-width:950px){.root.gates-view .gate-illustrated{min-height:220px;padding:12px}.root.gates-view .gate-top .name{font-size:17px}.root.gates-view .gate-content{min-height:155px;grid-template-columns:minmax(0,1fr) 69px}.root.gates-view .gate-control{width:64px;height:64px}.root.gates-view .gate-art{max-height:150px}}
@media(max-width:760px){.root.gates-view{padding:12px}.root.gates-view header{position:static;margin:0 0 8px}.root.gates-view nav{padding:4px;height:54px}.root.gates-view nav button{flex-direction:row;font-size:12px;padding:6px 3px;min-height:44px}.root.gates-view h2{font-size:21px}.root.gates-view .gategrid{gap:9px}.root.gates-view .gate-illustrated{min-height:175px;padding:9px}.root.gates-view .gate-top .name{font-size:13px}.root.gates-view .gate-content{min-height:120px;grid-template-columns:minmax(0,1fr) 48px;gap:2px}.root.gates-view .gate-control{width:46px;height:46px;font-size:0}.root.gates-view .gate-control ha-icon{--mdc-icon-size:25px}.root.gates-view .gate-art{max-height:115px}.root.gates-view .gate-status{font-size:9px;padding:2px 5px}}
@media(max-width:470px){.root.gates-view .gategrid{grid-template-columns:1fr}.root.gates-view .gate-illustrated{min-height:195px}.root.gates-view .gate-content{grid-template-columns:minmax(0,1fr) 65px}.root.gates-view .gate-control{width:62px;height:62px;font-size:10px}.root.gates-view .gate-art{max-height:145px}}
.gate-illustrated{border:1px solid #315e80;background:linear-gradient(160deg,#16334d 0%,#0b2035 90%);box-shadow:inset 0 1px rgba(157,220,255,.10);padding:15px 16px;min-height:230px;display:flex;flex-direction:column}.gate-top{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:34px}.gate-top .name{font-size:18px;font-weight:600}.camera-access,.camera-pending{display:inline-flex;align-items:center;gap:5px;border:1px solid #377599;background:#123c5b;border-radius:30px;padding:5px 9px;font-size:11px;color:#94ddff;white-space:nowrap;min-height:32px}.camera-access ha-icon,.camera-pending ha-icon{--mdc-icon-size:17px}.camera-pending{opacity:.7;border-color:#41576a;background:#243647;color:#c4d3dd}.gate-content{display:grid;grid-template-columns:minmax(0,1fr) 84px;align-items:center;gap:8px;flex:1}.gate-visual{min-width:0}.gate-art{display:block;width:100%;max-height:156px;filter:drop-shadow(0 0 4px rgba(101,211,255,.42));color:#a5e5ff}.gate-control{border:2px solid #67cbff;border-radius:50%;width:82px;height:82px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;background:radial-gradient(circle at 35% 25%,#2b6990,#0a2944 74%);box-shadow:0 0 12px rgba(57,175,245,.38),inset 0 1px 12px rgba(103,200,255,.18);font-size:11px;font-weight:600}.gate-control ha-icon{--mdc-icon-size:31px}.gate-control:active:not(:disabled){transform:scale(.96)}.gate-status{display:inline-flex;gap:5px;align-items:center;color:#aec3d2;font-size:11px}.gate-status ha-icon{--mdc-icon-size:14px}@media(max-width:760px){.gate-illustrated{padding:10px;min-height:185px}.gate-top .name{font-size:13px}.gate-content{grid-template-columns:minmax(0,1fr) 54px;gap:4px}.gate-control{height:53px;width:53px;font-size:9px;border-width:1px}.gate-control ha-icon{--mdc-icon-size:23px}.gate-art{max-height:120px}.camera-pending span,.camera-access span{display:none}.camera-pending,.camera-access{padding:5px}.gate-status{font-size:10px}}:host{display:block;min-width:0;color:#eef6fd;font:15px/1.35 system-ui,-apple-system,sans-serif}*{box-sizing:border-box}button,input{font:inherit}button{color:inherit;cursor:pointer}button:disabled{opacity:.5;cursor:default}button:focus-visible,input:focus-visible{outline:3px solid #70d9ff;outline-offset:3px}.root{background:radial-gradient(ellipse at top,#12324a,#071827 75%);border-radius:22px;padding:18px 22px;min-width:0}header{display:flex;align-items:center;gap:12px;margin-bottom:14px}h1{font-size:25px;margin:0;font-weight:600}small,.muted{color:#abc0d0;font-size:12px}h2{font-size:20px;margin:0 0 12px;font-weight:500}ha-icon{--mdc-icon-size:24px;flex:none}.brand{padding:11px;border-radius:14px;background:#19384f;color:#6dd5ff}nav{display:flex;gap:8px;margin-bottom:18px}nav button,.zone button,.action{background:#193247;border:0;border-radius:12px;padding:11px 16px;min-height:44px}nav button{display:flex;align-items:center;gap:8px}nav button[aria-selected=true]{background:#28506b}.sectionhead{display:flex;justify-content:space-between;align-items:center;margin:14px 0 8px;gap:8px}.sectionhead b{font-weight:500}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.tile{display:flex;align-items:center;gap:10px;text-align:left;min-width:0;min-height:88px;border:1px solid #30485b;border-radius:17px;background:#1b3042;padding:15px}.tile.on{background:#604c24;border-color:#a58440}.tile.on .symbol{color:#ffda83;background:#79602c}.tile.unavailable{border-style:dashed}.symbol{display:grid;place-items:center;background:#294458;border-radius:12px;width:36px;height:36px;flex:none}.name{display:block;font-weight:500;overflow-wrap:anywhere}.state{display:block;color:#d0dce6;font-size:12px;margin-top:3px}.reserved{min-height:44px;align-self:center;background:transparent;border:1px dashed #3b5264;border-radius:12px;padding:8px 12px;font-size:12px;color:#abc0d0}.zone{display:flex;gap:6px;margin-bottom:8px}.zone button{font-size:12px;padding:8px 14px}.zone [aria-pressed=true]{background:#33536b}.gategrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.gate{background:#1b3042;border-radius:17px;padding:14px;min-width:0}.camera{display:grid;place-content:center;text-align:center;background:#12293a;border-radius:11px;min-height:110px;color:#abc0d0;margin-bottom:10px;padding:8px}.camera button{background:none;border:0;color:inherit}.camera img{width:100%;max-height:170px;object-fit:cover;border-radius:10px}.gate .action{width:100%;margin-top:10px}.alarm-layout{display:grid;grid-template-columns:minmax(0,2.3fr) minmax(180px,1fr);gap:16px}.arm-buttons{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0 14px}.arm-buttons button{min-height:150px;background:#24465e;border:1px solid #47677d;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:15px;font-size:22px;font-weight:500}.arm-buttons ha-icon{--mdc-icon-size:48px}.alarm-box strong{display:block;font-size:24px}.disarm{width:100%;min-height:56px}.sensor-box{background:#1b3042;border-radius:16px;padding:12px}.sensor-box h3{font-size:14px;font-weight:500;margin:0 0 8px}.sensor{font-size:13px}.alarm-box{min-width:0}.arm-buttons button:disabled{opacity:.4}.alarm-box{background:#1b3042;border-radius:18px;padding:22px;text-align:center}.sensor{padding:12px 0;border-bottom:1px solid #30485b;display:flex;gap:10px;justify-content:space-between}.alarm-host{min-width:0}.notice{color:#ffdb8d;margin:8px 0;overflow-wrap:anywhere;font-size:13px}.notice:empty{display:none}footer{font-size:11px;color:#8fa9bc;margin-top:12px}.groupactions{display:flex;gap:6px}.groupactions button{font-size:12px;padding:8px 12px}.brightness{display:flex;gap:8px;align-items:center;font-size:12px;margin-top:5px}.brightness input{width:100%;min-width:0;min-height:44px}.tilewrap{min-width:0}.tilewrap>.tile{width:100%}@media(max-width:760px){.root{padding:14px;border-radius:16px}nav{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-bottom:14px}nav button{flex-direction:column;text-align:center;font-size:12px;padding:10px 4px;gap:5px;min-height:64px}.grid,.gategrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.tile{min-height:90px;padding:11px;gap:8px}.symbol{width:30px;height:34px}.zone{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}.zone button{padding:8px 2px}.alarm-layout{grid-template-columns:1fr}.arm-buttons button{min-height:130px;font-size:19px}.sensor{padding:8px 0}.gate{padding:11px}.gate .action{font-size:12px;padding:8px}.name{font-size:14px}.reserved{min-height:44px;padding:8px;font-size:12px}.sectionhead{flex-wrap:wrap}h1{font-size:23px}}
/* Approved Kapuk reference: header, 2x2 panels, named states, large blue line schematics */
.root.gates-view{padding:10px 14px 12px;background:radial-gradient(ellipse at 50% 0%,#102843,#051327 80%);min-height:0}
.root.gates-view header{position:absolute;left:22px;top:16px;z-index:1}
.root.gates-view nav{height:62px;margin:0 0 12px;padding-left:24%;border-radius:18px}
.root.gates-view nav button{font-size:15px}
.root.gates-view main h2{margin:4px 0 13px;padding-left:10px;font-size:27px}
.root.gates-view .gategrid{gap:14px;grid-template-columns:repeat(2,minmax(0,1fr))}
.root.gates-view .gate-illustrated{height:clamp(245px,32vh,345px);min-height:0;padding:16px 19px 12px;display:flex;flex-direction:column;background:linear-gradient(148deg,#12314e,#081a30 84%);border:1px solid #3e83b5;border-radius:21px}
.root.gates-view .gate-top{justify-content:space-between;align-items:flex-start}
.root.gates-view .gate-heading{min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:5px}
.root.gates-view .gate-top .name{font-size:22px;line-height:1.15}
.root.gates-view .gate-status{display:inline-flex;gap:5px;align-items:center;background:linear-gradient(#1b5379,#123450);border:1px solid #35668a;border-radius:18px;padding:4px 9px;color:#d5eafa;font-size:12px;white-space:nowrap}
.root.gates-view .gate-content{min-height:0;flex:1;display:grid;grid-template-columns:minmax(0,1fr) clamp(72px,8vw,96px);gap:10px;align-items:center}
.root.gates-view .gate-visual{display:flex;align-items:end;min-height:0;min-width:0;align-self:stretch;justify-content:center}
.root.gates-view .gate-art{max-height:100%;width:100%;height:100%;max-width:100%;color:#b0ecff;filter:drop-shadow(0 0 3px #51c9ff85)}
.root.gates-view .gate-control{width:clamp(70px,8vw,96px);height:clamp(70px,8vw,96px);border:2px solid #74d9ff;border-radius:50%;font-size:11px;box-shadow:0 0 16px #35adf988,inset 0 0 16px #329dd866}
.root.gates-view .gate-control ha-icon{--mdc-icon-size:34px}
.root.gates-view .camera-pending,.root.gates-view .camera-access{background:#0c2e4d;border:0;box-shadow:none;padding:3px 5px}
.root.gates-view footer{padding-top:3px}
@media(max-width:950px){.root.gates-view .gate-illustrated{height:clamp(205px,31vh,280px);padding:12px}.root.gates-view .gate-top .name{font-size:18px}.root.gates-view .gate-content{grid-template-columns:minmax(0,1fr) 69px;gap:4px}.root.gates-view .gate-control{height:66px;width:66px}.root.gates-view .gate-control ha-icon{--mdc-icon-size:26px}}
@media(max-width:760px){.root.gates-view header{position:static;margin:0 0 5px}.root.gates-view nav{padding:3px;height:55px}.root.gates-view nav button{font-size:12px}.root.gates-view .gategrid{gap:9px}.root.gates-view .gate-illustrated{height:clamp(176px,29vh,240px);padding:10px}.root.gates-view .gate-top .name{font-size:13px}.root.gates-view .gate-content{grid-template-columns:minmax(0,1fr) 50px}.root.gates-view .gate-control{height:48px;width:48px;font-size:0}.root.gates-view .gate-control ha-icon{--mdc-icon-size:24px}.root.gates-view .gate-status{font-size:9px;padding:2px 6px}.root.gates-view main h2{font-size:21px}}
@media(max-width:470px){.root.gates-view .gategrid{grid-template-columns:1fr}.root.gates-view .gate-illustrated{height:220px}.root.gates-view .gate-content{grid-template-columns:minmax(0,1fr) 70px}.root.gates-view .gate-control{width:66px;height:66px;font-size:10px}}
.root.gates-view .gate-illustrated{padding:15px 18px 10px}.root.gates-view .gate-content{gap:0}.root.gates-view .gate-visual{overflow:hidden}.root.gates-view .gate-art{width:100%;height:100%;object-fit:contain}.root.gates-view .gate-control{font-size:0}.root.gates-view .gate-control ha-icon{--mdc-icon-size:40px}.root.gates-view .gate-top .name{letter-spacing:.05px}.root.gates-view .camera-access{display:grid;place-items:center;width:43px;height:38px;border:none;border-radius:8px;background:transparent;color:#b5efff}.root.gates-view .camera-access span{display:none}.root.gates-view .camera-access ha-icon{--mdc-icon-size:32px}.root.gates-view .camera-access:focus-visible{outline:2px solid #72dfff}.root.gates-view .camera-pending{border:0;background:transparent;opacity:.55}.root.gates-view .camera-pending ha-icon{--mdc-icon-size:30px}@media(max-width:760px){.root.gates-view .gate-control ha-icon{--mdc-icon-size:28px}.root.gates-view .camera-access{width:30px;height:30px}.root.gates-view .camera-access ha-icon{--mdc-icon-size:23px}}
.root.gates-view .gate-heading .gate-status{display:none}
.root.gates-view .gate-top .gate-heading{gap:0}
.root.gates-view .gate-illustrated{height:clamp(245px,32vh,345px)}
.root.cameras-view{position:relative;background:radial-gradient(ellipse at 52% 0%,#112d49,#051326 82%);border-radius:20px;padding:14px 18px 10px}
.root.cameras-view header{display:flex;align-items:center;margin:0;position:absolute;left:30px;top:22px;z-index:1}
.root.cameras-view header .brand{background:transparent;padding:0;color:#b5e9ff}
.root.cameras-view header h1{font-size:21px}
.root.cameras-view header small{display:none}
.root.cameras-view nav{height:56px;margin:0 0 14px;padding:5px 6px 5px min(200px,24%);display:flex;justify-content:center;align-items:stretch;gap:8px;border:1px solid #1c3c5a;border-radius:17px;background:linear-gradient(90deg,#0a2138,#112d4a)}
.root.cameras-view nav button{background:transparent;border:1px solid transparent;border-radius:15px;min-height:44px;display:flex;align-items:center;gap:8px;padding:7px 12px;font-weight:600}
.root.cameras-view nav button[aria-selected=true]{background:linear-gradient(165deg,#1d709f,#084467);border-color:#4ebced;box-shadow:0 0 14px #2eaff24d}
.root.cameras-view h2{font-size:25px;margin:4px 0 12px}
.camera-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.camera-tile{min-width:0;background:linear-gradient(160deg,#15324d,#0a1d30);border:1px solid #3d7aa8;border-radius:18px;padding:10px 12px;display:flex;flex-direction:column;min-height:205px}
.camera-tile-head{display:flex;justify-content:space-between;align-items:center;gap:8px;font-weight:650;font-size:17px;margin-bottom:9px}
.camera-tile-head>span:first-child{display:flex;gap:7px;align-items:center}
.camera-tile-head ha-icon{--mdc-icon-size:21px}
.camera-ok{color:#89eda9;font-size:12px}.camera-idle{color:#a9b9ca;font-size:12px}
.camera-preview{display:block;position:relative;width:100%;flex:1;min-height:160px;background:#0c192b;padding:0;border:1px solid #345c74;border-radius:12px;overflow:hidden}
.camera-preview:focus-visible{outline:3px solid #74d9ff;outline-offset:2px}
.camera-live-frame,.camera-live-frame hui-picture-entity-card,.camera-live-frame .camera-fallback{display:block;width:100%;height:100%;min-height:160px}
.camera-live-frame hui-picture-entity-card{pointer-events:none}
.camera-live-frame .camera-fallback,.cam-dialog-preview .camera-fallback{object-fit:cover}
.camera-feed-note{display:grid;place-items:center;height:100%;min-height:160px;color:#b9d1e6}
.camera-corner{position:absolute;top:6px;right:6px;display:grid;place-items:center;border-radius:7px;background:#06243ac9;padding:5px}
.camera-corner ha-icon{--mdc-icon-size:21px}
.camera-empty{display:flex;flex:1;min-height:160px;align-items:center;justify-content:center;flex-direction:column;gap:9px;border-radius:12px;background:#09192c;color:#9ab4cb;font-size:13px}
.camera-empty ha-icon{--mdc-icon-size:42px}
.cam-overlay{position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:rgba(0,7,18,.78);padding:20px}
.cam-dialog{background:#0b2136;border:1px solid #59afe1;color:#edf7ff;border-radius:19px;padding:18px;width:min(930px,96vw);max-height:90vh;overflow:auto;box-shadow:0 20px 65px #0009}
.cam-dialog-head{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:20px;margin-bottom:12px}
.cam-dialog-head strong{display:flex;align-items:center;gap:9px}
.cam-close{background:#1c425c;border-radius:10px;padding:8px;border:1px solid #46708e}
.cam-dialog-grid{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(230px,1fr);gap:16px}
.cam-dialog-preview{display:flex;flex-direction:column;gap:10px;min-width:0}
.cam-dialog-preview [data-camera-dialog-live]{min-height:230px;background:#08192c;border-radius:12px;overflow:hidden}
.cam-dialog-preview hui-picture-entity-card{display:block;width:100%;min-height:230px}
.cam-ha-details{width:100%}
.cam-dialog-settings{background:#102d45;border:1px solid #295879;padding:12px;border-radius:12px;min-width:0}
.cam-dialog-settings h3{font-size:17px;margin:0 0 10px}
.cam-dialog-settings .muted{line-height:1.55}
.cam-setting{display:flex;align-items:center;justify-content:space-between;text-align:left;gap:12px;width:100%;background:#123850;border:1px solid #345971;border-radius:9px;margin:6px 0;padding:10px;font-size:12px;min-height:44px}
.cam-setting span:last-child{display:flex;align-items:center;white-space:nowrap;color:#c8e4f5}
@media(max-width:950px){.root.cameras-view header{position:static;margin-bottom:8px}.root.cameras-view nav{padding:4px}.root.cameras-view nav button{font-size:12px;padding:7px 6px}.camera-tile{min-height:180px}.camera-preview,.camera-empty,.camera-live-frame{min-height:130px}}
@media(max-width:760px){.root.cameras-view{padding:12px}.root.cameras-view nav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));height:auto;gap:4px}.root.cameras-view nav button{min-height:55px;flex-direction:column;justify-content:center;padding:6px 2px}.camera-grid{gap:8px}.camera-tile{padding:8px;min-height:160px}.camera-tile-head{font-size:12px}.camera-tile-head ha-icon{--mdc-icon-size:17px}.camera-ok,.camera-idle{font-size:10px}.camera-preview,.camera-empty,.camera-live-frame{min-height:110px}.cam-dialog-grid{grid-template-columns:1fr}.cam-dialog{padding:12px}}
@media(max-width:470px){.camera-grid{grid-template-columns:1fr}.camera-preview,.camera-empty,.camera-live-frame{min-height:190px}}

/* Camera detail takes whole viewport; settings are overlaid only on gear click */
.cam-overlay{position:fixed;inset:0;z-index:9999;background:#020b15;padding:0;display:block}
.cam-dialog{position:absolute;inset:0;width:100%;height:100%;max-height:none;overflow:hidden;margin:0;padding:0;background:#030c17;border:0;border-radius:0;box-shadow:none}
.cam-full-viewport{position:relative;width:100%;height:100%;overflow:hidden;background:#020a13}
.cam-full-feed{position:absolute;inset:0;display:grid;place-items:center;background:#030a13}
.cam-full-feed>hui-picture-entity-card{display:block;width:100%;height:100%;min-height:0}
.cam-full-feed>hui-picture-entity-card ha-card{height:100%;background:transparent}
.cam-full-feed img.camera-fallback{display:block;width:100%;height:100%;object-fit:contain}
.cam-full-feed .camera-feed-note{display:grid;place-items:center;min-height:100%;color:#bfd6ec}
.cam-full-toolbar{position:absolute;left:0;right:0;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:max(14px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px));background:linear-gradient(180deg,rgba(2,11,24,.94),rgba(2,11,24,0));pointer-events:none}
.cam-full-toolbar>*{pointer-events:auto}
.cam-full-name{display:flex;align-items:center;gap:9px;font-size:19px;font-weight:650;text-shadow:0 1px 5px #000}
.cam-full-actions{display:flex;gap:10px}
.cam-full-tool,.cam-settings-heading button{width:48px;height:48px;border:1px solid #5ebaf1;border-radius:12px;background:rgba(9,39,64,.88);display:grid;place-items:center;box-shadow:0 0 10px #2086ba55}
.cam-full-tool ha-icon{--mdc-icon-size:28px}
.cam-settings-pop{position:absolute;right:max(16px,env(safe-area-inset-right,0px));top:78px;z-index:4;width:min(390px,calc(100vw - 30px));max-height:calc(100vh - 100px);overflow:auto;background:#0a2339f5;border:1px solid #53a9d8;border-radius:16px;box-shadow:0 15px 40px #000a;color:#edf8ff}
.cam-settings-pop[hidden]{display:none!important}
.cam-settings-heading{display:flex;justify-content:space-between;align-items:center;padding:12px 15px;border-bottom:1px solid #2e5a77;font-size:17px}
.cam-settings-heading button{width:35px;height:35px;border-color:#2a5979}
.cam-settings-body{padding:12px}
.cam-settings-body .muted{display:block;font-size:13px;line-height:1.5}
.cam-native{margin-top:15px}
@media(max-width:760px){.cam-full-name{font-size:15px}.cam-full-tool{width:42px;height:42px}.cam-full-tool ha-icon{--mdc-icon-size:24px}.cam-settings-pop{top:67px;max-height:calc(100dvh - 78px)}}
.root .alarm-disarm-buttons{grid-template-columns:1fr}.root .alarm-disarm-buttons button{min-height:160px;background:linear-gradient(160deg,#245a75,#103b55);border:2px solid #6acbf0;box-shadow:0 0 13px #32b0e44d}.root .alarm-disarm-buttons ha-icon{--mdc-icon-size:52px}.root .alarm-wait{padding:25px 4px;color:#b8cede}@media(max-width:760px){.root .alarm-disarm-buttons button{min-height:125px}}
/* Gate and preview are sibling cards, never overlay. Focused gate stays next to its camera. */
.root.gates-view .gate-focus-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:stretch;margin-bottom:14px}
.root.gates-view .gate-focus-grid>.gate-illustrated{height:clamp(245px,32vh,345px)}
.root.gates-view .gate-camera-panel{min-width:0;height:clamp(245px,32vh,345px);display:flex;flex-direction:column;overflow:hidden;padding:12px;background:linear-gradient(150deg,#122e49,#06182a);border:1px solid #4182b2;border-radius:21px;box-shadow:0 8px 20px #0004}
.root.gates-view .gate-camera-head{display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:34px;margin-bottom:8px}
.root.gates-view .gate-camera-head strong{display:flex;align-items:center;gap:7px;font-size:16px;font-weight:650;min-width:0}
.root.gates-view .gate-camera-head strong ha-icon{--mdc-icon-size:20px}
.root.gates-view .gate-camera-head button{display:grid;place-items:center;width:36px;height:36px;flex:none;border-radius:10px;border:1px solid #4b8aaf;background:#143b56}
.root.gates-view .gate-camera-live{flex:1;min-height:0;display:grid;place-items:center;overflow:hidden;background:#06111e;border-radius:12px}
.root.gates-view .gate-camera-live hui-picture-entity-card{display:block;width:100%;height:100%;min-height:0;overflow:hidden}
.root.gates-view .gate-camera-live hui-picture-entity-card ha-card{height:100%}
.root.gates-view .gate-camera-live .camera-fallback{width:100%;height:100%;object-fit:contain}
.root.gates-view .gate-camera-empty{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px;color:#a8bbca;background:#061725;border-radius:12px}
.root.gates-view .gate-camera-empty ha-icon{--mdc-icon-size:42px}
.root.gates-view .gate-rest{margin-top:0}
@media(max-width:950px){.root.gates-view .gate-focus-grid>.gate-illustrated,.root.gates-view .gate-camera-panel{height:clamp(205px,31vh,280px)}}
@media(max-width:760px){.root.gates-view .gate-focus-grid{gap:9px;margin-bottom:9px}.root.gates-view .gate-focus-grid>.gate-illustrated,.root.gates-view .gate-camera-panel{height:clamp(176px,29vh,240px)}.root.gates-view .gate-camera-panel{padding:7px}.root.gates-view .gate-camera-head strong{font-size:11px}.root.gates-view .gate-camera-head strong ha-icon{--mdc-icon-size:16px}.root.gates-view .gate-camera-head button{height:30px;width:30px}}
@media(max-width:470px){.root.gates-view .gate-focus-grid{grid-template-columns:1fr}.root.gates-view .gate-focus-grid>.gate-illustrated,.root.gates-view .gate-camera-panel{height:220px}}
`;
class OtthonCard extends HTMLElement{
 constructor(){super();this.attachShadow({mode:'open'});this.page='lights';this.zone='Áttekintés';this.pending=false;this.message='';this.nativeAlarm=null;this.alarmKey='';this.activeCamera=null;this.gatePreview=null;}
 setConfig(c){this.cfg={...c};this.lights=c.lights||DEFAULT_LIGHTS;this.gates=c.gates||DEFAULT_GATES;this.render();}
 set hass(h){this._hass=h;if(this.page==='cameras'&&this.shadowRoot.querySelector('.camera-grid')){this.shadowRoot.querySelectorAll('hui-picture-entity-card').forEach(card=>card.hass=h);return;}this.render();if(this.nativeAlarm)this.nativeAlarm.hass=h;}
 getCardSize(){return 8;}
 static getStubConfig(){return {type:'custom:otthon-card'};}
 entity(id){return this._hass?.states?.[id];}
 available(id){const s=this.entity(id);return !!s&&!['unknown','unavailable'].includes(s.state);}
 icon(n){return `<ha-icon icon="${esc(n)}"></ha-icon>`;}
 more(id){this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId:id},bubbles:true,composed:true}));}
 async service(domain,action,data){if(this.pending)return;this.pending=true;this.message='';this.render();try{await this._hass.callService(domain,action,data);}catch(e){this.message='A parancs nem sikerült: '+(e?.message||String(e));}finally{this.pending=false;this.render();}}
 toggleLight(i){const x=this.lights[i];if(!x||!this.available(x.entity))return;const domain=x.entity.split('.')[0];if(!['light','switch'].includes(domain))return;return this.service(domain,this.entity(x.entity).state==='on'?'turn_off':'turn_on',{entity_id:x.entity});}
 group(on){const ids=this.lights.filter(x=>x.area==='Nappali').map(x=>x.entity);if(!ids.length||ids.some(id=>!this.available(id)))return;return this.service('homeassistant',on?'turn_on':'turn_off',{entity_id:ids});}
 lightTile(x,i){const s=this.entity(x.entity),ok=this.available(x.entity),on=s?.state==='on';const dim=x.entity.startsWith('light.')&&ok&&(s.attributes?.supported_color_modes||[]).some(m=>!['onoff','unknown'].includes(m));return `<div class="tilewrap"><button class="tile ${ok?(on?'on':''):'unavailable'}" data-light="${i}" aria-pressed="${on}" ${!ok||this.pending?'disabled':''}><span class="symbol">${this.icon(x.icon||'mdi:lightbulb')}</span><span><span class="name">${esc(x.name)}</span><span class="state">${ok?(on?'Bekapcsolva':'Kikapcsolva'):'Nem elérhető'}</span></span></button>${dim?`<label class="brightness">Fényerő<input type="range" min="1" max="100" value="${Math.max(1,Math.round((s.attributes.brightness||1)/2.55))}" data-dim="${i}" ${this.pending?'disabled':''}></label>`:''}</div>`;}
 lightsPage(){const reserve=n=>`<div class="reserved">+ Szabad ${n}</div>`;let n=0;const living=this.lights.filter(x=>x.area==='Nappali');const livingOK=living.length&&living.every(x=>this.available(x.entity));const count=living.filter(x=>this.entity(x.entity)?.state==='on').length;const groupState=!livingOK?'Nem elérhető':count===0?'Kikapcsolva':count===living.length?'Bekapcsolva':'Részben bekapcsolva';return `<h2>Világítás</h2><div class="zone">${['Áttekintés','Földszint','Emelet','Kültér'].map(z=>`<button data-zone="${z}" aria-pressed="${z===this.zone}">${z}</button>`).join('')}</div>${[...new Set(this.lights.map(x=>x.area))].filter(a=>this.zone==='Áttekintés'||(this.zone==='Földszint'&&a!=='Kültér')||(this.zone==='Kültér'&&a==='Kültér')||(this.zone==='Emelet'&&a==='További helyiségek')).map(a=>{const items=this.lights.map((x,i)=>({x,i})).filter(({x})=>x.area===a);const reserveCount=0;return `<section><div class="sectionhead"><b>${a}</b>${a==='Nappali'?`<span class="muted" data-group-state>${groupState}</span><span class="groupactions"><button class="action" data-group="on" ${!livingOK||this.pending?'disabled':''}>Összes be</button><button class="action" data-group="off" ${!livingOK||this.pending?'disabled':''}>Összes ki</button></span>`:''}</div><div class="grid">${items.map(({x,i})=>this.lightTile(x,i)).join('')}${Array.from({length:reserveCount},()=>reserve(++n)).join('')}</div></section>`}).join('')}`;}
 cameraId(g){if(g.camera)return g.camera.startsWith('camera.')&&this.entity(g.camera)?g.camera:null;const matches=Object.entries(this._hass?.states||{}).filter(([id,s])=>id.startsWith('camera.')&&g.camera_name&&s.attributes?.friendly_name===g.camera_name);return matches.length===1?matches[0][0]:null;}

 gatesPage(){const order=[0,2,1,3,...this.gates.map((_,i)=>i).filter(i=>i>3)].filter(i=>!!this.gates[i]),active=order.includes(this.gatePreview)?this.gatePreview:null;const tile=i=>{const g=this.gates[i],cam=this.cameraId(g),camOK=!!cam&&this.available(cam),hasCam=!!g.camera||!!g.camera_name,ok=this.available(g.entity);return '<section class="gate gate-illustrated"><div class="gate-top"><span class="name">'+esc(g.name)+'</span>'+(hasCam?'<button class="camera-access" data-gate-preview="'+i+'" title="Kapukamera megjelenítése" aria-label="'+esc(g.name)+' kamerája">'+this.icon(camOK?'mdi:video-outline':'mdi:video-off-outline')+'</button>':'')+'</div><div class="gate-content"><div class="gate-visual">'+gateDrawing(i)+'</div><button class="gate-control" data-gate="'+i+'" aria-label="'+esc(g.name)+' működtetése" title="'+esc(g.name)+' vezérlése" '+(!ok||this.pending?'disabled':'')+'>'+this.icon('mdi:power')+'<span>Vezérlés</span></button></div></section>';};const preview=i=>{const g=this.gates[i],cam=this.cameraId(g),online=!!cam&&this.available(cam);return '<section class="gate-camera-panel" aria-label="'+esc(g.name)+' kamera-előnézete"><div class="gate-camera-head"><strong>'+this.icon('mdi:video-outline')+esc(g.name)+' – kamera</strong><button data-gate-preview-close aria-label="Kamera-előnézet bezárása">'+this.icon('mdi:close')+'</button></div>'+(online?'<div class="gate-camera-live" data-gate-camera-live="'+i+'"></div>':'<div class="gate-camera-empty">'+this.icon('mdi:video-off-outline')+'<span>'+(g.camera_name||g.camera?'A kamera még nem elérhető':'Ehhez a kapuhoz nincs kamera')+'</span></div>')+'</section>';};return '<h2>Kapuk</h2>'+(active===null?'<div class="gategrid">'+order.map(tile).join('')+'</div>':'<div class="gate-focus-grid">'+tile(active)+preview(active)+'</div><div class="gategrid gate-rest">'+order.filter(i=>i!==active).map(tile).join('')+'</div>');}
 cameraSlots(){const byIndex=this.gates;return [{name:byIndex[2]?.name||'Fenti garázsajtó',g:byIndex[2],gateIndex:2},{name:byIndex[1]?.name||'Lenti garázsajtó',g:byIndex[1],gateIndex:1},{name:byIndex[0]?.name||'Nagykapu',g:byIndex[0],gateIndex:0},{name:byIndex[3]?.name||'Fedett terasz',g:byIndex[3],gateIndex:3}];}
 camerasPage(){return '<h2>Kamerák</h2><div class="camera-grid">'+this.cameraSlots().map((x,i)=>{const camera=x.g?this.cameraId(x.g):null,online=!!camera&&this.available(camera);return '<section class="camera-tile"><div class="camera-tile-head"><span>'+this.icon('mdi:video-outline')+esc(x.name)+'</span>'+(online?'<span class="camera-ok">Elérhető</span>':'<span class="camera-idle">Nincs élőkép</span>')+'</div>'+(online?'<button class="camera-preview" data-camera-slot="'+i+'" aria-label="'+esc(x.name)+' kamera részletei"><span class="camera-live-frame" data-camera-live="'+i+'"></span><span class="camera-corner">'+this.icon('mdi:arrow-expand-all')+'</span></button>':'<div class="camera-empty">'+this.icon('mdi:video-off-outline')+'<span>'+ (x.g?.camera||x.g?.camera_name?'Kamera még nincs elérhetővé téve':'Kamerahely előkészítve')+'</span></div>')+'</section>';}).join('')+'</div>';}
 cameraControls(id){const registry=this._hass?.entities||{};const device=registry[id]?.device_id;if(!device)return [];const allowed=new Set(['switch','number','select','button','binary_sensor','sensor']);return Object.entries(registry).filter(([entityId,item])=>entityId!==id&&item.device_id===device&&allowed.has(entityId.split('.')[0])&&this.entity(entityId)).map(([entityId,item])=>({id:entityId,name:this.entity(entityId).attributes?.friendly_name||item.name||entityId,domain:entityId.split('.')[0],state:this.entity(entityId).state})).sort((a,b)=>a.name.localeCompare(b.name,'hu'));}
 cameraDialog(){if(this.activeCamera===null)return '';const slot=this.cameraSlots()[this.activeCamera],id=slot?.g&&this.cameraId(slot.g);if(!id||!this.available(id))return '';const controls=this.cameraControls(id);return '<div class="cam-overlay" data-camera-overlay><section class="cam-dialog" role="dialog" aria-modal="true" aria-label="'+esc(slot.name)+' kamera"><div class="cam-full-viewport"><div class="cam-full-feed" data-camera-dialog-live="'+this.activeCamera+'"></div><div class="cam-full-toolbar"><span class="cam-full-name">'+this.icon('mdi:video-outline')+esc(slot.name)+'</span><div class="cam-full-actions"><button class="cam-full-tool" data-camera-gear aria-label="Kamerabeállítások" aria-expanded="false" title="Beállítások">'+this.icon('mdi:cog-outline')+'</button><button class="cam-full-tool" data-camera-close aria-label="Kamerakép bezárása" title="Bezárás">'+this.icon('mdi:close')+'</button></div></div><section class="cam-settings-pop" data-camera-settings hidden aria-label="Kamerabeállítások"><div class="cam-settings-heading"><strong>Beállítások</strong><button data-camera-settings-close aria-label="Beállítások bezárása">'+this.icon('mdi:close')+'</button></div><div class="cam-settings-body">'+(controls.length?controls.map((c,i)=>'<button class="cam-setting" data-camera-setting="'+i+'"><span>'+esc(c.name)+'</span><span>'+esc(c.state)+' '+this.icon('mdi:chevron-right')+'</span></button>').join(''):'<p class="muted">Ehhez a kamerához jelenleg nincs külön vezérelhető beállítás a Home Assistantban. A mozgásérzékelés és rögzítés beállításait az eWeLinkben lehet kezelni, ha az eszköz támogatja.</p>')+'<button class="cam-setting cam-native" data-camera-native>Home Assistant kamerarészletek '+this.icon('mdi:open-in-new')+'</button></div></section></div></section></div>';}
 mountCameraCards(){this.shadowRoot.querySelectorAll('[data-camera-live],[data-camera-dialog-live],[data-gate-camera-live]').forEach(place=>{const gateIndex=place.dataset.gateCameraLive;const slotIndex=Number(place.dataset.cameraLive??place.dataset.cameraDialogLive);const slot=this.cameraSlots()[slotIndex];const id=gateIndex!==undefined?this.cameraId(this.gates[Number(gateIndex)]):slot?.g&&this.cameraId(slot.g);if(!id||!this.available(id))return;let card;if(customElements.get('hui-picture-entity-card')){try{card=document.createElement('hui-picture-entity-card');card.setConfig({type:'picture-entity',entity:id,camera_view:'live',show_name:false,show_state:false});card.hass=this._hass;place.replaceChildren(card);return;}catch(e){}}
 const pic=this.entity(id)?.attributes?.entity_picture;const label=gateIndex!==undefined?this.gates[Number(gateIndex)].name:slot.name;place.innerHTML=pic?'<img class="camera-fallback" src="'+esc(pic)+'" alt="'+esc(label)+' kamera állóképe">':'<span class="camera-feed-note">Kamera elérhető – megnyitásra élőkép</span>';});}

 alarmId(){return this.cfg?.alarm_entity||'alarm_control_panel.nspanelpronappali_sonoff_1002139b4c_alarm';}
 alarmPage(){const names=['Bejárat','Nappali','Konyha','Garázs','Hanna'];const ids=['bejarat','nappalli','konyha','garazs','hanna'].map(n=>`binary_sensor.${n}_mozgaserzekelo_occupancy`);const id=this.alarmId(),s=this.entity(id),ok=this.available(id),features=Number(s?.attributes?.supported_features)||0;const labels={disarmed:'Hatástalanítva',armed_home:'Otthon élesítve',armed_away:'Távollét élesítve',armed_night:'Éjszakai élesítés',arming:'Élesítés folyamatban',pending:'Belépési késleltetés',triggered:'RIASZTÁS',disarming:'Hatástalanítás folyamatban'};return `<h2>Riasztó</h2><div class="alarm-layout"><section class="alarm-box"><strong>${ok?esc(labels[s.state]||s.state):'Riasztó nem elérhető'}</strong>${s.state==='disarmed'? `<div class="arm-buttons"><button data-arm="home" ${!(features&1)||this.pending?'disabled':''}>${this.icon('mdi:home-lock')}Otthon élesítés</button><button data-arm="away" ${!(features&2)||this.pending?'disabled':''}>${this.icon('mdi:shield-lock')}Távozás élesítés</button></div>` : ok&&(s.state.startsWith('armed_')||s.state==='triggered'||s.state==='pending') ? `<div class="arm-buttons alarm-disarm-buttons"><button data-alarm-control ${this.pending?'disabled':''}>${this.icon('mdi:shield-off-outline')}Kiriasztás</button></div>` : `<p class="alarm-wait">${ok?'Állapotváltás folyamatban':'Riasztó nem elérhető'}</p>`}</section><section class="sensor-box"><h3>Mozgásérzékelők</h3>${(this.cfg?.sensors||names.map((name,i)=>({name,entity:ids[i]}))).map(x=>`<div class="sensor"><span>${esc(x.name)}</span><span class="muted">${!this.available(x.entity)?'Nem elérhető':this.entity(x.entity).state==='on'?'Mozgás':'Nincs mozgás'}</span></div>`).join('')}</section></div>`;}
 async arm(mode){const id=this.alarmId(),s=this.entity(id);const feature=mode==='home'?1:mode==='away'?2:0;if(!feature||!this.available(id)||!(Number(s.attributes?.supported_features)&feature))return;if(s.attributes?.code_arm_required===true||(s.attributes?.code_arm_required!==false&&s.attributes?.code_format)){this.more(id);return;}return this.service('alarm_control_panel',mode==='home'?'alarm_arm_home':'alarm_arm_away',{entity_id:id});}


 render(){if(!this.cfg)return;const pages=[['lights','Világítás','mdi:lightbulb-outline'],['alarm','Riasztó','mdi:shield-home-outline'],['gates','Kapuk','mdi:gate'],['cameras','Kamerák','mdi:video-outline']];this.shadowRoot.innerHTML=`<style>${css}</style><div class="root ${this.page==='gates'?'gates-view':this.page==='cameras'?'cameras-view':''}"><header><span class="brand">${this.icon('mdi:home-outline')}</span><div><h1>Otthon</h1><small>Világítás · Kapuk · Biztonság</small></div></header><nav aria-label="Otthon oldalak">${pages.map(([id,name,icon])=>`<button data-page="${id}" aria-selected="${this.page===id}">${this.icon(icon)}${name}</button>`).join('')}</nav><main>${this.page==='lights'?this.lightsPage():this.page==='gates'?this.gatesPage():this.page==='cameras'?this.camerasPage():this.alarmPage()}</main><p class="notice" role="status">${esc(this.message)}</p>${this.cameraDialog()}<footer>Otthon 1.0.10</footer></div>`;
 this.shadowRoot.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{this.page=b.dataset.page;this.activeCamera=null;this.gatePreview=null;this.message='';this.render();});
 this.shadowRoot.querySelectorAll('[data-zone]').forEach(b=>b.onclick=()=>{this.zone=b.dataset.zone;this.render();});
 this.shadowRoot.querySelectorAll('[data-light]').forEach(b=>b.onclick=()=>this.toggleLight(+b.dataset.light));
 this.shadowRoot.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>this.group(b.dataset.group==='on'));
 this.shadowRoot.querySelectorAll('[data-dim]').forEach(b=>b.onchange=()=>{const x=this.lights[+b.dataset.dim];if(this.available(x.entity))this.service('light','turn_on',{entity_id:x.entity,brightness_pct:Number(b.value)});});
 this.shadowRoot.querySelectorAll('[data-gate-preview]').forEach(b=>b.onclick=()=>{this.gatePreview=+b.dataset.gatePreview;this.render();});
 this.shadowRoot.querySelectorAll('[data-gate-preview-close]').forEach(b=>b.onclick=()=>{this.gatePreview=null;this.render();});
 this.shadowRoot.querySelectorAll('[data-camera-slot]').forEach(b=>b.onclick=()=>{this.activeCamera=Number(b.dataset.cameraSlot);this.render();});
 this.shadowRoot.querySelectorAll('[data-camera-close]').forEach(b=>b.onclick=()=>{this.activeCamera=null;this.render();});
 this.shadowRoot.querySelectorAll('[data-camera-gear]').forEach(b=>b.onclick=()=>{const panel=this.shadowRoot.querySelector('[data-camera-settings]');if(panel){panel.hidden=!panel.hidden;b.setAttribute('aria-expanded',String(!panel.hidden));}});
 this.shadowRoot.querySelectorAll('[data-camera-settings-close]').forEach(b=>b.onclick=()=>{const panel=this.shadowRoot.querySelector('[data-camera-settings]');if(panel)panel.hidden=true;const gear=this.shadowRoot.querySelector('[data-camera-gear]');if(gear)gear.setAttribute('aria-expanded','false');});
 this.shadowRoot.querySelectorAll('[data-camera-overlay]').forEach(b=>b.onclick=e=>{if(e.target===b){this.activeCamera=null;this.render();}});
 this.shadowRoot.querySelectorAll('[data-camera-native]').forEach(b=>b.onclick=()=>{const sl=this.cameraSlots()[this.activeCamera],cam=sl?.g&&this.cameraId(sl.g);if(cam)this.more(cam);});
 this.shadowRoot.querySelectorAll('[data-camera-setting]').forEach(b=>b.onclick=()=>{const sl=this.cameraSlots()[this.activeCamera],cam=sl?.g&&this.cameraId(sl.g),controls=this.cameraControls(cam);if(controls[+b.dataset.cameraSetting])this.more(controls[+b.dataset.cameraSetting].id);});
 this.shadowRoot.querySelectorAll('[data-gate]').forEach(b=>b.onclick=()=>{const g=this.gates[+b.dataset.gate];if(!this.available(g.entity))return;this.gatePreview=+b.dataset.gate;this.render();if(!g.verified_action){this.more(g.entity);return;}if(window.confirm(g.name+' működtetése?'))this.service(g.verified_action.domain,g.verified_action.service,{entity_id:g.entity});});
 this.shadowRoot.querySelectorAll('[data-arm]').forEach(b=>b.onclick=()=>this.arm(b.dataset.arm));
 const alarmControl=this.shadowRoot.querySelector('[data-alarm-control]');if(alarmControl)alarmControl.onclick=()=>this.more(this.alarmId());
 this.mountCameraCards();
 }
}
if(!customElements.get('otthon-card'))customElements.define('otthon-card',OtthonCard);
window.customCards=window.customCards||[];
if(!window.customCards.some(x=>x.type==='otthon-card'))window.customCards.push({type:'otthon-card',name:'Otthon',description:'Világítás, kapuk és riasztó — iPad / iPhone',preview:false});
})();
