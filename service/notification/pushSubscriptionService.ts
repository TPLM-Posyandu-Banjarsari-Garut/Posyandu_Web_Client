import { api } from '@/service/auth/authService';

export interface PushSubscriptionKeys {
    p256dh: string;
    auth: string;
}

export interface PushSubscriptionPayload {
    endpoint: string;
    keys: PushSubscriptionKeys;
}

export async function fetchVapidPublicKey(): Promise<string> {
    const { data } = await api.get<{ status: string; data: { publicKey: string } }>(
        '/api/push-subscriptions/public-key'
    );
    return data.data.publicKey;
}

export async function savePushSubscription(payload: PushSubscriptionPayload): Promise<boolean> {
    try {
        await api.post('/api/push-subscriptions/subscribe', payload);
        return true;
    } catch (err: unknown) {
        // Handle 401 (user not logged in yet) gracefully
        if ((err as { response?: { status?: number } })?.response?.status === 401) {
            console.log('[PushSubscription] User not logged in yet, push subscription token will sync upon login.');
            return false;
        }
        console.warn('[PushSubscription] Failed to save subscription to server:', err);
        return false;
    }
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
    await api.delete('/api/push-subscriptions/unsubscribe', { data: { endpoint } });
}
