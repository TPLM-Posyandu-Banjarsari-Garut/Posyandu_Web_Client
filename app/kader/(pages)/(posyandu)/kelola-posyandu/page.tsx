"use client";

import React from "react";
import Link from "next/link";
import { useManagePosyanduPage } from "@/hooks/query/posyandu/useManagePosyanduPage";
import KelolaPosyanduHeader from "../../../../admin/(pages)/kelola-posyandu/components/KelolaPosyanduHeader";
import PosyanduCard from "../../../../admin/(pages)/kelola-posyandu/components/PosyanduCard";
import ManagePosyanduModal from "../../../../admin/(pages)/kelola-posyandu/components/ManagePosyanduModal";
import ConfirmLogoutModal from "../../../../admin/(pages)/kelola-posyandu/components/ConfirmLogoutModal";
import BottombarKader from '@/components/ui/bottombar/kader/BottombarKader';
import SuccessToast from "@/components/ui/SuccessToast";

export default function KelolaPosyandu() {
  const {
    logout,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    isLoading,
    totalItems,
    totalPages,
    allPosyandus,
    isModalOpen,
    editingItem,
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    showSuccessModal,
    successMessage,
    // Form fields
    name,
    setName,
    jalan,
    setJalan,
    rt,
    setRt,
    rw,
    setRw,
    patokan,
    setPatokan,
    villageName,
    setVillageName,
    formError,
    // Operations
    openAddModal,
    openEditModal,
    closeModal,
    handleDeletePosyandu,
    handleSavePosyandu,
    isMutating,
  } = useManagePosyanduPage();

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      {/* Mobile Device Mockup */}
      <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Sticky Header */}
        
        <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-20 sticky top-0 shadow-sm border-b border-slate-50">
          <div className="flex items-center gap-3">
            <Link
              href="/kader/home"
              className="p-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0"
              title="Kembali ke Beranda"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-base font-bold text-slate-800">Kelola Posyandu</h1>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Daftar Posyandu</p>
            </div>
          </div>
        </div>


        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-slate-50 pb-28 pt-4 px-6 custom-scrollbar">
          
          {/* Info Banner showing total items */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.5rem] p-4 text-white shadow-md mb-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <p className="text-[9px] uppercase font-extrabold text-blue-100 tracking-wider">
                Total Posyandu
              </p>
              <h2 className="text-lg font-bold leading-tight">
                {isLoading ? (
                  <span className="text-white/60 animate-pulse text-xs">Memuat...</span>
                ) : (
                  `${totalItems} Posyandu Terdaftar`
                )}
              </h2>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-5">
            <input
              type="text"
              placeholder="Cari nama atau lokasi posyandu..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Reset to page 1 on search change
              }}
              className="w-full bg-white pl-10 pr-4 py-3 rounded-[1.25rem] text-xs text-slate-705 border border-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setPage(1); // Reset to page 1
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 bg-slate-100 p-0.5 rounded-full cursor-pointer"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className="flex justify-between items-center mb-5 px-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                Sebelumnya
              </button>
              <span className="text-[11px] font-bold text-slate-500">
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          )}

          {/* Stack list of Posyandus */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Daftar Posyandu
              </h3>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <h4 className="text-xs font-bold text-slate-700">Memuat Data...</h4>
              </div>
            ) : allPosyandus.length > 0 ? (
              allPosyandus.map((item) => (
                <PosyanduCard
                  key={item.id}
                  item={item}
                  onEdit={openEditModal}
                  onDelete={handleDeletePosyandu}
                  isDeletePending={isMutating}
                />
              ))
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xs font-bold text-slate-700 mb-0.5">
                  Posyandu Tidak Ditemukan
                </h4>
                <p className="text-[10px] text-slate-400">
                  Cobalah kata kunci pencarian yang lain.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Floating Action Button (FAB) - Fixed Bottom Right Position */}
        <div className="fixed bottom-[100px] w-full max-w-md mx-auto z-30 pointer-events-none flex justify-end px-6 left-1/2 -translate-x-1/2">
          <button
            onClick={openAddModal}
            className="pointer-events-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.5)] cursor-pointer hover:scale-110 active:scale-95 transition-all group"
            title="Tambah Posyandu Baru"
          >
            <svg
              className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Manage Posyandu Modal (Form with overflow-y-auto) */}
        <ManagePosyanduModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSavePosyandu}
          isMutating={isMutating}
          editing={!!editingItem}
          name={name}
          setName={setName}
          jalan={jalan}
          setJalan={setJalan}
          rt={rt}
          setRt={setRt}
          rw={rw}
          setRw={setRw}
          patokan={patokan}
          setPatokan={setPatokan}
          villageName={villageName}
          setVillageName={setVillageName}
          formError={formError}
        />
        <BottombarKader />

        {/* Confirm Logout Modal */}
        

        {/* Success Toast */}
        <SuccessToast isOpen={showSuccessModal} message={successMessage} />

      </div>
    </div>
  );
}
