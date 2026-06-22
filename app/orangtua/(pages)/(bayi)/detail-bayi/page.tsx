"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BottombarOrtu from "@/components/ui/bottombar/orangtua/BottombarOrtu";
import { useGetOrangTuaChildById } from "@/hooks/query/orangtua/useOrangTuaChildren";

function DetailBayiContent() {
  const searchParams = useSearchParams();
  const childId = searchParams.get("id") || "";

  const { data: child, isLoading, error } = useGetOrangTuaChildById(childId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center animate-pulse">
        <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-48 rounded-t-[2rem] rounded-b-[2.5rem] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-white text-xs font-bold tracking-wider">Memuat Data Bayi...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
        <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200 p-6 items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-base font-extrabold text-slate-800 mb-1">Data Bayi Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500 mb-6 max-w-[220px]">
            Data bayi tidak dapat dimuat atau telah dihapus.
          </p>
          <Link href="/orangtua/data-bayi" className="bg-blue-600 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all">
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  const calculateAge = (birthDateStr?: string | null) => {
    if (!birthDateStr) return "-";
    const birthDate = new Date(birthDateStr);
    const today = new Date();

    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();

    if (months < 1) {
      const diffTime = Math.abs(today.getTime() - birthDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} Hari`;
    }
    return `${months} Bulan`;
  };

  const formatDateIndo = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const lokasiAdministratif = [
    { label: "Provinsi", value: "Jawa Barat" },
    { label: "Kabupaten / Kota", value: "Garut" },
    { label: "Kecamatan", value: "Banjarsari" },
    { label: "Puskesmas", value: "Puskesmas Banjarsari" },
    { label: "Desa / Kelurahan", value: child.posyandu_detail?.village_name || "-" },
    { label: "Nama Posyandu", value: child.posyandu_detail?.name || "-" },
    { label: "RT / RW", value: child.posyandu_detail?.rt && child.posyandu_detail?.rw ? `${child.posyandu_detail.rt} / ${child.posyandu_detail.rw}` : "-" },
    { label: "Alamat", value: child.posyandu_detail?.address_line || "-" },
  ];

  const dataPengukuran = [
    {
      label: "Tanggal Pengukuran",
      value: child.latest_nutrition?.measurement_date
        ? formatDateIndo(child.latest_nutrition.measurement_date)
        : "-",
    },
    {
      label: "Usia Saat Ukur",
      value: child.latest_nutrition?.age_months != null ? `${child.latest_nutrition.age_months} Bulan` : "-",
    },
    {
      label: "Berat Badan Sekarang",
      value: child.latest_nutrition?.weight_kg ? `${child.latest_nutrition.weight_kg} kg` : "-",
    },
    {
      label: "Tinggi Badan Sekarang",
      value: child.latest_nutrition?.height_cm ? `${child.latest_nutrition.height_cm} cm` : "-",
    },
    {
      label: "Lingkar Kepala",
      value: child.latest_nutrition?.head_circumference_cm ? `${child.latest_nutrition.head_circumference_cm} cm` : "-",
    },
  ];

  const statusGizi = [
    {
      label: "Status Gizi",
      value: child.latest_nutrition?.nutrition_status ? child.latest_nutrition.nutrition_status.toUpperCase() : "-",
    },
  ];

  const programPemantauan = [
    {
      label: "Vitamin A",
      value: child.latest_vitamin
        ? `Diberikan (Bulan ${child.latest_vitamin.distribution_period} ${child.latest_vitamin.distribution_year})`
        : "-",
    },
    { label: "KPSP", value: "-" },
    { label: "Buku KIA", value: "-" },
    { label: "Kelas Ibu Balita", value: "-" },
    { label: "MBG (Makan Bergizi Gratis)", value: "-" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Header - Transparent over colored background */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

        <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
          <Link
            href="/orangtua/data-bayi"
            className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-white tracking-wide">Detail Bayi</h1>
          <div className="w-10"></div> {/* Balanced spacing */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex flex-col items-center mb-6 border border-slate-100">
            <div className={`w-24 h-24 rounded-full border-[6px] border-white shadow-md flex items-center justify-center mb-4 -mt-16 text-4xl font-extrabold ${
              child.gender === "male" ? "bg-blue-100 text-blue-500" : "bg-pink-100 text-pink-500"
            }`}>
              {child.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1.5 text-center px-2 leading-tight">
              {child.name}
            </h2>
            <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold mb-5 border border-blue-100/50">
              NIK: {child.identity_number}
            </div>

            <div className="w-full grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
              <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Umur</span>
                <span className="text-xs font-bold text-slate-800">
                  {calculateAge(child.birth_date)}
                </span>
              </div>
              <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Kelamin</span>
                <span className="text-xs font-bold text-slate-800 truncate max-w-full">
                  {child.gender === "male" ? "Laki-laki" : "Perempuan"}
                </span>
              </div>
              <div className="flex flex-col items-center p-2.5 bg-slate-50/80 rounded-[1rem] border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Tgl Lahir</span>
                <span className="text-[10px] font-bold text-slate-800 truncate max-w-full">
                  {child.birth_date ? formatDateIndo(child.birth_date).split(" ").slice(0, 2).join(" ") : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Orang Tua */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Data Orang Tua</h3>
            <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Nama Ibu</p>
                  <p className="text-sm font-bold text-slate-800">{child.mother_name || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Lahir & Fisik */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 px-2">Detail Lahir & Fisik</h3>
            <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold text-slate-500 w-1/2">Tempat Lahir</span>
                <span className="text-sm font-bold text-slate-800 w-1/2 text-right">{child.place_of_birth || "-"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold text-slate-500 w-1/2">Kategori Anak</span>
                <span className="text-sm font-bold text-slate-800 w-1/2 text-right">
                  {child.child_category === "infant" ? "Infant (Bayi)" : child.child_category === "toddler" ? "Toddler (Balita)" : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold text-slate-500 w-1/2">Anak Ke-</span>
                <span className="text-sm font-bold text-slate-800 w-1/2 text-right">{child.birth_order || "-"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold text-slate-500 w-1/2">Gol. Darah</span>
                <span className="text-sm font-bold text-slate-800 w-1/2 text-right">{child.blood_type || "-"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold text-slate-500 w-1/2">Berat Badan Lahir</span>
                <span className="text-sm font-bold text-slate-800 w-1/2 text-right">{child.birth_weight ? `${child.birth_weight} kg` : "-"}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold text-slate-500 w-1/2">Tinggi Badan Lahir</span>
                <span className="text-sm font-bold text-slate-800 w-1/2 text-right">{child.birth_length ? `${child.birth_length} cm` : "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 w-1/2">Lingkar Kepala Lahir</span>
                <span className="text-sm font-bold text-slate-800 w-1/2 text-right">{child.birth_head_circumference ? `${child.birth_head_circumference} cm` : "-"}</span>
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
                <div key={idx} className="flex justify-between items-center last:border-0 pb-3 last:pb-0">
                  <span className="text-xs font-semibold text-slate-500 flex-1">{item.label}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-800">{item.value}</span>
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

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pb-10">
            <Link
              href={`/orangtua/buat-data-imunisasi?bayiId=${child.id}&nama=${encodeURIComponent(child.name)}`}
              className="w-full bg-blue-600 text-white rounded-[1.25rem] py-4 font-bold shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-center block text-sm"
            >
              Lihat Riwayat Imunisasi
            </Link>
            <button className="w-full bg-white text-blue-600 border-[2.5px] border-blue-100 rounded-[1.25rem] py-3.5 font-bold hover:bg-blue-50 hover:border-blue-200 transition-colors text-sm">
              Grafik Pertumbuhan
            </button>
          </div>

        </div>

        <BottombarOrtu />
      </div>
    </div>
  );
}

export default function DetailBayi() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
          <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200 justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-slate-500 text-xs font-bold tracking-wider">Memuat Halaman...</span>
            </div>
          </div>
        </div>
      }
    >
      <DetailBayiContent />
    </Suspense>
  );
}
