// The site moved to https://quranic-verses.github.io/aynawarad/
// This removes the old offline copy: it clears the old cache, sends open pages to the new address, then removes itself.
const NEW = 'https://quranic-verses.github.io/aynawarad/';
const PAGES = ["about.html", "akhir.html", "asmaa.html", "awwal.html", "farq.html", "fawatih.html", "guide.html", "lam.html", "makki.html", "privacy.html", "qabl.html", "rattib.html", "support.html", "tartib.html", "teacher.html", "wasat.html"];
const target = url => NEW + (PAGES.includes(new URL(url).pathname.split('/').pop()) ? new URL(url).pathname.split('/').pop() : '');
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('mutashabih-')).map(k => caches.delete(k)));
    await self.clients.claim();
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await self.registration.unregister();
    await Promise.all(cs.map(c => c.navigate(target(c.url)).catch(() => {})));
  })());
});
