import React from 'react';
import Link from 'next/link';

interface KelolaPosyanduHeaderProps {
  onLogoutClick: () => void;
}

export default function KelolaPosyanduHeader({ onLogoutClick }: KelolaPosyanduHeaderProps) {
  return (
    <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-20 sticky top-0 shadow-sm border-b border-slate-50">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/kelola-buat-akun"
          className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-105 hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0"
          title="Kembali ke Kelola Akun"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-base font-bold text-slate-800">Kelola Posyandu</h1>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Admin Posyandu</p>
        </div>
      </div>

      {/* Logout Trigger Icon */}
      <button
        onClick={onLogoutClick}
        className="p-2.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
        title="Keluar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );
}
