var version = 'v2::';
var cacheName = 'static';

function updateStaticCache() {
  return caches.open(version + cacheName).then(function(cache) {
    return cache.addAll([
      '/assets/fonts/cooperhewitt-light-webfont.woff2',
      '/assets/fonts/cooperhewitt-bold-webfont.woff2'
    ]);
  });
}
self.addEventListener('install', function(event) {
  event.waitUntil(updateStaticCache());
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
