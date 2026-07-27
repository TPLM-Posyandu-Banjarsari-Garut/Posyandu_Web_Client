'use client';

import { useEffect, useCallback } from 'react';
import { useCurrentUser } from '@/hooks/query/auth/useCurrentUser';
import { fetchVapidPublicKey, savePushSubscription } from '@/service/notification/pushSubscriptionService';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function executeWebPushSubscription(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    if (Notification.permission !== 'granted') return false;

    try {
        // Register push Service Worker
        const registration = await navigator.serviceWorker.register('/sw-push.js');
        await navigator.serviceWorker.ready;

        // Fetch VAPID Public Key from backend
        const vapidPublicKey = await fetchVapidPublicKey();
        if (!vapidPublicKey) {
            console.warn('[PushSubscription] VAPID public key empty');
            return false;
        }

        const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

        // Subscribe to PushManager
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            try {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedKey as unknown as BufferSource,
                });
            } catch (subErr: unknown) {
                const subError = subErr as Error;
                if (subError?.name === 'AbortError' || subError?.message?.includes('push service error')) {
                    console.warn('[PushSubscription] Browser Push Service temporarily unavailable or blocked by browser/network:', subError?.message);
                    const oldSub = await registration.pushManager.getSubscription().catch(() => null);
                    if (oldSub) await oldSub.unsubscribe().catch(() => null);
                    return false;
                }
                throw subErr;
            }
        }

        const subJson = subscription.toJSON();
        if (subJson.endpoint && subJson.keys?.p256dh && subJson.keys?.auth) {
            await savePushSubscription({
                endpoint: subJson.endpoint,
                keys: {
                    p256dh: subJson.keys.p256dh,
                    auth: subJson.keys.auth,
                },
            });
            console.log('[PushSubscription] Push subscription saved to DB successfully!');
            return true;
        }
    } catch (err: unknown) {
        const errorObj = err as Error;
        console.warn('[PushSubscription] Web Push registration skipped:', errorObj?.message || err);
    }
    return false;
}

export function usePushSubscription(): void {
    const { data: currentUser } = useCurrentUser();

    const registerPush = useCallback(async () => {
        await executeWebPushSubscription();
    }, []);

    useEffect(() => {
        if (currentUser?.id) {
            registerPush();
        }

        // Periodically check if permission was granted or if user returns to page
        const handleFocus = () => {
            if (Notification.permission === 'granted' && currentUser?.id) {
                registerPush();
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [currentUser?.id, registerPush]);
}
