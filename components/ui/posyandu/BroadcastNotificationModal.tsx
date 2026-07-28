'use client';

import React, { useState } from 'react';
import { ExaminationSchedule } from '@/interfaces/schedule';

interface BroadcastNotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItem: {
        schedule: ExaminationSchedule;
        examName: string;
    } | null;
    posyanduName: string;
    formatDateIndo: (dateStr: string) => string;
    onConfirm: (payload: {
        custom_message?: string;
        scheduled_push_at?: string;
        timingOption: 'instant' | 'custom';
        customPushTime: string;
    }) => void;
    isPending: boolean;
}

export default function BroadcastNotificationModal({
    isOpen,
    onClose,
    selectedItem,
    posyanduName,
    formatDateIndo,
    onConfirm,
    isPending,
}: BroadcastNotificationModalProps) {
    const [customBroadcastMessage, setCustomBroadcastMessage] = useState('');
    const [pushTimingOption, setPushTimingOption] = useState<'instant' | 'custom'>('instant');
    const [customPushTime, setCustomPushTime] = useState('');

    if (!isOpen || !selectedItem) return null;

    const formatPushTimestamp = (d: Date = new Date()) => {
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }) + ' WIB';
    };

    const handleSelectCustomPushTiming = () => {
        setPushTimingOption('custom');
        if (!customPushTime) {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 15);
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const hh = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            setCustomPushTime(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
        }
    };

    const handleConfirm = () => {
        if (pushTimingOption === 'custom' && !customPushTime) {
            alert('Silakan pilih tanggal dan jam push notifikasi terlebih dahulu.');
            return;
        }

        const scheduledPushAtIso = pushTimingOption === 'custom' && customPushTime
            ? new Date(customPushTime).toISOString()
            : undefined;

        onConfirm({
            custom_message: customBroadcastMessage.trim() || undefined,
            scheduled_push_at: scheduledPushAtIso,
            timingOption: pushTimingOption,
            customPushTime,
        });
    };

    return (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-[1010] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-slide-up">
                {/* Header */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h2 className="text-base font-bold text-slate-800">
                            Luncurkan Notifikasi
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Banner Info */}
                <div className="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100/80 text-xs text-indigo-900 font-medium leading-relaxed">
                    Notifikasi akan dikirimkan secara otomatis ke seluruh <strong>Orang Tua</strong> yang terdaftar di <strong>{posyanduName}</strong>.
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kegiatan & Waktu</label>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-700 flex flex-col gap-1">
                        <span className="text-sm font-bold text-indigo-600">{selectedItem.examName}</span>
                        <span>📅 {formatDateIndo(selectedItem.schedule.scheduled_date)}</span>
                        <span>⏰ {selectedItem.schedule.start_time || '08:00'} - {selectedItem.schedule.end_time || '11:00'} WIB</span>
                    </div>
                </div>

                {/* Timing Options */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Waktu Notifikasi (Kapan Di-Push)</label>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-700 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                                <span className="text-slate-800 font-bold">Waktu Peluncuran (Push)</span>
                            </div>
                            <span className="text-[10px] font-extrabold text-indigo-600 bg-white px-2.5 py-1 rounded-lg border border-indigo-100 shadow-xs">
                                {pushTimingOption === 'custom' && customPushTime
                                    ? formatPushTimestamp(new Date(customPushTime))
                                    : formatPushTimestamp(new Date())}
                            </span>
                        </div>
                        <div className="flex gap-2 pt-1 border-t border-slate-200/60">
                            <button
                                type="button"
                                onClick={() => setPushTimingOption('instant')}
                                className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                    pushTimingOption === 'instant'
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                ⚡ Langsung (Sekarang)
                            </button>
                            <button
                                type="button"
                                onClick={handleSelectCustomPushTiming}
                                className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                    pushTimingOption === 'custom'
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                ⏰ Waktu Kustom
                            </button>
                        </div>

                        {pushTimingOption === 'custom' && (
                            <div className="mt-1 flex flex-col gap-1">
                                <label className="text-[10px] font-bold text-slate-500">Pilih Tanggal & Jam Push Notifikasi:</label>
                                <input
                                    type="datetime-local"
                                    value={customPushTime}
                                    onChange={(e) => setCustomPushTime(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Custom Message */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pesan Khusus (Opsional)</label>
                    <textarea
                        value={customBroadcastMessage}
                        onChange={(e) => setCustomBroadcastMessage(e.target.value)}
                        rows={3}
                        placeholder="Contoh: Bawa buku KIA dan hadir tepat waktu ya bu..."
                        className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-medium"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5 pt-2 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="flex-[2] bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs py-3 rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                        {isPending ? 'Mengirim...' : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Kirim Notifikasi
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
