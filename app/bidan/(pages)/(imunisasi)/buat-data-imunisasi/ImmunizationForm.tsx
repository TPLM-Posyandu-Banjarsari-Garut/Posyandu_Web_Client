'use client';

import { Vaccine } from "@/interfaces/vaccine";

interface HistoryItem {
    id: string;
    tanggal: string;
    jenis: string;
    status: 'Selesai' | 'Terjadwal' | 'Ditunda';
    keterangan: string;
}

interface ImmunizationFormProps {
    editingItem: HistoryItem | null;
    setEditingItem: (item: HistoryItem | null) => void;
    tanggalEntry: string;
    setTanggalEntry: (val: string) => void;
    jenisImunisasi: string;
    setJenisImunisasi: (val: string) => void;
    status: 'Selesai' | 'Terjadwal' | 'Ditunda';
    setStatus: (val: 'Selesai' | 'Terjadwal' | 'Ditunda') => void;
    tanggalPengukuran: string;
    setTanggalPengukuran: (val: string) => void;
    usiaSaatUkur: string;
    setUsiaSaatUkur: (val: string) => void;
    beratBadan: string;
    setBeratBadan: (val: string) => void;
    tinggiBadan: string;
    setTinggiBadan: (val: string) => void;
    lingkarKepala: string;
    setLingkarKepala: (val: string) => void;
    nutritionStatus: 'normal' | 'underweight' | 'severely_underweight' | 'stunted' | 'wasted' | 'overweight';
    setNutritionStatus: (val: 'normal' | 'underweight' | 'severely_underweight' | 'stunted' | 'wasted' | 'overweight') => void;
    keterangan: string;
    setKeterangan: (val: string) => void;
    vaccinesList: Vaccine[];
    setShowManageModal: (val: boolean) => void;
    handleFormSubmit: (e: React.FormEvent) => void;
}

export default function ImmunizationForm({
    editingItem,
    setEditingItem,
    tanggalEntry,
    setTanggalEntry,
    jenisImunisasi,
    setJenisImunisasi,
    status,
    setStatus,
    tanggalPengukuran,
    setTanggalPengukuran,
    usiaSaatUkur,
    setUsiaSaatUkur,
    beratBadan,
    setBeratBadan,
    tinggiBadan,
    setTinggiBadan,
    lingkarKepala,
    setLingkarKepala,
    nutritionStatus,
    setNutritionStatus,
    keterangan,
    setKeterangan,
    vaccinesList,
    setShowManageModal,
    handleFormSubmit
}: ImmunizationFormProps) {
    return (
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
                            {vaccinesList.map((imun) => (
                                <option key={imun.id} value={imun.name}>{imun.name}</option>
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

                {/* Tanggal Pengukuran */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Pengukuran</label>
                    <div className="relative h-[3.25rem] w-full overflow-hidden">
                        <input
                            type="date"
                            value={tanggalPengukuran}
                            onChange={(e) => setTanggalPengukuran(e.target.value)}
                            className="absolute inset-0 h-full w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all [color-scheme:light]"
                        />
                    </div>
                </div>

                {/* Usia Saat Ukur */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Usia Saat Ukur (Bulan)</label>
                    <input
                        type="number"
                        value={usiaSaatUkur}
                        onChange={(e) => setUsiaSaatUkur(e.target.value)}
                        placeholder="Contoh: 12"
                        className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400"
                    />
                </div>

                {/* Berat Badan Sekarang */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Berat Badan Sekarang (kg)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={beratBadan}
                        onChange={(e) => setBeratBadan(e.target.value)}
                        placeholder="Contoh: 8.5"
                        className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400"
                    />
                </div>

                {/* Tinggi Badan Sekarang */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tinggi Badan Sekarang (cm)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={tinggiBadan}
                        onChange={(e) => setTinggiBadan(e.target.value)}
                        placeholder="Contoh: 75"
                        className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400"
                    />
                </div>

                {/* Lingkar Kepala */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lingkar Kepala (cm)</label>
                    <input
                        type="number"
                        step="0.1"
                        value={lingkarKepala}
                        onChange={(e) => setLingkarKepala(e.target.value)}
                        placeholder="Contoh: 44.5"
                        className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400"
                    />
                </div>

                {/* Status Gizi */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Gizi Anak</label>
                    <div className="relative">
                        <select
                            value={nutritionStatus}
                            onChange={(e) => setNutritionStatus(e.target.value as any)}
                            className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-705 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all appearance-none"
                        >
                            <option value="normal">Normal</option>
                            <option value="underweight">Berat Badan Kurang (Underweight)</option>
                            <option value="severely_underweight">Berat Badan Sangat Kurang</option>
                            <option value="stunted">Pendek (Stunted)</option>
                            <option value="wasted">Gizi Kurang / Kurus (Wasted)</option>
                            <option value="overweight">Gizi Lebih (Overweight)</option>
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
    );
}
