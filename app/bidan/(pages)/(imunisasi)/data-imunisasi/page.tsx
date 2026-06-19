"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BottombarBidan from "@/components/ui/bottombar/bidan/BottombarBidan";
import { useGetChildren } from "@/hooks/query/child/useManageChildren";
import axios from "axios";

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

  // Load children under this posyandu
  const { data: response, isLoading: isChildrenLoading, error: childrenError } = useGetChildren({
    search: debouncedSearch,
    page: currentPage,
    limit: 5,
  });

  const getErrorMessage = (err: any) => {
    if (!err) return "";
    if (axios.isAxiosError(err)) {
      return (err.response?.data as { message?: string })?.message || err.message;
    }
    return err.message || "Terjadi kesalahan";
  };

  const apiError = getErrorMessage(childrenError);
  const childrenList = response?.data?.data || [];

  const formatDateIndo = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isLoading = isChildrenLoading;

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Header */}
        <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/bidan/home"
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Data Imunisasi</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-slate-50">
          
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
          <div className="mb-6 relative">
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
              Hal. {currentPage} dari {response?.data?.meta?.total_pages || 1}
            </span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, response?.data?.meta?.total_pages || 1))}
              disabled={currentPage >= (response?.data?.meta?.total_pages || 1) || isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-slate-200 rounded-[1.25rem] text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] cursor-pointer"
            >
              Selanjutnya
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

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
                  className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3.5 hover:shadow-[0_6px_18px_rgb(0,0,0,0.05)] transition-all"
                >
                  {/* Card Header: Initial & Name */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center font-bold text-base shrink-0">
                      {bayi.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-bold text-slate-800 line-clamp-1">
                        {bayi.name}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Orang Tua: <span className="text-slate-700 font-semibold">{bayi.mother_name || "-"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Details: Posyandu & Last Updated */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/80 flex flex-col gap-2">
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

                  {/* Add Immunization Button */}
                  <Link
                    href={`/bidan/buat-data-imunisasi?bayiId=${bayi.id}&nama=${encodeURIComponent(bayi.name)}`}
                    className="w-full bg-blue-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(37,99,235,0.15)] flex justify-center items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Data Imunisasi
                  </Link>
                </div>
              ))
            ) : (
              // Empty Result State
              <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-700 mb-1">Tidak Ada Data Bayi</h3>
                <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                  Data bayi tidak ditemukan. Coba ubah kata kunci pencarian.
                </p>
              </div>
            )}
          </div>
        </div>

        <BottombarBidan />
      </div>
    </div>
  );
}
