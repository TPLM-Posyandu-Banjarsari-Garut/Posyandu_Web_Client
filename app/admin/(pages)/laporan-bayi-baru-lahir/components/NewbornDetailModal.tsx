"use client";

import React from "react";
import { NewbornReportItem } from "@/interfaces/child";

interface NewbornDetailModalProps {
  item: NewbornReportItem | null;
  onClose: () => void;
}

function formatDateIndo(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function NewbornDetailModal({ item, onClose }: NewbornDetailModalProps) {
  if (!item) return null;

  const isMale = item.gender === "male";

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-h-[85vh] rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col animate-scale-up overflow-hidden">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${
                isMale ? "bg-sky-50 text-sky-600" : "bg-pink-50 text-pink-600"
              }`}
            >
              {isMale ? "👦" : "👧"}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Detail Data Bayi Lahir
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">
                Laporan Kependudukan & Catatan Sipil
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Tutup"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-4 pr-1 text-slate-700 text-xs custom-scrollbar">
          
          {/* Section: Identitas Bayi */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
            <h4 className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>👶</span> Identitas Bayi Baru Lahir
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Nama Lengkap:</span>
                <span className="font-bold text-slate-800">{item.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">NIK Bayi:</span>
                <span className="font-bold font-mono text-slate-800">{item.identity_number || "-"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Jenis Kelamin:</span>
                <span className="font-semibold text-slate-800">
                  {isMale ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Anak Ke-:</span>
                <span className="font-semibold text-slate-800">
                  {item.birth_order ? `Anak ke-${item.birth_order}` : "-"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Tempat Lahir:</span>
                <span className="font-semibold text-slate-800">{item.place_of_birth || "-"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Tanggal Lahir:</span>
                <span className="font-semibold text-slate-800">{formatDateIndo(item.birth_date)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Golongan Darah:</span>
                <span className="font-semibold text-slate-800">{item.blood_type || "-"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Kategori Anak:</span>
                <span className="font-semibold text-slate-800 capitalize">{item.child_category || "Bayi"}</span>
              </div>
            </div>
          </div>

          {/* Section: Antropometri Lahir */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
            <h4 className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>📏</span> Antropometri & Kondisi Lahir
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white rounded-xl p-2 border border-slate-100">
                <span className="text-[9px] text-slate-400 block font-bold">Berat Lahir</span>
                <span className="text-xs font-black text-blue-600">
                  {item.birth_weight ? `${item.birth_weight} kg` : "-"}
                </span>
              </div>
              <div className="bg-white rounded-xl p-2 border border-slate-100">
                <span className="text-[9px] text-slate-400 block font-bold">Panjang Lahir</span>
                <span className="text-xs font-black text-blue-600">
                  {item.birth_length ? `${item.birth_length} cm` : "-"}
                </span>
              </div>
              <div className="bg-white rounded-xl p-2 border border-slate-100">
                <span className="text-[9px] text-slate-400 block font-bold">Lingkar Kepala</span>
                <span className="text-xs font-black text-blue-600">
                  {item.birth_head_circumference ? `${item.birth_head_circumference} cm` : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Data Ibu / Orang Tua */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
            <h4 className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>👩</span> Data Ibu / Orang Tua
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Nama Ibu:</span>
                <span className="font-bold text-slate-800">{item.mother_name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">NIK Ibu:</span>
                <span className="font-mono font-bold text-slate-800">{item.mother_nik || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Kontak (HP/WA):</span>
                <span className="font-semibold text-slate-800">{item.mother_phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Alamat:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[60%]">
                  {item.mother_address || "-"}
                  {item.mother_rt || item.mother_rw
                    ? ` (RT ${item.mother_rt || "00"}/RW ${item.mother_rw || "00"})`
                    : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Wilayah Posyandu */}
          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
            <h4 className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>🏥</span> Wilayah Posyandu
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Nama Posyandu:</span>
                <span className="font-bold text-slate-800">{item.posyandu_name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Wilayah Desa/Dusun:</span>
                <span className="font-semibold text-slate-800">
                  {item.posyandu_village || "Banjarsari"}
                </span>
              </div>
              {(item.posyandu_rt || item.posyandu_rw) && (
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">RT / RW Posyandu:</span>
                  <span className="font-semibold text-slate-800">
                    RT {item.posyandu_rt || "-"} / RW {item.posyandu_rw || "-"}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Button */}
        <div className="pt-4 border-t border-slate-100 mt-2 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-full text-xs transition-colors cursor-pointer"
          >
            Tutup Informasi
          </button>
        </div>

      </div>
    </div>
  );
}
