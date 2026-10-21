"use client";

import React, { useState } from "react";
import Link from "next/link";
import LaporanBayiHeader from "./components/LaporanBayiHeader";
import LaporanBayiSummaryCards from "./components/LaporanBayiSummaryCards";
import NewbornCard from "./components/NewbornCard";
import NewbornDetailModal from "./components/NewbornDetailModal";
import ConfirmLogoutModal from "../kelola-buat-akun/components/ConfirmLogoutModal";
import { useGetNewbornReport } from "@/hooks/query/child/useManageChildren";
import { useGetPosyandus } from "@/hooks/query/posyandu/useManagePosyandu";
import { useLogoutAdmin } from "@/hooks/query/authAdmin/UseLogoutAdmin";
import { NewbornReportItem } from "@/interfaces/child";

const MONTHS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - 3 + i);

export default function LaporanBayiBaruLahirPage() {
  const currentDate = new Date();
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [posyanduId, setPosyanduId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedChild, setSelectedChild] = useState<NewbornReportItem | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const logoutMutation = useLogoutAdmin();

  // Fetch Posyandu list for filter
  const { data: posyandusResponse } = useGetPosyandus({ limit: 100 });
  const posyanduList = posyandusResponse?.data || [];

  // Fetch Newborn Report
  const { data: reportResponse, isLoading, isError, refetch } = useGetNewbornReport({
    month,
    year,
    posyandu_id: posyanduId || undefined,
    search: searchQuery || undefined,
    page,
    limit: 5,
  });

  const reportData = reportResponse?.data;
  const summary = reportData?.summary;
  const newborns = reportData?.data || [];
  const meta = reportData?.meta;
  const totalItems = meta?.total_items || 0;
  const totalPages = meta?.total_pages || 1;

  const currentMonthName = MONTHS.find((m) => m.value === month)?.label || `Bulan ${month}`;
  const isCurrentMonth =
    month === currentDate.getMonth() + 1 && year === currentDate.getFullYear();

  const handleResetToCurrentMonth = () => {
    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      {/* Mobile Device Mockup */}
      <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Sticky Header */}
        <LaporanBayiHeader onLogoutClick={() => setIsLogoutModalOpen(true)} />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 pb-28 pt-4 px-6 custom-scrollbar">
          
          {/* Quick Nav Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-2xl mb-4 text-[11px] font-bold">
            <Link
              href="/admin/kelola-buat-akun"
              className="flex-1 py-2 text-center rounded-xl text-slate-600 hover:text-slate-900 transition-all"
            >
              Kelola Akun
            </Link>
            <Link
              href="/admin/kelola-posyandu"
              className="flex-1 py-2 text-center rounded-xl text-slate-600 hover:text-slate-900 transition-all"
            >
              Posyandu
            </Link>
            <span className="flex-1 py-2 text-center rounded-xl bg-white text-blue-600 shadow-xs font-extrabold">
              Bayi Lahir
            </span>
          </div>

          {/* Month & Year Filter Header */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <span>🗓️</span> Pilih Bulan & Tahun
              </span>

              {!isCurrentMonth && (
                <button
                  type="button"
                  onClick={handleResetToCurrentMonth}
                  className="text-[10px] font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                >
                  Ke Bulan Ini
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2.5">
              {/* Month Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1 block">Bulan</label>
                <select
                  value={month}
                  onChange={(e) => {
                    setMonth(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1 block">Tahun</label>
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Posyandu Filter */}
            {posyanduList.length > 0 && (
              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1 block">Filter Posyandu</label>
                <select
                  value={posyanduId}
                  onChange={(e) => {
                    setPosyanduId(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                >
                  <option value="">Semua Posyandu ({posyanduList.length})</option>
                  {posyanduList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.village_name ? `(${p.village_name})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Month Summary Cards */}
          <LaporanBayiSummaryCards
            summary={summary}
            monthName={currentMonthName}
            year={year}
          />

          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Cari nama bayi, NIK, atau nama ibu..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white pl-10 pr-10 py-3 rounded-[1.25rem] text-xs text-slate-700 border border-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-full cursor-pointer"
                title="Hapus pencarian"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Pagination Top Bar */}
          {totalItems > 0 && (
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-[11px] font-bold text-slate-500">
                Total: <strong className="text-blue-600">{totalItems}</strong> Data Bayi
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Hal {page} dari {totalPages}
              </span>
            </div>
          )}

          {/* List Section */}
          <div className="space-y-3">
            {isLoading && (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-xs">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <h4 className="text-xs font-bold text-slate-700">Memuat Laporan Bayi Baru Lahir...</h4>
                <p className="text-[10px] text-slate-400 mt-1">Mengambil data periode {currentMonthName} {year}</p>
              </div>
            )}

            {isError && !isLoading && (
              <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 text-center text-rose-700">
                <span className="text-2xl block mb-2">⚠️</span>
                <h4 className="text-xs font-bold">Gagal Memuat Data Laporan</h4>
                <p className="text-[10px] text-rose-600 mt-1 mb-3">Terjadi kendala saat menghubungi server.</p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-1.5 rounded-full bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 active:scale-95 transition-all cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
            )}

            {!isLoading && !isError && newborns.length === 0 && (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-xs">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3 text-2xl">
                  👶
                </div>
                <h4 className="text-xs font-bold text-slate-700">Tidak Ada Data Bayi Lahir</h4>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                  Belum ada catatan bayi baru lahir pada periode {currentMonthName} {year}
                  {posyanduId ? " untuk posyandu yang dipilih" : ""}.
                </p>
              </div>
            )}

            {!isLoading && !isError && newborns.map((item) => (
              <NewbornCard
                key={item.id}
                item={item}
                onSelect={(child) => setSelectedChild(child)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalItems > 0 && totalPages > 1 && (
            <div className="flex justify-between items-center mt-5 mb-2 px-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                Sebelumnya
              </button>
              <span className="text-[11px] font-bold text-slate-500">
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Detail Modal */}
      <NewbornDetailModal
        item={selectedChild}
        onClose={() => setSelectedChild(null)}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
        isPending={logoutMutation.isPending}
      />
    </div>
  );
}
