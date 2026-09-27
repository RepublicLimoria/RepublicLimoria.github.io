const VERSION = "limoria-pwa-v4";
const CORE = [
  "./", "./index.html", "./about.html", "./government.html", "./constitution.html", "./citizenship.html",
  "./economy.html", "./geography.html", "./cities.html", "./ministries.html", "./culture.html",
  "./symbols.html", "./tourism.html", "./news.html", "./gallery.html", "./faq.html", "./contact.html", "./404.html",
  "./manifest.webmanifest", "./assets/css/style.css", "./assets/css/3d.css", "./assets/css/chatbot.css",
  "./assets/js/site.js", "./assets/js/chatbot.js", "./assets/js/three-scene.js",
  "./assets/img/logo.svg", "./assets/img/favicon.svg", "./assets/img/flag.svg", "./assets/img/hero.svg",
  "./assets/img/president.png", "./assets/img/icon-192.png", "./assets/img/icon-512.png"
];
self.addEventListener("install", event => { event.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch", event => {
  const req=event.request; if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return;
  if(req.mode==='navigate' || req.destination==='document') {
    event.respondWith(fetch(req).then(res=>{ const copy=res.clone(); caches.open(VERSION).then(c=>c.put(req,copy)); return res; }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
  } else {
    event.respondWith(caches.match(req).then(cached=>cached || fetch(req).then(res=>{const copy=res.clone(); caches.open(VERSION).then(c=>c.put(req,copy)); return res;}).catch(()=>cached)));
  }
});
