'use client';

import { useState } from 'react';
import Link from 'next/link';
import BottombarBidan from '@/components/ui/bottombar/bidan/BottombarBidan';
import DateFilterInput from '@/components/ui/DateFilterInput';
import { FilterHalf, FilterRow } from '@/components/ui/FilterRow';
import { useGetMidwifeProfile } from '@/hooks/query/midwife/useMidwifeProfile';
import {
    useGetMidwifeConsultations,
    useUpdateConsultationStatus
} from '@/hooks/query/midwife/useMidwifeConsultations';
import { MidwifeConsultation } from '@/service/midwife/midwifeService';

export default function JadwalKonsultasiPage() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [page, setPage] = useState(1);

    const { data: profile, isLoading: isLoadingProfile } = useGetMidwifeProfile();
    const midwife_id = profile?.id;

    const { data: consultationsResponse, isLoading: isLoadingConsultations, error } = useGetMidwifeConsultations(
        {
            midwife_id,
            status: status || undefined,
            search: search || undefined,
            page,
            limit: 50
        },
        !!midwife_id
    );

    const updateStatusMutation = useUpdateConsultationStatus();

    const consultations = consultationsResponse?.data || [];

    // Client-side date filter
    const filteredConsultations = consultations.filter((item: MidwifeConsultation) => {
        if (!date) return true;
        const itemDateString = item.scheduled_at.split('T')[0];
        return itemDateString === date;
    });

    const getLayananLabel = (type: string) => {
        if (type === 'pregnancy') return 'ANC / Ibu Hamil';
        if (type === 'child_development') return 'Imunisasi / Tumbuh Kembang';
        return 'Layanan Umum';
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'confirmed':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'in_progress':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'completed':
                return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'cancelled':
            default:
                return 'bg-red-50 text-red-600 border-red-100';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Menunggu';
            case 'confirmed':
                return 'Terkonfirmasi';
            case 'in_progress':
                return 'Sedang Diperiksa';
            case 'completed':
                return 'Selesai';
            case 'cancelled':
                return 'Ditolak / Batal';
            default:
                return status;
        }
    };

    // Helper to format date & time strictly in UTC
    const formatUtcDateTime = (isoString: string) => {
        const d = new Date(isoString);
        const dateStr = d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
        });
        
        const h = String(d.getUTCHours()).padStart(2, '0');
        const m = String(d.getUTCMinutes()).padStart(2, '0');
        const timeStr = `${h}.${m}`;

        return { dateStr, timeStr };
    };

    const handleUpdateStatus = (publicId: string, newStatus: string) => {
        if (confirm(`Apakah Anda yakin ingin mengubah status janji temu ini menjadi ${getStatusLabel(newStatus)}?`)) {
            updateStatusMutation.mutate({
                publicId,
                status: newStatus,
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md min-w-0 bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/bidan/home" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Jadwal Konsultasi</h1>
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
                                placeholder="Cari nama ibu atau anak..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <FilterRow>
                            <FilterHalf>
                                <DateFilterInput value={date} onChange={(val: string) => setDate(val)} />
                            </FilterHalf>
                            <FilterHalf>
                                <div className="relative h-[3.25rem] w-full overflow-hidden">
                                    <select
                                        className="filter-select-input absolute inset-0 h-full w-full box-border px-3 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-[0_2px_10px_rgb(0,0,0,0.02)] appearance-none"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="pending">Menunggu</option>
                                        <option value="confirmed">Terkonfirmasi</option>
                                        <option value="in_progress">Sedang Diperiksa</option>
                                        <option value="completed">Selesai</option>
                                        <option value="cancelled">Ditolak / Batal</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </FilterHalf>
                        </FilterRow>
                    </div>

                    {/* Stack Data */}
                    <div className="flex flex-col gap-4">
                        {isLoadingProfile || isLoadingConsultations ? (
                            <div className="flex flex-col items-center py-10">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <span className="text-xs font-bold text-slate-500">Memuat data jadwal...</span>
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 text-xs font-bold text-red-500">
                                Gagal memuat data konsultasi.
                            </div>
                        ) : filteredConsultations.length === 0 ? (
                            <div className="text-center py-10 text-xs font-bold text-slate-400">
                                Tidak ada jadwal konsultasi.
                            </div>
                        ) : (
                            filteredConsultations.map((item: MidwifeConsultation) => {
                                const { dateStr, timeStr } = formatUtcDateTime(item.scheduled_at);
                                const displayName = item.children_name || item.parent_name || 'Pasien';

                                return (
                                    <div key={item.id} className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-4 relative overflow-hidden">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-start gap-2">
                                                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border ${getStatusBadge(item.status)}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                                {item.queue_number && (
                                                    <span className="text-xs.5 font-extrabold text-[#1E3050] bg-slate-100 px-2.5 py-1 rounded-lg">
                                                        Q-{String(item.queue_number).padStart(3, '0')}
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-base font-bold text-slate-800 leading-snug mt-1">{displayName}</h2>
                                            
                                            {item.children_name && item.parent_name && (
                                                <p className="text-[11px] text-slate-500 font-semibold -mt-1">
                                                    Orangtua: {item.parent_name}
                                                </p>
                                            )}

                                            <div className="flex flex-col gap-2 mt-2">
                                                <div className="flex items-center gap-2 text-slate-650 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase w-14 shrink-0">Layanan</span>
                                                    <span className="text-xs font-medium text-slate-700">{getLayananLabel(item.consultation_type)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-650 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase w-14 shrink-0">Posyandu</span>
                                                    <span className="text-xs font-medium text-slate-700">{item.posyandu_name || 'Posyandu'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-650 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase w-14 shrink-0">Tanggal</span>
                                                    <span className="text-xs font-medium text-slate-700">{dateStr}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-650 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase w-14 shrink-0">Jam</span>
                                                    <span className="text-xs font-medium text-slate-700">{timeStr} WIB</span>
                                                </div>
                                                {item.notes && (
                                                    <div className="flex items-start gap-2 text-slate-650 bg-amber-50/45 p-2.5 rounded-xl border border-amber-100/50">
                                                        <span className="text-[10px] font-bold text-amber-600/70 uppercase w-14 shrink-0 mt-0.5">Catatan</span>
                                                        <span className="text-xs font-medium text-slate-700 leading-normal">{item.notes}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action buttons based on status */}
                                        {item.status === 'pending' && (
                                            <div className="flex gap-2 mt-2 pt-4 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'confirmed')}
                                                    className="flex-1 bg-blue-600 text-white text-xs font-bold px-4 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-1.5 shadow-sm cursor-pointer"
                                                >
                                                    Konfirmasi
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'cancelled')}
                                                    className="flex-1 bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-xl hover:bg-red-100 hover:text-red-700 active:scale-95 transition-all flex justify-center items-center gap-1.5 cursor-pointer"
                                                >
                                                    Tolak
                                                </button>
                                            </div>
                                        )}

                                        {item.status === 'confirmed' && (
                                            <div className="flex gap-2 mt-2 pt-4 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'in_progress')}
                                                    className="flex-1 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all flex justify-center items-center gap-1.5 shadow-sm cursor-pointer"
                                                >
                                                    Mulai Periksa
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'cancelled')}
                                                    className="flex-1 bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-xl hover:bg-red-100 hover:text-red-700 active:scale-95 transition-all flex justify-center items-center gap-1.5 cursor-pointer"
                                                >
                                                    Batalkan
                                                </button>
                                            </div>
                                        )}

                                        {item.status === 'in_progress' && (
                                            <div className="flex gap-2 mt-2 pt-4 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleUpdateStatus(item.id, 'completed')}
                                                    className="w-full bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all flex justify-center items-center gap-1.5 shadow-sm cursor-pointer"
                                                >
                                                    Selesaikan Pemeriksaan
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Fixed (+) Button */}
                <div className="fixed bottom-[100px] w-full max-w-md mx-auto z-40 pointer-events-none flex justify-end px-6 left-1/2 -translate-x-1/2">
                    <Link href="/bidan/buat-jadwal-konsultasi" className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all pointer-events-auto">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    </Link>
                </div>

                <BottombarBidan />
            </div>
        </div>
    );
}
