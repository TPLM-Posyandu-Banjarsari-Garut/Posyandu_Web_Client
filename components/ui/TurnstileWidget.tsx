'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: string | HTMLElement,
                options: {
                    sitekey: string;
                    callback: (token: string) => void;
                    'expired-callback'?: () => void;
                    'error-callback'?: () => void;
                    theme?: 'light' | 'dark' | 'auto';
                    size?: 'normal' | 'compact';
                    language?: string;
                }
            ) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
        };
    }
}

interface TurnstileWidgetProps {
    onVerify: (token: string) => void;
    onExpire?: () => void;
    theme?: 'light' | 'dark' | 'auto';
}

export default function TurnstileWidget({ onVerify, onExpire, theme = 'light' }: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

    const renderWidget = () => {
        if (!containerRef.current || !window.turnstile || !siteKey) return;
        // Cegah render ganda
        if (widgetIdRef.current) return;

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
                onVerify(token);
            },
            'expired-callback': () => {
                widgetIdRef.current = null;
                if (onExpire) onExpire();
            },
            'error-callback': () => {
                widgetIdRef.current = null;
            },
            theme,
            language: 'id',
        });
    };

    useEffect(() => {
        // Jika script sudah ada (misalnya navigasi ulang), langsung render
        if (window.turnstile) {
            renderWidget();
        }
        return () => {
            if (window.turnstile && widgetIdRef.current) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch {
                    // widget mungkin sudah dihapus
                }
                widgetIdRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!siteKey) {
        return (
            <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-700 font-semibold">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                CAPTCHA belum dikonfigurasi (NEXT_PUBLIC_TURNSTILE_SITE_KEY tidak ditemukan)
            </div>
        );
    }

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="lazyOnload"
                onLoad={renderWidget}
            />
            <div className="flex justify-center">
                <div ref={containerRef} />
            </div>
        </>
    );
}
