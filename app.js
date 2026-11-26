function renderVision(){$('vision').innerHTML='<h2>2027–2031 · Build an exceptional life</h2><p>Wealth, professional excellence, athletic health, peace, motherhood and joy.</p><h3>2027 · Foundations</h3><p>Manuscript by April; Canada by July; financial stability; sustainable 360-degree routine. Explore clinical, academic, executive and entrepreneurial paths.</p><h3>2028 · Accelerate</h3><p>Strengthen career positioning, income and business ownership.</p><h3>2029 · Expand</h3><p>Validate scalable income streams and international contribution.</p><h3>2030 · Consolidate</h3><p>Build assets, independence and systems.</p><h3>2031 · Evaluate</h3><p>Review five-year outcomes and next strategic horizon. Long-term ambitions: homes in France and Canada, financial independence and scalable ownership.</p><p class="sub">2028–2031 are directional proposals, not fixed commitments.</p>'}

function render(){
 renderStrategy();
 const k=key(cur),diff=days(today,cur);
 $("before").hidden=!(cur<START);
 $("kick").textContent=diff===0?"Today":diff===-1?"Yesterday":diff===1?"Tomorrow":(diff<0?"Past day · tap for today":"Coming up · tap for today");
 $("date").textContent=cur.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"});
 $("dApr").textContent=Math.max(0,days(cur,APR));$("dJul").textContent=Math.max(0,days(cur,JUL));
 $("prog").style.width=Math.min(100,Math.max(0,dayN(cur)/days(START,APR)*100))+"%";
 const tired=!!S.tired[k];$("tired").setAttribute("aria-pressed",tired);$("tiredNote").hidden=!tired;
 const L=dayList(cur),done=L.filter(x=>isDone(x,k)).length;
 $("score").innerHTML=L.length?`<b>${done}</b> of ${L.length} done`:"";
 const ess=L.filter(x=>x.ess);$("essCard").hidden=!ess.length;$("ess").innerHTML=ess.map(x=>taskHTML(x,k)).join("");
 const rest=L.filter(x=>!x.ess);$("areasTitle").hidden=$("areasSub").hidden=!rest.length;
 $("areas").innerHTML=AREAS.map(([id,name,aim])=>{const it=rest.filter(x=>x.area===id);if(!it.length)return"";const dn=it.filter(x=>isDone(x,k)).length;
  return `<details class="area" data-area="${id}" ${openAreas.has(id)?"open":""}><summary><span><b>${esc(name)}</b><small>${esc(aim)}</small></span><span class="frac ${dn===it.length?"full":""}">${dn}/${it.length}</span></summary><ul>${it.map(x=>taskHTML(x,k)).join("")}</ul></details>`}).join("");
 $("reviewSec").hidden=cur.getDay()!==0||cur<START;
 if(cur.getDay()===0){const r=S.reviews[k]||{};$("rThesis").value=r.thesis||"";$("rFund").value=r.fund??"";$("rCard").value=r.card??"";$("rWin").value=r.win||"";drawEnergy(r.energy);$("rMsg").textContent=r.saved?"Saved. Well done.":""}
 const mon=new Date(cur);mon.setDate(cur.getDate()-((cur.getDay()+6)%7));
 $("week").innerHTML=[...Array(7)].map((_,i)=>{const t=new Date(mon);t.setDate(mon.getDate()+i);const kk=key(t),DL=dayList(t),p=DL.length?Math.round(DL.filter(x=>isDone(x,kk)).length/DL.length*100):0;return `<div class="${kk===k?"now":""}"><i><b style="height:${p}%"></b></i>${t.toLocaleDateString("en-GB",{weekday:"short"}).slice(0,2)}</div>`}).join("");
 if(document.activeElement!==$("ideas"))$("ideas").value=S.ideas||"";
}
let energy=null;
function drawEnergy(v){energy=v||null;$("energy").innerHTML=[1,2,3,4,5].map(n=>`<button type="button" data-e="${n}" aria-pressed="${n===energy}">${n}</button>`).join("")}

/* ---------- milestones view ---------- */
function renderMs(){
 renderStrategicMilestones();
 const nextI=MS.findIndex(m=>d(m[0])>=today);let tot=0,dn=0;
 $("msList").innerHTML=MS.map((m,i)=>{const dt=d(m[0]),c=m[1].filter((_,j)=>S.ms[m[0]+"-"+j]).length;tot+=6;dn+=c;
  return `<div class="ms ${i===nextI?"next":""}" id="ms${i}"><h3>${dt.toLocaleDateString("en-GB",{day:"numeric",month:"long"})}<span>${c}/6${i===nextI?" · next":""}</span></h3><ul>${m[1].map((txt,j)=>`<li><div class="task"><label><input type="checkbox" data-ms="${m[0]}-${j}" ${S.ms[m[0]+"-"+j]?"checked":""}><span class="t">${esc(txt)}<small>${esc(AREAS[j][1])}</small></span></label><span></span></div></li>`).join("")}</ul></div>`}).join("");
 $("msHead").textContent=`${dn} of ${tot} milestones reached. Next checkpoint: ${nextI>=0?d(MS[nextI][0]).toLocaleDateString("en-GB",{day:"numeric",month:"long"}):"all dates passed"}.`;
 return nextI}

