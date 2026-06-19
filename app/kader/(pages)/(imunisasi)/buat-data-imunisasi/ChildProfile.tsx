'use client';

import { Child } from "@/interfaces/child";

interface ChildProfileProps {
    child: Child;
    calculateAge: (birthDateStr?: string | null) => string;
    formatDateIndo: (dateStr?: string | null) => string;
}

export default function ChildProfile({ child, calculateAge, formatDateIndo }: ChildProfileProps) {
    const matchedBaby = {
        id: child.id,
        nama: child.name,
        nik: child.identity_number,
        umur: calculateAge(child.birth_date),
        kelamin: child.gender === 'male' ? 'Laki-laki' : 'Perempuan',
        tanggalLahir: formatDateIndo(child.birth_date),
        orangTua: child.mother_name || "-",
        posyandu: child.posyandu_detail?.name || "-",
        terakhirDiperbarui: formatDateIndo(child.updated_at)
    };

    return (
        <>
            {/* Profile Card */}
            <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex flex-col items-center mb-6 border border-slate-100">
                <div className="w-24 h-24 rounded-full bg-pink-100 border-[6px] border-white shadow-md flex items-center justify-center mb-4 -mt-16 text-pink-500">
                    {matchedBaby.kelamin === 'Laki-laki' ? (
                        <div className="w-24 h-24 rounded-full bg-blue-100 border-[6px] border-white shadow-md flex items-center justify-center text-blue-500 font-bold text-4xl">
                            {matchedBaby.nama.charAt(0)}
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-pink-100 border-[6px] border-white shadow-md flex items-center justify-center text-pink-500 font-bold text-4xl">
                            {matchedBaby.nama.charAt(0)}
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-1.5 text-center leading-tight">
                    {matchedBaby.nama}
                </h2>

                <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold mb-5 border border-blue-100">
                    NIK: {matchedBaby.nik}
                </div>

                <div className="w-full grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
                    <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Umur</span>
                        <span className="text-xs font-bold text-slate-800">{matchedBaby.umur}</span>
                    </div>
                    <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Kelamin</span>
                        <span className="text-xs font-bold text-slate-800 truncate max-w-full">{matchedBaby.kelamin}</span>
                    </div>
                    <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Tgl Lahir</span>
                        <span className="text-[10px] font-bold text-slate-800 truncate max-w-full">
                            {matchedBaby.tanggalLahir.split(' ')[0]} {matchedBaby.tanggalLahir.split(' ')[1]?.slice(0, 3)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Administrative Info Card */}
            <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Data Orang Tua & Lokasi</h3>
                <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-xs font-semibold text-slate-500">Nama Orang Tua</span>
                        <span className="text-xs font-bold text-slate-850 text-right">{matchedBaby.orangTua}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-xs font-semibold text-slate-500">Nama Posyandu</span>
                        <span className="text-xs font-bold text-slate-850 text-right">{matchedBaby.posyandu}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Terakhir Diperbarui</span>
                        <span className="text-xs font-bold text-slate-850 text-right">{formatDateIndo(child.updated_at)}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
