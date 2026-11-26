const ONE=864e5;
function d(s){const[y,m,x]=s.split("-").map(Number);return new Date(y,m-1,x)}
function key(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}
function days(a,b){return Math.round((b-a)/ONE)}
const START=d("2026-11-29"),APR=d("2027-04-01"),JUL=d("2027-07-01");
const today=new Date();today.setHours(0,0,0,0);
let cur=new Date(today<START?START:today);
const dayN=t=>days(START,t);
const weekN=t=>Math.floor(days(d("2026-11-23"),t)/7);
const pick=(arr,n)=>arr[((n%arr.length)+arr.length)%arr.length];
const holiday=t=>t>=d("2026-12-21")&&t<=d("2027-01-03");
const fmtD=t=>t.toLocaleDateString("en-GB",{day:"numeric",month:"short"});

