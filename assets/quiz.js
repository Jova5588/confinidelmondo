(function(){
const codes=Object.keys(Q), pool=codes.filter(k=>Q[k].b.length>=2&&Q[k].b.length<=7);
const el=id=>document.getElementById(id);
let round=0, score=0, cur=null, sel=new Set(), done=false, order=[];
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function start(){ order=shuffle(pool.slice()).slice(0,10); round=0; score=0; next(); }
function next(){
  if(round>=order.length) return finish();
  cur=order[round]; sel=new Set(); done=false;
  const c=Q[cur], right=new Set(c.b);
  // distrattori: vicini dei vicini e paesi dello stesso continente
  let near=new Set(); c.b.forEach(n=>Q[n].b.forEach(m=>{ if(m!==cur&&!right.has(m)) near.add(m); }));
  let d=shuffle([...near]);
  if(d.length<4) d=d.concat(shuffle(codes.filter(k=>Q[k].c===c.c&&k!==cur&&!right.has(k)&&!near.has(k))));
  const total=Math.min(Math.max(c.b.length+4,8),12);
  const opts=shuffle(c.b.concat(d.slice(0,total-c.b.length)));
  el("qnum").textContent=`Domanda ${round+1} di ${order.length}`;
  el("qscore").textContent=`Punti: ${score}`;
  el("qflag").src=`${P}assets/flags/${cur.toLowerCase()}.svg`; el("qflag").alt=`Bandiera: ${c.n}`;
  el("qname").textContent=c.q;
  el("qhint").textContent=`Seleziona tutti i paesi confinanti (sono ${c.b.length}).`;
  const box=el("qopts"); box.innerHTML="";
  opts.forEach(k=>{ const b=document.createElement("button"); b.type="button"; b.className="qopt"; b.dataset.k=k;
    b.setAttribute("aria-pressed","false");
    b.innerHTML=`<img src="${P}assets/flags/${k.toLowerCase()}.svg" alt="" width="24" height="16"><span></span>`; b.querySelector("span").textContent=Q[k].n;
    b.onclick=()=>{ if(done) return; sel.has(k)?sel.delete(k):sel.add(k); b.classList.toggle("on"); b.setAttribute("aria-pressed",sel.has(k)); };
    box.appendChild(b); });
  el("qfeed").textContent=""; el("qfeed").className="qfeed";
  el("qcheck").hidden=false; el("qnext").hidden=true;
}
function check(){
  if(done) return; done=true;
  const right=new Set(Q[cur].b); let ok=sel.size===right.size&&[...sel].every(k=>right.has(k));
  document.querySelectorAll(".qopt").forEach(b=>{ const k=b.dataset.k;
    if(right.has(k)&&sel.has(k)) b.classList.add("good");
    else if(right.has(k)) b.classList.add("miss");
    else if(sel.has(k)) b.classList.add("bad"); });
  if(ok) score++;
  el("qscore").textContent=`Punti: ${score}`;
  const f=el("qfeed"); f.className="qfeed "+(ok?"ok":"ko");
  f.innerHTML=(ok?"Esatto! ":"Non proprio. ")+`<a href="${P}paesi/${Q[cur].s}/">Scopri i confini ${Q[cur].o} →</a>`;
  round++; el("qcheck").hidden=true; el("qnext").hidden=false;
  el("qnext").textContent= round>=order.length ? "Vedi il risultato →" : "Prossima domanda →"; el("qnext").focus();
}
function finish(){
  el("qnum").textContent="Quiz completato"; el("qflag").removeAttribute("src"); el("qflag").alt="";
  el("qname").textContent=`Hai totalizzato ${score} punti su ${order.length}`;
  el("qhint").textContent= score>=9?"Straordinario: conosci i confini del mondo come pochi!": score>=6?"Ottimo lavoro! Ancora un piccolo ripasso e sarai imbattibile.":"Un buon inizio: esplora la mappa e riprova!";
  el("qopts").innerHTML=""; el("qfeed").textContent="";
  el("qcheck").hidden=true; el("qnext").hidden=false; el("qnext").textContent="Ricomincia con nuove domande"; round=-1;
}
el("qcheck").onclick=check;
el("qnext").onclick=()=>{ if(round===-1) start(); else next(); };
start();
})();
