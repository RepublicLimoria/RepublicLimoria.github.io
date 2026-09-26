// ===== SMOOTH SCROLL =====
function go(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}

// ===== LANGUAGE TOGGLE =====
function setL(lang){
  document.body.classList.remove('en','bn');
  document.body.classList.add(lang);
  const ben = document.getElementById('ben');
  const bbn = document.getElementById('bbn');
  if(ben) ben.classList.toggle('active', lang==='en');
  if(bbn) bbn.classList.toggle('active', lang==='bn');
  document.querySelectorAll('input,textarea').forEach(el=>{
    if(lang==='bn'){ el.placeholder = el.dataset.phbn || el.placeholder; }
    else{ el.placeholder = el.dataset.phen || el.placeholder; }
  });
  try{ localStorage.setItem('limLang', lang); }catch(e){}
}

// ===== THEME TOGGLE =====
function toggleTheme(){
  document.body.classList.toggle('dark');
  const btn = document.getElementById('themeBtn');
  const isDark = document.body.classList.contains('dark');
  if(btn) btn.textContent = isDark ? '☀️' : '🌙';
  try{ localStorage.setItem('limTheme', isDark ? 'dark' : 'light'); }catch(e){}
}

// ===== TOAST NOTIFICATION =====
function showToast(){
  const t = document.getElementById('toast');
  if(!t) return;
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 3000);
}

// ===== DATE =====
const todayEl = document.getElementById('today');
if(todayEl){
  todayEl.textContent = new Date().toLocaleDateString('en-US',{
    year:'numeric', month:'long', day:'numeric'
  });
}

// ===== SCROLL EVENTS =====
const header = document.getElementById('hd');
const topBtn = document.getElementById('top');
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', ()=>{
  const y = window.scrollY;

  if(header) header.classList.toggle('scrolled', y > 20);
  if(topBtn) topBtn.classList.toggle('show', y > 400);

  if(progressBar){
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (y / total) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  // Active nav
  const secs = ['home','about','gov','syms','news','services','contact'];
  let cur = 'home';
  secs.forEach(id=>{
    const el = document.getElementById(id);
    if(el && y >= el.offsetTop - 200) cur = id;
  });
  document.querySelectorAll('.nl').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('onclick').includes("'"+cur+"'"));
  });
});

// ===== REVEAL ON SCROLL =====
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('vis');
      observer.unobserve(e.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=> observer.observe(el));

// ===== ANIMATED COUNTERS =====
function animateCounter(el){
  const target = parseFloat(el.dataset.count);
  const divide = parseFloat(el.dataset.divide || 1);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = (target * eased) / divide;

    if(divide > 1){
      el.textContent = current.toFixed(1) + suffix;
    } else if (suffix === '%'){
      el.textContent = Math.round(current) + suffix;
    } else {
      el.textContent = Math.round(current).toLocaleString();
    }

    if(progress < 1) requestAnimationFrame(tick);
    else {
      if(divide > 1) el.textContent = (target/divide).toFixed(1) + suffix;
      else if(suffix === '%') el.textContent = target + suffix;
      else el.textContent = target.toLocaleString();
    }
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=> counterObserver.observe(el));

// ===== CURSOR GLOW (desktop) =====
const cursorGlow = document.getElementById('cursorGlow');
if(cursorGlow && window.innerWidth >= 900){
  document.addEventListener('mousemove', (e)=>{
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// ===== LOAD SAVED PREFERENCES =====
try{
  const savedLang = localStorage.getItem('limLang');
  if(savedLang) setL(savedLang);

  const savedTheme = localStorage.getItem('limTheme');
  if(savedTheme === 'dark'){
    document.body.classList.add('dark');
    const btn = document.getElementById('themeBtn');
    if(btn) btn.textContent = '☀️';
  }
}catch(e){}