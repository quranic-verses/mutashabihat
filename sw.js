// The site moved to https://quranic-verses.github.io/quranic-tests/
// This replaces the old offline copy: it clears the old cache, sends open pages to the new address, then removes itself.
const NEW = 'https://quranic-verses.github.io/quranic-tests/';
const target = url => {
  const page = new URL(url).pathname.split('/').pop();
  return NEW + ({"farq.html":"farq.html","privacy.html":"privacy.html"}[page] || "");
};
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await self.registration.unregister();
    await Promise.all(cs.map(c => c.navigate(target(c.url)).catch(() => {})));
  })());
});
// Never serve anything from cache any more.
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') e.respondWith(Response.redirect(target(e.request.url), 302));
});
