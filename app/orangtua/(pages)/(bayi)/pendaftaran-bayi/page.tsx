'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PendaftaranBayi() {
    const [tanggalLahir, setTanggalLahir] = useState('');
    const [tanggalPengukuran, setTanggalPengukuran] = useState('');

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 pt-8 pb-6 flex items-center justify-between rounded-b-[2rem] shadow-md z-10">
                    <Link href="/orangtua/data-bayi" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Pendaftaran Bayi</h1>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-28 bg-slate-50 relative">
                    <form className="flex flex-col gap-6">
                        
                        {/* 1. Informasi Pribadi */}
                        <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</div>
                                Informasi Pribadi
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Nama Lengkap Bayi</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" placeholder="Contoh: Ahmad Rafli" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">NIK Bayi</label>
                                    <input type="number" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" placeholder="16 digit NIK" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 overflow-hidden">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Jenis Kelamin</label>
                                        <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm appearance-none transition-all">
                                            <option value="">Pilih</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                     <div className="min-w-0">
                                         <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Tanggal Lahir</label>
                                         <div className="relative w-full min-w-0 overflow-hidden">
                                             <input
                                                 type="date"
                                                 value={tanggalLahir}
                                                 onChange={(e) => setTanggalLahir(e.target.value)}
                                                 className="w-full max-w-full min-w-0 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10 [color-scheme:light] font-normal text-slate-700"
                                                 style={{ color: tanggalLahir ? undefined : 'transparent' }}
                                             />
                                             {!tanggalLahir && (
                                                 <span className="absolute inset-y-0 left-4 right-10 z-[1] flex items-center pointer-events-none text-sm text-slate-400">
                                                     dd/mm/yy
                                                 </span>
                                             )}
                                             <div className="absolute inset-y-0 right-0 z-[1] flex items-center pr-3.5 pointer-events-none text-slate-400">
                                                 <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                 </svg>
                                             </div>
                                         </div>
                                     </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">BB Lahir</label>
                                        <input type="number" className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" placeholder="kg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">TB Lahir</label>
                                        <input type="number" className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all" placeholder="cm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Gol. Darah</label>
                                        <select className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm appearance-none transition-all">
                                            <option value="">Pilih</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="AB">AB</option>
                                            <option value="O">O</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Data Orang Tua */}
                        <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">2</div>
                                Data Orang Tua
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Nama Ibu</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm transition-all" placeholder="Nama Ibu Kandung" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Nama Ayah</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm transition-all" placeholder="Nama Ayah Kandung" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Lokasi & Administratif */}
                        <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">3</div>
                                Lokasi & Administratif
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Provinsi</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all" placeholder="Provinsi" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Kab / Kota</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all" placeholder="Kabupaten" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Kecamatan</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all" placeholder="Kecamatan" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Desa / Kelurahan</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all" placeholder="Desa" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Puskesmas</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all" placeholder="Nama Puskesmas" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Nama Posyandu</label>
                                        <div className="relative">
                                            <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm appearance-none transition-all pr-10 text-slate-700">
                                                <option value="">Pilih Posyandu</option>
                                                <option value="Posyandu Mawar I">Posyandu Mawar I</option>
                                                <option value="Posyandu Melati II">Posyandu Melati II</option>
                                                <option value="Posyandu Flamboyan III">Posyandu Flamboyan III</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">RT / RW</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all" placeholder="001/002" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Alamat Lengkap</label>
                                    <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all" rows={2} placeholder="Detail alamat..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* 4. Data Pengukuran Awal */}
                        <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-xs">4</div>
                                Pengukuran & Antropometri
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 overflow-hidden">
                                     <div className="min-w-0">
                                         <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Tgl Pengukuran</label>
                                         <div className="relative w-full min-w-0 overflow-hidden">
                                             <input
                                                 type="date"
                                                 value={tanggalPengukuran}
                                                 onChange={(e) => setTanggalPengukuran(e.target.value)}
                                                 className="w-full max-w-full min-w-0 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all pr-10 [color-scheme:light] font-normal text-slate-700"
                                                 style={{ color: tanggalPengukuran ? undefined : 'transparent' }}
                                             />
                                             {!tanggalPengukuran && (
                                                 <span className="absolute inset-y-0 left-4 right-10 z-[1] flex items-center pointer-events-none text-sm text-slate-400">
                                                     dd/mm/yy
                                                 </span>
                                             )}
                                             <div className="absolute inset-y-0 right-0 z-[1] flex items-center pr-3.5 pointer-events-none text-slate-400">
                                                 <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                 </svg>
                                             </div>
                                         </div>
                                     </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Usia (Bulan)</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all" placeholder="Misal: 6" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">BB Sekarang</label>
                                        <input type="number" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all" placeholder="kg" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">TB Sekarang</label>
                                        <input type="number" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all" placeholder="cm" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Lingkar Lengan</label>
                                        <input type="number" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm transition-all" placeholder="cm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Cara Ukur</label>
                                        <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-sm appearance-none transition-all">
                                            <option value="Telentang">Telentang</option>
                                            <option value="Berdiri">Berdiri</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 5. Status Gizi */}
                        <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
                            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">5</div>
                                Status Gizi & Pemantauan
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Status Z-Score (BB/U, TB/U, BB/TB)</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input type="text" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="ZS BB/U" />
                                        <input type="text" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="ZS TB/U" />
                                        <input type="text" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="ZS BB/TB" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Naik Berat Badan</label>
                                        <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                                            <option value="Ya">Ya (N)</option>
                                            <option value="Tidak">Tidak (T)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">KPSP</label>
                                        <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                                            <option value="Sesuai">Sesuai</option>
                                            <option value="Meragukan">Meragukan</option>
                                            <option value="Penyimpangan">Penyimpangan</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Buku KIA</label>
                                        <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                                            <option value="Ya">Memiliki</option>
                                            <option value="Tidak">Tidak</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Kelas Ibu Balita</label>
                                        <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                                            <option value="Ya">Mengikuti</option>
                                            <option value="Tidak">Tidak</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Vitamin A</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" placeholder="Kapsul Biru" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Terima MBG</label>
                                        <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all">
                                            <option value="Ya">Ya</option>
                                            <option value="Tidak">Tidak</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Catatan Tambahan</label>
                                    <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all" rows={2} placeholder="Kondisi bayi saat ini..."></textarea>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Fixed Submit Button Area */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-slate-100 z-20 rounded-b-[2.5rem]">
                    <button className="w-full bg-blue-600 text-white rounded-[1.25rem] py-4 font-bold shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all text-center">
                        Simpan Data Bayi
                    </button>
                </div>

            </div>
        </div>
    );
}
