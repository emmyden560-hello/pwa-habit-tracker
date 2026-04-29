/* 
  PWA Service Worker - Cache-First Strategy
  Ensures the Habit Tracker remains accessible offline.
*/

const CACHE_NAME = 'habit-tracker-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/login',
    '/signup',
    '/dashboard',
    '/manifest.json',
    // Static app assets and generated icons
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/favicon-196.png',
    '/icons/apple-icon-180.png'
];

// 1. Install Event: Cache the App Shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 2. Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. Fetch Event: Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Always try to serve navigation requests with cached app shell as a fallback
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    return networkResponse;
                })
                .catch(() => caches.match('/'))
        );
        return;
    }

    // Runtime cache for Next.js static assets (/_next/). Use cache-first.
    if (requestUrl.pathname.startsWith('/_next/') || requestUrl.pathname.startsWith('/static/')) {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => {
                    // If asset not cached and network fails, return cached app shell
                    return caches.match('/');
                });
            })
        );
        return;
    }

    // Default behavior: try cache first, then network
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
