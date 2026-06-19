'use client';

import BottombarKader from '@/components/ui/bottombar/kader/BottombarKader';
import DateFilterInput from '@/components/ui/DateFilterInput';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useGetChildren } from "@/hooks/query/child/useManageChildren";
import { useGetPosyandus } from "@/hooks/query/posyandu/useManagePosyandu";

export default function DataImunisasi() {
    // Search and Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedPosyandu, setSelectedPosyandu] = useState('semua');
    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to page 1 on search change
        }, 450);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Handle filter adjustments by resetting pagination
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedPosyandu, selectedDate]);

    // Fetch children list from database
    const { data: response, isLoading: isChildrenLoading } = useGetChildren({
        search: debouncedSearch,
        posyandu_id: selectedPosyandu === 'semua' ? undefined : selectedPosyandu,
        page: currentPage,
        limit: 5,
    });

    // Fetch posyandus for the dropdown filter list
    const { data: posyandusResponse } = useGetPosyandus({ limit: 100 });
    const posyandusList = posyandusResponse?.data || [];

    const childrenList = response?.data?.data || [];
    const totalPages = response?.data?.meta?.total_pages || 1;

    // Client-side date filter if selectedDate is set
    const displayedChildren = selectedDate 
        ? childrenList.filter(child => {
            if (!child.updated_at) return false;
            const updatedDate = new Date(child.updated_at).toISOString().split('T')[0];
            return updatedDate === selectedDate;
          })
        : childrenList;

    // Helper to format date into Indonesian standard style
    const formatDateIndo = (dateStr?: string | null) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedDate('');
        setSelectedPosyandu('semua');
        setCurrentPage(1);
    };

    const hasActiveFilters = searchTerm !== '' || selectedDate !== '' || selectedPosyandu !== 'semua';
    const isLoading = isChildrenLoading;

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/kader/home" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Data Imunisasi</h1>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28 bg-slate-50">

                    {/* Filters Section */}
                    <div className="flex flex-col gap-3 mb-6">

                        {/* Search Bar */}
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                                placeholder="Cari nama atau NIK bayi..."
                            />
                        </div>

                        {/* Date Filter & Posyandu Dropdown filter row */}
                        <div className="grid grid-cols-2 gap-3">

                            {/* Date Filter Component */}
                            <DateFilterInput
                                value={selectedDate}
                                onChange={setSelectedDate}
                                className="w-full"
                            />

                            {/* Posyandu Select Dropdown */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <select
                                    value={selectedPosyandu}
                                    onChange={(e) => setSelectedPosyandu(e.target.value)}
                                    className="w-full pl-9 pr-8 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] text-slate-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                                >
                                    <option value="semua">Semua Posyandu</option>
                                    {posyandusList.map((posyandu) => (
                                        <option key={posyandu.id} value={posyandu.id}>
                                            {posyandu.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="self-end text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 transition-all px-3 py-1.5 rounded-full flex items-center gap-1 mt-1 shrink-0 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Reset Filter
                            </button>
                        )}
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
                        ) : displayedChildren.length > 0 ? (
                            displayedChildren.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3.5 hover:shadow-[0_6px_18px_rgb(0,0,0,0.05)] transition-all"
                                >
                                    {/* Card Header: Initial & Name */}
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-11 h-11 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center font-bold text-base shrink-0">
                                            {item.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-sm font-bold text-slate-800 line-clamp-1">
                                                {item.name}
                                            </h2>
                                            <p className="text-xs text-slate-500 font-medium">
                                                Orang Tua: <span className="text-slate-700 font-semibold">{item.mother_name || "-"}</span>
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
                                                {item.posyandu_detail?.name || "-"}
                                            </span>
                                        </div>
                                        {/* Last Updated */}
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-[11px] font-medium text-slate-500">
                                                Diperbarui: <span className="text-slate-700 font-semibold">{formatDateIndo(item.updated_at)}</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Add Immunization Button */}
                                    <Link
                                        href={`/kader/buat-data-imunisasi?bayiId=${item.id}&nama=${encodeURIComponent(item.name)}`}
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
                            /* Empty State */
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center flex flex-col items-center justify-center min-h-[300px]">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 112-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 mb-1">Tidak Ada Data Imunisasi</h3>
                                <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                                    Data imunisasi tidak ditemukan. Coba ubah kata kunci pencarian atau filter yang aktif.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Navigation */}
                <BottombarKader />
            </div>
        </div>
    );
}
