const CACHE_NAME = 'superapp-v2';
const urlsToCache = ['./', './index.html', './dashboard-staff.html', './dashboard-mitra.html', './dashboard-admin.html', './style.css', './app.js'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => {
    if (key !== CACHE_NAME) return caches.delete(key);
  }))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // MUTLAK: Jangan pernah Cache request POST atau API Google untuk mencegah "Failed to Fetch"
  if (event.request.method !== 'GET' || event.request.url.includes('script.google') || event.request.url.includes('googleusercontent')) {
    return; 
  }
  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});
