'use client';

import { useState } from 'react';

const controlClassName =
    'w-full min-w-0 max-w-full px-3 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-[0_2px_10px_rgb(0,0,0,0.02)] [color-scheme:light]';

type DateFilterInputProps = {
    className?: string;
};

export default function DateFilterInput({ className = '' }: DateFilterInputProps) {
    const [value, setValue] = useState('');

    return (
        <div className={`relative min-w-0 flex-1 basis-0 ${className}`}>
            <input
                type="date"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`${controlClassName} pr-9 ${value ? 'text-slate-700' : 'text-transparent [&::-webkit-datetime-edit]:opacity-0'} [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                aria-label="Filter tanggal"
            />
            {!value && (
                <span
                    className="absolute inset-y-0 left-3 right-9 flex items-center pointer-events-none text-[13px] text-slate-400 truncate"
                    aria-hidden
                >
                    dd/mm/yy
                </span>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        </div>
    );
}
