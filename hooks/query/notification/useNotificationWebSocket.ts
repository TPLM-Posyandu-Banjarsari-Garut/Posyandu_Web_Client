'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useCurrentUser } from '@/hooks/query/auth/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';

interface WsNotificationPayload {
    id: string;
    title: string;
    body: string;
    type: string;
    status: string;
    data: Record<string, unknown> | null;
    created_at: string;
}

interface WsNotificationMessage {
    type: 'notification';
    payload: WsNotificationPayload;
}

/**
 * Derives the WebSocket URL from the current page location.
 * - In development: ws://localhost:3000/ws  (API server port)
 * - In production:  wss://api.posyandubanjarsari.my.id/ws
 */
function getWebSocketUrl(): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
        const parsed = new URL(apiUrl);
        const wsProtocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${wsProtocol}//${parsed.host}/ws`;
    }
    // Fallback: derive from window.location
    if (typeof window !== 'undefined') {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${wsProtocol}//${window.location.host}/ws`;
    }
    return 'ws://localhost:3000/ws';
}

/**
 * Hook that establishes a WebSocket connection to the server,
 * authenticates with the current user's ID, listens for incoming
 * notifications, and displays them as browser push notifications.
 *
 * Features:
 * - Automatic reconnection with exponential backoff
 * - Heartbeat pong responses to keep connection alive
 * - Invalidates notification queries on new messages
 * - Shows browser Notification via Service Worker when available
 */
export function useNotificationWebSocket(): void {
    const { data: currentUser } = useCurrentUser();
    const queryClient = useQueryClient();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const MAX_RECONNECT_ATTEMPTS = 10;

    const showBrowserNotification = useCallback(
        async (payload: WsNotificationPayload): Promise<void> => {
            if (typeof window === 'undefined') return;
            if (!('Notification' in window)) return;
            if (Notification.permission !== 'granted') return;

            const notificationOptions: NotificationOptions = {
                body: payload.body,
                icon: '/icon-192x192.png',
                badge: '/icon-192x192.png',
                tag: payload.id,
                data: {
                    url: '/',
                    notificationId: payload.id,
                },
            };

            try {
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.ready;
                    await registration.showNotification(payload.title, notificationOptions);
                } else {
                    new Notification(payload.title, notificationOptions);
                }
            } catch (err) {
                console.warn('Failed to show browser notification:', err);
                // Fallback to basic Notification API
                try {
                    new Notification(payload.title, notificationOptions);
                } catch {
                    // Silently ignore if all notification methods fail
                }
            }
        },
        []
    );

    useEffect(() => {
        if (!currentUser?.id) return;

        const userId = currentUser.id;

        function connect(): void {
            // Prevent duplicate connections
            if (wsRef.current?.readyState === WebSocket.OPEN ||
                wsRef.current?.readyState === WebSocket.CONNECTING) {
                return;
            }

            const wsUrl = getWebSocketUrl();
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                reconnectAttemptsRef.current = 0;

                // Authenticate with server
                ws.send(JSON.stringify({ type: 'auth', user_id: userId }));
            };

            ws.onmessage = (event: MessageEvent) => {
                try {
                    const message = JSON.parse(
                        typeof event.data === 'string' ? event.data : ''
                    ) as WsNotificationMessage;

                    if (message.type === 'notification' && message.payload) {
                        // Show browser notification
                        showBrowserNotification(message.payload);

                        // Invalidate notification-related queries so UI updates
                        queryClient.invalidateQueries({
                            queryKey: ['notifications'],
                        });
                        queryClient.invalidateQueries({
                            queryKey: ['unread-notifications-count'],
                        });
                    }
                } catch {
                    // Ignore non-JSON messages (e.g. pong frames)
                }
            };

            ws.onclose = (event: CloseEvent) => {
                wsRef.current = null;

                // Don't reconnect if closed intentionally (code 1000)
                if (event.code === 1000) return;

                // Exponential backoff reconnect
                if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
                    const delay = Math.min(
                        1000 * Math.pow(2, reconnectAttemptsRef.current),
                        30000
                    );
                    reconnectAttemptsRef.current += 1;
                    reconnectTimeoutRef.current = setTimeout(connect, delay);
                }
            };

            ws.onerror = () => {
                // onclose will fire after onerror, handling reconnection
                ws.close();
            };
        }

        connect();

        return () => {
            // Cleanup on unmount or user change
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (wsRef.current) {
                wsRef.current.close(1000, 'Component unmounted');
                wsRef.current = null;
            }
        };
    }, [currentUser?.id, showBrowserNotification, queryClient]);
}
