// Custom Service Worker for handling Web Push Notifications (Background & Closed Browser)

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
    if (!event.data) return;

    try {
        const data = event.data.json();

        const title = data.title || 'POSYANDU BANJARSARI';
        const options = {
            body: data.body || 'Anda memiliki notifikasi baru.',
            icon: data.icon || '/icon-192x192.png',
            badge: data.badge || '/icon-192x192.png',
            vibrate: [100, 50, 100],
            data: data.data || {},
            actions: [
                {
                    action: 'open_app',
                    title: 'Buka Posyandu'
                }
            ]
        };

        event.waitUntil(self.registration.showNotification(title, options));
    } catch (err) {
        console.error('Error parsing push notification data:', err);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (const client of windowClients) {
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
