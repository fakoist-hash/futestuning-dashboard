/* Read-only Recorder analysis. Values are held until the next recorded update;
 * unavailable states split coverage. No forecast, pump estimate or control call. */
const FT_DIAGNOSTICS = {
 number(value) {
  return value !== null && value !== undefined && String(value).trim() !== '' && Number.isFinite(Number(value)) ? Number(value) : null;
 },
 temperature(row, attribute) {
  if (!row || ['unknown','unavailable'].includes(row.state)) return null;
  const a=row.attributes||{}, value=this.number(attribute?a[attribute]:row.state);
  const unit=attribute==='temperature'&&row.entity_id?.startsWith('weather.')?a.temperature_unit:a.unit_of_measurement;
  return unit==='°C'&&value!==null&&value>=-40&&value<=110?value:null;
 },
 series(rows, read) {
  return (rows||[]).map(row=>({t:Date.parse(row.last_updated||row.last_changed),v:read(row)}))
   .filter(p=>Number.isFinite(p.t)).sort((a,b)=>a.t-b.t);
 },
 segments(points,start,end) {
  const out=[];let t=start,v=null;
  for(const p of points){if(p.t<=start){v=p.v;continue}if(p.t>=end)break;out.push({start:t,end:p.t,v});t=p.t;v=p.v;}
  if(t<end)out.push({start:t,end,v});return out;
 },
 numeric(points,start,end,base=18) {
  let covered=0,sum=0,degreeHours=0,min=Infinity,max=-Infinity;
  for(const s of this.segments(points,start,end)){if(s.v===null)continue;const dt=s.end-s.start;covered+=dt;sum+=s.v*dt;degreeHours+=Math.max(0,base-s.v)*dt/3600000;min=Math.min(min,s.v);max=Math.max(max,s.v);}
  return {coverage:covered/(end-start),min:covered?min:null,max:covered?max:null,mean:covered?sum/covered:null,degreeHours:covered?degreeHours:null};
 },
 binary(points,start,end) {
  let known=0,on=0,starts=0;const missing=[];
  for(const s of this.segments(points,start,end)){const dt=s.end-s.start;if(s.v===null)missing.push({start:s.start,end:s.end});else{known+=dt;if(s.v===true)on+=dt;}}
  let prev=null;for(const p of points){if(p.t>=end)break;if(p.t>start&&prev===false&&p.v===true)starts++;prev=p.v;}
  return {hours:known?on/3600000:null,coverage:known/(end-start),starts:known?starts:null,missing};
 },
 // Midnight boundaries are calendar boundaries in the HA timezone, including DST.
 dayKey(t,zone){return new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(t));},
 days(start,end,zone) {
  const out=[];let cursor=start,key=this.dayKey(start,zone);
  while(cursor<end){let next=Math.min(end,cursor+3600000);if(this.dayKey(next,zone)!==key){let lo=cursor,hi=next;while(hi-lo>1){const mid=Math.floor((lo+hi)/2);if(this.dayKey(mid,zone)===key)lo=mid;else hi=mid;}next=hi;}
   const last=out[out.length-1];if(last?.date===key)last.end=next;else out.push({date:key,start:cursor,end:next});cursor=next;key=this.dayKey(cursor,zone);
  }return out;
 },
 summarize(series,sources,start,end,zone,base=18) {
  const rows=this.days(start,end,zone).map(day=>{
   const weather=this.numeric(series[sources.outdoor?.id]||[],day.start,day.end,base);
   const demands=sources.demands.map(s=>this.binary(series[s.id]||[],day.start,day.end));
   const indoor=(sources.climates||[]).map(id=>({id,current:this.numeric(series[id+'#current_temperature']||[],day.start,day.end),target:this.numeric(series[id+'#temperature']||[],day.start,day.end)}));
   const completeDay=day.end-day.start>=23*3600000&&this.dayKey(day.start-1,zone)!==day.date&&this.dayKey(day.end,zone)!==day.date;
   const weatherGood=completeDay&&weather.coverage>=.95&&weather.degreeHours>=1;
   return {...day,weather,demands,indoor,completeDay,ratios:demands.map(d=>weatherGood&&d.coverage>=.95?d.hours/weather.degreeHours:null)};
  });return rows;
 },
 compare(rows) {
  const valid=rows.filter(r=>r.completeDay&&r.weather.coverage>=.95&&r.ratios.every(v=>v!==null));
  const current=valid[valid.length-1];if(!current)return null;
  const similar=valid.filter(r=>r!==current&&Math.abs(r.weather.mean-current.weather.mean)<=2&&current.indoor.every((v,i)=>v.target.coverage>=.95&&r.indoor[i]?.target.coverage>=.95&&Math.abs(v.target.mean-r.indoor[i].target.mean)<=.5));
  if(!similar.length)return null;
  return {current,reference:similar.map(r=>r.date),ratios:current.ratios.map((v,i)=>{const avg=similar.reduce((s,r)=>s+r.ratios[i],0)/similar.length;return avg>0?(v/avg-1)*100:null;})};
 },
 csv(rows,names) {
  const header=['date','complete_day','outdoor_coverage','outdoor_min_C','outdoor_mean_C','outdoor_max_C','degree_hours_base18_C_h',...names.flatMap(n=>[n+'_demand_h',n+'_confirmed_off_on',n+'_coverage',n+'_demand_h_per_degree_hour'])];
  return '\ufeff'+[header,...rows.map(r=>[r.date,r.completeDay,r.weather.coverage,r.weather.min,r.weather.mean,r.weather.max,r.weather.degreeHours,...r.demands.flatMap((d,i)=>[d.hours,d.starts,d.coverage,r.ratios[i]])])].map(row=>row.map(v=>v===null?'':typeof v==='number'?String(Math.round(v*10000)/10000):String(v)).join(';')).join('\r\n');
 }
};
