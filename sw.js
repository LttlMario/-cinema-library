const CACHE = 'cinema-library-shell-v4';
const SHELL = [
  './', './index.html', './catalog.html', './genres.html', './stream/index.html',
  './404.html', './contribute.html', './watch-together.html', './about.html', './contact.html', './terms.html', './privacy.html', './sitemap.html', './manifest.webmanifest',
  './assets/site-shell.css', './assets/site-shell.js', './assets/icons/cinema-library-favicon.png'
];
const CACHEABLE = /\.(?:html?|css|js|webmanifest|png|jpe?g|svg|ico|woff2?)$/i;
function cacheKeyFor(request) {
  const url = new URL(request.url);
  return new Request(url.origin + url.pathname, { method: 'GET' });
}
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
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  const cacheKey = cacheKeyFor(request);
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && (request.mode === 'navigate' || CACHEABLE.test(url.pathname))) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(cacheKey, copy)).catch(() => {});
      }
      return response;
    } catch {
      const cached = await caches.match(request) || await caches.match(cacheKey);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return (await caches.match('./404.html')) || new Response('Offline', { status: 503 });
      }
      return new Response('', { status: 503, statusText: 'Offline' });
    }
  })());
});
