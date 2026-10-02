const CACHE_PREFIX = 'typeflow-shell-';
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-192-maskable.png',
  '/icons/icon-512-maskable.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            await caches.open(CACHE_NAME)
              .then(cache => cache.put('/index.html', response.clone()));
          }
          return response;
        } catch {
          const cachedPage = await caches.match('/index.html');
          if (cachedPage) return cachedPage;
          return new Response(
            '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TypeFlow offline</title><body style="font:16px system-ui;background:#030712;color:#f9fafb;padding:2rem"><h1>TypeFlow is offline</h1><p>The app shell is not cached yet. Reconnect once and reopen TypeFlow to prepare offline access.</p></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
      })()
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});
