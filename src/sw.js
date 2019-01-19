var version = 'v1::';
var cacheName = 'static';

function updateStaticCache() {
  return caches.open(version + cacheName).then(function(cache) {
    return cache.addAll([
      '/',
      '/assets/fonts/Cabin.woff2',
      '/assets/fonts/Cabin-Bold.woff2',
      '/assets/images/global/icons/botdot-v2.svg',
      '/assets/images/global/banners/blue-ridge-mountains-1900.jpg',
      '/assets/images/global/icons/favicon-16x16.png',
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
