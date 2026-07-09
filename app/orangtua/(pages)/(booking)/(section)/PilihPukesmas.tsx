'use client';

import { useState } from 'react';
import { useGetOrangTuaPosyandus } from '@/hooks/query/orangtua/useOrangTuaChildren';

interface PilihPuskesmasProps {
  onSelect: (id: string, name: string) => void;
}

export default function PilihPukesmas({ onSelect }: PilihPuskesmasProps) {
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useGetOrangTuaPosyandus({
    search: search || undefined,
    limit: 100,
  });

  const posyandus = data?.data || [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-extrabold text-[#1E3050] tracking-wide mb-1">Pilih Posyandu</h2>
        <p className="text-xs font-semibold text-slate-500">Pilih salah satu Posyandu untuk memulai layanan check-up.</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Cari Posyandu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#EBE8D8] rounded-2xl py-3 px-4 pl-10 text-xs.5 font-semibold text-slate-800 focus:outline-none focus:border-blue-400 placeholder-slate-400"
        />
        <svg
          className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          // Loading Skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-full bg-white rounded-2xl p-5 border border-[#EBE8D8] animate-pulse flex flex-col gap-2">
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-6 text-xs.5 font-bold text-red-500">
            Gagal memuat data Posyandu. Silakan coba lagi.
          </div>
        ) : posyandus.length === 0 ? (
          <div className="text-center py-10 text-xs.5 font-semibold text-slate-500">
            Tidak ada Posyandu yang ditemukan.
          </div>
        ) : (
          posyandus.map((posyandu) => {
            const address = [
              posyandu.address_line,
              posyandu.rt && `RT ${posyandu.rt}`,
              posyandu.rw && `RW ${posyandu.rw}`,
              posyandu.village_name
            ].filter(Boolean).join(', ');

            return (
              <button
                key={posyandu.id}
                onClick={() => onSelect(posyandu.id, posyandu.name)}
                className="w-full text-left bg-white rounded-2xl py-4 px-5 border border-[#EBE8D8] hover:border-blue-400 hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-sm font-bold text-[#1E3050] tracking-wide leading-tight truncate">{posyandu.name}</h3>
                  <p className="text-xs text-slate-550 font-semibold mt-1.5 truncate">
                    {address || 'Alamat tidak tertera'}
                  </p>
                </div>
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
