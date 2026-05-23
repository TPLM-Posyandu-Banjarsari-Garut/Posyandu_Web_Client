'use client';

import BottombarKader from '@/components/ui/bottombar/kader/BottombarKader';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

// Interfaces
interface HistoryItem {
    id: number;
    tanggal: string;
    jenis: string;
    status: 'Selesai' | 'Terjadwal' | 'Ditunda';
    keterangan: string;
}
// pada jenis imunisasi buat bisa create jenis imunisasi,update,delete dan tambahkan search juga jenis imunisasi lalu untuk history imu
interface BabyDetail {
    id: number;
    nama: string;
    nik: string;
    umur: string;
    kelamin: 'Laki-laki' | 'Perempuan';
    tanggalLahir: string;
    orangTua: string;
    posyandu: string;
    terakhirDiperbarui: string;
}

function BuatDataImunisasiContent() {
    const searchParams = useSearchParams();
    const bayiIdParam = searchParams.get('bayiId');
    const namaParam = searchParams.get('nama');

    // List of premium dummy babies database
    const babiesDb: BabyDetail[] = [
        {
            id: 1,
            nama: 'Ahmad Rafli',
            nik: '3201010101010001',
            umur: '6 Bulan',
            kelamin: 'Laki-laki',
            tanggalLahir: '15 November 2025',
            orangTua: 'Siti Aminah & Hendra',
            posyandu: 'Posyandu Mawar',
            terakhirDiperbarui: '18 Mei 2026'
        },
        {
            id: 2,
            nama: 'Siti Maryam',
            nik: '3201010101010002',
            umur: '4 Bulan',
            kelamin: 'Perempuan',
            tanggalLahir: '10 Januari 2026',
            orangTua: 'Budi Santoso & Ratna',
            posyandu: 'Posyandu Melati',
            terakhirDiperbarui: '20 Mei 2026'
        },
        {
            id: 3,
            nama: 'Budi Santoso',
            nik: '3201010101010003',
            umur: '9 Bulan',
            kelamin: 'Laki-laki',
            tanggalLahir: '22 Agustus 2025',
            orangTua: 'Dewi Lestari & Joko',
            posyandu: 'Posyandu Mawar',
            terakhirDiperbarui: '15 Mei 2026'
        },
        {
            id: 4,
            nama: 'Keysha Putri',
            nik: '3201010101010004',
            umur: '3 Bulan',
            kelamin: 'Perempuan',
            tanggalLahir: '12 Februari 2026',
            orangTua: 'Hendra Wijaya & Rina',
            posyandu: 'Posyandu Anggrek',
            terakhirDiperbarui: '21 Mei 2026'
        },
        {
            id: 5,
            nama: 'Rian Hidayat',
            nik: '3201010101010005',
            umur: '12 Bulan',
            kelamin: 'Laki-laki',
            tanggalLahir: '10 Mei 2025',
            orangTua: 'Mulyadi & Tini',
            posyandu: 'Posyandu Melati',
            terakhirDiperbarui: '10 Mei 2026'
        },
        {
            id: 6,
            nama: 'Aditya Pratama',
            nik: '3201010101010006',
            umur: '5 Bulan',
            kelamin: 'Laki-laki',
            tanggalLahir: '25 Desember 2025',
            orangTua: 'Yusuf & Siska',
            posyandu: 'Posyandu Anggrek',
            terakhirDiperbarui: '21 Mei 2026'
        }
    ];

    // Find current baby or default to index 0
    const matchedBaby = babiesDb.find(b => b.id === Number(bayiIdParam)) ||
        babiesDb.find(b => b.nama.toLowerCase() === namaParam?.toLowerCase()) ||
        babiesDb[0];

    // Immunization standard list state
    const [immunizationList, setImmunizationList] = useState<string[]>([
        'BCG (Tuberculosis)',
        'Polio 1 (OPV)',
        'Polio 2 (OPV)',
        'Polio 3 (OPV)',
        'Polio 4 (OPV)',
        'Hepatitis B',
        'DPT-HB-Hib 1',
        'DPT-HB-Hib 2',
        'DPT-HB-Hib 3',
        'Campak / MR',
        'IPV (Inactivated Polio Vaccine)',
        'PCV 1',
        'PCV 2'
    ]);

    // Collapsible states
    const [showHistory, setShowHistory] = useState(false);

    // Dynamic Mock History state
    const [history, setHistory] = useState<HistoryItem[]>([
        { id: 101, tanggal: '2026-01-20', jenis: 'Hepatitis B', status: 'Selesai', keterangan: 'Kondisi bayi sangat sehat saat disuntik' },
        { id: 102, tanggal: '2026-02-18', jenis: 'BCG (Tuberculosis)', status: 'Selesai', keterangan: 'Muncul bekas suntikan normal' },
        { id: 103, tanggal: '2026-03-20', jenis: 'Polio 1 (OPV)', status: 'Selesai', keterangan: 'Vaksin tetes lancar' }
    ]);

    // Form inputs state
    const [tanggalEntry, setTanggalEntry] = useState('');
    const [jenisImunisasi, setJenisImunisasi] = useState('BCG (Tuberculosis)');
    const [status, setStatus] = useState<'Selesai' | 'Terjadwal' | 'Ditunda'>('Selesai');
    const [keterangan, setKeterangan] = useState('');

    // Editing State
    const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);

    // Notification states
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);



    // Prefill date with today's date in YYYY-MM-DD format
    useEffect(() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setTanggalEntry(`${yyyy}-${mm}-${dd}`);
    }, []);

    // Set form fields if editing
    useEffect(() => {
        if (editingItem) {
            setTanggalEntry(editingItem.tanggal);
            setJenisImunisasi(editingItem.jenis);
            setStatus(editingItem.status);
            setKeterangan(editingItem.keterangan);
        } else {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            setTanggalEntry(`${yyyy}-${mm}-${dd}`);
            setJenisImunisasi(immunizationList[0] || '');
            setStatus('Selesai');
            setKeterangan('');
        }
    }, [editingItem]);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2500);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            // Update mode
            setHistory(prev => prev.map(item =>
                item.id === editingItem.id
                    ? { ...item, tanggal: tanggalEntry, jenis: jenisImunisasi, status, keterangan }
                    : item
            ));
            triggerToast('Data Imunisasi berhasil diperbarui!');
            setEditingItem(null);
        } else {
            // Create mode
            const newItem: HistoryItem = {
                id: Date.now(),
                tanggal: tanggalEntry,
                jenis: jenisImunisasi,
                status,
                keterangan
            };
            setHistory(prev => [newItem, ...prev]);
            triggerToast('Data Imunisasi baru berhasil ditambahkan!');
        }

        // Reset inputs
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        setTanggalEntry(`${yyyy}-${mm}-${dd}`);
        setJenisImunisasi(immunizationList[0] || '');
        setStatus('Selesai');
        setKeterangan('');
    };

    const handleEditItem = (item: HistoryItem) => {
        setEditingItem(item);
        // Scroll to form nicely
        const formEl = document.getElementById('imunisasi-form');
        if (formEl) {
            formEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDeleteItem = (id: number) => {
        if (editingItem?.id === id) {
            setEditingItem(null);
        }
        setHistory(prev => prev.filter(item => item.id !== id));
        triggerToast('Data Imunisasi berhasil dihapus!');
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

                {/* Sticky Nav Header */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/kader/data-imunisasi" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Imunisasi Bayi</h1>
                    <div className="w-10 h-10"></div> {/* Spacing balance */}
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-28">

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
                                <span className="text-[10px] font-bold text-slate-800 truncate max-w-full">{matchedBaby.tanggalLahir.split(' ')[0]} {matchedBaby.tanggalLahir.split(' ')[1].slice(0, 3)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Administrative Info Card */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Data Orang Tua & Lokasi</h3>
                        <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-xs font-semibold text-slate-500">Nama Orang Tua</span>
                                <span className="text-xs font-bold text-slate-850 text-right">{matchedBaby.orangTua}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-xs font-semibold text-slate-500">Nama Posyandu</span>
                                <span className="text-xs font-bold text-slate-850 text-right">{matchedBaby.posyandu}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-slate-500">Terakhir Diperbarui</span>
                                <span className="text-xs font-bold text-slate-850 text-right">{formatDateIndo(matchedBaby.terakhirDiperbarui)}</span>
                            </div>
                        </div>
                    </div>

                    {/* History Collapsible Section */}
                    <div className="mb-6">
                        <button
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
                                {history.length > 0 ? (
                                    history.map((item) => (
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
                                                    onClick={() => handleEditItem(item)}
                                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                                                >
                                                    Hapus
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

                    {/* Entry Form */}
                    <div id="imunisasi-form" className="scroll-mt-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">
                            {editingItem ? 'Edit Data Imunisasi' : 'Input Data Imunisasi'}
                        </h3>

                        <form onSubmit={handleFormSubmit} className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-4">

                            {/* Tanggal Entry */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Entry</label>
                                <div className="relative h-[3.25rem] w-full overflow-hidden">
                                    <input
                                        type="date"
                                        value={tanggalEntry}
                                        onChange={(e) => setTanggalEntry(e.target.value)}
                                        className="absolute inset-0 h-full w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all [color-scheme:light]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Jenis Imunisasi */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jenis Imunisasi</label>
                                <div className="relative">
                                    <select
                                        value={jenisImunisasi}
                                        onChange={(e) => setJenisImunisasi(e.target.value)}
                                        className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-705 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all appearance-none"
                                        required
                                    >
                                        {immunizationList.map((imun) => (
                                            <option key={imun} value={imun}>{imun}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as 'Selesai' | 'Terjadwal' | 'Ditunda')}
                                        className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-705 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all appearance-none"
                                        required
                                    >
                                        <option value="Selesai">Selesai</option>
                                        <option value="Terjadwal">Terjadwal</option>
                                        <option value="Ditunda">Ditunda</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Keterangan */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan / Catatan</label>
                                <textarea
                                    value={keterangan}
                                    onChange={(e) => setKeterangan(e.target.value)}
                                    placeholder="Masukkan keterangan detail (misalnya: suhu tubuh normal, dll)..."
                                    className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400 min-h-[5rem] resize-none"
                                />
                            </div>

                            {/* Form Submission Button */}
                            <div className="flex gap-3.5 pt-2">
                                {editingItem && (
                                    <button
                                        type="button"
                                        onClick={() => setEditingItem(null)}
                                        className="w-1/3 bg-slate-100 text-slate-600 font-bold text-sm py-4 rounded-[1.25rem] hover:bg-slate-200 active:scale-95 transition-all text-center"
                                    >
                                        Batal
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className={`font-bold text-sm py-4 rounded-[1.25rem] active:scale-95 transition-all flex justify-center items-center gap-2 ${editingItem
                                        ? 'w-2/3 bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700'
                                        : 'w-full bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700'
                                        }`}
                                >
                                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    {editingItem ? 'Update Imunisasi' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>



                {/* Toast Notification */}
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
                <BottombarKader />
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
