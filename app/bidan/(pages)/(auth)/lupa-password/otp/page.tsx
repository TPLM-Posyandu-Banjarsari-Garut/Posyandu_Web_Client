"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useResetPasswordBidan } from "@/hooks/query/authBidan/useResetPasswordBidan";
import { ResetPasswordOTPPayload } from "@/interfaces/auth";

export default function OTPResetPasswordBidan() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordOTPPayload>({
    defaultValues: { email },
  });
  const resetPasswordMutation = useResetPasswordBidan();

  const onSubmit = (data: ResetPasswordOTPPayload) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/bidan/login");
        }, 2000);
      },
    });
  };

  const isLoading = resetPasswordMutation.isPending;
  const error = resetPasswordMutation.error?.message;

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <p className="text-slate-600 mb-4">Email tidak ditemukan. Silakan ulangi proses lupa kata sandi.</p>
          <button onClick={() => router.push('/bidan/lupa-password')} className="text-blue-600 font-bold hover:underline">
            Kembali
          </button>
        </div>
      </div>
    );
  }

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
            Ubah Kata Sandi
          </h1>
          <p className="text-white/80 text-sm mt-2 font-medium">
            Masukkan kode OTP yang dikirimkan ke <span className="font-bold">{email}</span> beserta kata sandi baru Anda.
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
            
            {errors.otp && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 shadow-sm mb-5">
                <span>Kode OTP wajib diisi</span>
              </div>
            )}
            
            {errors.password && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 shadow-sm mb-5">
                <span>Kata sandi baru wajib diisi (min. 8 karakter)</span>
              </div>
            )}

            <form id="resetPasswordForm" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <input type="hidden" {...register("email")} />

              <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-[1.25rem] p-3 hover:border-slate-350 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Kode OTP
                  </label>
                  <input
                    type="text"
                    {...register("otp", { required: true })}
                    className="bg-transparent border-none outline-none p-0 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:ring-0 w-full tracking-widest"
                    placeholder="Masukkan OTP"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-[1.25rem] p-3 hover:border-slate-350 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div className="flex flex-col flex-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Kata Sandi Baru
                  </label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    {...register("password", { required: true, minLength: 8 })}
                    className="bg-transparent border-none outline-none p-0 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:ring-0 w-full"
                    placeholder="Minimal 8 karakter"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer mr-1"
                >
                  {passwordVisible ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <button
              type="submit"
              form="resetPasswordForm"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-full active:scale-98 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] flex justify-center items-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span className="tracking-wide text-sm">Simpan Kata Sandi</span>
              )}
            </button>
          </div>
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
            <h2 className="text-base font-extrabold text-slate-800 mb-1">Berhasil!</h2>
            <p className="text-xs text-slate-500 leading-normal font-semibold">
              Kata sandi Anda berhasil diubah. Silakan login kembali.
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
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
