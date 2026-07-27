'use client';

import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import {
  useGetOrangTuaChildById,
  useGetOrangTuaImmunizationRecords,
  useGetOrangTuaVaccines,
  useGetOrangTuaNutritionRecords,
} from "@/hooks/query/orangtua/useOrangTuaChildren";
import axios from "axios";

interface UIHistoryItem {
    id: string;
    tanggal: string;
    jenis: string;
    status: 'Selesai' | 'Terjadwal' | 'Ditunda';
    keterangan: string;
    dose_number: number;
    batch_number: string;
    kipi_status: boolean;
    location_type: string;
    measurement_date?: string;
    age_months?: number | null;
    weight_kg?: string | null;
    height_cm?: string | null;
    head_circumference_cm?: string | null;
    nutrition_status?: string | null;
}

function BuatDataImunisasiContent() {
    const searchParams = useSearchParams();
    const bayiIdParam = searchParams.get('bayiId') || "";

    // Collapsible states - default to true
    const [showHistory, setShowHistory] = useState(true);

    // Selected immunization record for modal view
    const [selectedItem, setSelectedItem] = useState<UIHistoryItem | null>(null);

    // Fetch child by ID
    const { data: child, isLoading: isChildLoading, error: childError } = useGetOrangTuaChildById(bayiIdParam);

    // Fetch immunization records for the child
    const { data: immunizationResponse, isLoading: isImmunizationLoading } = useGetOrangTuaImmunizationRecords({ 
        children_id: bayiIdParam 
    });

    // Fetch vaccine types to map IDs to Names
    const { data: vaccinesResponse } = useGetOrangTuaVaccines();

    // Fetch all child nutrition/measurement records to match by date
    const { data: nutritionResponse } = useGetOrangTuaNutritionRecords({
        children_id: bayiIdParam
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

    const apiError = getErrorMessage(childError);

    const calculateAge = (birthDateStr?: string | null) => {
        if (!birthDateStr) return "-";
        const birthDate = new Date(birthDateStr);
        const today = new Date();
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

    const formatDateIndo = (dateStr?: string | null) => {
        if (!dateStr) return "-";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "-";
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return "-";
        }
    };

    const getStatusColor = (statusVal: string) => {
        switch (statusVal) {
            case 'Selesai':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Terjadwal':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Ditunda':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    if (isChildLoading) {
        return (
            <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
                <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200 justify-center items-center">
                    <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    if (!child) {
        return (
            <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
                <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200 justify-center items-center text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h2 className="font-bold text-slate-800 mb-2">Bayi tidak ditemukan</h2>
                    <p className="text-sm text-slate-500 mb-6">Data bayi tidak ada atau ID tidak valid.</p>
                    <Link href="/orangtua/data-imunisasi" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-colors">
                        Kembali
                    </Link>
                </div>
            </div>
        );
    }

    const matchedBaby = {
        id: child.id,
        nama: child.name,
        nik: child.identity_number,
        umur: calculateAge(child.birth_date),
        kelamin: child.gender === 'male' ? 'Laki-laki' : 'Perempuan',
        tanggalLahir: formatDateIndo(child.birth_date),
        ibu: child.mother_name || "-",
        posyandu: child.posyandu_detail?.name || "-",
        terakhirDiperbarui: formatDateIndo(child.updated_at)
    };

    // Extract vaccines and nutrition records from response
    const vaccinesList = vaccinesResponse?.data?.data || [];
    const immunizationRecordsList = immunizationResponse?.data || [];
    const nutritionRecordsList = nutritionResponse?.data || [];

    // Map records to UI HistoryItems
    const historyList: UIHistoryItem[] = immunizationRecordsList.map((rec) => {
        const matchingVaccine = vaccinesList.find((v) => v.id === rec.vaccine_id);
        const statusMap: Record<string, 'Selesai' | 'Terjadwal' | 'Ditunda'> = {
            completed: 'Selesai',
            scheduled: 'Terjadwal',
            not_yet: 'Ditunda',
            missed: 'Ditunda'
        };
        const locationMap: Record<string, string> = {
            posyandu: 'Posyandu',
            puskesmas: 'Puskesmas',
            pustu: 'Pustu',
            home: 'Rumah',
            school: 'Sekolah',
            paud: 'PAUD',
            kindergarten: 'TK',
            daycare: 'Daycare'
        };

        // Find matching child measurement/nutrition record by date
        const matchingNutrition = nutritionRecordsList.find((nut) => {
            if (!rec.date_given || !nut.measurement_date) return false;
            const recDate = new Date(rec.date_given).toISOString().split('T')[0];
            const nutDate = new Date(nut.measurement_date).toISOString().split('T')[0];
            return recDate === nutDate;
        });

        return {
            id: rec.id,
            tanggal: rec.date_given ? new Date(rec.date_given).toISOString().split('T')[0] : '',
            jenis: matchingVaccine?.name || 'Vaksin Tidak Dikenal',
            status: statusMap[rec.status] || 'Ditunda',
            keterangan: rec.notes || '',
            dose_number: rec.dose_number,
            batch_number: rec.batch_number || '-',
            kipi_status: rec.kipi_status,
            location_type: rec.location_type ? (locationMap[rec.location_type] || rec.location_type) : '-',
            measurement_date: matchingNutrition?.measurement_date || undefined,
            age_months: matchingNutrition?.age_months || null,
            weight_kg: matchingNutrition?.weight_kg || null,
            height_cm: matchingNutrition?.height_cm || null,
            head_circumference_cm: matchingNutrition?.head_circumference_cm || null,
            nutrition_status: matchingNutrition?.nutrition_status || null
        };
    });

    const birthDateParts = matchedBaby.tanggalLahir.split(' ');
    const day = birthDateParts[0] || '';
    const month = birthDateParts[1]?.slice(0, 3) || '';
    const displayBirthDate = month ? `${day} ${month}` : day;

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header Background */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

                {/* Sticky Nav Header */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/orangtua/data-imunisasi" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Imunisasi Bayi</h1>
                    <div className="w-10 h-10"></div> {/* Spacing balance */}
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-28">

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

                    {/* Profile Card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex flex-col items-center mb-6 border border-slate-100">
                        <div className="w-24 h-24 rounded-full bg-pink-100 border-[6px] border-white shadow-md flex items-center justify-center mb-4 -mt-16 text-pink-500">
                            {matchedBaby.kelamin === 'Laki-laki' ? (
                                <div className="w-24 h-24 rounded-full bg-blue-100 border-[6px] border-white shadow-md flex items-center justify-center text-blue-500 font-bold text-4xl">
                                    {matchedBaby.nama.charAt(0)}
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-pink-100 border-[6px] border-white shadow-md flex items-center justify-center text-pink-500 font-bold text-4xl">
                                    {matchedBaby.nama.charAt(0)}
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800 mb-1.5 text-center leading-tight">
                            {matchedBaby.nama}
                        </h2>

                        <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold mb-5 border border-blue-100">
                            NIK: {matchedBaby.nik}
                        </div>

                        <div className="w-full grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
                            <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Umur</span>
                                <span className="text-xs font-bold text-slate-800">{matchedBaby.umur}</span>
                            </div>
                            <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Kelamin</span>
                                <span className="text-xs font-bold text-slate-800 truncate max-w-full">{matchedBaby.kelamin}</span>
                            </div>
                            <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Tgl Lahir</span>
                                <span className="text-[10px] font-bold text-slate-800 truncate max-w-full">{displayBirthDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Administrative Info Card */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Data Ibu & Lokasi</h3>
                        <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-xs font-semibold text-slate-500">Nama Ibu</span>
                                <span className="text-xs font-bold text-slate-850 text-right">{matchedBaby.ibu}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-xs font-semibold text-slate-500">Nama Posyandu</span>
                                <span className="text-xs font-bold text-slate-850 text-right">{matchedBaby.posyandu}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-slate-500">Terakhir Diperbarui</span>
                                <span className="text-xs font-bold text-slate-850 text-right">{matchedBaby.terakhirDiperbarui}</span>
                            </div>
                        </div>
                    </div>

                    {/* History Collapsible Section */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => setShowHistory(!showHistory)}
                            className="w-full flex justify-between items-center px-2 py-1 mb-3 transition-colors active:opacity-75 focus:outline-none"
                        >
                            <h3 className="text-sm font-bold text-slate-800">Riwayat Imunisasi</h3>
                            <div className={`p-1.5 rounded-lg bg-slate-100 text-slate-500 transition-transform duration-350 ${showHistory ? 'rotate-180' : ''}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {showHistory && (
                            <div className="flex flex-col gap-3.5 animate-fade-in">
                                {isImmunizationLoading ? (
                                    Array.from({ length: 2 }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-3 animate-pulse"
                                        >
                                            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                                            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                                            <div className="h-8 bg-slate-100 rounded-xl"></div>
                                        </div>
                                    ))
                                ) : historyList.length > 0 ? (
                                    historyList.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-3"
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <h4 className="text-sm font-extrabold text-slate-800 leading-tight">
                                                        {item.jenis}
                                                    </h4>
                                                    <span className="text-[10px] text-slate-400 font-bold">
                                                        {formatDateIndo(item.tanggal)}
                                                    </span>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </div>

                                            {item.keterangan && (
                                                <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 leading-relaxed font-medium">
                                                    {item.keterangan}
                                                </p>
                                            )}

                                            <div className="flex justify-end gap-2.5 border-t border-slate-50 pt-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedItem(item)}
                                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer"
                                                >
                                                    Lihat Detail
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center text-xs text-slate-400 font-medium">
                                        Belum ada riwayat imunisasi terdaftar.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Modal */}
                {selectedItem && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                        <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <h3 className="text-base font-extrabold text-slate-800">Detail Imunisasi</h3>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body: Grid of Details */}
                            <div className="flex flex-col gap-4">
                                {/* Vaccine Name & Status */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-base font-extrabold text-slate-800 leading-tight">
                                            {selectedItem.jenis}
                                        </h4>
                                        <span className="text-xs text-slate-400 font-semibold">
                                            Dosis Ke-{selectedItem.dose_number}
                                        </span>
                                    </div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(selectedItem.status)}`}>
                                        {selectedItem.status}
                                    </span>
                                </div>

                                {/* Section 1: Detail Imunisasi */}
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Detail Imunisasi</h4>
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
                                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                                            <span className="text-xs font-semibold text-slate-500">Tanggal Entry</span>
                                            <span className="text-xs font-bold text-slate-700">{formatDateIndo(selectedItem.tanggal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                                            <span className="text-xs font-semibold text-slate-500">Lokasi Imunisasi</span>
                                            <span className="text-xs font-bold text-slate-700">{selectedItem.location_type}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                                            <span className="text-xs font-semibold text-slate-500">Nomor Batch Vaksin</span>
                                            <span className="text-xs font-mono font-bold text-slate-700">{selectedItem.batch_number}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-slate-500">Kondisi KIPI</span>
                                            <span className={`text-xs font-bold ${selectedItem.kipi_status ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                {selectedItem.kipi_status ? 'Ada Gejala KIPI' : 'Tidak Ada Gejala KIPI'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Detail Tumbuh Kembang */}
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Detail Tumbuh Kembang</h4>
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
                                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                                            <span className="text-xs font-semibold text-slate-500">Tanggal Pengukuran</span>
                                            <span className="text-xs font-bold text-slate-700">
                                                {selectedItem.measurement_date ? formatDateIndo(selectedItem.measurement_date) : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                                            <span className="text-xs font-semibold text-slate-500">Usia Saat Ukur</span>
                                            <span className="text-xs font-bold text-slate-700">
                                                {selectedItem.age_months != null ? `${selectedItem.age_months} Bulan` : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                                            <span className="text-xs font-semibold text-slate-500">Berat Badan Sekarang</span>
                                            <span className="text-xs font-bold text-slate-700">
                                                {selectedItem.weight_kg ? `${selectedItem.weight_kg} kg` : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                                            <span className="text-xs font-semibold text-slate-500">Tinggi Badan Sekarang</span>
                                            <span className="text-xs font-bold text-slate-700">
                                                {selectedItem.height_cm ? `${selectedItem.height_cm} cm` : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-200/60 pb-2.5">
                                            <span className="text-xs font-semibold text-slate-500">Lingkar Kepala</span>
                                            <span className="text-xs font-bold text-slate-700">
                                                {selectedItem.head_circumference_cm ? `${selectedItem.head_circumference_cm} cm` : '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-slate-500">Status Gizi Anak</span>
                                            <span className="text-xs font-bold text-slate-700 uppercase">
                                                {selectedItem.nutrition_status || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                {selectedItem.keterangan && (
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Keterangan / Catatan</span>
                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed text-xs text-slate-600 font-medium">
                                            {selectedItem.keterangan}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer Button */}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-full bg-blue-600 text-white font-extrabold text-xs py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(37,99,235,0.15)] flex justify-center items-center cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}

                {/* Bottom Navigation */}
                <BottombarOrtu />
            </div>
        </div>
    );
}

export default function BuatDataImunisasi() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <BuatDataImunisasiContent />
        </Suspense>
    );
}
