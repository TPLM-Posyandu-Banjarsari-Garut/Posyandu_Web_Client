"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  verifyEmailOTP,
  resendEmailOTP,
  changePassword,
} from "@/service/auth/authService";
import axios from "axios";

export interface OtpVerificationCardProps {
  roleName: string;
  loginPath: string;
  homePath: string;
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{12,100}$/;

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export default function OtpVerificationCard({
  roleName,
  loginPath,
  homePath,
}: OtpVerificationCardProps) {
  const router = useRouter();

  // Lazy initialization to avoid calling setState directly in useEffect
  const [email] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("verify_email") ?? "";
    }
    return "";
  });

  // Flow stages: "otp" | "suggestion" | "change_password" | "done"
  const [stage, setStage] = useState<"otp" | "suggestion" | "change_password" | "done">("otp");

  // OTP State (6 digits)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Timer
  const [otpTimer, setOtpTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Redirect to login if email is not available
  useEffect(() => {
    if (!email) {
      router.replace(loginPath);
    }
  }, [email, loginPath, router]);

  // Timer countdown
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleCleanNavigation = (path: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("verify_email");
      sessionStorage.removeItem("verify_role");
      window.location.replace(path);
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0 || isResending || !email) return;
    setGeneralError("");
    setInfoMessage("");
    setIsResending(true);
    try {
      await resendEmailOTP({ email, type: "email-verification" });
      setOtpTimer(60);
      setInfoMessage("Kode OTP verifikasi baru telah dikirim ke email Anda.");
    } catch (err) {
      setGeneralError(getErrorMessage(err, "Gagal mengirim ulang kode OTP."));
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "");
    if (!sanitized && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = sanitized.slice(-1);
    setOtp(newOtp);

    // Auto focus next box
    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setInfoMessage("");

    const fullCode = otp.join("");
    if (fullCode.length < 6) {
      setGeneralError("Kode OTP harus terdiri dari 6 digit angka.");
      return;
    }

    setIsVerifying(true);
    try {
      await verifyEmailOTP({ email, otp: fullCode });
      setStage("suggestion");
    } catch (err) {
      setGeneralError(getErrorMessage(err, "Kode OTP salah atau telah kadaluarsa."));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Kata sandi awal/saat ini wajib diisi.");
      return;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      setPasswordError(
        "Kata sandi baru minimal 12 karakter dan wajib kombinasi huruf besar, huruf kecil, angka, serta simbol khusus."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi tidak cocok dengan kata sandi baru.");
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError("Kata sandi baru tidak boleh sama dengan kata sandi lama.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      setStage("done");
      setTimeout(() => {
        handleCleanNavigation(homePath);
      }, 1500);
    } catch (err) {
      setPasswordError(getErrorMessage(err, "Gagal memperbarui kata sandi. Pastikan kata sandi awal benar."));
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-0 sm:px-0 text-slate-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-10 pb-16 flex flex-col relative z-0 shrink-0">
          <button
            onClick={() => router.push(loginPath)}
            className="w-10 h-10 rounded-full border border-white/35 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all self-start mb-6 cursor-pointer"
            title="Kembali ke Login"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight">
            {stage === "change_password" ? "Keamanan Akun" : "Verifikasi OTP"}
          </h1>
          <p className="text-white/80 text-xs mt-1.5 font-medium leading-relaxed">
            {stage === "change_password"
              ? "Perbarui kata sandi awal Anda demi keamanan akun."
              : `Akun ${roleName}: Masukkan kode 6 digit yang dikirimkan ke ${email || "email Anda"}.`}
          </p>
        </div>

        {/* Content Card Body */}
        <div className="bg-white rounded-t-[2.5rem] -mt-8 pt-7 px-6 pb-8 flex-1 flex flex-col justify-between relative z-10">
          
          {/* STAGE 1: OTP INPUT FORM */}
          {stage === "otp" && (
            <div className="flex flex-col">
              {generalError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2.5 animate-shake shadow-sm mb-4">
                  <span className="shrink-0 text-base">⚠️</span>
                  <span>{generalError}</span>
                </div>
              )}

              {infoMessage && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2.5 shadow-sm mb-4">
                  <span className="shrink-0 text-base">✅</span>
                  <span>{infoMessage}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                <div className="flex justify-center gap-2 mt-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      className="w-12 h-14 bg-slate-50 border border-slate-200/90 rounded-[1rem] text-center text-xl font-bold text-blue-600 hover:border-slate-350 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center mt-1">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Belum menerima kode?</p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending || otpTimer > 0}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-extrabold px-5 py-2 rounded-full transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isResending ? (
                      <span>Mengirim...</span>
                    ) : otpTimer > 0 ? (
                      <span>Kirim Ulang ({otpTimer}s)</span>
                    ) : (
                      <span>Kirim Ulang Kode</span>
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-full active:scale-98 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] flex justify-center items-center gap-2 disabled:opacity-75 cursor-pointer"
                >
                  {isVerifying ? <span>Memverifikasi...</span> : <span>Verifikasi Sekarang</span>}
                </button>
              </form>
            </div>
          )}

          {/* STAGE 2: SECURITY RECOMMENDATION MODAL / VIEW */}
          {stage === "suggestion" && (
            <div className="flex flex-col items-center text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 shadow-sm border border-amber-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m12-5.5a9.5 9.5 0 11-19 0 9.5 9.5 0 0119 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              </div>

              <h2 className="text-lg font-bold text-slate-800 mb-1.5">
                Verifikasi Berhasil!
              </h2>
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 mb-6 text-left">
                <p className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1.5">
                  <span>🔒</span> Rekomendasi Keamanan:
                </p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Akun Anda dibuat oleh Administrator. Untuk mencegah akses tidak sah dan menjaga privasi data, kami sangat menyarankan Anda untuk <strong>memperbarui kata sandi</strong> sekarang.
                </p>
              </div>

              <div className="flex flex-col w-full gap-3">
                <button
                  type="button"
                  onClick={() => setStage("change_password")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-full shadow-md shadow-blue-600/20 active:scale-98 transition-all cursor-pointer text-xs"
                >
                  Perbarui Kata Sandi Sekarang (Disarankan)
                </button>
                <button
                  type="button"
                  onClick={() => handleCleanNavigation(homePath)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold py-3.5 rounded-full transition-all cursor-pointer text-xs"
                >
                  Nanti Saja (Lanjut ke Beranda)
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: CHANGE PASSWORD FORM */}
          {stage === "change_password" && (
            <form onSubmit={handleSaveNewPassword} className="flex flex-col gap-4 animate-fade-in">
              {passwordError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-3 rounded-2xl flex items-center gap-2 animate-shake">
                  <span>⚠️</span>
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Kata Sandi Awal (Saat Ini)
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi dari admin"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 12 karakter (huruf, angka, simbol)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                  <span>Tampilkan Kata Sandi</span>
                </label>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Syarat kata sandi yang aman:</p>
                <p>• Minimal 12 karakter</p>
                <p>• Mengandung huruf besar (A-Z) & huruf kecil (a-z)</p>
                <p>• Mengandung angka (0-9) dan simbol karakter khusus (@$!%*?&#)</p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-full shadow-md shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer text-xs disabled:opacity-75"
                >
                  {isUpdatingPassword ? "Menyimpan Kata Sandi..." : "Simpan & Lanjut ke Beranda"}
                </button>
                <button
                  type="button"
                  onClick={() => handleCleanNavigation(homePath)}
                  className="w-full py-2.5 text-slate-400 hover:text-slate-600 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Lewati dan Masuk ke Beranda
                </button>
              </div>
            </form>
          )}

          {/* STAGE 4: SUCCESS MODAL OVERLAY */}
          {stage === "done" && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-white w-full max-w-[290px] rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col items-center justify-center animate-scale-up text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(16,185,129,0.2)] animate-bounce">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-base font-extrabold text-slate-800 mb-1">
                  Kata Sandi Diperbarui!
                </h2>
                <p className="text-xs text-slate-500 leading-normal font-semibold">
                  Akun Anda kini lebih aman. Mengalihkan ke beranda...
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
