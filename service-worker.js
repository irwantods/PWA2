const CACHE_NAME = "PWAkedua-v1";
var urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/soccer-ball-128.ico",
    "/pages/home.html",
    "/pages/about.html",
    "/pages/standing.html",
    "/pages/team.html",
    "/css/materialize.min.css",
    "/js/materialize.min.js",
    "/js/script.js",
    "/js/api.js",
    "./img/soccer-ball-32.png",
    "./img/soccer-ball-64.png",
    "./img/soccer-ball-128.png",
    "./img/soccer-ball-144.png",
    "./img/soccer-ball-152.png",
    "./img/soccer-ball-192.png",
    "./img/soccer-ball-256.png",
    "./img/soccer-ball-384.png",
    "./img/soccer-ball-512.png"
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