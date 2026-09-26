/* ========================================
   REPUBLIC OF LIMORIA — SCRIPT.JS
   Part 1: Core Functions
   ======================================== */

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

// ===== MOBILE MENU =====
function toggleMenu(){
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('menuToggle');
  if(nav && btn){
    nav.classList.toggle('open');
    btn.classList.toggle('active');
  }
}
function closeMenu(){
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('menuToggle');
  if(nav && btn){
    nav.classList.remove('open');
    btn.classList.remove('active');
  }
}

// ===== TOAST =====
function showToast(){
  const t = document.getElementById('toast');
  if(!t) return;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(()=> t.classList.remove('show'), 3000);
}

// ===== DATE =====
const todayEl = document.getElementById('today');
if(todayEl){
  todayEl.textContent = new Date().toLocaleDateString('en-US',{
    year:'numeric', month:'long', day:'numeric'
  });
}
/* ========================================
   Part 2: Scroll, Animation, 3D Effects
   ======================================== */

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
}, {passive:true});

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

// ===== 3D TILT EFFECT =====
function add3DTilt(el, maxTilt = 10){
  if(window.innerWidth < 768) return;

  el.addEventListener('mousemove', (e)=>{
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotateY = ((x - cx) / cx) * maxTilt;
    const rotateX = ((cy - y) / cy) * maxTilt;

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02)`;
  });

  el.addEventListener('mouseleave', ()=>{
    el.style.transform = '';
  });
}

document.querySelectorAll('.card, .sym, .nitem, .pcard').forEach(el=>{
  add3DTilt(el, 8);
});

// ===== HERO PARALLAX ON SCROLL =====
const heroFlag = document.querySelector('.flag-frame');
const heroContent = document.querySelector('.hero-content');

if(heroFlag && window.innerWidth >= 768){
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(y < 800){
      heroFlag.style.transform = `perspective(1400px) rotateY(${-8 + y*0.02}deg) rotateX(${4 - y*0.01}deg) translateY(${y * 0.1}px)`;
      if(heroContent){
        heroContent.style.transform = `translateY(${y * 0.15}px)`;
        heroContent.style.opacity = Math.max(0, 1 - (y / 600));
      }
    }
  }, {passive:true});
}

// ===== MOUSE-FOLLOW GLOW ON CARDS =====
if(window.innerWidth >= 768){
  document.querySelectorAll('.card, .sym').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(201,162,39,.08) 0%, var(--card-bg) 60%)`;
    });

    card.addEventListener('mouseleave', ()=>{
      card.style.background = '';
    });
  });
}
/* ========================================
   Part 3: Chatbot & Final Features
   ======================================== */

// ===== OUTSIDE CLICK CLOSES MENU =====
document.addEventListener('click', (e)=>{
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('menuToggle');
  if(!nav || !btn) return;
  if(!nav.contains(e.target) && !btn.contains(e.target)){
    nav.classList.remove('open');
    btn.classList.remove('active');
  }
});

// ===== ESCAPE CLOSES MENU =====
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeMenu();
});

// ===== SWIPE RIGHT CLOSES MENU =====
let touchStartX = 0;
document.addEventListener('touchstart', (e)=>{ touchStartX = e.touches[0].clientX; });
document.addEventListener('touchend', (e)=>{
  const diff = touchStartX - e.changedTouches[0].clientX;
  if(diff < -80) closeMenu();
});

/* ========================================
   💬 CHATBOT LOGIC
   ======================================== */

let chatOpened = false;

function toggleChat(){
  const win = document.getElementById('chatWindow');
  const badge = document.getElementById('chatBadge');
  if(!win) return;

  win.classList.toggle('open');

  if(!chatOpened && win.classList.contains('open')){
    chatOpened = true;
    if(badge) badge.style.display = 'none';
    setTimeout(()=> document.getElementById('chatInput')?.focus(), 400);
  }
}

function quickAsk(text){
  const input = document.getElementById('chatInput');
  if(input){
    input.value = text;
    sendMessage();
  }
}