/* ---------- progress view ---------- */
function stats(){const end=today<START?null:today,A={},ids={},weeks=[];let tot=0,dn=0;
 AREAS.forEach(a=>A[a[0]]={tot:0,done:0});
 if(end)for(let t=new Date(START);t<=end;t.setDate(t.getDate()+1)){const k=key(t),L=dayList(t),wi=weekN(t)-weekN(START);
  weeks[wi]=weeks[wi]||{tot:0,done:0,mon:new Date(t.getTime()-((t.getDay()+6)%7)*ONE)};
  L.forEach(x=>{const ok=isDone(x,k)?1:0,a=A[x.area]||A.life;a.tot++;a.done+=ok;tot++;dn+=ok;weeks[wi].tot++;weeks[wi].done+=ok;const id=x.trk?"trk":x.id;ids[id]=ids[id]||{tot:0,done:0};ids[id].tot++;ids[id].done+=ok})}
 return{A,ids,weeks,tot,dn,days:end?days(START,end)+1:0}}
function renderProg(){
 renderOutcomes();
 const P=stats(),pct=(a,b)=>b?Math.round(a/b*100):0,I=id=>P.ids[id]||{tot:0,done:0};
 const tc=Object.keys(S.trk.canada).length,tw=Object.keys(S.trk.wealth).length;
 const rk=Object.keys(S.reviews).sort(),last=f=>{for(let i=rk.length-1;i>=0;i--){const v=S.reviews[rk[i]][f];if(v!==null&&v!==undefined&&v!=="")return v}return null};
 const fund=last("fund"),card=last("card"),firstCard=(()=>{for(const k of rk){const v=S.reviews[k].card;if(v!==null&&v!==undefined&&v!=="")return v}return null})();
 $("pHead").textContent=P.days?`Day ${P.days} of your plan: ${pct(P.dn,P.tot)}% of planned tasks done.`:"Your plan starts on 27 November. Progress appears here from then.";
 const r=(label,a,b,txt)=>`<div class="r"><span>${esc(label)}</span><span>${esc(txt??(a+" / "+b))}</span>${b?`<div class="mini"><i style="width:${Math.min(100,pct(a,b))}%"></i></div>`:""}</div>`;
 $("pMoney").innerHTML=`<h2>Money</h2><div class="rows">${r("Move fund",fund||0,7100,fund===null?"enter on Sunday":"€"+(+fund).toLocaleString("en-GB")+" / €7,100")}${r("RBC card balance",0,0,card===null?"enter on Sunday":"€"+(+card).toLocaleString("en-GB")+(firstCard!==null&&+card<+firstCard?" ↓ from €"+(+firstCard).toLocaleString("en-GB"):""))}</div>`;
 const msA=j=>MS.filter(m=>S.ms[m[0]+"-"+j]).length;
 const R={career:[r("Thesis sessions done",I("thesis").done,I("thesis").tot),r("Thesis status (Sunday)",0,0,last("thesis")||"not set yet"),r("Canada steps",tc,TRACK.canada.length),r("Job applications sent",0,0,String(I("job").done))],
  wealth:[r("Money steps",tw,TRACK.wealth.length),r("Days spending noted",I("spend").done,I("spend").tot)],
  body:[r("Movement & workouts",I("move").done,I("move").tot),r("Food focus days",I("eat").done,I("eat").tot),r("Skincare & bed by 22:00",I("skin").done,I("skin").tot)],
  inner:[r("Quiet or prayer days",I("quiet").done,I("quiet").tot),r("Weekly practice done",I("theme").done,I("theme").tot)],
  mother:[r("Days with 20 min for Maella",I("maella").done,I("maella").tot)],
  life:[r("Joy & creativity tasks",I("life").done,I("life").tot)]};
 $("pAreas").innerHTML=AREAS.map(([id,name],j)=>{const a=P.A[id];return `<div class="card pcard"><h3><span>${esc(name)}</span><b>${pct(a.done,a.tot)}%</b></h3><div class="meter"><i style="width:${pct(a.done,a.tot)}%"></i></div><div class="rows">${R[id].join("")}${r("Milestones reached",msA(j),MS.length)}</div></div>`}).join("");
 $("pWeeks").innerHTML=P.weeks.filter(Boolean).map(w=>{const p=pct(w.done,w.tot);return `<div><em>${p}%</em><i style="height:${p}%"></i><small>${fmtD(w.mon)}</small></div>`}).join("")||'<p class="note">No data yet.</p>';
 const ev=rk.filter(k=>S.reviews[k].energy);
 $("pEnergy").innerHTML=ev.map(k=>{const e=S.reviews[k].energy;return `<div><em>${e}</em><i style="height:${e*20}%"></i><small>${fmtD(d(k))}</small></div>`}).join("")||'<p class="note">Fill in your first Sunday check to see this.</p>';
}

