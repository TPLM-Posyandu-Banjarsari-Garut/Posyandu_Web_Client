'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import AppBarBooking from '@/components/ui/appbar/AppBarBooking';
import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';

function LihatAntreanContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Retrieve booking details from search parameters with default fallbacks
    const puskesmas = searchParams.get('puskesmas') || 'Puskesmas Bogor Tengah';
    const layanan = searchParams.get('layanan') || 'Layanan Umum';
    const date = searchParams.get('date') || 'Hari ini';
    const time = searchParams.get('time') || '08.30';

    const handleGoHome = () => {
        router.push('/orangtua/home');
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            {/* Mobile Container */}
            <div className="w-full max-w-md bg-[#FFFDF6] min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Sticky AppBar */}
                <AppBarBooking
                    title="Nomor Antrean"
                    onBack={handleGoHome}
                    showBack={true}
                />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pb-28 custom-scrollbar px-6 pt-6">
                    <div className="flex flex-col items-center pt-4 pb-6">
                        {/* Checkmark Icon */}
                        <div className="w-24 h-24 rounded-full bg-[#E2EEB7] flex items-center justify-center text-[#1E3050] mb-6 shadow-sm">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="4.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Success Messages */}
                        <h2 className="text-xl font-extrabold text-[#1E3050] text-center tracking-wide mb-2">
                            Antrean Aktif Anda
                        </h2>
                        <p className="text-xs text-slate-500 font-semibold text-center leading-relaxed max-w-[280px] mb-6">
                            Tunjukkan nomor antrean ini saat tiba di puskesmas.
                        </p>

                        {/* Queue Ticket Card */}
                        <div className="w-full bg-white rounded-3xl p-6 border border-[#EBE8D8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-8 flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                Nomor Antrean
                            </span>
                            <span className="text-5xl font-extrabold text-[#1E3050] tracking-wide mt-2 mb-3">
                                A-038
                            </span>
                            <div>
                                <span className="inline-block bg-[#314A85] text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
                                    BPJS
                                </span>
                            </div>

                            <div className="border-t border-[#EBE8D8] border-dashed my-5"></div>

                            {/* Detail List */}
                            <div className="flex flex-col gap-3.5">
                                <div className="flex justify-between items-start text-xs font-semibold gap-4">
                                    <span className="text-slate-450 shrink-0">Puskesmas</span>
                                    <span className="text-[#1E3050] font-bold text-right">{puskesmas}</span>
                                </div>
                                <div className="flex justify-between items-start text-xs font-semibold gap-4">
                                    <span className="text-slate-450 shrink-0">Layanan</span>
                                    <span className="text-[#1E3050] font-bold text-right">{layanan}</span>
                                </div>
                                <div className="flex justify-between items-start text-xs font-semibold gap-4">
                                    <span className="text-slate-450 shrink-0">Tanggal</span>
                                    <span className="text-[#1E3050] font-bold text-right">{date}</span>
                                </div>
                                <div className="flex justify-between items-start text-xs font-semibold gap-4">
                                    <span className="text-slate-450 shrink-0">Jam</span>
                                    <span className="text-[#1E3050] font-bold text-right">{time}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full grid grid-cols-2 gap-3 mb-4">
                            <button
                                type="button"
                                onClick={handleGoHome}
                                className="w-full bg-white border border-[#EBE8D8] text-[#1E3050] py-4 rounded-3xl font-bold text-sm text-center hover:bg-slate-50 transition-all active:scale-[0.98]"
                            >
                                Beranda
                            </button>
                            <button
                                type="button"
                                onClick={handleGoHome}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-3xl font-bold text-sm text-center shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all active:scale-[0.98]"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottombar */}
                <BottombarOrtu />
            </div>
        </div>
    );
}

export default function LihatAntreanPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LihatAntreanContent />
        </Suspense>
    );
}
