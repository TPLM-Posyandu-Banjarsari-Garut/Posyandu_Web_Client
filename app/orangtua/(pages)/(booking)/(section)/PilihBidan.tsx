'use client';

import { useState } from 'react';
import { useGetOrangTuaMidwives } from '@/hooks/query/orangtua/useOrangTuaChildren';

interface PilihBidanProps {
  posyandu_id: string;
  onSelect: (id: string, name: string) => void;
  onBack: () => void;
}

export default function PilihBidan({ posyandu_id, onSelect, onBack }: PilihBidanProps) {
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useGetOrangTuaMidwives({
    posyandu_id,
    limit: 100,
  });

  const midwives = data?.data || [];

  const filteredMidwives = midwives.filter((midwife) => {
    const name = midwife.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          onClick={onBack}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2 active:scale-95 transition-all"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <h2 className="text-sm font-extrabold text-[#1E3050] tracking-wide mb-1">Pilih Bidan</h2>
        <p className="text-xs font-semibold text-slate-500">Pilih bidan pendamping yang bertugas di Posyandu ini.</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Cari Bidan..."
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
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="w-full bg-white rounded-2xl p-5 border border-[#EBE8D8] animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200"></div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-6 text-xs.5 font-bold text-red-500">
            Gagal memuat data Bidan. Silakan coba lagi.
          </div>
        ) : filteredMidwives.length === 0 ? (
          <div className="text-center py-10 text-xs.5 font-semibold text-slate-500">
            Tidak ada Bidan yang ditemukan di Posyandu ini.
          </div>
        ) : (
          filteredMidwives.map((midwife) => {
            const displayName = midwife.name || 'Bidan Tanpa Nama';
            const strNumber = midwife.license_number || 'STR tidak tertera';
            
            return (
              <button
                key={midwife.id}
                onClick={() => onSelect(midwife.id, displayName)}
                className="w-full text-left bg-white rounded-2xl py-4 px-5 border border-[#EBE8D8] hover:border-blue-400 hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-sm font-extrabold shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#1E3050] tracking-wide leading-tight truncate">{displayName}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      No. STR: {strNumber}
                    </p>
                  </div>
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
