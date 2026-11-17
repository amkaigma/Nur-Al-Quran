// Nur Al-Quran Service Worker for PWA installability & Adhan Prayer Notifications

const CACHE_NAME = 'nur-alquran-shell-v1';
const CORE_ASSETS = [
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Listen for Adhan notification dispatch requests from the client
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'SHOW_ADHAN_NOTIFICATION') return;

  const title = data.title || 'Prayer Time Arrived';
  const options = {
    body: data.body || 'Hayya alas-Salah — Tap to open & play Adhan',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: data.tag || 'nur-adhan-alert',
    renotify: true,
    requireInteraction: true,
    data: {
      prayerKey: data.prayerKey || 'fajr',
      voiceId: data.voiceId || '',
      triggerAudio: data.triggerAudio !== false
    },
    actions: [
      { action: 'play_adhan', title: 'Play Adhan' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const payload = event.notification.data || {};
  const targetUrl = `/?adhanPrayer=${encodeURIComponent(payload.prayerKey || '')}&play=1`;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({
            type: 'TRIGGER_ADHAN_FROM_NOTIFICATION',
            prayerKey: payload.prayerKey,
            voiceId: payload.voiceId
          });
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
