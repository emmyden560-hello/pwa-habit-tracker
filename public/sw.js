const CACHE_NAME = 'habit-tracker-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/login',
    '/signup',
    '/dashboard',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/favicon-196.png',
    '/icons/apple-icon-180.png'
];

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

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    if (event.request.mode === 'navigate') {
        self.addEventListener('fetch', (event) => {
            event.respondWith(
                fetch(event.request)
                    .then((networkResponse) => {
                        // If we get a good response, cache it for later
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Network failed, try the cache
                        return caches.match(event.request).then((cachedResponse) => {
                            if (cachedResponse) return cachedResponse;
                            if (event.request.mode === 'navigate') {
                                return caches.match('/');
                            }
                        });
                    })
            );
        });
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
