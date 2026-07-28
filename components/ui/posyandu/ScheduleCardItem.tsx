'use client';

import React from 'react';
import { ExaminationSchedule } from '@/interfaces/schedule';

interface ScheduleCardItemProps {
    item: ExaminationSchedule;
    examName: string;
    posyanduName: string;
    formatDateIndo: (dateStr: string) => string;
    onOpenBroadcast: (item: ExaminationSchedule, examName: string) => void;
    onOpenEdit: (item: ExaminationSchedule) => void;
    onDelete: (id: string, examName: string) => void;
}

export default function ScheduleCardItem({
    item,
    examName,
    posyanduName,
    formatDateIndo,
    onOpenBroadcast,
    onOpenEdit,
    onDelete,
}: ScheduleCardItemProps) {
    return (
        <div
            className="bg-white rounded-[2rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300 animate-fade-in"
        >
            {/* Header / Posyandu Name */}
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 leading-tight">
                            {examName}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            {posyanduName}
                        </p>
                    </div>
                </div>
                <span className="shrink-0 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-100/60">
                    Terjadwal
                </span>
            </div>

            {/* Schedule Details */}
            <div className="flex flex-col gap-2.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <div className="flex gap-2.5 items-center text-xs text-slate-650 font-bold">
                    <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDateIndo(item.scheduled_date)}</span>
                </div>
                <div className="flex gap-2.5 items-center text-xs text-slate-650 font-bold">
                    <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item.start_time || '08:00'} - {item.end_time || '11:00'} WIB</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 border-t border-slate-50 pt-3.5">
                {/* Luncurkan Notifikasi Button */}
                <button
                    onClick={() => onOpenBroadcast(item, examName)}
                    className="w-full bg-gradient-to-tr from-indigo-500 to-blue-600 hover:opacity-95 text-[11px] font-bold px-3 py-3 rounded-xl active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(79,70,229,0.2)] text-white cursor-pointer"
                >
                    <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Luncurkan Notifikasi
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => onOpenEdit(item)}
                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3 py-2.5 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(item.id, examName)}
                        className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold px-3.5 py-2.5 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer"
                        title="Hapus"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
