const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/futestuning-diagnostics.js','utf8')+'\nglobalThis.D=FT_DIAGNOSTICS',ctx);const D=ctx.D,H=3600000;
const points=values=>values.map(([h,v])=>({t:h*H,v}));
let a=D.binary(points([[0,false],[1,true],[2,null],[3,true],[4,false]]),0,5*H);
assert.equal(a.hours,2);assert.equal(a.coverage,.8);assert.equal(a.starts,1);assert.equal(a.missing.length,1);
assert.equal(D.binary(points([[0,true],[2,false]]),0,3*H).starts,0,'Already on at query start is not a new start');
assert.equal(D.binary([],0,H).hours,null,'No records must not become zero usage');
assert.equal(D.binary(points([[2,true]]),0,3*H).coverage,1/3);
a=D.numeric(points([[0,8],[1,12],[2,null],[3,18]]),0,4*H);assert.equal(a.mean,38/3);assert.equal(a.degreeHours,16);assert.equal(a.coverage,.75);
assert.equal(D.numeric([],0,H).mean,null);
for(const state of ['-203','NaN','Infinity','unknown','unavailable',''])assert.equal(D.temperature({state,attributes:{unit_of_measurement:'°C'}}),null);
assert.equal(D.temperature({state:'50',attributes:{unit_of_measurement:'°F'}}),null);
assert.equal(D.temperature({entity_id:'weather.test',state:'sunny',attributes:{temperature:8,temperature_unit:'°C'}},'temperature'),8);
assert.equal(D.temperature({entity_id:'weather.test',state:'unavailable',attributes:{temperature:8,temperature_unit:'°C'}},'temperature'),null);
// Europe/Budapest's 23-hour spring day and 25-hour autumn day are complete days.
for(const [start,end,hours] of [['2026-03-28T23:00:00Z','2026-03-29T22:00:00Z',23],['2026-10-24T22:00:00Z','2026-10-25T23:00:00Z',25]]){
 const s=Date.parse(start),e=Date.parse(end),days=D.days(s,e,'Europe/Budapest');assert.equal(days.length,1);assert.equal((days[0].end-days[0].start)/H,hours);
 const rows=D.summarize({w:[{t:s,v:8}],d:[{t:s,v:true}]},{outdoor:{id:'w'},demands:[{id:'d'}]},s,e,'Europe/Budapest');assert.equal(rows[0].completeDay,true);assert.equal(rows[0].ratios[0],.1);
}
const start=Date.parse('2026-11-01T23:00:00Z'),end=start+48*H,sources={outdoor:{id:'w'},demands:[{id:'d'}]};
let rows=D.summarize({w:[{t:start,v:8}],d:[{t:start,v:true}]},sources,start,end,'Europe/Budapest');assert.equal(rows.length,2);assert.equal(D.compare(rows).ratios[0],0);
rows=D.summarize({w:[{t:start,v:18}],d:[{t:start,v:true}]},sources,start,end,'Europe/Budapest');assert.equal(rows[0].ratios[0],null);assert.equal(D.compare(rows),null);
assert.match(D.csv(rows,['test']),/confirmed_off_on/);assert(!D.csv(rows,['test']).includes('NaN'));
console.log('PASS: Recorder durations, confirmed starts, missing-data coverage, time-weighted means, degree-hours, DST days, comparison and CSV');
