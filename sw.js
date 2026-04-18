const CACHE_NAME = 'disto-survey-v4.4';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './modules/bluetooth.js',
  './modules/calculator.js',
  './modules/layout.js',
  './modules/report.js',
  './modules/structure.js',
  './modules/truss_patterns.js',
  './modules/truss_svgs.js',
  './modules/telegram.js',
  './modules/voice.js',
  './vendor/jspdf.umd.min.js',
  './truss_blueprints.png'
];

// Install: Cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Strategy - Network First for HTML, Cache First for assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 1. Bypass cache for non-GET and PHP proxy
  if (event.request.method !== 'GET' || url.pathname.endsWith('.php')) {
    return; 
  }

  // 2. Network-First for index.html or root to ensure freshness
  if (url.pathname === '/' || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Cache-First for static assets
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
