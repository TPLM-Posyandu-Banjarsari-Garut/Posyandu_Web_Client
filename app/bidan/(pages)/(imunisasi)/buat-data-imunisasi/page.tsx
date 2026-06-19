'use client';

import BottombarBidan from '@/components/ui/bottombar/bidan/BottombarBidan';
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

    // Manage Immunization Types State
    const [showManageModal, setShowManageModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newTypeName, setNewTypeName] = useState('');
    const [editingTypeIndex, setEditingTypeIndex] = useState<number | null>(null);
    const [editingTypeName, setEditingTypeName] = useState('');

    // Manage Immunization Types Handlers
    const handleAddType = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newTypeName.trim();
        if (!trimmed) return;
        
        if (immunizationList.some(item => item.toLowerCase() === trimmed.toLowerCase())) {
            alert('Jenis imunisasi sudah ada!');
            return;
        }
        
        setImmunizationList(prev => [...prev, trimmed]);
        setNewTypeName('');
        triggerToast('Jenis imunisasi berhasil ditambahkan!');
    };

    const handleUpdateType = (index: number) => {
        const trimmed = editingTypeName.trim();
        if (!trimmed) return;
        
        const oldName = immunizationList[index];
        if (oldName === trimmed) {
            setEditingTypeIndex(null);
            return;
        }

        if (immunizationList.some((item, idx) => idx !== index && item.toLowerCase() === trimmed.toLowerCase())) {
            alert('Jenis imunisasi sudah ada!');
            return;
        }

        setImmunizationList(prev => prev.map((item, idx) => idx === index ? trimmed : item));
        
        if (jenisImunisasi === oldName) {
            setJenisImunisasi(trimmed);
        }

        setHistory(prev => prev.map(item => 
            item.jenis === oldName ? { ...item, jenis: trimmed } : item
        ));

        setEditingTypeIndex(null);
        setEditingTypeName('');
        triggerToast('Jenis imunisasi berhasil diperbarui!');
    };

    const handleDeleteType = (nameToDelete: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus jenis imunisasi "${nameToDelete}"?`)) {
            const remainingList = immunizationList.filter(item => item !== nameToDelete);
            setImmunizationList(remainingList);
            
            if (jenisImunisasi === nameToDelete) {
                setJenisImunisasi(remainingList[0] || '');
            }
            
            triggerToast('Jenis imunisasi berhasil dihapus!');
        }
    };

    const filteredList = immunizationList.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 z-0 rounded-b-[2.5rem]"></div>

                {/* Sticky Nav Header */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/bidan/data-imunisasi" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
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
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jenis Imunisasi</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowManageModal(true)}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-750 transition-colors flex items-center gap-1 active:scale-95 duration-150 cursor-pointer"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Kelola
                                    </button>
                                </div>
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

                {/* Manage Immunization Modal */}
                {showManageModal && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end animate-fade-in">
                        <div className="bg-white w-full rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col max-h-[80%] animate-slide-up overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
                                <div>
                                    <h2 className="text-base font-bold text-slate-800">Kelola Jenis Imunisasi</h2>
                                    <p className="text-[10px] text-slate-400">Tambah, ubah, atau hapus jenis imunisasi</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowManageModal(false);
                                        setSearchQuery('');
                                        setNewTypeName('');
                                        setEditingTypeIndex(null);
                                    }}
                                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 custom-scrollbar">
                                {/* Search bar */}
                                <div className="relative shrink-0">
                                    <input
                                        type="text"
                                        placeholder="Cari jenis imunisasi..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full box-border pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Form Add New */}
                                <form onSubmit={handleAddType} className="flex gap-2 shrink-0">
                                    <input
                                        type="text"
                                        placeholder="Tambah imunisasi..."
                                        value={newTypeName}
                                        onChange={(e) => setNewTypeName(e.target.value)}
                                        className="flex-1 box-border px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Tambah
                                    </button>
                                </form>

                                {/* List of Types */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daftar Vaksin ({filteredList.length})</label>
                                    {filteredList.length > 0 ? (
                                        filteredList.map((item, idx) => {
                                            const originalIndex = immunizationList.indexOf(item);
                                            const isEditing = editingTypeIndex === originalIndex;

                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-150 rounded-xl transition-all"
                                                >
                                                    {isEditing ? (
                                                        <div className="flex-1 flex gap-2 items-center">
                                                            <input
                                                                type="text"
                                                                value={editingTypeName}
                                                                onChange={(e) => setEditingTypeName(e.target.value)}
                                                                className="flex-1 box-border px-2 py-1.5 bg-white border border-blue-400 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                                                autoFocus
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUpdateType(originalIndex)}
                                                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer animate-fade-in"
                                                            >
                                                                Simpan
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingTypeIndex(null);
                                                                    setEditingTypeName('');
                                                                }}
                                                                className="bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer animate-fade-in"
                                                            >
                                                                Batal
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setJenisImunisasi(item);
                                                                    setShowManageModal(false);
                                                                    setSearchQuery('');
                                                                    triggerToast(`Dipilih: ${item}`);
                                                                }}
                                                                className="flex-1 text-left text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                                                            >
                                                                {item}
                                                            </button>
                                                            <div className="flex gap-1.5 ml-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditingTypeIndex(originalIndex);
                                                                        setEditingTypeName(item);
                                                                    }}
                                                                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all active:scale-90 cursor-pointer"
                                                                    title="Edit nama"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteType(item)}
                                                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all active:scale-90 cursor-pointer"
                                                                    title="Hapus"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
                                            Tidak ada jenis imunisasi yang cocok.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                <BottombarBidan />
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
