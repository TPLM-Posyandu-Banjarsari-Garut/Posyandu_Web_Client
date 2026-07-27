"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import BottombarOrtu from "@/components/ui/bottombar/orangtua/BottombarOrtu";
import { useGetOrangTuaChildren } from "@/hooks/query/orangtua/useOrangTuaChildren";

export default function DataImunisasi() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset page to 1 on search change
    }, 450);
    return () => clearTimeout(handler);
  }, [search]);

  // Load children under this parent
  const { data: response, isLoading, error } = useGetOrangTuaChildren({
    search: debouncedSearch,
    page: currentPage,
    limit: 5,
  });

  const getErrorMessage = (err: unknown): string => {
    if (!err) return "";
    if (axios.isAxiosError(err)) {
      return (err.response?.data as { message?: string })?.message || err.message;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return "Terjadi kesalahan";
  };

  const apiError = getErrorMessage(error);
  const childrenList = response?.data || [];
  const totalPages = response?.meta?.total_pages || 1;

  // Helper to format date into Indonesian standard style
  const formatDateIndo = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Header */}
        <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/orangtua/home"
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Data Imunisasi</h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28 bg-slate-50">
          
          {apiError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 mb-6 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>{apiError}</span>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
              placeholder="Cari nama atau NIK bayi..."
            />
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1 || isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-slate-200 rounded-[1.25rem] text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              Sebelumnya
            </button>
            
            <span className="text-xs font-extrabold text-slate-500 whitespace-nowrap">
              Hal. {currentPage} dari {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages || isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-slate-200 rounded-[1.25rem] text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] cursor-pointer"
            >
              Selanjutnya
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Stack of Immunization Cards */}
          <div className="flex flex-col gap-4">
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-4 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-2xl"></div>
                </div>
              ))
            ) : childrenList.length > 0 ? (
              childrenList.map((bayi) => (
                <div
                  key={bayi.id}
                  className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3.5 hover:shadow-[0_6px_18px_rgb(0,0,0,0.05)] transition-all hover:scale-[1.01] duration-200"
                >
                  {/* Card Header: Initial & Name */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center font-extrabold text-base shrink-0">
                      {bayi.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-bold text-slate-800 truncate leading-snug">
                        {bayi.name}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Orang Tua: <span className="text-slate-700 font-semibold">{bayi.mother_name || "-"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Details: Posyandu & Last Updated */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/85 flex flex-col gap-2">
                    {/* Posyandu */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-xs font-semibold text-slate-600">
                        {bayi.posyandu_detail?.name || "-"}
                      </span>
                    </div>
                    {/* Last Updated */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[11px] font-medium text-slate-500">
                        Diperbarui: <span className="text-slate-700 font-semibold">{formatDateIndo(bayi.updated_at)}</span>
                      </span>
                    </div>
                  </div>

                  {/* View History Button */}
                  <Link
                    href={`/orangtua/buat-data-imunisasi?bayiId=${bayi.id}&nama=${encodeURIComponent(bayi.name)}`}
                    className="w-full bg-blue-600 text-white font-extrabold text-xs py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(37,99,235,0.15)] flex justify-center items-center gap-1.5 cursor-pointer text-center"
                  >
                    Lihat Riwayat Imunisasi
                  </Link>
                </div>
              ))
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-700 mb-1">Tidak Ada Data Imunisasi</h3>
                <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                  Belum ada bayi yang terdaftar di akun Anda atau pencarian tidak ditemukan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottombarOrtu />
      </div>
    </div>
  );
}
