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
    '/globals.css',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
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
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached asset or fetch from network
            return response || fetch(event.request).catch(() => {
                // Fallback for navigation requests when offline
                if (event.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });
        })
    );
});
