import Link from "next/link";
import BottombarBidan from "./BottombarBidan";

export default function FiturAplikasi() {
    return (
        <div className="mb-10">
            <div className="flex justify-between items-end mb-5">
                <h2 className="text-lg font-bold text-slate-800">Fitur Aplikasi</h2>
            </div>
            <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                {/* Feature 1: Data Bayi */}
                <Link href="/bidan/data-bayi" className="flex flex-col items-center gap-2.5 group">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-pink-100 flex items-center justify-center text-pink-500 shadow-sm transition-transform active:scale-95 group-hover:shadow-md">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-600 text-center">Data Bayi</span>
                </Link>

                {/* Feature 2: Data Imunisasi */}
                <Link href="/bidan/data-imunisasi" className="flex flex-col items-center gap-2.5 group">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-cyan-100 flex items-center justify-center text-cyan-600 shadow-sm transition-transform active:scale-95 group-hover:shadow-md">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-600 text-center leading-tight">Data<br />Imunisasi</span>
                </Link>

                {/* Feature 3: Edukasi */}
                <Link href="/bidan/edukasi" className="flex flex-col items-center gap-2.5 group">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-orange-100 flex items-center justify-center text-orange-500 shadow-sm transition-transform active:scale-95 group-hover:shadow-md">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-600 text-center">Edukasi</span>
                </Link>

                {/* Feature 4: Inventaris */}
                <Link href="/bidan/inventaris" className="flex flex-col items-center gap-2.5 group">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm transition-transform active:scale-95 group-hover:shadow-md">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-600 text-center">Inventaris</span>
                </Link>

                {/* Feature 5: Riwayat Imunisasi */}
                <Link href="/bidan/riwayat-imunisasi" className="flex flex-col items-center gap-2.5 group">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm transition-transform active:scale-95 group-hover:shadow-md">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-600 text-center leading-tight">Riwayat<br />Imunisasi</span>
                </Link>

                {/* Feature 6: Kelola */}
                <Link href="/bidan/(kelola)" className="flex flex-col items-center gap-2.5 group">
                    <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm transition-transform active:scale-95 group-hover:shadow-md">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-600 text-center">Kelola Edukasi</span>
                </Link>
            </div>
        </div>
    )
}