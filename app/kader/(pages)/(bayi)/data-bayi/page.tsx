"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BottombarKader from "@/components/ui/bottombar/kader/BottombarKader";
import { useGetCadreProfile } from "@/hooks/query/cadre/useCadreProfile";
import { useGetChildren } from "@/hooks/query/child/useManageChildren";
import axios from "axios";

export default function DataBayi() {
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

  const { data: cadre, isLoading: isCadreLoading } = useGetCadreProfile();

  // Load children under this posyandu
  const { data: response, isLoading: isChildrenLoading, error: childrenError } = useGetChildren({
    posyandu_id: cadre?.posyandu_id || "",
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

  console.log("data-bayi debug:", {
    cadre,
    isCadreLoading,
    response,
    isChildrenLoading,
    childrenError: childrenError ? { message: childrenError.message, response: (childrenError as any).response?.data } : null,
  });

  const childrenList = response?.data?.data || [];

  const calculateAge = (birthDateStr?: string | null) => {
    if (!birthDateStr) return "-";
    const birthDate = new Date(birthDateStr);
    const today = new Date();

    // Calculate difference in months
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();

    if (months < 1) {
      const diffTime = Math.abs(today.getTime() - birthDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Hari`;
    }
    return `${months} Bulan`;
  };

  const formatGender = (gender: "male" | "female") => {
    return gender === "male" ? "Laki-laki" : "Perempuan";
  };

  const isLoading = isCadreLoading || isChildrenLoading;

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

        {/* Header */}
        <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/kader/home"
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Data Bayi</h1>
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
          <div className="mb-3 relative">
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
                  className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-4 hover:scale-[1.01] transition-transform duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center font-extrabold text-lg shrink-0 border border-pink-200">
                      {bayi.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-extrabold text-slate-800 truncate leading-snug">
                        {bayi.name}
                      </h2>
                      <p className="text-xs text-slate-500 font-bold tracking-wide mt-0.5">
                        NIK: {bayi.identity_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100/80">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">
                        J. Kelamin
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {formatGender(bayi.gender)}
                      </span>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">
                        Umur
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {calculateAge(bayi.birth_date)}
                      </span>
                    </div>
                    <Link
                      href={`/kader/detail-bayi?id=${bayi.id}`}
                      className="ml-2 bg-blue-50 text-blue-600 text-xs font-extrabold px-4 py-2.5 rounded-full hover:bg-blue-100 hover:text-blue-700 active:scale-95 transition-all shrink-0 border border-blue-100/60"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Empty Result State
              <div className="bg-white rounded-[1.5rem] p-8 text-center border border-slate-200 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 mb-1">
                  Tidak Ada Data Bayi
                </h3>
                <p className="text-xs text-slate-500 font-medium max-w-[200px] mx-auto leading-relaxed">
                  Belum ada bayi yang terdaftar di posyandu ini atau pencarian tidak ditemukan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed (+) Button */}
        <div className="fixed bottom-[100px] w-full max-w-md mx-auto z-40 pointer-events-none flex justify-end px-6 left-1/2 -translate-x-1/2">
          <Link
            href="/kader/pendaftaran-bayi"
            className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all pointer-events-auto border border-blue-500/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>

        <BottombarKader />
      </div>
    </div>
  );
}
