const CACHE = 'cinema-library-shell-v3';
const SHELL = [
  './', './index.html', './catalog.html', './genres.html', './stream/index.html',
  './404.html', './contribute.html', './manifest.webmanifest',
  './assets/site-shell.css', './assets/site-shell.js', './assets/icons/cinema-library-favicon.png'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(SHELL.map(url => cache.add(url)))
    )
  );
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
      }
      return response;
    } catch {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return (await caches.match('./404.html')) || new Response('Offline', { status: 503 });
      }
      return new Response('', { status: 503, statusText: 'Offline' });
    }
  })());
});

