'use client';

import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import DateFilterInput from '@/components/ui/DateFilterInput';
import { FilterHalf, FilterRow } from '@/components/ui/FilterRow';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
    useGetOrangTuaEducations,
    useGetOrangTuaEducationCategories,
} from '@/hooks/query/orangtua/useOrangTuaChildren';

export default function EdukasiPage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const limit = 5;

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 450);
        return () => clearTimeout(handler);
    }, [search]);

    const { data: response, isLoading } = useGetOrangTuaEducations({
        page,
        limit,
        search: debouncedSearch || undefined,
        category_id: category || undefined,
    });

    const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetOrangTuaEducationCategories();
    const categories = categoriesResponse?.data?.data || [];

    const educations = response?.data?.data || [];
    const totalItems = response?.data?.totalItems || 0;
    const totalPages = Math.ceil(totalItems / limit);

    const getCategoryName = (id: string) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : 'Tanpa Kategori';
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md min-w-0 bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/orangtua/home" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Edukasi</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-6 py-6 custom-scrollbar bg-slate-50">

                    {/* Filter Section */}
                    <div className="mb-6 flex flex-col gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                                placeholder="Cari judul edukasi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <FilterRow>
                            <FilterHalf>
                                <div className="relative h-[3.25rem] w-full overflow-hidden">
                                    <select 
                                        className="filter-select-input absolute inset-0 h-full w-full box-border px-3 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-[0_2px_10px_rgb(0,0,0,0.02)] appearance-none disabled:opacity-50"
                                        value={category}
                                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                                        disabled={isLoadingCategories}
                                    >
                                        <option value="">{isLoadingCategories ? "Memuat..." : "Semua Kategori"}</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </FilterHalf>
                            <FilterHalf>
                                <DateFilterInput />
                            </FilterHalf>
                        </FilterRow>
                        
                        {/* Pagination Controls */}
                        <div className="flex justify-between items-center px-2 mt-2">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || isLoading}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Sebelumnya
                            </button>
                            <span className="text-sm font-medium text-slate-500">
                                Halaman {page} dari {totalPages || 1}
                            </span>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages || isLoading}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>

                    {/* Stack Data */}
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <div className="text-center py-10 text-slate-500 text-sm">Memuat data...</div>
                        ) : educations.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 text-sm">Tidak ada edukasi ditemukan.</div>
                        ) : (
                            educations.map((item) => (
                                <div key={item.id} className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-4 relative overflow-hidden">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full w-fit uppercase tracking-wider">{getCategoryName(item.category_id)}</span>
                                        <h2 className="text-base font-bold text-slate-800 leading-snug mt-1">{item.title}</h2>
                                        <div className="flex items-center gap-1.5 mt-1.5 text-slate-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="text-xs font-medium">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-2 pt-4 border-t border-slate-100">
                                        <Link href={`/orangtua/baca-edukasi?id=${item.id}`} className="w-full bg-blue-600 text-white text-xs font-bold px-4 py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.15)] cursor-pointer">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                            Baca Edukasi
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <BottombarOrtu />
            </div>
        </div>
    );
}