function sendMessage(){
  const input = document.getElementById('chatInput');
  const body = document.getElementById('chatBody');
  if(!input || !body) return;

  const text = input.value.trim();
  if(!text) return;

  const qr = document.getElementById('quickReplies');
  if(qr) qr.style.display = 'none';

  addMsg(text, 'user');
  input.value = '';

  const typing = document.createElement('div');
  typing.className = 'msg bot';
  typing.id = 'typingIndicator';
  typing.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  body.appendChild(typing);
  body.scrollTop = body.scrollHeight;

  setTimeout(()=>{
    typing.remove();
    const reply = getBotReply(text);
    addMsg(reply, 'bot');
  }, 900 + Math.random() * 600);
}

function addMsg(text, type){
  const body = document.getElementById('chatBody');
  if(!body) return;

  const msg = document.createElement('div');
  msg.className = 'msg ' + type;
  msg.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[m]);
}

/* ========================================
   🧠 BOT BRAIN
   ======================================== */
function getBotReply(input){
  const t = input.toLowerCase();
  const isBn = document.body.classList.contains('bn');

  // Greeting
  if(/(hi|hello|hey|হ্যালো|হাই|সালাম|আসসালামু)/i.test(t)){
    return isBn
      ? '👋 হ্যালো! লিমোরিয়া প্রজাতন্ত্র সম্পর্কে কী জানতে চান?'
      : '👋 Hello! What would you like to know about the Republic of Limoria?';
  }

  // About Limoria
  if(/(limoria|লিমোরিয়া|about|দেশ|nation|republic|প্রজাতন্ত্র)/i.test(t)){
    return isBn
      ? '🏛️ লিমোরিয়া প্রজাতন্ত্র ১৯৮৭ সালে প্রতিষ্ঠিত একটি সার্বভৌম রাষ্ট্র। ১২টি প্রদেশে ২৪ লক্ষাধিক নাগরিক বাস করেন। রাজধানী: ক্যাপিটাল সিটি।'
      : '🏛️ The Republic of Limoria is a sovereign nation founded in 1987. Over 2.4 million citizens across 12 provinces. Capital: Capital City.';
  }

  // President
  if(/(president|রাষ্ট্রপতি|leader|নেতা|vandell|ভ্যান্ডেল)/i.test(t)){
    return isBn
      ? '👑 রাষ্ট্রপতি আরিয়া ভ্যান্ডেল লিমোরিয়ার রাষ্ট্রপ্রধান। তিনি ঐক্য ও অগ্রগতির জন্য কাজ করছেন।'
      : '👑 President Aria Vandell is the Head of State, working for unity and progress.';
  }

  // Currency
  if(/(currency|মুদ্রা|taka|money|guilder|গিল্ডার|lg)/i.test(t)){
    return isBn
      ? '💰 লিমোরিয়ার জাতীয় মুদ্রা: লিমোরিয়ান গিল্ডার (LG)। প্রতিটি মুদ্রায় জাতীয় প্রতীক খোদাই করা।'
      : '💰 National currency: Limorian Guilder (LG). Each coin bears the national emblem.';
  }

  // Services
  if(/(service|সেবা|citizen|নাগরিক|apply|আবেদন|id|passport|পাসপোর্ট)/i.test(t)){
    return isBn
      ? '📋 নাগরিক সেবা:\n• পরিচয়পত্র ও পাসপোর্ট\n• শিক্ষা\n• স্বাস্থ্যসেবা\n• কর ও অর্থ\n• পরিবহন\n• পরিবেশ'
      : '📋 Citizen Services:\n• Identity & Passports\n• Education\n• Healthcare\n• Taxes & Finance\n• Transport\n• Environment';
  }

  // News
  if(/(news|সংবাদ|update|আপডেট|announcement|ঘোষণা)/i.test(t)){
    return isBn
      ? '📰 সর্বশেষ সংবাদ দেখতে "News" সেকশনে যান। সরকারি ঘোষণা ও আপডেট পাবেন।'
      : '📰 Visit the "News" section for the latest government announcements.';
  }

  // Contact
  if(/(contact|যোগাযোগ|email|ইমেইল|phone|ফোন|address|ঠিকানা|reach)/i.test(t)){
    return isBn
      ? '📞 যোগাযোগ:\n📍 গভর্নমেন্ট হাউস, রাজধানী\n📞 +000 1234 5678\n✉️ info@limoria.gov\n🕐 রবি–বৃহস্পতি, ৯টা–৫টা'
      : '📞 Contact:\n📍 Government House, Capital City\n📞 +000 1234 5678\n✉️ info@limoria.gov\n🕐 Sun–Thu, 9AM–5PM';
  }

  // Population
  if(/(population|জনসংখ্যা|how many|কত)/i.test(t)){
    return isBn
      ? '👥 লিমোরিয়ার জনসংখ্যা প্রায় ২৪ লক্ষ (২.৪ মিলিয়ন)।'
      : '👥 Limoria has a population of about 2.4 million.';
  }

  // Language
  if(/(language|ভাষা|speak|বাংলা|english)/i.test(t)){
    return isBn
      ? '🌐 লিমোরিয়ায় ৮টি ভাষা প্রচলিত। সরকারি ভাষা ইংরেজি ও লিমোরিয়ান।'
      : '🌐 8 languages are spoken. Official: English and Limorian.';
  }

  // Flag
  if(/(flag|পতাকা|symbol|প্রতীক|emblem)/i.test(t)){
    return isBn
      ? '🇱🇷 পতাকায়: সবুজ (ভূমি), সাদা (শান্তি), নীল (সমুদ্র), সোনালি সূর্য (আশা)।'
      : '🇱🇷 Flag: green (land), white (peace), blue (seas), golden sun (hope).';
  }

  // History
  if(/(history|ইতিহাস|founded|প্রতিষ্ঠা|1987)/i.test(t)){
    return isBn
      ? '📜 লিমোরিয়া ১৯৮৭ সালে প্রতিষ্ঠিত হয়। সংবিধান ১৯৮৭ সালের। জাতীয় দিবস: ১২ এপ্রিল।'
      : '📜 Limoria was founded in 1987. Constitution: 1987. National Day: April 12.';
  }

  // Government
  if(/(government|সরকার|branch|বিভাগ|assembly|সংসদ|court|আদালত)/i.test(t)){
    return isBn
      ? '⚖️ সরকারের ৩টি শাখা:\n• নির্বাহী (রাষ্ট্রপতি)\n• আইনসভা (জাতীয় সংসদ, ১২০ জন)\n• বিচার বিভাগ (সুপ্রিম কোর্ট)'
      : '⚖️ Three branches:\n• Executive (President)\n• Legislative (National Assembly, 120)\n• Judicial (Supreme Court)';
  }

  // Article
  if(/(article|আর্টিকেল|full|বিস্তারিত|read)/i.test(t)){
    return isBn
      ? '📖 সম্পূর্ণ আর্টিকেল পড়তে হোমপেজে "সম্পূর্ণ আর্টিকেল" বাটনে ক্লিক করুন।'
      : '📖 Click the "Full Article" button on the homepage to read the full article.';
  }

  // Thanks
  if(/(thank|ধন্যবাদ|thanks|থ্যাংক)/i.test(t)){
    return isBn
      ? '😊 আপনাকে স্বাগতম! আর কিছু জানতে চাইলে বলুন।'
      : '😊 You\'re welcome! Let me know if you need anything else.';
  }

  // Bye
  if(/(bye|বিদায়|goodbye|আলবিদা)/i.test(t)){
    return isBn
      ? '👋 বিদায়! লিমোরিয়া প্রজাতন্ত্রে আবার আসবেন।'
      : '👋 Goodbye! Visit the Republic of Limoria again soon.';
  }

  // Default
  return isBn
    ? '🤔 দুঃখিত, আমি ঠিক বুঝতে পারিনি। আপনি জিজ্ঞেস করতে পারেন:\n• "লিমোরিয়া সম্পর্কে"\n• "রাষ্ট্রপতি কে?"\n• "মুদ্রা"\n• "নাগরিক সেবা"\n• "যোগাযোগ"'
    : '🤔 Sorry, I didn\'t understand. Try asking:\n• "About Limoria"\n• "Who is the president?"\n• "Currency"\n• "Citizen services"\n• "Contact"';
}

/* ========================================
   💾 LOAD SAVED PREFERENCES
   ======================================== */
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