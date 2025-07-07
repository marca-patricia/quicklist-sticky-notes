
const CACHE_NAME = 'quicklist-v2';
const STATIC_CACHE = 'quicklist-static-v2';
const DYNAMIC_CACHE = 'quicklist-dynamic-v2';

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico',
  '/manifest.json',
  '/assets/quicklist-icon.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Strategy: Cache First for static assets, Network First for API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Cache First Strategy for static assets
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      request.url.includes('/static/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      }).catch(() => {
        // Return offline fallback for images
        if (request.destination === 'image') {
          return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Offline</text></svg>', {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        }
      })
    );
    return;
  }

  // Network First Strategy for HTML pages
  event.respondWith(
    fetch(request).then((response) => {
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        // Return offline page
        return caches.match('/').then((cachedResponse) => {
          return cachedResponse || new Response('Offline - Please check your connection', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      });
    })
  );
});

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'quicklist-sync') {
    event.waitUntil(syncQuicklistData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do QuickList',
    icon: '/assets/quicklist-icon.png',
    badge: '/assets/quicklist-icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Detalhes',
        icon: '/assets/quicklist-icon.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/assets/quicklist-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('QuickList', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received.');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync QuickList data when back online
async function syncQuicklistData() {
  try {
    console.log('Syncing QuickList data...');
    
    // In a real app, this would sync with your backend
    // For now, we'll just log the sync attempt
    const pendingActions = JSON.parse(localStorage.getItem('quicklist-pending-actions') || '[]');
    
    if (pendingActions.length > 0) {
      console.log(`Syncing ${pendingActions.length} pending actions`);
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear pending actions after successful sync
      localStorage.removeItem('quicklist-pending-actions');
      console.log('Sync completed successfully');
    }
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
}

// Periodic background sync (when supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'quicklist-periodic-sync') {
    event.waitUntil(syncQuicklistData());
  }
});
