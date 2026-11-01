'use client';

import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
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
  resetKey?: number | string;
}

const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  function TurnstileWidget(
    { onVerify, onExpire, onError, theme = 'light', resetKey },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const isMountedRef = useRef(false);

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

    const renderWidget = useCallback(() => {
      if (!containerRef.current || !window.turnstile || !siteKey) return;
      // Cegah render ganda jika widget sudah ada
      if (widgetIdRef.current) return;

      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerify(token);
          },
          'expired-callback': () => {
            if (onExpire) onExpire();
          },
          'error-callback': (errorCode?: string) => {
            if (onExpire) onExpire();
            if (onError) onError(errorCode);
            // Auto reload widget jika ada error pada Cloudflare Turnstile
            setTimeout(() => {
              try {
                if (widgetIdRef.current && window.turnstile) {
                  window.turnstile.reset(widgetIdRef.current);
                }
              } catch {
                // ignore
              }
            }, 1500);
          },
          'timeout-callback': () => {
            if (onExpire) onExpire();
            setTimeout(() => {
              try {
                if (widgetIdRef.current && window.turnstile) {
                  window.turnstile.reset(widgetIdRef.current);
                }
              } catch {
                // ignore
              }
            }, 1000);
          },
          'refresh-expired': 'auto',
          'refresh-timeout': 'auto',
          theme,
          language: 'id',
        });
      } catch (err) {
        console.error('Turnstile render failed:', err);
      }
    }, [siteKey, onVerify, onExpire, onError, theme]);

    const reset = useCallback(() => {
      if (onExpire) {
        onExpire();
      }
      if (typeof window !== 'undefined' && window.turnstile) {
        try {
          if (widgetIdRef.current) {
            window.turnstile.reset(widgetIdRef.current);
          } else {
            window.turnstile.reset();
          }
        } catch {
          // Jika reset gagal, bersihkan dan render ulang
          try {
            if (widgetIdRef.current) {
              window.turnstile.remove(widgetIdRef.current);
              widgetIdRef.current = null;
            }
            renderWidget();
          } catch {
            // ignore
          }
        }
      }
    }, [onExpire, renderWidget]);

    useImperativeHandle(
      ref,
      () => ({
        reset,
      }),
      [reset]
    );

    // Auto-reset jika resetKey berubah setelah mount
    useEffect(() => {
      if (isMountedRef.current && resetKey !== undefined) {
        reset();
      }
    }, [resetKey, reset]);

    useEffect(() => {
      isMountedRef.current = true;

      if (window.turnstile) {
        renderWidget();
        return () => {
          if (window.turnstile && widgetIdRef.current) {
            try {
              window.turnstile.remove(widgetIdRef.current);
            } catch {
              // ignore
            }
            widgetIdRef.current = null;
          }
        };
      }

      // Interval fallback jika script sudah dimuat namun window.turnstile belum siap
      const checkTurnstileInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstileInterval);
          renderWidget();
        }
      }, 100);

      const timeout = setTimeout(() => {
        clearInterval(checkTurnstileInterval);
      }, 5000);

      return () => {
        clearInterval(checkTurnstileInterval);
        clearTimeout(timeout);
        if (window.turnstile && widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }
      };
    }, [renderWidget]);

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

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderWidget}
        />
        <div className="flex justify-center">
          <div ref={containerRef} />
        </div>
      </>
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;
