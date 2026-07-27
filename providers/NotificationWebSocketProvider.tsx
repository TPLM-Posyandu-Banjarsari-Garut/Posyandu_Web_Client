'use client';

import { useNotificationWebSocket } from '@/hooks/query/notification/useNotificationWebSocket';
import { usePushSubscription } from '@/hooks/query/notification/usePushSubscription';

/**
 * Provider component that activates the WebSocket & Web Push notification listeners.
 * Place this inside a layout that is wrapped with QueryProvider.
 * It renders nothing visually — it only establishes the WS connection and Web Push subscription
 * when a user is authenticated.
 */
export default function NotificationWebSocketProvider() {
    useNotificationWebSocket();
    usePushSubscription();
    return null;
}
