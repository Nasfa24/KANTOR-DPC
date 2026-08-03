const CACHE_NAME = 'superapp-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './dashboard-staff.html',
  './dashboard-mitra.html',
  './dashboard-admin.html',
  './style.css',
  './app.js'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Bypass API Google dari Cache agar data selalu Real-Time
self.addEventListener('fetch', event => {
  if (event.request.url.includes('script.google.com')) {
    return; // Biarkan API tembus langsung
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});