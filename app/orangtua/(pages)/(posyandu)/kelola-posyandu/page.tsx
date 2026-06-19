'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import { useConfirm } from '@/providers/ConfirmProvider';

interface Posyandu {
    id: number;
    nama: string;
    rt: string;
    rw: string;
    jalan: string;
    patokan: string;
    tempat: string;
}

export default function KelolaPosyandu() {
    const confirm = useConfirm();
    
    // Initial premium dummy data
    const [posyanduList, setPosyanduList] = useState<Posyandu[]>([
        {
            id: 1,
            nama: 'Posyandu Mawar I',
            rt: '02',
            rw: '04',
            jalan: 'Jl. Banjarsari Raya No. 45',
            patokan: 'Dekat Lapangan Bola Banjarsari',
            tempat: 'Aula Desa Banjarsari'
        },
        {
            id: 2,
            nama: 'Posyandu Melati II',
            rt: '01',
            rw: '03',
            jalan: 'Gang Harapan Indah II',
            patokan: 'Samping SDN Banjarsari 1',
            tempat: 'Halaman Rumah Ketua RW 03'
        },
        {
            id: 3,
            nama: 'Posyandu Flamboyan III',
            rt: '05',
            rw: '01',
            jalan: 'Jl. Raya Garut-Tasik No. 12',
            patokan: 'Seberang Kantor Kecamatan',
            tempat: 'Balai Dusun Cempaka'
        }
    ]);

    // Modal & Toast states
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Posyandu | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Form inputs state
    const [nama, setNama] = useState('');
    const [jalan, setJalan] = useState('');
    const [rt, setRt] = useState('');
    const [rw, setRw] = useState('');
    const [patokan, setPatokan] = useState('');
    const [tempat, setTempat] = useState('');

    // Trigger Toast Alert
    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2500);
    };

    // Open Add Modal
    const openAddModal = () => {
        setEditingItem(null);
        setNama('');
        setJalan('');
        setRt('');
        setRw('');
        setPatokan('');
        setTempat('');
        setShowModal(true);
    };

    // Open Edit Modal
    const openEditModal = (item: Posyandu) => {
        setEditingItem(item);
        setNama(item.nama);
        setJalan(item.jalan);
        setRt(item.rt);
        setRw(item.rw);
        setPatokan(item.patokan);
        setTempat(item.tempat);
        setShowModal(true);
    };

    // Close Modal
    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    // Delete Posyandu Handler
    const handleDelete = async (id: number, name: string) => {
        if (await confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) {
            setPosyanduList(prev => prev.filter(item => item.id !== id));
            triggerToast(`Posyandu "${name}" berhasil dihapus.`);
        }
    };

    // Form Submit Handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validations
        if (!nama.trim() || !jalan.trim() || !rt.trim() || !rw.trim() || !patokan.trim() || !tempat.trim()) {
            alert('Semua kolom form wajib diisi!');
            return;
        }

        if (editingItem) {
            // Update mode
            setPosyanduList(prev => prev.map(item =>
                item.id === editingItem.id
                    ? { ...item, nama, jalan, rt, rw, patokan, tempat }
                    : item
            ));
            triggerToast(`Posyandu "${nama}" berhasil diperbarui!`);
        } else {
            // Add new mode
            const newItem: Posyandu = {
                id: Date.now(),
                nama,
                jalan,
                rt,
                rw,
                patokan,
                tempat
            };
            setPosyanduList(prev => [...prev, newItem]);
            triggerToast(`Posyandu "${nama}" berhasil ditambahkan!`);
        }

        closeModal();
    };

    // Filtered posyandu list based on search query
    const filteredPosyandu = posyanduList.filter(item =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jalan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tempat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            {/* Mobile Container */}
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header Background Gradient */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

                {/* Sticky Header Nav */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/orangtua/home" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Kelola Posyandu</h1>
                    <div className="w-10 h-10"></div> {/* Spacing spacer */}
                </div>

                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-44">

                    {/* Dashboard Info Banner */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex items-center gap-4 mb-6 border border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Terdaftar</p>
                            <h2 className="text-xl font-bold text-slate-800 leading-tight">
                                {filteredPosyandu.length} Posyandu
                            </h2>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                            placeholder="Cari nama atau lokasi posyandu..."
                        />
                    </div>

                    {/* Stacks Card list */}
                    <div className="flex flex-col gap-4">
                        {filteredPosyandu.length > 0 ? (
                            filteredPosyandu.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-[2rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
                                >
                                    {/* Posyandu Name */}
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 shrink-0">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-extrabold text-slate-850 leading-tight">
                                                    {item.nama}
                                                </h3>
                                                <span className="inline-block mt-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-100/50">
                                                    RT. {item.rt} / RW. {item.rw}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Details */}
                                    <div className="flex flex-col gap-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                                        <div className="flex gap-2 items-start text-xs text-slate-600 leading-relaxed font-medium">
                                            <svg className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                            </svg>
                                            <span>{item.jalan}</span>
                                        </div>
                                        <div className="flex gap-2 items-start text-xs text-slate-500 font-medium">
                                            <svg className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                            </svg>
                                            <span className="italic">Patokan: {item.patokan}</span>
                                        </div>
                                    </div>

                                    {/* Tempat / Venue */}
                                    <div className="flex justify-between items-center text-xs font-semibold border-b border-slate-50 pb-2">
                                        <span className="text-slate-400">Tempat Pelaksanaan</span>
                                        <span className="text-slate-800 font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-xl border border-amber-100">
                                            {item.tempat}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 border-t border-slate-50 pt-3">
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3 py-2 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id, item.nama)}
                                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold px-3.5 py-2 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center"
                                            title="Hapus"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-semibold shadow-[0_2px_10px_rgb(0,0,0,0.01)]">
                                Tidak ada data posyandu yang ditemukan.
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Action Button (FAB) for adding new Posyandu */}
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md flex justify-end px-6 pointer-events-none z-40">
                    <button
                        onClick={openAddModal}
                        className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                        title="Tambah Posyandu Baru"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Sticky Bottom Navigation Bar */}
                <BottombarOrtu />

                {/* Bottom Sheet Modal */}
                {showModal && (
                    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-[1010] flex flex-col justify-end animate-fade-in">
                        <div className="bg-white w-full rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col max-h-[85%] animate-slide-up overflow-hidden">

                            {/* Modal Header */}
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
                                <div>
                                    <h2 className="text-base font-bold text-slate-800">
                                        {editingItem ? 'Edit Posyandu' : 'Tambah Posyandu Baru'}
                                    </h2>
                                    <p className="text-[10px] text-slate-400">Isi data informasi posyandu di bawah ini</p>
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
                                <form onSubmit={handleSubmit} id="posyandu-form" className="flex flex-col gap-4">
                                    {/* Nama Posyandu */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Posyandu</label>
                                        <input
                                            type="text"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            placeholder="Contoh: Posyandu Mawar I"
                                            className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Alamat Jalan */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Jalan</label>
                                        <input
                                            type="text"
                                            value={jalan}
                                            onChange={(e) => setJalan(e.target.value)}
                                            placeholder="Nama jalan, nomor rumah, gang..."
                                            className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                                            required
                                        />
                                    </div>

                                    {/* RT & RW Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">RT</label>
                                            <input
                                                type="text"
                                                maxLength={3}
                                                value={rt}
                                                onChange={(e) => setRt(e.target.value.replace(/\D/g, ''))} // Numeric only
                                                placeholder="Contoh: 02"
                                                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">RW</label>
                                            <input
                                                type="text"
                                                maxLength={3}
                                                value={rw}
                                                onChange={(e) => setRw(e.target.value.replace(/\D/g, ''))} // Numeric only
                                                placeholder="Contoh: 04"
                                                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Patokan */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patokan Lokasi</label>
                                        <input
                                            type="text"
                                            value={patokan}
                                            onChange={(e) => setPatokan(e.target.value)}
                                            placeholder="Contoh: Dekat masjid / seberang lapangan bola..."
                                            className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Tempat Pelaksanaan */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tempat Pelaksanaan</label>
                                        <input
                                            type="text"
                                            value={tempat}
                                            onChange={(e) => setTempat(e.target.value)}
                                            placeholder="Contoh: Aula Desa / Rumah Ketua RW"
                                            className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                                            required
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer (Sticky bottom) */}
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
                                    form="posyandu-form"
                                    className="w-2/3 bg-blue-600 text-white font-bold text-sm py-4 rounded-[1.25rem] shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer"
                                >
                                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                    </svg>
                                    Simpan Data
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
