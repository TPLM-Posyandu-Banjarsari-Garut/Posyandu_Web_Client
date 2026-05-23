import BottombarKader from '@/components/ui/bottombar/kader/BottombarKader';
import Link from 'next/link';

export default function DataBayi() {
    const dummyData = [
        { id: 1, nama: 'Ahmad Rafli', nik: '3201010101010001', kelamin: 'Laki-laki', umur: '6 Bulan' },
        { id: 2, nama: 'Siti Aminah', nik: '3201010101010002', kelamin: 'Perempuan', umur: '4 Bulan' },
        { id: 3, nama: 'Budi Santoso', nik: '3201010101010003', kelamin: 'Laki-laki', umur: '9 Bulan' },
        { id: 4, nama: 'Budi Santoso', nik: '3201010101010004', kelamin: 'Laki-laki', umur: '9 Bulan' },
        { id: 5, nama: 'Budi Santoso', nik: '3201010101010005', kelamin: 'Laki-laki', umur: '9 Bulan' },
        { id: 6, nama: 'Budi Santoso', nik: '3201010101010006', kelamin: 'Laki-laki', umur: '9 Bulan' },
        { id: 7, nama: 'Budi Santoso', nik: '3201010101010007', kelamin: 'Laki-laki', umur: '9 Bulan' }
    ];

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/kader/home" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Data Bayi</h1>
                    </div>

                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-slate-50">

                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                            placeholder="Cari nama atau NIK bayi..."
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        {dummyData.map((bayi) => (
                            <div key={bayi.id} className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center font-bold text-lg shrink-0">
                                        {bayi.nama.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-sm font-bold text-slate-800 line-clamp-1">{bayi.nama}</h2>
                                        <p className="text-xs text-slate-500 font-medium">NIK: {bayi.nik}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100/80">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">J. Kelamin</span>
                                        <span className="text-xs font-bold text-slate-700">{bayi.kelamin}</span>
                                    </div>
                                    <div className="w-px h-6 bg-slate-200"></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Umur</span>
                                        <span className="text-xs font-bold text-slate-700">{bayi.umur}</span>
                                    </div>
                                    <Link href="/kader/detail-bayi" className="ml-2 bg-blue-50 text-blue-600 text-xs font-bold px-4 py-2.5 rounded-full hover:bg-blue-100 hover:text-blue-700 active:scale-95 transition-all shrink-0">
                                        Lihat Detail
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

                {/* Fixed (+) Button */}
                <div className="fixed bottom-[100px] w-full max-w-md mx-auto z-40 pointer-events-none flex justify-end px-6 left-1/2 -translate-x-1/2">
                    <Link href="/kader/pendaftaran-bayi" className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all pointer-events-auto">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    </Link>
                </div>

                <BottombarKader />
            </div>
        </div>
    );
}
