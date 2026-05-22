import BottombarBidan from '@/components/ui/bottombar/bidan/BottombarBidan';
import Link from 'next/link';

export default function DetailBayi() {
    const lokasiAdministratif = [
        { label: 'Provinsi', value: 'Jawa Barat' },
        { label: 'Kabupaten / Kota', value: 'Garut' },
        { label: 'Kecamatan', value: 'Banjarsari' },
        { label: 'Puskesmas', value: 'Puskesmas Banjarsari' },
        { label: 'Desa / Kelurahan', value: 'Banjarsari' },
        { label: 'Nama Posyandu', value: 'Mawar 1' },
        { label: 'RT / RW', value: '001 / 002' },
        { label: 'Alamat', value: 'Jl. Raya Banjarsari No. 10' },
    ];

    const dataPengukuran = [
        { label: 'Tanggal Pengukuran', value: '15 Mei 2026' },
        { label: 'Usia Saat Ukur', value: '6 Bulan 5 Hari' },
        { label: 'Berat Badan Sekarang', value: '7.5 kg' },
        { label: 'Tinggi Badan Sekarang', value: '65 cm' },
        { label: 'Cara Ukur', value: 'Telentang' },
        { label: 'Lingkar Lengan Atas', value: '14 cm' },
    ];

    const statusGizi = [
        { label: 'Berat Badan / Umur', value: 'Normal', zs: '0.5' },
        { label: 'Tinggi Badan / Umur', value: 'Normal', zs: '0.2' },
        { label: 'Berat Badan / Tinggi Badan', value: 'Normal', zs: '0.3' },
        { label: 'Naik Berat Badan', value: 'Ya (N)' },
    ];

    const programPemantauan = [
        { label: 'Jumlah Vitamin A', value: '1 Kapsul Biru' },
        { label: 'KPSP', value: 'Sesuai' },
        { label: 'Buku KIA', value: 'Memiliki' },
        { label: 'Kelas Ibu Balita', value: 'Mengikuti' },
        { label: 'MBG (Makan Bergizi Gratis)', value: 'Ya' },
        { label: 'Detail Tambahan', value: 'Kondisi umum sangat baik, aktif bergerak.' },
    ];

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header - Transparent over colored background */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/bidan/data-bayi" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Detail Bayi</h1>
                    <button className="p-2 -mr-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6">

                    {/* Profile Card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex flex-col items-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-pink-100 border-[6px] border-white shadow-md flex items-center justify-center mb-4 -mt-16">
                            <span className="text-4xl font-bold text-pink-500">A</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-1.5">Ahmad Rafli</h2>
                        <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold mb-5 border border-blue-100">
                            NIK: 3201010101010001
                        </div>

                        <div className="w-full grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
                            <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Umur</span>
                                <span className="text-xs font-bold text-slate-800">6 Bulan</span>
                            </div>
                            <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Kelamin</span>
                                <span className="text-xs font-bold text-slate-800 truncate max-w-full">Laki-laki</span>
                            </div>
                            <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Tgl Lahir</span>
                                <span className="text-[10px] font-bold text-slate-800 truncate max-w-full">15 Nov 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Orang Tua (Moved Up for Better Hierarchy) */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Data Orang Tua</h3>
                        <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 space-y-5">
                            <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Nama Ibu</p>
                                    <p className="text-sm font-bold text-slate-800">Siti Nurhaliza</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Nama Ayah</p>
                                    <p className="text-sm font-bold text-slate-800">Budi Setiawan</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lokasi & Administratif */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Lokasi & Administratif</h3>
                        <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
                            {lokasiAdministratif.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                    <span className="text-xs font-semibold text-slate-500 w-1/2">{item.label}</span>
                                    <span className="text-sm font-bold text-slate-800 w-1/2 text-right">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Data Pengukuran Terakhir */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Data Pengukuran Terakhir</h3>
                        <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
                            {dataPengukuran.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                    <span className="text-xs font-semibold text-slate-500 w-1/2">{item.label}</span>
                                    <span className="text-sm font-bold text-slate-800 w-1/2 text-right">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Gizi & Z-Score */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Status Gizi & Z-Score</h3>
                        <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
                            {statusGizi.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                    <span className="text-xs font-semibold text-slate-500 flex-1">{item.label}</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-slate-800">{item.value}</span>
                                        {item.zs && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full mt-1">ZS: {item.zs}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Program & Pemantauan */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Program & Pemantauan</h3>
                        <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
                            {programPemantauan.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                                    <span className="text-xs font-semibold text-slate-500 w-2/5">{item.label}</span>
                                    <span className="text-sm font-bold text-slate-800 w-3/5 text-right leading-tight">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pb-10">
                        <Link href="/bidan/riwayat-imunisasi" className="w-full bg-blue-600 text-white rounded-[1.25rem] py-4 font-bold shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-center">
                            Lihat Riwayat Imunisasi
                        </Link>
                        <button className="w-full bg-white text-blue-600 border-[2.5px] border-blue-100 rounded-[1.25rem] py-3.5 font-bold hover:bg-blue-50 hover:border-blue-200 transition-colors">
                            Grafik Pertumbuhan
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
