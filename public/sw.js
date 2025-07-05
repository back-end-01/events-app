// Pages available offline:
// '/', '/events', '/success', '/auth/signin', '/auth/error', '/volunteer/dashboard', '/volunteer/apply', '/volunteer/qr-generator', '/volunteer/scanning'
// Plus icons and manifest

const CACHE_NAME = 'janmashtami-v2';
const urlsToCache = [
  '/',
  '/events',
  '/success',
  '/auth/signin',
  '/auth/error',
  '/volunteer/dashboard',
  '/volunteer/apply',
  '/volunteer/qr-generator',
  '/volunteer/scanning',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json',
  // Add more static assets if needed
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 