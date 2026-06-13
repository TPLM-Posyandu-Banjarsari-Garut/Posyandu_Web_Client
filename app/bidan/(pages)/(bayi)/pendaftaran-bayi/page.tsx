"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useGetMidwifeProfile } from "@/hooks/query/midwife/useMidwifeProfile";
import { useCreateChild } from "@/hooks/query/child/useManageChildren";
import { CreateChildPayload } from "@/interfaces/child";
import axios from "axios";

interface ChildFormInputs {
  name: string;
  identity_number: string;
  gender: "L" | "P" | "";
  birth_date: string;
  place_of_birth: string;
  birth_order: string;
  blood_type: "A" | "B" | "AB" | "O" | "";
  birth_weight: string;
  birth_length: string;
  birth_head_circumference: string;
  child_category: string;
  // Visual-only fields (or metadata for logs)
  mother_name?: string;
  father_name?: string;
  address?: string;
}

export default function PendaftaranBayi() {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Load Midwife profile to get posyandu_id
  const { data: midwife, isLoading: isMidwifeLoading } = useGetMidwifeProfile();

  // Create Child Mutation
  const createMutation = useCreateChild();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ChildFormInputs>({
    defaultValues: {
      name: "",
      identity_number: "",
      gender: "",
      birth_date: "",
      place_of_birth: "",
      birth_order: "",
      blood_type: "",
      birth_weight: "",
      birth_length: "",
      birth_head_circumference: "",
      child_category: "toddler",
      mother_name: "",
      father_name: "",
      address: "",
    },
  });

  const selectedGender = watch("gender");
  const selectedBloodType = watch("blood_type");
  const birthDateValue = watch("birth_date");

  const onSubmit = handleSubmit((data) => {
    if (!midwife?.posyandu_id) {
      setApiError("ID Posyandu Bidan tidak terdeteksi. Silakan coba masuk kembali.");
      return;
    }

    setApiError("");

    const payload: CreateChildPayload = {
      posyandu_id: midwife.posyandu_id,
      name: data.name,
      identity_number: data.identity_number,
      gender: data.gender as "L" | "P",
      birth_date: data.birth_date ? data.birth_date : null,
      place_of_birth: data.place_of_birth || null,
      birth_order: data.birth_order ? parseInt(data.birth_order) : null,
      blood_type: data.blood_type ? (data.blood_type as "A" | "B" | "AB" | "O") : null,
      birth_weight: data.birth_weight ? parseFloat(data.birth_weight).toFixed(2) : null,
      birth_length: data.birth_length ? parseFloat(data.birth_length).toFixed(2) : null,
      birth_head_circumference: data.birth_head_circumference
        ? parseFloat(data.birth_head_circumference).toFixed(2)
        : null,
      child_category: data.child_category || null,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/bidan/data-bayi");
        }, 1500);
      },
      onError: (err: any) => {
        let msg = "Gagal mendaftarkan data bayi.";
        if (axios.isAxiosError(err)) {
          const resData = err.response?.data as { message?: string } | undefined;
          msg = resData?.message || msg;
        } else if (err instanceof Error) {
          msg = err.message;
        }
        setApiError(msg);
      },
    });
  });

  const isPending = isMidwifeLoading || createMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 pt-8 pb-6 flex items-center justify-between rounded-b-[2rem] shadow-md z-10 shrink-0">
          <Link
            href="/bidan/data-bayi"
            className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-white tracking-wide">Pendaftaran Bayi</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-28 bg-slate-50 relative">
          
          {/* Error Alert Display */}
          {(apiError || Object.keys(errors).length > 0) && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 mb-4 shadow-sm animate-shake">
              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                {apiError && <span>{apiError}</span>}
                {Object.values(errors).map((err, idx) => (
                  <span key={idx} className="block">• {err.message}</span>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            
            {/* 1. Informasi Pribadi */}
            <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                  1
                </div>
                Informasi Pribadi
              </h2>
              
              <div className="space-y-4">
                
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                    Nama Lengkap Bayi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Nama lengkap bayi wajib diisi" })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all font-semibold"
                    placeholder="Contoh: Ahmad Rafli"
                  />
                </div>

                {/* NIK Bayi */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                    NIK Bayi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("identity_number", {
                      required: "NIK bayi wajib diisi",
                      minLength: {
                        value: 16,
                        message: "NIK harus minimal 16 karakter",
                      },
                      maxLength: {
                        value: 16,
                        message: "NIK maksimal 16 karakter",
                      },
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all font-semibold"
                    placeholder="16 digit NIK"
                  />
                </div>

                {/* Gender & Birth Date */}
                <div className="grid grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                      Jenis Kelamin <span className="text-rose-500">*</span>
                    </label>
                    <select
                      {...register("gender", { required: "Jenis kelamin wajib dipilih" })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all font-semibold text-slate-700"
                    >
                      <option value="">Pilih</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                      Tanggal Lahir <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative w-full">
                      <input
                        type="date"
                        {...register("birth_date", { required: "Tanggal lahir bayi wajib diisi" })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10 [color-scheme:light] font-semibold text-slate-700"
                        style={{ color: birthDateValue ? undefined : "transparent" }}
                      />
                      {!birthDateValue && (
                        <span className="absolute inset-y-0 left-4 right-10 z-[1] flex items-center pointer-events-none text-sm text-slate-400">
                          dd/mm/yy
                        </span>
                      )}
                      <div className="absolute inset-y-0 right-0 z-[1] flex items-center pr-3 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Tempat Lahir & Anak Ke */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      {...register("place_of_birth")}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all font-semibold"
                      placeholder="Bandung"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                      Anak Ke-
                    </label>
                    <input
                      type="number"
                      {...register("birth_order")}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all font-semibold"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* BB Lahir, TB Lahir, Gol. Darah */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                      BB Lahir
                    </label>
                    <input
                      type="text"
                      {...register("birth_weight")}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all font-semibold"
                      placeholder="kg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                      TB Lahir
                    </label>
                    <input
                      type="text"
                      {...register("birth_length")}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all font-semibold"
                      placeholder="cm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                      LK Lahir
                    </label>
                    <input
                      type="text"
                      {...register("birth_head_circumference")}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all font-semibold"
                      placeholder="cm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                      Kategori Anak
                    </label>
                    <select
                      {...register("child_category")}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all font-semibold text-slate-700"
                    >
                      <option value="infant">Infant (Bayi)</option>
                      <option value="toddler">Toddler (Balita)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                      Gol. Darah
                    </label>
                    <select
                      {...register("blood_type")}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all font-semibold text-slate-700"
                    >
                      <option value="">Pilih</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. Data Orang Tua (Metadata / Form support) */}
            <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
                  2
                </div>
                Data Orang Tua
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                    Nama Ibu
                  </label>
                  <input
                    type="text"
                    {...register("mother_name")}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm transition-all font-semibold"
                    placeholder="Nama Ibu Kandung"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                    Nama Ayah
                  </label>
                  <input
                    type="text"
                    {...register("father_name")}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-sm transition-all font-semibold"
                    placeholder="Nama Ayah Kandung"
                  />
                </div>
              </div>
            </div>

            {/* 3. Alamat Tambahan */}
            <div className="bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">
                  3
                </div>
                Alamat Tinggal
              </h2>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">
                  Alamat Lengkap
                </label>
                <textarea
                  {...register("address")}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all font-semibold"
                  rows={3}
                  placeholder="Detail jalan, RT/RW, kelurahan..."
                ></textarea>
              </div>
            </div>

            {/* Fixed Submit Button Area inside scroll container */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 text-white rounded-[1.25rem] py-4 font-bold shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-blue-700 active:scale-95 transition-all text-center flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <span>Simpan Data Bayi</span>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Success Notification Popup Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-[290px] rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col items-center justify-center animate-scale-up text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(16,185,129,0.2)] animate-bounce">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-base font-extrabold text-slate-800 mb-1">Pendaftaran Berhasil</h2>
            <p className="text-xs text-slate-500 leading-normal font-semibold">
              Data bayi telah berhasil terdaftar ke database posyandu.
            </p>
          </div>
        </div>
      )}

      {/* Custom styles for animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
