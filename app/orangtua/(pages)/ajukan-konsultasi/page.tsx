'use client';

import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Interfaces
interface KonsultasiItem {
    id: number;
    bidan: string;
    namaBayi: string;
    tanggal: string;
    jamMulai: string;
    jamSelesai: string;
}

export default function AjukanKonsultasi() {
    // Initial dummy history
    const [historyList, setHistoryList] = useState<KonsultasiItem[]>([
        {
            id: 1,
            bidan: 'Bidan Siti Rahma, A.Md.Keb',
            namaBayi: 'Ahmad Rafli',
            tanggal: '2026-05-25',
            jamMulai: '09:00',
            jamSelesai: '10:00'
        },
        {
            id: 2,
            bidan: 'Bidan Sri Wahyuni, A.Md.Keb',
            namaBayi: 'Ahmad Rafli',
            tanggal: '2026-05-20',
            jamMulai: '14:00',
            jamSelesai: '15:00'
        }
    ]);

    // Master databases
    const babiesDb = ['Ahmad Rafli', 'Siti Maryam', 'Budi Santoso'];
    const midwivesDb = [
        'Bidan Siti Rahma, A.Md.Keb',
        'Bidan Sri Wahyuni, A.Md.Keb',
        'Bidan Dian Lestari, S.ST'
    ];

    // State of overlay modal
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<KonsultasiItem | null>(null);

    // Form inputs state
    const [namaBayi, setNamaBayi] = useState(babiesDb[0]);
    const [tanggal, setTanggal] = useState('');
    const [jamMulai, setJamMulai] = useState('08:00');
    const [jamSelesai, setJamSelesai] = useState('09:00');
    const [bidan, setBidan] = useState(midwivesDb[0]);

    // Toast feedback state
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Set today's date as default in form
    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setTanggal(`${yyyy}-${mm}-${dd}`);
    }, []);

    // Set form fields if editing
    useEffect(() => {
        if (editingItem) {
            setNamaBayi(editingItem.namaBayi);
            setTanggal(editingItem.tanggal);
            setJamMulai(editingItem.jamMulai);
            setJamSelesai(editingItem.jamSelesai);
            setBidan(editingItem.bidan);
        } else {
            setNamaBayi(babiesDb[0]);
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            setTanggal(`${yyyy}-${mm}-${dd}`);
            setJamMulai('08:00');
            setJamSelesai('09:00');
            setBidan(midwivesDb[0]);
        }
    }, [editingItem]);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2500);
    };

    const handleOpenCreateForm = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleOpenEditForm = (item: KonsultasiItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleDeleteItem = (id: number) => {
        setHistoryList(prev => prev.filter(item => item.id !== id));
        triggerToast('Pengajuan konsultasi berhasil dihapus!');
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            // Edit Mode
            setHistoryList(prev => prev.map(item =>
                item.id === editingItem.id
                    ? { ...item, namaBayi, tanggal, jamMulai, jamSelesai, bidan }
                    : item
            ));
            triggerToast('Jadwal konsultasi berhasil diperbarui!');
        } else {
            // Create Mode
            const newItem: KonsultasiItem = {
                id: Date.now(),
                namaBayi,
                tanggal,
                jamMulai,
                jamSelesai,
                bidan
            };
            setHistoryList(prev => [newItem, ...prev]);
            triggerToast('Konsultasi baru berhasil diajukan!');
        }

        setIsFormOpen(false);
        setEditingItem(null);
    };

    const formatDateIndo = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
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
                    <h1 className="text-lg font-bold text-white tracking-wide">Ajukan Konsultasi</h1>
                    <div className="w-10 h-10"></div> {/* Spacing balance */}
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-28">

                    {/* Intro Section */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col mb-6 mt-4">
                        <h2 className="text-base font-extrabold text-slate-800 mb-1.5 leading-snug">
                            Konsultasi Bersama Bidan
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Ajukan jadwal pertemuan tatap muka atau konsultasi langsung mengenai kesehatan buah hati Anda bersama Bidan Posyandu yang bertugas.
                        </p>
                    </div>

                    {/* Stack History Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-3.5 px-2">Riwayat Pengajuan Anda</h3>
                        
                        <div className="flex flex-col gap-4">
                            {historyList.length > 0 ? (
                                historyList.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-3.5 hover:shadow-[0_6px_18px_rgb(0,0,0,0.04)] transition-all"
                                    >
                                        {/* Midwife & Baby Name */}
                                        <div className="flex flex-col gap-0.5">
                                            <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                                                {item.bidan}
                                            </h4>
                                            <p className="text-[11px] text-slate-450 font-bold mt-0.5">
                                                Bayi: <span className="text-blue-600 font-extrabold">{item.namaBayi}</span>
                                            </p>
                                        </div>

                                        {/* Date and Time Details */}
                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 flex flex-col gap-2">
                                            {/* Date */}
                                            <div className="text-xs font-semibold text-slate-650">
                                                Tanggal: <span className="text-slate-800 font-bold">{formatDateIndo(item.tanggal)}</span>
                                            </div>
                                            {/* Consultation Hours */}
                                            <div className="text-xs font-semibold text-slate-650">
                                                Jam: <span className="text-indigo-600 font-extrabold">{item.jamMulai} - {item.jamSelesai} WIB</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-2.5 border-t border-slate-50 pt-3">
                                            <button
                                                onClick={() => handleOpenEditForm(item)}
                                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-4 py-2 rounded-lg active:scale-95 transition-all"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold px-4 py-2 rounded-lg active:scale-95 transition-all"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-medium">
                                    Belum ada riwayat pengajuan konsultasi.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Floating (+) Button for New Consultation (Fixed) */}
                <div className="fixed bottom-[96px] w-full max-w-md mx-auto z-40 pointer-events-none flex justify-end px-6 left-1/2 -translate-x-1/2">
                    <button
                        onClick={handleOpenCreateForm}
                        className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all pointer-events-auto"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Bottom Sheet Modal Overlay */}
                {isFormOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm pointer-events-auto">
                        {/* Tap outside to close */}
                        <div className="absolute inset-0 z-0" onClick={() => setIsFormOpen(false)}></div>

                        {/* Bottom Sheet Form */}
                        <form
                            onSubmit={handleFormSubmit}
                            className="relative z-10 w-full max-w-md bg-white rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col gap-4 animate-slide-up max-h-[85vh] overflow-y-auto custom-scrollbar"
                        >
                            {/* Handle Bar Indicator */}
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2 shrink-0"></div>

                            <div className="flex justify-between items-center mb-1 shrink-0">
                                <h3 className="text-base font-extrabold text-slate-800">
                                    {editingItem ? 'Update Konsultasi' : 'Ajukan Konsultasi Baru'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* 1. Dropdown Nama Bayi */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Bayi</label>
                                <div className="relative">
                                    <select
                                        value={namaBayi}
                                        onChange={(e) => setNamaBayi(e.target.value)}
                                        className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all shadow-inner"
                                        required
                                    >
                                        {babiesDb.map((b) => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Date Field (Required for Tanggal) */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</label>
                                <input
                                    type="date"
                                    value={tanggal}
                                    onChange={(e) => setTanggal(e.target.value)}
                                    className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner [color-scheme:light]"
                                    required
                                />
                            </div>

                            {/* 2 & 3. Jam Mulai & Jam Selesai */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Mulai</label>
                                    <input
                                        type="time"
                                        value={jamMulai}
                                        onChange={(e) => setJamMulai(e.target.value)}
                                        className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Selesai</label>
                                    <input
                                        type="time"
                                        value={jamSelesai}
                                        onChange={(e) => setJamSelesai(e.target.value)}
                                        className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 4. Dropdown Pilih Bidan */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Bidan</label>
                                <div className="relative">
                                    <select
                                        value={bidan}
                                        onChange={(e) => setBidan(e.target.value)}
                                        className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none transition-all shadow-inner"
                                        required
                                    >
                                        {midwivesDb.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* 5. Button Ajukan Konsultasi / Simpan Perubahan */}
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-4 rounded-xl active:scale-95 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)] mt-2 shrink-0"
                            >
                                {editingItem ? 'Simpan Perubahan' : 'Ajukan Konsultasi'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Toast Feedback Notification */}
                {showToast && (
                    <div className="absolute bottom-[92px] left-1/2 -translate-x-1/2 w-[85%] bg-slate-900/90 text-white text-xs font-bold px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-[1000] animate-fade-in backdrop-blur-sm border border-white/10">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="flex-1 text-slate-100">{toastMessage}</span>
                    </div>
                )}

                {/* Bottom Navigation */}
                <BottombarOrtu />
            </div>
        </div>
    );
}
