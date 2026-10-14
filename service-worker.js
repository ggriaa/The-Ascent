const CACHE_NAME = 'kaizen-v2';
const APP_SHELL = ['./', './index.html', './manifest.json', './kaizen-workout-enhancements.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

async function addKaizenWorkoutEnhancements(response) {
  if (!response || !response.ok) return response;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;
  const html = await response.text();
  if (html.includes('kaizen-workout-enhancements.js')) return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
  const injected = html.replace('</body>', '<script src="./kaizen-workout-enhancements.js?v=2"></script></body>');
  return new Response(injected, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      return await addKaizenWorkoutEnhancements(response);
    } catch (_) {
      const cached = await caches.match(event.request);
      return await addKaizenWorkoutEnhancements(cached);
    }
  })());
});
