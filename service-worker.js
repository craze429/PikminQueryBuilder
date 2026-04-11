const CACHE_VERSION = '2.2';
const CURRENT_CACHE_NAME = `pikmin-cache-v${CACHE_VERSION}`;

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './favicon.ico',
  './icons/icon_x192.png',
  './icons/icon_x512.png',
  './icons/maskable_icon_x192.png',
  './icons/maskable_icon_x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CURRENT_CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CURRENT_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          return cachedResponse || fetch(event.request);
        })
      // If you have an offline.html page and want to show it on fetch errors,
      // you would add it to ASSETS_TO_CACHE and add a .catch() here like:
      // .catch(() => caches.match('./offline.html'))
    );
  }
});