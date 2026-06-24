'use client';

import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import Link from 'next/link';
import { useState } from 'react';
import { useGetOrangTuaConsultations } from '@/hooks/query/orangtua/useOrangTuaChildren';

export default function HistoryBookingPage() {
    const [page, setPage] = useState(1);
    const { data: consultationsResponse, isLoading, error } = useGetOrangTuaConsultations({ limit: 5, page });
    const historyList = consultationsResponse?.data || [];

    const formatDateIndo = (dateStr: string) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'in_progress': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'completed': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'cancelled':
            default: return 'bg-red-50 text-red-600 border-red-100';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Menunggu';
            case 'confirmed': return 'Terkonfirmasi';
            case 'in_progress': return 'Sedang Diperiksa';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    const getLayananLabel = (type: string) => {
        if (type === 'pregnancy') return 'ANC / Ibu Hamil';
        if (type === 'child_development') return 'Imunisasi / Tumbuh Kembang';
        return 'Layanan Umum';
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
                {/* Header Background */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

                {/* Sticky Header Nav */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/orangtua/home" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Riwayat Konsultasi</h1>
                    <div className="w-10 h-10"></div>
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-28">
                    {/* Intro Section */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col mb-6 mt-4">
                        <h2 className="text-base font-extrabold text-slate-800 mb-1.5 leading-snug">
                            History Booking Anda
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Lihat seluruh riwayat pengajuan dan jadwal konsultasi Anda bersama Bidan Posyandu di sini.
                        </p>
                    </div>

                    {/* Stack History Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-3.5 px-2">Daftar Riwayat</h3>
                        
                        <div className="flex flex-col gap-4">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <span className="text-xs font-bold text-slate-500">Memuat riwayat...</span>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 rounded-3xl p-8 border border-red-100 text-center text-xs text-red-500 font-medium">
                                    Gagal memuat riwayat booking.
                                </div>
                            ) : historyList.length > 0 ? (
                                historyList.map((item: any) => {
                                    const d = new Date(item.scheduled_at);
                                    const h = String(d.getUTCHours()).padStart(2, '0');
                                    const m = String(d.getUTCMinutes()).padStart(2, '0');
                                    const timeStr = `${h}.${m} WIB`;
                                    const displayName = item.children_name || item.parent_name || 'Pasien';

                                    return (
                                        <div key={item.id} className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-3.5 hover:shadow-[0_6px_18px_rgb(0,0,0,0.04)] transition-all relative overflow-hidden">
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                                {item.queue_number && (
                                                    <span className="text-xs.5 font-extrabold text-[#1E3050] bg-slate-100 px-2.5 py-1 rounded-lg">
                                                        Q-{String(item.queue_number).padStart(3, '0')}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-0.5">
                                                <h4 className="text-sm font-bold text-slate-800 truncate leading-tight">
                                                    {item.midwife_name || item.posyandu_name || 'Bidan Posyandu'}
                                                </h4>
                                                <p className="text-[11px] text-slate-450 font-bold mt-0.5">
                                                    Pasien: <span className="text-blue-600 font-extrabold">{displayName}</span>
                                                </p>
                                            </div>

                                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 flex flex-col gap-2">
                                                <div className="text-xs font-semibold text-slate-650 flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase w-14 shrink-0">Layanan</span>
                                                    <span className="text-slate-800 font-bold">{getLayananLabel(item.consultation_type)}</span>
                                                </div>
                                                <div className="text-xs font-semibold text-slate-650 flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase w-14 shrink-0">Tanggal</span>
                                                    <span className="text-slate-800 font-bold">{formatDateIndo(item.scheduled_at)}</span>
                                                </div>
                                                <div className="text-xs font-semibold text-slate-650 flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase w-14 shrink-0">Jam</span>
                                                    <span className="text-indigo-600 font-extrabold">{timeStr}</span>
                                                </div>
                                            </div>
                                            
                                            {item.cancellation_reason && item.status === 'cancelled' && (
                                                <div className="bg-red-50 p-3 rounded-2xl border border-red-100/50 mt-1">
                                                    <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Alasan Pembatalan:</p>
                                                    <p className="text-xs font-medium text-red-700">{item.cancellation_reason}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-medium">
                                    Belum ada riwayat pengajuan konsultasi.
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {historyList.length > 0 && !isLoading && !error && (
                                <div className="flex justify-between items-center py-2 mt-2 px-1">
                                    <button 
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${page === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50 cursor-pointer shadow-sm'}`}
                                    >
                                        Sebelumnya
                                    </button>
                                    <span className="text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                        Halaman {page}
                                    </span>
                                    <button 
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={historyList.length < 5}
                                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${historyList.length < 5 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50 cursor-pointer shadow-sm'}`}
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <BottombarOrtu />
            </div>
        </div>
    );
}
