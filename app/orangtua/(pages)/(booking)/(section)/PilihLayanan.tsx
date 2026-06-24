'use client';

import { useState } from 'react';
import { useGetOrangTuaChildren, useGetOrangTuaPregnancyRecords } from '@/hooks/query/orangtua/useOrangTuaChildren';
import Link from 'next/link';

interface PilihLayananProps {
  onSelect: (
    type: 'pregnancy' | 'child_development' | 'general',
    children_id: string | null,
    pregnancy_record_id: string | null,
    posyandu_id?: string | null,
    posyandu_name?: string | null
  ) => void;
}

type ViewType = 'type' | 'layanan_umum_sub' | 'select_child' | 'no_pregnancy_record';

export default function PilihLayanan({ onSelect }: PilihLayananProps) {
  const [view, setView] = useState<ViewType>('type');
  const [selectedType, setSelectedType] = useState<'pregnancy' | 'child_development' | 'general' | null>(null);

  // Fetch children list
  const { data: childrenData, isLoading: isLoadingChildren } = useGetOrangTuaChildren({
    limit: 50,
  });

  // Fetch active pregnancy records
  const { data: pregnancyData, isLoading: isLoadingPregnancy } = useGetOrangTuaPregnancyRecords({
    is_active: true,
    limit: 10,
  });

  const childrenList = childrenData?.data || [];
  const pregnancyRecords = pregnancyData?.data || [];

  const handleSelectPregnancy = () => {
    const currentRecords = pregnancyRecords;
    if (currentRecords.length > 0) {
      // Use the first active pregnancy record, pass posyandu_id (we'll fetch name inside the booking page)
      onSelect('pregnancy', null, currentRecords[0].id, currentRecords[0].posyandu_id, null);
    } else {
      setView('no_pregnancy_record');
    }
  };

  const handleSelectImunisasi = () => {
    setSelectedType('child_development');
    if (childrenList.length === 1) {
      const child = childrenList[0];
      onSelect('child_development', child.id, null, child.posyandu_id, child.posyandu_detail?.name || null);
    } else {
      setView('select_child');
    }
  };

  const handleSelectGeneral = () => {
    setView('layanan_umum_sub');
  };

  const handleSelectPeriksaBayi = () => {
    setSelectedType('general');
    if (childrenList.length === 1) {
      const child = childrenList[0];
      onSelect('general', child.id, null, child.posyandu_id, child.posyandu_detail?.name || null);
    } else {
      setView('select_child');
    }
  };

  const handleSelectPeriksaIbu = () => {
    onSelect('general', null, null, null, null);
  };

  if (view === 'layanan_umum_sub') {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <button
            onClick={() => setView('type')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2 active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <h2 className="text-sm font-extrabold text-[#1E3050] tracking-wide mb-1">Pilih Sub-Layanan Umum</h2>
          <p className="text-xs font-semibold text-slate-500 font-sans">Tentukan siapa yang akan melakukan pemeriksaan kesehatan.</p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Periksa Bayi */}
          <button
            onClick={handleSelectPeriksaBayi}
            className="w-full text-left bg-white rounded-2xl py-4.5 px-5 border border-[#EBE8D8] hover:border-blue-400 hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E3050] tracking-wide leading-tight">Periksa Bayi / Anak</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Pemeriksaan umum anak (timbang, keluhan, dll.)</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Periksa Ibu */}
          <button
            onClick={handleSelectPeriksaIbu}
            className="w-full text-left bg-white rounded-2xl py-4.5 px-5 border border-[#EBE8D8] hover:border-blue-400 hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E3050] tracking-wide leading-tight">Periksa Ibu</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Pemeriksaan umum / keluhan kesehatan ibu</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (view === 'select_child') {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <button
            onClick={() => setView(selectedType === 'general' ? 'layanan_umum_sub' : 'type')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2 active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <h2 className="text-sm font-extrabold text-[#1E3050] tracking-wide mb-1">Pilih Bayi/Anak</h2>
          <p className="text-xs font-semibold text-slate-500 font-sans">Pilih profil bayi untuk penjadwalan pemeriksaan.</p>
        </div>

        <div className="flex flex-col gap-3">
          {isLoadingChildren ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-full bg-white rounded-2xl p-5 border border-[#EBE8D8] animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                </div>
              </div>
            ))
          ) : childrenList.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-[#EBE8D8] text-center flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-[#1E3050]">Belum Ada Bayi Terdaftar</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-[260px] font-sans">
                Anda harus mendaftarkan bayi Anda terlebih dahulu sebelum membuat janji.
              </p>
              <Link
                href="/orangtua/pendaftaran-bayi"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs.5 px-6 py-3 rounded-full active:scale-95 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
              >
                Daftarkan Bayi
              </Link>
            </div>
          ) : (
            childrenList.map((child) => (
              <button
                key={child.id}
                onClick={() => onSelect(selectedType || 'general', child.id, null, child.posyandu_id, child.posyandu_detail?.name || null)}
                className="w-full text-left bg-white rounded-2xl py-4 px-5 border border-[#EBE8D8] hover:border-blue-400 hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-extrabold shrink-0">
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-[#1E3050] tracking-wide leading-tight truncate">{child.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      NIK: {child.identity_number} · {child.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === 'no_pregnancy_record') {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <button
            onClick={() => setView('type')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2 active:scale-95 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <h2 className="text-sm font-extrabold text-[#1E3050] tracking-wide mb-1">ANC / Ibu Hamil</h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-red-100 text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-650">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[#1E3050]">Tidak Ada Catatan Kehamilan Aktif</h3>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-[260px] font-sans">
            Anda tidak memiliki catatan kehamilan aktif saat ini. Layanan ini memerlukan pendaftaran awal dari Bidan atau Kader Posyandu.
          </p>
          <p className="text-[11px] text-slate-400 font-semibold font-sans">
            Silakan hubungi bidan/kader di Posyandu terdekat Anda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-extrabold text-[#1E3050] tracking-wide mb-1">Pilih Layanan</h2>
        <p className="text-xs font-semibold text-slate-500 font-sans">Pilih jenis layanan konsultasi/pemeriksaan yang Anda butuhkan.</p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Layanan Umum */}
        <button
          onClick={handleSelectGeneral}
          className="w-full text-left bg-white rounded-2xl py-4.5 px-5 border border-[#EBE8D8] hover:border-blue-400 hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E3050] tracking-wide leading-tight">Layanan Umum</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Pemeriksaan dan konsultasi kesehatan umum</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* ANC / Ibu Hamil */}
        <button
          onClick={handleSelectPregnancy}
          disabled={isLoadingPregnancy}
          className="w-full text-left bg-white rounded-2xl py-4.5 px-5 border border-[#EBE8D8] hover:border-blue-400 hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)] disabled:opacity-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E3050] tracking-wide leading-tight">ANC / Ibu Hamil</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Pemeriksaan kehamilan rutin & kesehatan janin</p>
            </div>
          </div>
          {isLoadingPregnancy ? (
            <div className="w-4 h-4 border-2 border-slate-350 border-t-transparent rounded-full animate-spin shrink-0"></div>
          ) : (
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        {/* Imunisasi / Tumbuh Kembang */}
        <button
          onClick={handleSelectImunisasi}
          className="w-full text-left bg-white rounded-2xl py-4.5 px-5 border border-[#EBE8D8] hover:border-blue-400 hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E3050] tracking-wide leading-tight">Imunisasi / Tumbuh Kembang</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Pemberian vaksin, timbang berat badan & tinggi anak</p>
            </div>
          </div>
          <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
