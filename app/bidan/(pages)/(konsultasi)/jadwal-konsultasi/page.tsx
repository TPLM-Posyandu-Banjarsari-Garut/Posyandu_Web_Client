'use client';

import BottombarBidan from '@/components/ui/bottombar/bidan/BottombarBidan';
import Link from 'next/link';

export default function JadwalKonsultasiPage() {
    const dummyData = [
        { id: 1, nama: 'Ibu Siti Aminah', tanggal: '25 Mei 2024', jam: '09:00 - 10:00', status: 'Terjadwal' },
        { id: 2, nama: 'Ibu Budi Rahayu', tanggal: '26 Mei 2024', jam: '10:30 - 11:30', status: 'Terjadwal' },
        { id: 3, nama: 'Ibu Ningsih', tanggal: '28 Mei 2024', jam: '13:00 - 14:00', status: 'Ditolak' },
    ];

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/bidan/home" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Jadwal Konsultasi</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-slate-50">

                    {/* Filter Section */}
                    <div className="mb-6 flex flex-col gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                                placeholder="Cari nama ibu..."
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="date"
                                    className="w-full px-3 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                                />
                            </div>
                            <div className="relative flex-1">
                                <select className="w-full px-3 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-[0_2px_10px_rgb(0,0,0,0.02)] appearance-none">
                                    <option value="">Semua Jadwal</option>
                                    <option value="Ditolak">Ditolak</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stack Data */}
                    <div className="flex flex-col gap-4">
                        {dummyData.map((item) => (
                            <div key={item.id} className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-4 relative overflow-hidden">
                                <div className="flex flex-col gap-1.5">
                                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full w-fit uppercase tracking-wider ${item.status === 'Ditolak' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {item.status}
                                    </span>
                                    <h2 className="text-base font-bold text-slate-800 leading-snug mt-1">{item.nama}</h2>

                                    <div className="flex flex-col gap-2 mt-2">
                                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="text-xs font-medium">{item.tanggal}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="text-xs font-medium">{item.jam}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-2 pt-4 border-t border-slate-100">
                                    <button className="flex-1 bg-amber-50 text-amber-600 text-xs font-bold px-4 py-3 rounded-xl hover:bg-amber-100 hover:text-amber-700 active:scale-95 transition-all flex justify-center items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        Edit
                                    </button>
                                    <button className="flex-1 bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-xl hover:bg-red-100 hover:text-red-700 active:scale-95 transition-all flex justify-center items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        Tolak
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fixed (+) Button */}
                <div className="fixed bottom-[100px] w-full max-w-md mx-auto z-40 pointer-events-none flex justify-end px-6 left-1/2 -translate-x-1/2">
                    <Link href="/bidan/buat-jadwal-konsultasi" className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all pointer-events-auto">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    </Link>
                </div>

                <BottombarBidan />
            </div>
        </div>
    );
}
