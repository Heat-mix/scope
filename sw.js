const CACHE_VERSION = 'oscilloscope-v0.1.3-official';
const APP_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest?v=0.1.3-official',
  './apple-touch-icon-v3.png',
  './icon-192.png?v=0.1.3-official',
  './icon-512.png?v=0.1.3-official',
  './favicon.png?v=0.1.3-official',
  './app-screenshot.png?v=0.1.3-official'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('oscilloscope-') && key !== CACHE_VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) caches.open(CACHE_VERSION).then(cache => cache.put(event.request, response.clone()));
        return response;
      })
      .catch(() => caches.match(event.request).then(response => response || caches.match('./index.html')))
  );
});
