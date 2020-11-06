const CACHE_NAME = "PWAkedua-v0";
var urlsToCache = [
    "/",
    "/manifest.json",
    "/nav.html",
    "/index.html",
    //page navigasi
    "/pages/home.html",
    "/pages/saved.html",
    "/pages/standing.html",
    "/pages/team.html",
    // css
    "/asset/css/materialize.min.css",
    "/asset/css/style.css",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "/asset/css/PatrickHand-Regular.ttf",
    // aset image home
    "./asset/img/11.webp",
    "./asset/img/3.webp",
    "./asset/img/save.png",
    "./asset/img/pwa.png",
    "./asset/img/update.png",
    "./asset/img/6.webp",
    //file JS
    "/script/materialize/materialize.min.js",
    "/script/nav.js",
    "/script/sw-register.js",
    "/script/api/api.js",
    //icon
    "./soccer-ball-128.ico",
    "./asset/img/soccer-ball-512.png",
    "./asset/img/soccer-ball-384.png",
    "./asset/img/soccer-ball-256.png",
    "./asset/img/soccer-ball-192.png",
    "./asset/img/soccer-ball-152.png",
    "./asset/img/soccer-ball-144.png",
    "./asset/img/soccer-ball-128.png",
    "./asset/img/soccer-ball-64.png",
    "./asset/img/soccer-ball-32.png"
];

self.addEventListener("install", function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});
self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + "dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
self.addEventListener("fetch", function(event) {
    const base_url = "https://api.football-data.org/v2/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { 'ignoreSearch': true }).then(function(response) {
                return response || fetch(event.request);
            })
        )
    }
});