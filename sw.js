// 오프라인에서도 열리도록: 먼저 네트워크, 안 되면 저장해둔 파일
var CACHE = 'nakseo-v3';
var SHELL = ['./', 'index.html', 'style.css', 'app.js', 'manifest.webmanifest',
  'img/bunny-face.png', 'img/bunny-coin.png', 'img/bunny-lying.png', 'img/bunny-paper.png',
  'icons/icon-192.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res && res.ok && (e.request.url.indexOf(self.location.origin) === 0 || res.type === 'cors')) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () { return caches.match(e.request); })
  );
});
