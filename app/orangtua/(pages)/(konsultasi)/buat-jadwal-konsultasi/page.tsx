'use client';

import Link from 'next/link';

const textInputClassName =
    'w-full min-w-0 max-w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400';

const nativeInputClassName =
    'form-native-input absolute inset-0 h-full w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all';

const fieldWrapClassName = 'relative h-[3.25rem] w-full min-w-0 overflow-hidden';

export default function BuatJadwalKonsultasiPage() {
    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md min-w-0 bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/kader/jadwal-konsultasi" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Buat Jadwal Baru</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 min-h-0 min-w-0 flex-col overflow-x-hidden overflow-y-auto px-6 py-6 custom-scrollbar bg-slate-50">
                    <div className="flex flex-1 flex-col gap-5 rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-[0_4px_15px_rgb(0,0,0,0.03)] min-w-0">

                        <div className="flex min-w-0 flex-col gap-2.5">
                            <label className="text-sm font-bold text-slate-700">Nama Ibu / Pasien</label>
                            <input
                                type="text"
                                className={textInputClassName}
                                placeholder="Masukkan nama ibu/pasien..."
                            />
                        </div>

                        <div className="flex min-w-0 flex-col gap-2.5">
                            <label className="text-sm font-bold text-slate-700">Tanggal Konsultasi</label>
                            <div className={fieldWrapClassName}>
                                <input type="date" className={nativeInputClassName} />
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-col gap-2.5">
                            <label className="text-sm font-bold text-slate-700">Jam Mulai</label>
                            <div className={fieldWrapClassName}>
                                <input type="time" className={nativeInputClassName} />
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-col gap-2.5">
                            <label className="text-sm font-bold text-slate-700">Jam Selesai</label>
                            <div className={fieldWrapClassName}>
                                <input type="time" className={nativeInputClassName} />
                            </div>
                        </div>

                        <button className="mt-auto w-full bg-blue-600 text-white font-bold text-sm py-4 rounded-[1.25rem] hover:bg-blue-700 active:scale-95 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                            Simpan Jadwal
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
