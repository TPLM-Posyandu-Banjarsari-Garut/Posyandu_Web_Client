import React from 'react';

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function ConfirmLogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isPending
}: ConfirmLogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white w-full max-w-[280px] rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col items-center justify-center animate-scale-up text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(244,63,94,0.15)]">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-slate-800 mb-1">Konfirmasi Keluar</h2>
        <p className="text-[11px] text-slate-400 leading-normal mb-5">
          Apakah Anda yakin ingin keluar dari halaman panel admin?
        </p>
        <div className="flex w-full gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-500 font-bold text-xs py-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-rose-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-600/10 disabled:opacity-50"
          >
            {isPending ? 'Keluar...' : 'Keluar'}
          </button>
        </div>
      </div>
    </div>
  );
}
