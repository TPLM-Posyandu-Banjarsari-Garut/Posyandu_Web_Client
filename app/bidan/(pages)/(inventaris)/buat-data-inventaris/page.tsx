'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const textInputClassName =
    'w-full min-w-0 max-w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400';

const selectClassName =
    'w-full min-w-0 max-w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all appearance-none';

export default function BuatDataInventaris() {
    const router = useRouter();

    // Form states
    const [nama, setNama] = useState('');
    const [kategori, setKategori] = useState<'vaksin' | 'barang' | 'makanan'>('vaksin');
    const [stok, setStok] = useState<number | ''>('');
    const [status, setStatus] = useState<'Tersedia' | 'Tidak Tersedia'>('Tersedia');

    // Validation & loading states
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Auto-update status based on stock count
    useEffect(() => {
        if (stok === 0) {
            setStatus('Tidak Tersedia');
        } else if (stok !== '' && stok > 0 && status === 'Tidak Tersedia') {
            setStatus('Tersedia');
        }
    }, [stok, status]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!nama.trim()) {
            setError('Nama item tidak boleh kosong');
            return;
        }
        if (stok === '') {
            setError('Jumlah stok tidak boleh kosong');
            return;
        }
        if (stok < 0) {
            setError('Jumlah stok tidak boleh negatif');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call and success animation
        setTimeout(() => {
            setIsSubmitting(false);
            setShowSuccessModal(true);

            // Redirect back to list page after 1.5s
            setTimeout(() => {
                router.push('/bidan/data-inventaris');
            }, 1500);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
                
                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/bidan/data-inventaris" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Buat Inventaris</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50 flex flex-col">
                    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5 rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-[0_4px_15px_rgb(0,0,0,0.03)]">
                        
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Input Nama Item */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Item</label>
                            <input
                                type="text"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                className={textInputClassName}
                                placeholder="Masukkan nama vaksin, barang, atau makanan..."
                            />
                        </div>

                        {/* Select Kategori */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</label>
                            <div className="relative">
                                <select
                                    value={kategori}
                                    onChange={(e) => setKategori(e.target.value as 'vaksin' | 'barang' | 'makanan')}
                                    className={selectClassName}
                                >
                                    <option value="vaksin">Vaksin</option>
                                    <option value="barang">Barang</option>
                                    <option value="makanan">Makanan</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Input Jumlah Stok */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah Stok</label>
                            <input
                                type="number"
                                value={stok}
                                onChange={(e) => setStok(e.target.value === '' ? '' : parseInt(e.target.value))}
                                className={textInputClassName}
                                placeholder="Masukkan jumlah stok (pcs)..."
                                min="0"
                            />
                        </div>

                        {/* Select Status */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Ketersediaan</label>
                            <div className="relative">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as 'Tersedia' | 'Tidak Tersedia')}
                                    className={selectClassName}
                                    disabled={stok === 0}
                                >
                                    <option value="Tersedia">Tersedia</option>
                                    <option value="Tidak Tersedia">Tidak Tersedia / Habis</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {stok === 0 && (
                                <p className="text-[10px] font-bold text-rose-500">
                                    * Status otomatis diatur ke &quot;Tidak Tersedia&quot; karena stok kosong.
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-auto w-full bg-blue-600 text-white font-bold text-sm py-4 rounded-[1.25rem] hover:bg-blue-700 active:scale-95 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Simpan Inventaris</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Success Modal Overlay */}
                {showSuccessModal && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
                        <div className="bg-white w-full max-w-[280px] rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center justify-center animate-scale-up text-center">
                            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-[0_4px_15px_rgba(16,185,129,0.2)]">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-base font-bold text-slate-800 mb-1">Berhasil Disimpan</h2>
                            <p className="text-xs text-slate-400 leading-normal">
                                Data inventaris baru berhasil didaftarkan ke sistem.
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
