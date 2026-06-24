import Link from "next/link";

export default function BottombarOrtu() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center h-20 px-6 z-[999] rounded-t-3xl sm:rounded-t-none sm:rounded-b-[2.5rem] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <Link href="/orangtua/home" className="flex flex-col items-center gap-1.5 text-blue-600">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
        <span className="text-[10px] font-bold">Beranda</span>
      </Link>
      <Link href="/orangtua/ajukan-konsultasi" className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span className="text-[10px] font-bold">History</span>
      </Link>

      {/* Center Floating Action Button */}
      <div className="relative -top-6 flex justify-center">
        <Link href="/orangtua/booking-layanan" className="w-14 h-14 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(79,70,229,0.4)] border-[4px] border-white hover:scale-105 active:scale-95 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
        </Link>
      </div>

      <Link href="/orangtua/edukasi" className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        <span className="text-[10px] font-bold">Edukasi</span>
      </Link>
      <Link href="/orangtua/profile" className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        <span className="text-[10px] font-bold">Profil</span>
      </Link>
    </div>
  );
}
