// Service Worker per Notula™ PWA (Modalità Cloud-Only Network-First)
const CACHE_NAME = 'notula-cloud-only-v3.0';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass through all requests directly to the network in Cloud-Only mode
  if (
    event.request.method !== 'GET' ||
    event.request.url.startsWith('chrome-extension') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('google.com') ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(fetch(event.request));
});
