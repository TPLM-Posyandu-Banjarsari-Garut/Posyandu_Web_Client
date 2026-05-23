'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BottombarKader from '@/components/ui/bottombar/kader/BottombarKader';
import DateFilterInput from '@/components/ui/DateFilterInput';

interface Jadwal {
    id: number;
    namaPosyandu: string;
    tanggal: string; // Format: YYYY-MM-DD
    jamMulai: string; // Format: HH:MM
    jamSelesai: string; // Format: HH:MM
}

export default function JadwalPosyandu() {
    // Register Service Worker explicitly on mount to ensure push notifications work flawlessly
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then((reg) => {
                console.log('Service Worker registered successfully with scope:', reg.scope);
            }).catch((err) => {
                console.warn('Service Worker registration failed:', err);
            });
        }
    }, []);

    // Initial premium dummy schedule data
    const [jadwalList, setJadwalList] = useState<Jadwal[]>([
        {
            id: 1,
            namaPosyandu: 'Posyandu Mawar I',
            tanggal: '2026-05-24',
            jamMulai: '08:00',
            jamSelesai: '11:00'
        },
        {
            id: 2,
            namaPosyandu: 'Posyandu Melati II',
            tanggal: '2026-05-25',
            jamMulai: '09:00',
            jamSelesai: '12:00'
        },
        {
            id: 3,
            namaPosyandu: 'Posyandu Flamboyan III',
            tanggal: '2026-05-28',
            jamMulai: '08:30',
            jamSelesai: '11:30'
        }
    ]);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterPosyandu, setFilterPosyandu] = useState('');

    // Modal & Toast states
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Jadwal | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Form inputs state
    const [namaPosyandu, setNamaPosyandu] = useState('Posyandu Mawar I');
    const [customNamaPosyandu, setCustomNamaPosyandu] = useState('');
    const [isCustomNama, setIsCustomNama] = useState(false);
    const [tanggal, setTanggal] = useState('');
    const [jamMulai, setJamMulai] = useState('');
    const [jamSelesai, setJamSelesai] = useState('');

    // Trigger Toast Notification
    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    // Open Add Modal
    const openAddModal = () => {
        setEditingItem(null);
        setNamaPosyandu('Posyandu Mawar I');
        setIsCustomNama(false);
        setCustomNamaPosyandu('');

        // Prefill date with tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        setTanggal(`${yyyy}-${mm}-${dd}`);

        setJamMulai('08:00');
        setJamSelesai('11:00');
        setShowModal(true);
    };

    // Open Edit Modal
    const openEditModal = (item: Jadwal) => {
        setEditingItem(item);
        const presetNames = ['Posyandu Mawar I', 'Posyandu Melati II', 'Posyandu Flamboyan III'];
        if (presetNames.includes(item.namaPosyandu)) {
            setNamaPosyandu(item.namaPosyandu);
            setIsCustomNama(false);
            setCustomNamaPosyandu('');
        } else {
            setNamaPosyandu('Lainnya');
            setIsCustomNama(true);
            setCustomNamaPosyandu(item.namaPosyandu);
        }
        setTanggal(item.tanggal);
        setJamMulai(item.jamMulai);
        setJamSelesai(item.jamSelesai);
        setShowModal(true);
    };

    // Close Modal
    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    // Delete Schedule Handler
    const handleDelete = (id: number, posyanduName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus jadwal untuk "${posyanduName}"?`)) {
            setJadwalList(prev => prev.filter(item => item.id !== id));
            triggerToast(`Jadwal "${posyanduName}" berhasil dihapus.`);
        }
    };

    // Form Submit Handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalNama = isCustomNama ? customNamaPosyandu.trim() : namaPosyandu;
        if (!finalNama) {
            alert('Nama Posyandu tidak boleh kosong!');
            return;
        }
        if (!tanggal || !jamMulai || !jamSelesai) {
            alert('Semua kolom form wajib diisi!');
            return;
        }

        if (editingItem) {
            // Update mode
            setJadwalList(prev => prev.map(item =>
                item.id === editingItem.id
                    ? { ...item, namaPosyandu: finalNama, tanggal, jamMulai, jamSelesai }
                    : item
            ));
            triggerToast(`Jadwal "${finalNama}" berhasil diperbarui!`);
        } else {
            // Add new mode
            const newItem: Jadwal = {
                id: Date.now(),
                namaPosyandu: finalNama,
                tanggal,
                jamMulai,
                jamSelesai
            };
            setJadwalList(prev => [newItem, ...prev]);
            triggerToast(`Jadwal "${finalNama}" berhasil ditambahkan!`);
        }

        closeModal();
    };

    // PWA Push Notification Handler
    const handleLaunchNotification = async (item: Jadwal) => {
        if (!("Notification" in window)) {
            alert("Browser ini tidak mendukung notifikasi.");
            return;
        }

        const showNotification = async () => {
            const title = "🔔 JADWAL POSYANDU BARU";
            const options: NotificationOptions & { vibrate?: number[] } = {
                body: `Jadwal untuk ${item.namaPosyandu} telah diluncurkan pada ${formatDateIndo(item.tanggal)} pukul ${item.jamMulai} - ${item.jamSelesai} WIB. Jangan lupa hadir!`,
                icon: "/icon-192x192.png",
                badge: "/icon-192x192.png",
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: item.id,
                },
            };

            // Try sending notification via registered service worker
            if ("serviceWorker" in navigator) {
                try {
                    // Prevent hanging indefinitely by using a 1.2-second timeout
                    const swReadyPromise = navigator.serviceWorker.ready;
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Timeout waiting for Service Worker")), 1200)
                    );
                    const registration = await Promise.race([swReadyPromise, timeoutPromise]) as ServiceWorkerRegistration;

                    console.log("Mengirim notifikasi melalui Service Worker...");
                    await registration.showNotification(title, options);
                    triggerToast(`Notifikasi "${item.namaPosyandu}" terkirim via SW!`);
                    return;
                } catch (err) {
                    console.warn("Service Worker showNotification gagal, menggunakan fallback:", err);
                }
            }

            // Fallback for standard browser notifications (Chrome/Safari desktop)
            console.log("Menggunakan Browser Notification (fallback)...");
            try {
                new Notification(title, options);
                triggerToast(`Notifikasi "${item.namaPosyandu}" terkirim!`);
            } catch (err) {
                console.error("Gagal meluncurkan browser notification:", err);
                alert("Gagal mengirim notifikasi. Pastikan izin notifikasi diaktifkan di browser Anda.");
            }
        };

        if (Notification.permission === "granted") {
            await showNotification();
        } else if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                await showNotification();
            } else {
                triggerToast("Izin notifikasi ditolak oleh pengguna.");
            }
        } else {
            alert("Izin notifikasi diblokir. Harap aktifkan izin notifikasi pada pengaturan browser Anda.");
        }
    };

    // Safer Indonesian Date Formatter helper (no timezone shift)
    const formatDateIndo = (dateStr: string) => {
        if (!dateStr) return '-';
        const [year, month, day] = dateStr.split('-');
        if (!year || !month || !day) return dateStr;
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
    };

    // Filter schedules
    const filteredJadwal = jadwalList.filter((item) => {
        const matchesSearch = item.namaPosyandu.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDate = filterDate ? item.tanggal === filterDate : true;
        const matchesPosyandu = filterPosyandu ? item.namaPosyandu === filterPosyandu : true;
        return matchesSearch && matchesDate && matchesPosyandu;
    });

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            {/* Mobile Container */}
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header Background Gradient */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

                {/* Sticky Header Nav */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/kader/home" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Jadwal Posyandu</h1>
                    <div className="w-10 h-10"></div> {/* Spacing spacer */}
                </div>

                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-44">

                    {/* Dashboard Info Banner */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex items-center gap-4 mb-6 border border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Jadwal</p>
                            <h2 className="text-xl font-bold text-slate-800 leading-tight">
                                {filteredJadwal.length} Sesi
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
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-205 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                            placeholder="Cari nama posyandu..."
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
                                className="w-full h-full box-border px-3 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-[0_2px_10px_rgb(0,0,0,0.02)] appearance-none font-semibold"
                            >
                                <option value="">Semua Posyandu</option>
                                <option value="Posyandu Mawar I">Mawar I</option>
                                <option value="Posyandu Melati II">Melati II</option>
                                <option value="Posyandu Flamboyan III">Flamboyan III</option>
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
                            <span className="text-[11px] font-bold text-slate-400">Hasil filter: {filteredJadwal.length} Jadwal</span>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterDate('');
                                    setFilterPosyandu('');
                                }}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Schedule Stack list */}
                    <div className="flex flex-col gap-4">
                        {filteredJadwal.length > 0 ? (
                            filteredJadwal.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-[2rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300 animate-fade-in"
                                >
                                    {/* Posyandu Name */}
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 shrink-0">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-extrabold text-slate-850 leading-tight">
                                                    {item.namaPosyandu}
                                                </h3>
                                                <span className="inline-block mt-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100/50">
                                                    Terjadwal
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Schedule Details */}
                                    <div className="flex flex-col gap-2.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex gap-2.5 items-center text-xs text-slate-650 font-bold">
                                            <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{formatDateIndo(item.tanggal)}</span>
                                        </div>
                                        <div className="flex gap-2.5 items-center text-xs text-slate-650 font-bold">
                                            <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{item.jamMulai} - {item.jamSelesai} WIB</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons & Notification */}
                                    <div className="flex flex-col gap-2 border-t border-slate-50 pt-3.5">
                                        {/* Luncurkan Notifikasi Button */}
                                        <button
                                            onClick={() => handleLaunchNotification(item)}
                                            className="w-full bg-gradient-to-tr from-indigo-500 to-blue-600 hover:opacity-95 text-[11px] font-bold px-3 py-3 rounded-xl active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(79,70,229,0.2)] text-white cursor-pointer"
                                        >
                                            <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            Luncurkan Notifikasi
                                        </button>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3 py-2.5 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id, item.namaPosyandu)}
                                                className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold px-3.5 py-2.5 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer"
                                                title="Hapus"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-semibold shadow-[0_2px_10px_rgb(0,0,0,0.01)]">
                                Tidak ada jadwal posyandu yang ditemukan.
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Action Button (FAB) for adding new Schedule */}
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md flex justify-end px-6 pointer-events-none z-40">
                    <button
                        onClick={openAddModal}
                        className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                        title="Tambah Jadwal Baru"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Bottom navigation */}
                <BottombarKader />

                {/* Bottom Sheet Modal */}
                {showModal && (
                    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-[1010] flex flex-col justify-end animate-fade-in">
                        <div className="bg-white w-full rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col max-h-[85%] animate-slide-up overflow-hidden">

                            {/* Modal Header */}
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
                                <div>
                                    <h2 className="text-base font-bold text-slate-800">
                                        {editingItem ? 'Edit Jadwal Posyandu' : 'Tambah Jadwal Baru'}
                                    </h2>
                                    <p className="text-[10px] text-slate-400">Tentukan lokasi, tanggal, dan waktu pelaksanaan posyandu</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Scrollable Body */}
                            <div className="flex-1 overflow-y-auto py-4 pr-1 flex flex-col gap-4 custom-scrollbar">
                                <form onSubmit={handleSubmit} id="jadwal-form" className="flex flex-col gap-4">
                                    {/* Nama Posyandu Dropdown */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Posyandu</label>
                                        <div className="relative">
                                            <select
                                                value={namaPosyandu}
                                                onChange={(e) => {
                                                    setNamaPosyandu(e.target.value);
                                                    setIsCustomNama(e.target.value === 'Lainnya');
                                                }}
                                                className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all appearance-none font-semibold"
                                                required
                                            >
                                                <option value="Posyandu Mawar I">Posyandu Mawar I</option>
                                                <option value="Posyandu Melati II">Posyandu Melati II</option>
                                                <option value="Posyandu Flamboyan III">Posyandu Flamboyan III</option>
                                                <option value="Lainnya">Lainnya (Tulis Kustom)</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Nama Posyandu Input (if 'Lainnya' selected) */}
                                    {isCustomNama && (
                                        <div className="flex flex-col gap-1.5 animate-fade-in">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Posyandu Kustom</label>
                                            <input
                                                type="text"
                                                value={customNamaPosyandu}
                                                onChange={(e) => setCustomNamaPosyandu(e.target.value)}
                                                placeholder="Contoh: Posyandu Dahlia IV"
                                                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Tanggal Pelaksanaan */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Pelaksanaan</label>
                                        <div className="relative h-[3.25rem] w-full overflow-hidden">
                                            <input
                                                type="date"
                                                value={tanggal}
                                                onChange={(e) => setTanggal(e.target.value)}
                                                className="absolute inset-0 h-full w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all [color-scheme:light]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Jam Mulai & Selesai Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Mulai</label>
                                            <input
                                                type="time"
                                                value={jamMulai}
                                                onChange={(e) => setJamMulai(e.target.value)}
                                                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all [color-scheme:light]"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Selesai</label>
                                            <input
                                                type="time"
                                                value={jamSelesai}
                                                onChange={(e) => setJamSelesai(e.target.value)}
                                                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all [color-scheme:light]"
                                                required
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-4 border-t border-slate-100 flex gap-3.5 shrink-0 bg-white">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm py-4 rounded-[1.25rem] active:scale-95 transition-all text-center cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    form="jadwal-form"
                                    className="w-2/3 bg-blue-600 text-white font-bold text-sm py-4 rounded-[1.25rem] shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer"
                                >
                                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Simpan Jadwal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast Notification Alert */}
                {showToast && (
                    <div className="fixed bottom-[92px] left-1/2 -translate-x-1/2 w-[85%] max-w-[calc(448px*0.85)] bg-slate-900/90 text-white text-xs font-bold px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-[1050] animate-fade-in backdrop-blur-sm border border-white/10">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="flex-1 text-slate-100">{toastMessage}</span>
                    </div>
                )}

            </div>
        </div>
    );
}
