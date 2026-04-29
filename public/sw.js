const CACHE_NAME = 'habit-tracker-v3';
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
            // Cache items individually so that one failure doesn't block the whole SW installation
            return Promise.all(
                ASSETS_TO_CACHE.map((url) => {
                    return cache.add(url).catch((err) => {
                        console.warn('Failed to cache:', url, err);
                    });
                })
            );
        })
    );
    self.skipWaiting();
});

// Activate Event: Cleanup old caches
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
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only intercept GET requests
    if (event.request.method !== 'GET') return;

    const requestUrl = new URL(event.request.url);

    // Handle HTML Navigation requests
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
                        return cachedResponse || caches.match('/', { ignoreSearch: true });
                    });
                })
        );
        return;
    }

    // Static assets (Next.js /_next/, icons, etc.) - Cache first, then network
    if (
        requestUrl.pathname.startsWith('/_next/') || 
        requestUrl.pathname.startsWith('/static/') ||
        requestUrl.pathname.startsWith('/icons/')
    ) {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then((cached) => {
                if (cached) return cached;
                return fetch(event.request).then((networkResponse) => {
                    if (networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Ignore offline failure for static assets, no fallback
                    return new Response('', { status: 503, statusText: 'Service Unavailable' });
                });
            })
        );
        return;
    }

    // Default behavior for other requests (API, images, etc): Network first, then cache
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request, { ignoreSearch: true });
            })
    );
});
