function norm(v){const b={ticks:{},tired:{},reviews:{},custom:{},ideas:"",trk:{},ms:{}};const o=Object.assign(b,v||{});o.trk=o.trk||{};o.trk.canada=o.trk.canada||{};o.trk.wealth=o.trk.wealth||{};o.ms=o.ms||{};return o}
try{S=norm(JSON.parse(localStorage.getItem("cleia-today")||"null"))}catch(e){S=norm()}
let db=null,timer=null,openAreas=new Set(),openHow=new Set();
const $=id=>document.getElementById(id);
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function save(){try{localStorage.setItem("cleia-today",JSON.stringify(S))}catch(e){}}

function trackStep(name,k){const log=S.trk[name],L=TRACK[name];
 for(const i in log)if(log[i]===k)return{i:+i,done:true};
 if(k<key(today))return null;
 for(let i=0;i<L.length;i++)if(!log[i])return{i,done:false};
 return{i:-1,done:false}}
function resolve(x,k){if(!x.id.startsWith("trk:"))return x;
 const n=x.id.slice(4),s=trackStep(n,k);if(!s)return null;
 if(s.i<0)return{...x,id:"trkx:"+n,txt:TRACK_DONE[n],how:"You've finished this path. Keep the habit going."};
 const st=TRACK[n][s.i];return{...x,id:"trk:"+n,txt:st[0],how:st[1]||"",trk:n,idx:s.i,done:s.done,step:"Step "+(s.i+1)+" of "+TRACK[n].length}}
function isDone(x,k){if(x.trk)return x.done;return!!(S.ticks[k]||{})[x.id]}
function dayList(t){const k=key(t);let L=tasks(t).map(x=>resolve(x,k)).filter(Boolean);
 if(S.tired[k]){L=L.filter(x=>x.ess).map(x=>x.id==="thesis"?{...x,txt:"Thesis: 25 min, only if you can",how:"Open the file and write anything, even 3 sentences. Then stop."}:x)}
 (S.custom[k]||[]).forEach((c,i)=>L.push({area:"life",id:"c"+i,txt:c,how:"",ess:1,custom:1}));return L}

function taskHTML(x,k){const hid="h-"+x.id,open=openHow.has(k+x.id);
 return `<li><div class="task"><label><input type="checkbox" data-id="${esc(x.id)}" ${x.trk?`data-trk="${x.trk}" data-idx="${x.idx}"`:""} ${isDone(x,k)?"checked":""}><span class="t">${esc(x.txt)}${x.step?`<small>${x.step}</small>`:""}</span></label>${x.how?`<button class="info" data-how="${esc(x.id)}" aria-expanded="${open}" aria-controls="${hid}" aria-label="How to do it">?</button>`:"<span></span>"}</div>${x.how&&open?`<p class="how" id="${hid}">${esc(x.how)}</p>`:""}</li>`}

