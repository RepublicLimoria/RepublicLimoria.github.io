
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
