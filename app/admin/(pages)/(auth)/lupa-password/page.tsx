"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useForgetPasswordAdmin } from "@/hooks/query/authAdmin/useForgetPasswordAdmin";

interface ForgetPasswordForm {
  email: string;
}

export default function LupaPasswordAdmin() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgetPasswordForm>();
  const forgetPasswordMutation = useForgetPasswordAdmin();

  const onSubmit = (data: ForgetPasswordForm) => {
    forgetPasswordMutation.mutate(data.email, {
      onSuccess: () => {
        router.push(`/admin/lupa-password/otp?email=${encodeURIComponent(data.email)}`);
      },
    });
  };

  const isLoading = forgetPasswordMutation.isPending;
  const error = forgetPasswordMutation.error?.message;

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-0 sm:px-0 text-slate-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-10 pb-16 flex flex-col relative z-0 shrink-0">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border border-white/35 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all self-start mb-8 cursor-pointer"
            title="Kembali"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight transition-all duration-300">
            Lupa Kata Sandi
          </h1>
          <p className="text-white/80 text-sm mt-2 font-medium">
            Masukkan email Anda untuk menerima kode OTP pemulihan kata sandi.
          </p>
        </div>

        <div className="bg-white rounded-t-[2.5rem] -mt-8 pt-8 px-6 pb-8 flex-1 flex flex-col justify-between relative z-10">
          <div className="flex flex-col">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 shadow-sm mb-5">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{error}</span>
              </div>
            )}
            
            {errors.email && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 shadow-sm mb-5">
                <span>Email wajib diisi</span>
              </div>
            )}

            <form id="forgetPasswordForm" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-[1.25rem] p-3 hover:border-slate-350 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="bg-transparent border-none outline-none p-0 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:ring-0 w-full"
                    placeholder="contoh@email.com"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <button
              type="submit"
              form="forgetPasswordForm"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-full active:scale-98 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] flex justify-center items-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <span className="tracking-wide text-sm">Kirim OTP</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
