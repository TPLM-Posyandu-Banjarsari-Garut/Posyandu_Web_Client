import React from 'react';

interface SuccessToastProps {
  isOpen: boolean;
  message: string;
}

export default function SuccessToast({ isOpen, message }: SuccessToastProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white w-full max-w-[280px] rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center justify-center animate-scale-up text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(16,185,129,0.2)] animate-bounce">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-slate-800 mb-1">Sukses</h2>
        <p className="text-xs text-slate-400 leading-normal">
          {message || 'Aksi berhasil disimpan.'}
        </p>
      </div>
    </div>
  );
}
