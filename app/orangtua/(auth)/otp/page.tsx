"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useVerifyOTP } from "@/hooks/query/authOrangTua/useVerifyOTP";
import { useResendOTP } from "@/hooks/query/authOrangTua/useResendOTP";

export default function OTPPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("verify_email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      router.push("/orangtua/login");
    }
  }, [router]);

  // OTP State (6 digits)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer logic
  const [otpTimer, setOtpTimer] = useState(60);

  // Global UI States
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Hooks
  const verifyMutation = useVerifyOTP();
  const resendMutation = useResendOTP();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOtp = () => {
    if (otpTimer > 0 || resendMutation.isPending) return;
    setError("");
    
    resendMutation.mutate(
      { email, type: "email-verification" },
      {
        onSuccess: () => {
          setOtpTimer(60);
        },
        onError: (err) => {
          setError(err.message);
        },
      }
    );
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Keep only the last typed character
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Kode OTP harus 6 digit");
      return;
    }

    verifyMutation.mutate(
      { email, otp: otpString },
      {
        onSuccess: () => {
          setShowSuccess(true);
          sessionStorage.removeItem("verify_email");
          setTimeout(() => {
            router.push("/orangtua/home");
          }, 1500);
        },
        onError: (err) => {
          setError(err.message);
        },
      }
    );
  };

  const isPending = verifyMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-0 sm:px-0 text-slate-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Top Gradient Header Section */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-10 pb-16 flex flex-col relative z-0 shrink-0">
          <button
            onClick={() => router.push("/orangtua/login")}
            className="w-10 h-10 rounded-full border border-white/35 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all self-start mb-8 cursor-pointer"
            title="Kembali"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight transition-all duration-300">
            Verifikasi<br />OTP
          </h1>
          <p className="text-white/80 text-sm mt-2 font-medium">
            Masukkan kode 6 digit yang telah dikirim ke email Anda.
          </p>
        </div>

        {/* White Form Card Overlap Section */}
        <div className="bg-white rounded-t-[2.5rem] -mt-8 pt-8 px-6 pb-8 flex-1 flex flex-col justify-between relative z-10">
          
          <div className="flex flex-col">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 animate-shake shadow-sm mb-5">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="flex flex-col gap-8">
              
              {/* OTP Inputs */}
              <div className="flex justify-center gap-2 mt-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    className="w-12 h-14 bg-slate-50 border border-slate-200/80 rounded-[1rem] text-center text-xl font-bold text-blue-600 hover:border-slate-350 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="flex flex-col items-center mt-2">
                <p className="text-xs font-semibold text-slate-500 mb-2">Belum menerima kode?</p>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={resendMutation.isPending || otpTimer > 0}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-extrabold px-5 py-2 rounded-full transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {resendMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Mengirim...</span>
                    </>
                  ) : otpTimer > 0 ? (
                    <span>Kirim Ulang ({otpTimer}s)</span>
                  ) : (
                    <span>Kirim Ulang Kode</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <button
              onClick={handleVerify}
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-full active:scale-98 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] flex justify-center items-center gap-2 disabled:opacity-75 cursor-pointer"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span className="tracking-wide text-sm">Verifikasi</span>
              )}
            </button>
          </div>

        </div>

      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-[290px] rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col items-center justify-center animate-scale-up text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(16,185,129,0.2)] animate-bounce">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-base font-extrabold text-slate-800 mb-1">
              Verifikasi Berhasil
            </h2>
            <p className="text-xs text-slate-500 leading-normal font-semibold">
              Terima kasih! Mengarahkan ke dasbor...
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
