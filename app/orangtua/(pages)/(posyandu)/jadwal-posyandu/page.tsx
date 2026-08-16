'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import DateFilterInput from '@/components/ui/DateFilterInput';
import { useQuery } from '@tanstack/react-query';
import { useGetSchedules } from '@/hooks/query/schedule/useManageSchedules';
import { useGetExaminations } from '@/hooks/query/examination/useManageExaminations';
import { fetchPosyandus } from '@/service/posyandu/posyanduService';
import { ExaminationSchedule } from '@/interfaces/schedule';

interface PosyanduItem {
    id: string;
    name: string;
}

interface ExaminationItem {
    id: string;
    posyandu_id: string;
    name: string;
}

export default function JadwalPosyandu() {
    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterPosyandu, setFilterPosyandu] = useState('');
    const [page, setPage] = useState(1);
    const limit = 5;

    // Fetch Posyandus
    const { data: posyanduRes } = useQuery({
        queryKey: ['posyandus'],
        queryFn: () => fetchPosyandus({ limit: 100 }),
    });
    const posyandusList: PosyanduItem[] = Array.isArray(posyanduRes?.data) ? posyanduRes.data : [];

    // Fetch Examinations
    const { data: examinationsData } = useGetExaminations();
    const rawExams = (examinationsData as unknown as { data?: { data?: ExaminationItem[] } })?.data?.data;
    const examinationsList: ExaminationItem[] = Array.isArray(rawExams) ? rawExams : [];

    // Fetch Schedules
    const { data: schedulesData, isLoading } = useGetSchedules({
        scheduled_date: filterDate || undefined,
        posyandu_id: filterPosyandu || undefined,
        page,
        limit
    });

    const rawSchedules = (schedulesData as unknown as { data?: { data?: ExaminationSchedule[]; meta?: { total_pages?: number; total_items?: number } } })?.data?.data;
    const schedules: ExaminationSchedule[] = Array.isArray(rawSchedules) ? rawSchedules : [];
    const meta = (schedulesData as unknown as { data?: { meta?: { total_pages?: number; total_items?: number } } })?.data?.meta;
    const totalPages = meta?.total_pages || 1;
    const totalItems = meta?.total_items || schedules.length;

    // Reset page on filter change
    useEffect(() => {
        setPage(1);
    }, [filterDate, filterPosyandu, searchQuery]);

    // Safer Indonesian Date Formatter
    const formatDateIndo = (dateStr: string) => {
        if (!dateStr) return '-';
        const rawDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        const [year, month, day] = rawDate.split('-');
        if (!year || !month || !day) return dateStr;
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
    };

    // Filter schedules locally by searchQuery (matching examination name or posyandu name)
    const filteredSchedules = useMemo(() => {
        if (!searchQuery.trim()) return schedules;
        const q = searchQuery.toLowerCase();
        return schedules.filter(item => {
            const examObj = examinationsList.find(e => e.id === item.examination_id);
            const posyanduObj = posyandusList.find(p => p.id === item.posyandu_id);
            const examName = examObj?.name || 'Kegiatan Posyandu';
            const posyanduName = posyanduObj?.name || 'Posyandu';
            return examName.toLowerCase().includes(q) || posyanduName.toLowerCase().includes(q);
        });
    }, [schedules, searchQuery, examinationsList, posyandusList]);

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            {/* Mobile Container */}
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header Background Gradient */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

                {/* Header Nav */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/orangtua/home" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Jadwal Posyandu</h1>
                    <div className="w-10 h-10"></div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-32">

                    {/* Dashboard Info Banner */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex items-center gap-4 mb-6 border border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Jadwal Posyandu</p>
                            <h2 className="text-xl font-bold text-slate-800 leading-tight">
                                {totalItems} Sesi
                            </h2>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                            placeholder="Cari jenis kegiatan atau posyandu..."
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="mb-4 flex gap-2">
                        {/* Date Filter */}
                        <div className="w-[calc(50%-0.25rem)] min-w-0 shrink-0 grow-0">
                            <DateFilterInput
                                value={filterDate}
                                onChange={(val) => setFilterDate(val)}
                            />
                        </div>

                        {/* Posyandu Select Filter */}
                        <div className="w-[calc(50%-0.25rem)] min-w-0 shrink-0 grow-0 relative h-[3.25rem]">
                            <select
                                value={filterPosyandu}
                                onChange={(e) => setFilterPosyandu(e.target.value)}
                                className="w-full h-full box-border px-3 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-[0_2px_10px_rgb(0,0,0,0.02)] appearance-none font-semibold truncate pr-8"
                            >
                                <option value="">Semua Posyandu</option>
                                {posyandusList.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Reset Filter Button */}
                    {(searchQuery || filterDate || filterPosyandu) && (
                        <div className="flex justify-between items-center mb-4 px-2">
                            <span className="text-[11px] font-bold text-slate-400">Hasil filter: {filteredSchedules.length} Jadwal</span>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterDate('');
                                    setFilterPosyandu('');
                                }}
                                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Schedule List */}
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-semibold">
                                Memuat jadwal posyandu...
                            </div>
                        ) : filteredSchedules.length > 0 ? (
                            filteredSchedules.map((item) => {
                                const examObj = examinationsList.find(e => e.id === item.examination_id);
                                const posyanduObj = posyandusList.find(p => p.id === item.posyandu_id);
                                const examName = examObj?.name || 'Kegiatan Posyandu';
                                const posyanduName = posyanduObj?.name || 'Posyandu';

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-[2rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-3.5 hover:shadow-md transition-shadow duration-300 animate-fade-in"
                                    >
                                        {/* Exam & Posyandu Name */}
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-extrabold text-slate-800 leading-tight">
                                                        {examName}
                                                    </h3>
                                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                                        {posyanduName}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="shrink-0 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-100/60">
                                                Terjadwal
                                            </span>
                                        </div>

                                        {/* Schedule Time Details */}
                                        <div className="flex flex-col gap-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-650">
                                            <div className="flex items-center gap-2.5">
                                                <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formatDateIndo(item.scheduled_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5">
                                                <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{item.start_time || '08:00'} - {item.end_time || '11:00'} WIB</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-semibold shadow-[0_2px_10px_rgb(0,0,0,0.01)]">
                                Tidak ada jadwal posyandu yang ditemukan.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 bg-white p-3 rounded-2xl border border-slate-100">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                                Sebelumnya
                            </button>
                            <span className="text-xs font-bold text-slate-500">
                                Halaman {page} dari {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 disabled:opacity-40 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    )}

                </div>

                {/* Bottom Navigation for Orang Tua */}
                <BottombarOrtu />
            </div>
        </div>
    );
}
