import React from 'react';

interface KelolaBuatAkunBannerProps {
  totalItems: number;
}

export default function KelolaBuatAkunBanner({ totalItems }: KelolaBuatAkunBannerProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-5 text-white shadow-md mb-6 relative overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-10 translate-x-2 translate-y-2">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      <h2 className="text-sm font-bold mb-1">Manajemen Pengguna</h2>
      <p className="text-[11px] text-blue-100 leading-normal mb-3">
        Gunakan halaman ini untuk mendaftarkan dan memantau akun Kader, Bidan, serta Orang Tua.
      </p>
      <div className="flex gap-2">
        <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg">
          Total: {totalItems} Akun
        </span>
      </div>
    </div>
  );
}
