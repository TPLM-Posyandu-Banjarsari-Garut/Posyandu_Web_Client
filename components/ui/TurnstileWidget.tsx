'use client';

import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
} from 'react';
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
          'error-callback'?: (errorCode?: string) => void;
          'timeout-callback'?: () => void;
          'refresh-expired'?: 'auto' | 'manual' | 'never';
          'refresh-timeout'?: 'auto' | 'manual' | 'never';
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          language?: string;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export interface TurnstileWidgetRef {
  reset: () => void;
}

export interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (errorCode?: string) => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  resetKey?: number | string;
  className?: string;
}

const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  function TurnstileWidget(
    {
      onVerify,
      onExpire,
      onError,
      theme = 'light',
      size = 'normal',
      resetKey,
      className,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const isRenderingRef = useRef(false);
    const [scriptLoadError, setScriptLoadError] = useState(false);

    // Keep callback references stable across renders to prevent unnecessary re-mounts
    const onVerifyRef = useRef(onVerify);
    const onExpireRef = useRef(onExpire);
    const onErrorRef = useRef(onError);

    useEffect(() => {
      onVerifyRef.current = onVerify;
      onExpireRef.current = onExpire;
      onErrorRef.current = onError;
    });

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

    // Bersihkan widget Turnstile secara aman
    const cleanupWidget = useCallback(() => {
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
      isRenderingRef.current = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    }, []);

    // Render widget Turnstile langsung (jangan pakai turnstile.ready karena Cloudflare melempar error 3857 jika script async)
    const renderWidget = useCallback(() => {
      if (!containerRef.current || !siteKey || typeof window === 'undefined') return;
      if (!window.turnstile || typeof window.turnstile.render !== 'function') return;
      if (widgetIdRef.current || isRenderingRef.current) return;

      isRenderingRef.current = true;

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerifyRef.current?.(token);
          },
          'expired-callback': () => {
            onExpireRef.current?.();
          },
          'error-callback': (errorCode?: string) => {
            console.error('Cloudflare Turnstile error:', errorCode);
            onExpireRef.current?.();
            onErrorRef.current?.(errorCode);
          },
          'timeout-callback': () => {
            onExpireRef.current?.();
          },
          'refresh-expired': 'auto',
          'refresh-timeout': 'auto',
          theme,
          size,
          language: 'id',
        });

        if (id !== undefined && id !== null) {
          widgetIdRef.current = String(id);
        }
      } catch (err) {
        console.error('Turnstile render failed:', err);
      } finally {
        isRenderingRef.current = false;
      }
    }, [siteKey, theme, size]);

    // Reset widget (hanya reset status widget yang ada tanpa unmount/re-render DOM jika memungkinkan)
    const reset = useCallback(() => {
      onExpireRef.current?.();
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
        } catch {
          // Jika reset gagal, bersihkan dan render ulang
          cleanupWidget();
          renderWidget();
        }
      }
    }, [cleanupWidget, renderWidget]);

    useImperativeHandle(
      ref,
      () => ({
        reset,
      }),
      [reset]
    );

    // Track resetKey changes only (skip pada initial mount agar tidak memicu reset seketika)
    const isInitialMount = useRef(true);
    const prevResetKeyRef = useRef(resetKey);

    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        prevResetKeyRef.current = resetKey;
        return;
      }

      if (resetKey !== undefined && resetKey !== prevResetKeyRef.current) {
        prevResetKeyRef.current = resetKey;
        reset();
      }
    }, [resetKey, reset]);

    // Lifecycle: mount & unmount
    useEffect(() => {
      let isCancelled = false;

      const tryInit = () => {
        if (isCancelled) return;
        if (window.turnstile && typeof window.turnstile.render === 'function') {
          renderWidget();
        }
      };

      if (window.turnstile && typeof window.turnstile.render === 'function') {
        tryInit();
      } else {
        const checkInterval = setInterval(() => {
          if (window.turnstile && typeof window.turnstile.render === 'function') {
            clearInterval(checkInterval);
            tryInit();
          }
        }, 50);

        const timeout = setTimeout(() => {
          clearInterval(checkInterval);
        }, 5000);

        return () => {
          isCancelled = true;
          clearInterval(checkInterval);
          clearTimeout(timeout);
          cleanupWidget();
        };
      }

      return () => {
        isCancelled = true;
        cleanupWidget();
      };
    }, [renderWidget, cleanupWidget]);

    if (!siteKey) {
      return (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-700 font-semibold">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          CAPTCHA belum dikonfigurasi (NEXT_PUBLIC_TURNSTILE_SITE_KEY tidak ditemukan)
        </div>
      );
    }

    if (scriptLoadError) {
      return (
        <div className="flex flex-col items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 text-center">
          <span>Gagal memuat CAPTCHA. Silakan periksa koneksi internet atau matikan ad-blocker Anda.</span>
          <button
            type="button"
            onClick={() => {
              setScriptLoadError(false);
              cleanupWidget();
              renderWidget();
            }}
            className="text-xs font-bold underline hover:text-red-700"
          >
            Coba lagi
          </button>
        </div>
      );
    }

    return (
      <>
        <Script
          id="cloudflare-turnstile-script"
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderWidget}
          onError={() => setScriptLoadError(true)}
        />
        <div className={`flex justify-center items-center min-h-[65px] ${className ?? ''}`}>
          <div ref={containerRef} />
        </div>
      </>
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;
