"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import BottombarBidan from "@/components/ui/bottombar/bidan/BottombarBidan";
import { useGetChildById, useUpdateChild } from "@/hooks/query/child/useManageChildren";
import { useGetPosyandus } from "@/hooks/query/posyandu/useManagePosyandu";
import { useGetUsers } from "@/hooks/query/userAdmin/UseManageUsers";
import { CreateChildPayload } from "@/interfaces/child";

function DetailBayiContent() {
  const searchParams = useSearchParams();
  const childId = searchParams.get("id") || "";

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<CreateChildPayload>>({});
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [motherSearch, setMotherSearch] = useState("");
  const [showMotherDropdown, setShowMotherDropdown] = useState(false);

  // Queries & Mutations
  const { data: childResponse, isLoading: isChildLoading, error: childError } = useGetChildById(childId);
  const { data: posyandusData } = useGetPosyandus({ limit: 100 });
  const { data: motherUsersData, isLoading: isMotherLoading } = useGetUsers({
    role: "parent",
    search: motherSearch || undefined,
    limit: 10,
  });
  const updateMutation = useUpdateChild();

  const child = childResponse?.data;

  // Initialize editedData when child detail is loaded
  useEffect(() => {
    if (child) {
      setEditedData({
        posyandu_id: child.posyandu_id || "",
        name: child.name || "",
        identity_number: child.identity_number || "",
        gender: child.gender || "male",
        child_category: child.child_category || "toddler",
        place_of_birth: child.place_of_birth || "",
        birth_date: child.birth_date ? new Date(child.birth_date).toISOString().split("T")[0] : "",
        birth_order: child.birth_order || null,
        blood_type: child.blood_type || null,
        birth_weight: child.birth_weight || "",
        birth_length: child.birth_length || "",
        birth_head_circumference: child.birth_head_circumference || "",
        parent_user_id: child.parent_user_id || null,
        mother_name: child.mother_name || "",
      } as any);
    }
  }, [child]);

  if (isChildLoading) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
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

  if (childError || !child) {
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
          <Link href="/bidan/data-bayi" className="bg-blue-600 text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all">
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  const posyanduName = posyandusData?.data.find((p) => p.id === child.posyandu_id)?.name || "Mawar 1";

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

  const handleEditToggle = () => {
    if (!isEditing && child) {
      setEditedData({
        posyandu_id: child.posyandu_id || "",
        name: child.name || "",
        identity_number: child.identity_number || "",
        gender: child.gender || "male",
        child_category: child.child_category || "toddler",
        place_of_birth: child.place_of_birth || "",
        birth_date: child.birth_date ? new Date(child.birth_date).toISOString().split("T")[0] : "",
        birth_order: child.birth_order || null,
        blood_type: child.blood_type || null,
        birth_weight: child.birth_weight || "",
        birth_length: child.birth_length || "",
        birth_head_circumference: child.birth_head_circumference || "",
        parent_user_id: child.parent_user_id || null,
        mother_name: child.mother_name || "",
      } as any);
      setApiError("");
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (field: keyof CreateChildPayload, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const payload: Partial<CreateChildPayload> = {
      posyandu_id: editedData.posyandu_id || undefined,
      name: editedData.name || undefined,
      identity_number: editedData.identity_number || undefined,
      gender: editedData.gender as "male" | "female",
      birth_date: editedData.birth_date ? editedData.birth_date : null,
      place_of_birth: editedData.place_of_birth || null,
      birth_order: editedData.birth_order ? Number(editedData.birth_order) : null,
      blood_type: editedData.blood_type ? (editedData.blood_type as "A" | "B" | "AB" | "O") : null,
      birth_weight: editedData.birth_weight ? parseFloat(editedData.birth_weight.toString()).toFixed(2) : null,
      birth_length: editedData.birth_length ? parseFloat(editedData.birth_length.toString()).toFixed(2) : null,
      birth_head_circumference: editedData.birth_head_circumference
        ? parseFloat(editedData.birth_head_circumference.toString()).toFixed(2)
        : null,
      child_category: editedData.child_category || null,
      parent_user_id: editedData.parent_user_id !== undefined ? editedData.parent_user_id : undefined,
    };

    updateMutation.mutate(
      { id: childId, payload },
      {
        onSuccess: () => {
          setIsEditing(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        },
        onError: (err: any) => {
          let msg = "Gagal memperbarui data bayi.";
          if (axios.isAxiosError(err)) {
            const resData = err.response?.data as
              | { message?: string; errors?: Record<string, string[]> }
              | undefined;

            if (resData?.errors) {
              const errorDetails = Object.entries(resData.errors)
                .map(([field, msgs]) => {
                  const IndonesianFieldNames: Record<string, string> = {
                    posyandu_id: "Posyandu",
                    name: "Nama Lengkap",
                    identity_number: "NIK",
                    gender: "Jenis Kelamin",
                    birth_date: "Tanggal Lahir",
                    place_of_birth: "Tempat Lahir",
                    birth_order: "Anak Ke-",
                    blood_type: "Gol. Darah",
                    birth_weight: "BB Lahir",
                    birth_length: "TB Lahir",
                    birth_head_circumference: "LK Lahir",
                    child_category: "Kategori Anak",
                  };
                  const fieldName = IndonesianFieldNames[field] || field;
                  return `${fieldName}: ${msgs.join(", ")}`;
                })
                .join(", ");
              msg = `${resData.message} (${errorDetails})`;
            } else {
              msg = resData?.message || msg;
            }
          } else if (err instanceof Error) {
            msg = err.message;
          }
          setApiError(msg);
        },
      }
    );
  };

  const lokasiAdministratif = [
    { label: "Provinsi", value: "Jawa Barat" },
    { label: "Kabupaten / Kota", value: "Garut" },
    { label: "Kecamatan", value: "Banjarsari" },
    { label: "Puskesmas", value: "Puskesmas Banjarsari" },
    { label: "Desa / Kelurahan", value: "Banjarsari" },
    { label: "Nama Posyandu", value: posyanduName },
    { label: "RT / RW", value: "001 / 002" },
    { label: "Alamat", value: "Jl. Raya Banjarsari No. 10" },
  ];

  const dataPengukuran = [
    { label: "Tanggal Pengukuran", value: "15 Mei 2026" },
    { label: "Usia Saat Ukur", value: "6 Bulan 5 Hari" },
    { label: "Berat Badan Sekarang", value: "7.5 kg" },
    { label: "Tinggi Badan Sekarang", value: "65 cm" },
    { label: "Cara Ukur", value: "Telentang" },
    { label: "Lingkar Lengan Atas", value: "14 cm" },
  ];

  const statusGizi = [
    { label: "Berat Badan / Umur", value: "Normal", zs: "0.5" },
    { label: "Tinggi Badan / Umur", value: "Normal", zs: "0.2" },
    { label: "Berat Badan / Tinggi Badan", value: "Normal", zs: "0.3" },
    { label: "Naik Berat Badan", value: "Ya (N)" },
  ];

  const programPemantauan = [
    { label: "Jumlah Vitamin A", value: "1 Kapsul Biru" },
    { label: "KPSP", value: "Sesuai" },
    { label: "Buku KIA", value: "Memiliki" },
    { label: "Kelas Ibu Balita", value: "Mengikuti" },
    { label: "MBG (Makan Bergizi Gratis)", value: "Ya" },
    { label: "Detail Tambahan", value: "Kondisi umum sangat baik, aktif bergerak." },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Header Background */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 z-0 rounded-b-[2.5rem]"></div>

        <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
          <Link
            href="/bidan/data-bayi"
            className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-white tracking-wide">
            {isEditing ? "Edit Detail Bayi" : "Detail Bayi"}
          </h1>
          <button
            onClick={handleEditToggle}
            className={`p-2 -mr-2 rounded-full backdrop-blur-md transition-colors ${
              isEditing
                ? "bg-rose-500/20 text-rose-200 hover:bg-rose-500/30"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {isEditing ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex flex-col items-center mb-6">
            <div
              className={`w-24 h-24 rounded-full border-[6px] border-white shadow-md flex items-center justify-center mb-4 -mt-16 text-4xl font-extrabold ${
                child.gender === "male" ? "bg-blue-100 text-blue-500" : "bg-pink-100 text-pink-500"
              }`}
            >
              {child.name ? child.name.charAt(0).toUpperCase() : "A"}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1.5 text-center px-2">
              {child.name}
            </h2>
            <div className="bg-blue-50/60 text-blue-600 px-4 py-1.5 rounded-full text-xs font-extrabold mb-5 border border-blue-100/50">
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

          {isEditing ? (
            /* Update Form */
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              {apiError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-4 rounded-2xl flex items-center gap-3">
                  <span>{apiError}</span>
                </div>
              )}

              <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Informasi Pribadi</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Nama Lengkap Bayi</label>
                  <input
                    type="text"
                    value={editedData.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">NIK Bayi</label>
                  <input
                    type="text"
                    value={editedData.identity_number || ""}
                    onChange={(e) => handleFieldChange("identity_number", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold"
                    maxLength={16}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Jenis Kelamin</label>
                    <select
                      value={editedData.gender || ""}
                      onChange={(e) => handleFieldChange("gender", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-700"
                      required
                    >
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={editedData.birth_date || ""}
                      onChange={(e) => handleFieldChange("birth_date", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-700"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Tempat Lahir</label>
                    <input
                      type="text"
                      value={editedData.place_of_birth || ""}
                      onChange={(e) => handleFieldChange("place_of_birth", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Anak Ke-</label>
                    <input
                      type="number"
                      value={editedData.birth_order || ""}
                      onChange={(e) => handleFieldChange("birth_order", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">BB Lahir (kg)</label>
                    <input
                      type="text"
                      value={editedData.birth_weight || ""}
                      onChange={(e) => handleFieldChange("birth_weight", e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">TB Lahir (cm)</label>
                    <input
                      type="text"
                      value={editedData.birth_length || ""}
                      onChange={(e) => handleFieldChange("birth_length", e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">LK Lahir (cm)</label>
                    <input
                      type="text"
                      value={editedData.birth_head_circumference || ""}
                      onChange={(e) => handleFieldChange("birth_head_circumference", e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Kategori Anak</label>
                    <select
                      value={editedData.child_category || ""}
                      onChange={(e) => handleFieldChange("child_category", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-700"
                    >
                      <option value="infant">Infant (Bayi)</option>
                      <option value="toddler">Toddler (Balita)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Gol. Darah</label>
                    <select
                      value={editedData.blood_type || ""}
                      onChange={(e) => handleFieldChange("blood_type", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-700"
                    >
                      <option value="">Pilih</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Posyandu</label>
                  <select
                    value={editedData.posyandu_id || ""}
                    onChange={(e) => handleFieldChange("posyandu_id", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-700"
                    required
                  >
                    <option value="">Pilih Posyandu</option>
                    {posyandusData?.data.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data Orang Tua / Ibu Kandung */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                    Nama Ibu Kandung
                  </label>
                  
                  {/* Dropdown Toggle Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowMotherDropdown(true);
                      setMotherSearch("");
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm font-semibold text-left flex justify-between items-center"
                  >
                    <span className={(editedData as any).mother_name ? "text-slate-800" : "text-slate-400"}>
                      {(editedData as any).mother_name || "Pilih Ibu Kandung"}
                    </span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Backdrop to close dropdown when clicking outside */}
                  {showMotherDropdown && (
                    <div 
                      className="fixed inset-0 z-20 cursor-default" 
                      onClick={() => setShowMotherDropdown(false)}
                    />
                  )}

                  {/* Dropdown Card */}
                  {showMotherDropdown && (
                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-30 flex flex-col gap-2 max-h-60 overflow-hidden">
                      {/* Search Bar inside Dropdown */}
                      <div className="relative shrink-0">
                        <input
                          type="text"
                          value={motherSearch}
                          onChange={(e) => setMotherSearch(e.target.value)}
                          placeholder="Cari nama ibu..."
                          className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-xs font-semibold"
                          autoFocus
                        />
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* Parent Users List Container */}
                      <div className="overflow-y-auto custom-scrollbar flex-1 space-y-1 pr-1">
                        {isMotherLoading ? (
                          <div className="py-4 text-center text-xs font-semibold text-slate-400 flex justify-center items-center gap-1.5">
                            <svg className="animate-spin h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Mencari...
                          </div>
                        ) : motherUsersData?.data && motherUsersData.data.length > 0 ? (
                          motherUsersData.data.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => {
                                handleFieldChange("parent_user_id", user.id);
                                handleFieldChange("mother_name", user.name);
                                setShowMotherDropdown(false);
                              }}
                              className="w-full px-3 py-2 rounded-lg text-left hover:bg-purple-50 text-xs font-semibold transition-colors flex flex-col gap-0.5"
                            >
                              <span className="text-slate-800 font-bold">{user.name}</span>
                              <span className="text-slate-400 text-[10px]">{user.email}</span>
                            </button>
                          ))
                        ) : (
                          <div className="py-4 text-center text-xs font-semibold text-slate-400">
                            Orang tua tidak ditemukan
                          </div>
                        )}
                      </div>

                      {/* Clear Button */}
                      {((editedData as any).mother_name || (editedData as any).parent_user_id) && (
                        <div className="border-t border-slate-100 pt-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              handleFieldChange("parent_user_id", null);
                              handleFieldChange("mother_name", "");
                              setShowMotherDropdown(false);
                            }}
                            className="w-full py-1.5 text-center text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                          >
                            Hapus Pilihan
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pb-10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-slate-100 text-slate-600 font-extrabold py-3.5 rounded-[1.25rem] active:scale-95 transition-all text-center text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-blue-600 text-white font-extrabold py-3.5 rounded-[1.25rem] shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-blue-700 active:scale-95 transition-all text-center text-xs flex justify-center items-center gap-2"
                >
                  {updateMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Detail View */
            <>
              {/* Data Orang Tua */}
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
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-3 last:pb-0"
                    >
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
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-3 last:pb-0"
                    >
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
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b border-slate-100 last:border-0 pb-3 last:pb-0"
                    >
                      <span className="text-xs font-semibold text-slate-500 flex-1">{item.label}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-800">{item.value}</span>
                        {item.zs && (
                          <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full mt-1">
                            ZS: {item.zs}
                          </span>
                        )}
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
                    <div
                      key={idx}
                      className="flex justify-between items-start border-b border-slate-100 last:border-0 pb-3 last:pb-0"
                    >
                      <span className="text-xs font-semibold text-slate-500 w-2/5">{item.label}</span>
                      <span className="text-sm font-bold text-slate-800 w-3/5 text-right leading-tight">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action buttons */}
              <div className="flex flex-col gap-3 pb-10">
                <Link
                  href={`/bidan/buat-data-imunisasi?bayiId=${child.id}`}
                  className="w-full bg-blue-600 text-white rounded-[1.25rem] py-4 font-bold shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-center block text-sm"
                >
                  Lihat / Input Riwayat Imunisasi
                </Link>
                <button className="w-full bg-white text-blue-600 border-[2.5px] border-blue-100 rounded-[1.25rem] py-3.5 font-bold hover:bg-blue-50 hover:border-blue-200 transition-colors text-sm">
                  Grafik Pertumbuhan
                </button>
              </div>
            </>
          )}
        </div>

        <BottombarBidan />
      </div>

      {/* Success Notification Alert overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-[290px] rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col items-center justify-center animate-scale-up text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(16,185,129,0.2)] animate-bounce">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-base font-extrabold text-slate-800 mb-1">Pembaruan Berhasil</h2>
            <p className="text-xs text-slate-500 leading-normal font-semibold">
              Data bayi telah berhasil diperbarui di database.
            </p>
          </div>
        </div>
      )}

      {/* Embedded style tags for animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default function DetailBayi() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
          <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-48 rounded-t-[2rem] rounded-b-[2.5rem] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-white text-xs font-bold tracking-wider">Memuat...</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <DetailBayiContent />
    </Suspense>
  );
}
