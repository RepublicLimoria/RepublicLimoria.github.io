
document.addEventListener("DOMContentLoaded",()=>{
 const btn=document.querySelector(".menu-btn"),nav=document.querySelector("nav");
 if(btn&&nav){btn.addEventListener("click",()=>{nav.classList.toggle("open");btn.setAttribute("aria-expanded",nav.classList.contains("open"))});
 nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));}
 const y=document.querySelector("[data-year]"); if(y)y.textContent=new Date().getFullYear();
});
function demoSubmit(e){e.preventDefault();const s=document.getElementById("form-status");if(s)s.textContent="Demo submitted successfully. Connect a form service to receive real messages.";e.target.reset();return false;}

const glow=document.createElement("div");glow.className="cursor-glow";document.body.appendChild(glow);
addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});
const progress=document.createElement("div");progress.className="progress-bar";document.body.appendChild(progress);
addEventListener("scroll",()=>{const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h>0?(scrollY/h)*100:0)+"%"});
document.querySelectorAll(".glass-card").forEach(card=>{
  card.addEventListener("pointermove",e=>{
    if(innerWidth<700)return;
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(700px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-4px)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="");
});
addEventListener("keydown",e=>{
  if(e.key==="/"){e.preventDefault();document.querySelector(".main-nav a")?.focus()}
  if(e.key.toLowerCase()==="h") location.href="index.html";
});

/* Bangla / English language toggle */
(function(){
 const bn={
  "Home":"হোম","About":"পরিচিতি","Government":"সরকার","Constitution":"সংবিধান","Citizenship":"নাগরিকত্ব","Economy":"অর্থনীতি","Geography":"ভূগোল","Cities":"শহরসমূহ","Ministries":"মন্ত্রণালয়","Culture":"সংস্কৃতি","Symbols":"জাতীয় প্রতীক","Tourism":"পর্যটন","News":"সংবাদ","Gallery":"গ্যালারি","FAQ":"জিজ্ঞাসা","Contact":"যোগাযোগ",
  "Explore Limoria →":"লিমোরিয়া দেখুন →","Read the Constitution":"সংবিধান পড়ুন","View Government":"সরকার দেখুন","View all →":"সব দেখুন →","Discover the national story →":"জাতীয় পরিচিতি দেখুন →",
  "Government<small>Institutions & leadership</small>":"সরকার<small>প্রতিষ্ঠান ও নেতৃত্ব</small>",
  "Constitution<small>Principles & rights</small>":"সংবিধান<small>নীতি ও অধিকার</small>",
  "Citizenship<small>Fictional civic guide</small>":"নাগরিকত্ব<small>কাল্পনিক নাগরিক নির্দেশিকা</small>",
  "Economy<small>Trade & development</small>":"অর্থনীতি<small>বাণিজ্য ও উন্নয়ন</small>",
  "Geography<small>Regions & landscapes</small>":"ভূগোল<small>অঞ্চল ও প্রাকৃতিক দৃশ্য</small>",
  "Tourism<small>Places to explore</small>":"পর্যটন<small>দর্শনীয় স্থান</small>",
  "HEAD OF STATE":"রাষ্ট্রপ্রধান","THE REPUBLIC OF LIMORIA":"লিমোরিয়া প্রজাতন্ত্র","WELCOME TO LIMORIA":"লিমোরিয়ায় স্বাগতম",
  "News & Updates":"সংবাদ ও আপডেট","National Symbols":"জাতীয় প্রতীক","Fictional worldbuilding notice:":"কাল্পনিক বিশ্বনির্মাণ নোট:",
  "Population (fictional)":"জনসংখ্যা (কাল্পনিক)","Area (fictional)":"আয়তন (কাল্পনিক)","Capital (fictional)":"রাজধানী (কাল্পনিক)","Currency (fictional)":"মুদ্রা (কাল্পনিক)",
  "Unity • Progress • Prosperity":"ঐক্য • অগ্রগতি • সমৃদ্ধি",
  "Fictional worldbuilding project.":"কাল্পনিক বিশ্বনির্মাণ প্রকল্প।"
 };
 const original=new WeakMap();
 function translateTextNode(node,on){
   if(node.nodeType!==3)return;
   const parent=node.parentElement;
   if(!parent || ['SCRIPT','STYLE'].includes(parent.tagName))return;
   if(!original.has(node)) original.set(node,node.nodeValue);
   const text=original.get(node);
   if(!on){node.nodeValue=text;return;}
   const trimmed=text.trim();
   if(!trimmed)return;
   const val=bn[trimmed];
   if(val!==undefined){node.nodeValue=text.replace(trimmed,val);}
 }
 function setLang(lang){
   const on=lang==='bn';
   document.documentElement.lang=on?'bn':'en';
   document.documentElement.classList.toggle('lang-bn',on);
   document.querySelectorAll('.language-toggle').forEach(b=>b.textContent=on?'English':'বাংলা');
   document.querySelectorAll('body *').forEach(el=>{
     if(el.classList.contains('language-toggle')) return;
     Array.from(el.childNodes).forEach(n=>translateTextNode(n,on));
   });
   localStorage.setItem('limoria-language',lang);
 }
 document.addEventListener('DOMContentLoaded',()=>{
   document.querySelectorAll('.language-toggle').forEach(b=>b.addEventListener('click',()=>setLang((localStorage.getItem('limoria-language')||'en')==='en'?'bn':'en')));
   setLang(localStorage.getItem('limoria-language')||'en');
 });
})();

// Privacy-friendly local visit counter (GitHub Pages has no global database).
document.addEventListener("DOMContentLoaded",()=>{try{const k="limoria-local-visits";let n=parseInt(localStorage.getItem(k)||"0",10)+1;localStorage.setItem(k,String(n));document.querySelectorAll("[data-visit-count]").forEach(el=>el.textContent=n.toLocaleString());}catch(e){}});