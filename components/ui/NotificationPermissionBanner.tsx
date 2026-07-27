'use client';

import React, { useState, useEffect } from 'react';
import { executeWebPushSubscription } from '@/hooks/query/notification/usePushSubscription';

export default function NotificationPermissionBanner() {
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('granted');
    const [isDismissed, setIsDismissed] = useState(true);
    const [isRequesting, setIsRequesting] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!('Notification' in window)) {
            setPermissionStatus('unsupported');
            return;
        }

        const currentPermission = Notification.permission;
        setPermissionStatus(currentPermission);

        // Check if user dismissed the banner recently (within 3 days)
        const dismissedAt = localStorage.getItem('dismissed_notif_banner_time');
        if (dismissedAt) {
            const daysPassed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
            if (daysPassed < 3) {
                setIsDismissed(true);
                return;
            }
        }

        if (currentPermission === 'default') {
            setIsDismissed(false);
        } else {
            setIsDismissed(true);
        }
    }, []);

    const handleEnableNotification = async () => {
        if (!('Notification' in window)) return;

        setIsRequesting(true);
        try {
            const permission = await Notification.requestPermission();
            setPermissionStatus(permission);

            if (permission === 'granted') {
                setIsDismissed(true);
                localStorage.removeItem('dismissed_notif_banner_time');

                // Trigger Web Push Registration & save token to DB
                await executeWebPushSubscription().catch(err => {
                    console.log('[PushSubscription] Deferred subscription sync:', err);
                });
            } else if (permission === 'denied') {
                setShowHelp(true);
            }
        } catch (err) {
            console.error('Error requesting notification permission:', err);
        } finally {
            setIsRequesting(false);
        }
    };

    const handleDismiss = () => {
        setIsDismissed(true);
        localStorage.setItem('dismissed_notif_banner_time', Date.now().toString());
    };

    if (isDismissed || permissionStatus === 'granted' || permissionStatus === 'unsupported') {
        return null;
    }

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[9999] animate-fade-in font-sans">
            <div className="bg-white/95 backdrop-blur-md rounded-[2rem] p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 flex flex-col gap-3.5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-wide">
                                Aktifkan Notifikasi Posyandu 🔔
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                                Dapatkan pengingat jadwal posyandu & imunisasi secara otomatis di HP Anda.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
                        title="Tutup"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {permissionStatus === 'denied' || showHelp ? (
                    <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-2xl text-[11px] text-amber-800 leading-relaxed font-semibold">
                        ⚠️ Notifikasi terdeteksi diblokir oleh browser. Klik ikon <strong>gembok 🔒</strong> di samping URL browser Anda untuk mengubah izin menjadi <strong>Izinkan (Allow)</strong>.
                    </div>
                ) : (
                    <div className="flex items-center gap-2 pt-1">
                        <button
                            onClick={handleEnableNotification}
                            disabled={isRequesting}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-[0_4px_14px_rgba(79,70,229,0.25)] active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                            {isRequesting ? 'Meminta Izin...' : 'Aktifkan Notifikasi'}
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-3 px-4 rounded-2xl transition-all cursor-pointer shrink-0"
                        >
                            Nanti Saja
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