/* ---------- views & events ---------- */
let view="today";
function show(v){view=v;$("vDash").hidden=v!=="dashboard";if(v==="dashboard")renderDashboard();$("vVision").hidden=v!=="vision";$("vToday").hidden=v!=="today";$("vMs").hidden=v!=="ms";$("vProg").hidden=v!=="progress";$("backup").hidden=v!=="progress";
 [["tToday","today"],["tMs","ms"],["tProg","progress"],["tVision","vision"],["tDash","dashboard"]].forEach(([b,n])=>$(b).setAttribute("aria-selected",n===v));
 document.querySelector("header").hidden=v!=="today";
 if(v==="ms"){const i=renderMs();if(i>=0)setTimeout(()=>{const el=$("ms"+i);if(el&&i>0)el.scrollIntoView({block:"start"})},50)}
 if(v==="progress")renderProg();
 if(v==="today")render(); if(v==="vision")renderVision();
 try{window.scrollTo(0,0)}catch(e){}
 try{history.replaceState(null,"",v==="today"?location.pathname+location.search:"#"+(v==="ms"?"milestones":v))}catch(e){}}
$("tDash").onclick=()=>show("dashboard");$("tVision").onclick=()=>show("vision");$("tToday").onclick=()=>show("today");$("tMs").onclick=()=>show("ms");$("tProg").onclick=()=>show("progress");

function onTick(e){const el=e.target;if(el.type!=="checkbox")return;const k=key(cur);
 if(el.dataset.ms){if(el.checked)S.ms[el.dataset.ms]=true;else delete S.ms[el.dataset.ms];save();renderMs();return}
 const id=el.dataset.id;if(!id)return;
 if(el.dataset.trk){const log=S.trk[el.dataset.trk],i=+el.dataset.idx;if(el.checked)log[i]=k;else delete log[i]}
 else{S.ticks[k]=S.ticks[k]||{};S.ticks[k][id]=el.checked}
 save();render()}
$("vToday").addEventListener("change",onTick);$("vMs").addEventListener("change",onTick);
$("vToday").addEventListener("click",e=>{const b=e.target.closest(".info");if(!b)return;const id=key(cur)+b.dataset.how;openHow.has(id)?openHow.delete(id):openHow.add(id);render()});
$("areas").addEventListener("toggle",e=>{const a=e.target.dataset&&e.target.dataset.area;if(!a)return;e.target.open?openAreas.add(a):openAreas.delete(a)},true);
const go=n=>{cur.setDate(cur.getDate()+n);render()};
$("prev").onclick=()=>go(-1);$("next").onclick=()=>go(1);
$("tod").onclick=()=>{cur=new Date(today<START?START:today);render()};
$("tired").onclick=()=>{const k=key(cur);S.tired[k]?delete S.tired[k]:S.tired[k]=true;save();render()};
$("addForm").onsubmit=e=>{e.preventDefault();const v=$("addIn").value.trim();if(!v)return;const k=key(cur);(S.custom[k]=S.custom[k]||[]).push(v.slice(0,140));$("addIn").value="";save();render()};
$("energy").addEventListener("click",e=>{const n=+e.target.dataset.e;if(n)drawEnergy(n)});
const num=v=>v===""?null:+v;
$("rSave").onclick=()=>{S.reviews[key(cur)]={thesis:$("rThesis").value,fund:num($("rFund").value),card:num($("rCard").value),energy,win:$("rWin").value.slice(0,200),saved:true};save();render()};
let it;$("ideas").addEventListener("input",()=>{clearTimeout(it);it=setTimeout(()=>{S.ideas=$("ideas").value.slice(0,5000);save()},600)});
document.addEventListener("keydown",e=>{if(view!=="today"||e.target.matches("input,textarea,select,summary,button"))return;if(e.key==="ArrowLeft")go(-1);if(e.key==="ArrowRight")go(1)});
let sx=null,sy=null;
$("vToday").addEventListener("touchstart",e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
$("vToday").addEventListener("touchend",e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;if(Math.abs(dx)>70&&Math.abs(dy)<40)go(dx<0?1:-1)},{passive:true});

const themeButton=document.getElementById('themeToggle');function applyTheme(v){document.documentElement.dataset.theme=v;themeButton.textContent=v==='dark'?'Light mode':'Dark mode';}applyTheme(localStorage.getItem('today-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));themeButton.onclick=()=>{let v=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem('today-theme',v);applyTheme(v)};
render();
if(location.hash==="#dashboard")show("dashboard");else if(location.hash==="#vision")show("vision");else if(location.hash==="#milestones")show("ms");else if(location.hash==="#progress")show("progress");

if("serviceWorker" in navigator){try{navigator.serviceWorker.register("sw.js")}catch(e){}}
$("bExport").onclick=()=>{const blob=new Blob([JSON.stringify(S)],{type:"application/json"});const u=URL.createObjectURL(blob);const l=document.createElement("a");l.href=u;l.download="today-backup-"+key(today)+".json";document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);$("bMsg").textContent="Backup saved to your Downloads/Files."};
$("bImport").onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{S=norm(JSON.parse(t));save();show(view);$("bMsg").textContent="Backup restored."}catch(err){$("bMsg").textContent="This file is not a valid backup."}})};