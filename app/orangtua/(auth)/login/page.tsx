"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginOrangTua } from "@/hooks/query/authOrangTua/useLoginOrangTua";
import { useRegisterOrangTua } from "@/hooks/query/authOrangTua/useRegisterOrangTua";

export default function OrangTuaAuth() {
  const router = useRouter();

  // Active Tab state ("login" or "register")
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const {
    register: registerLogin,
    onSubmit: onSubmitLogin,
    displayError: loginError,
    passwordVisible: loginPasswordVisible,
    setPasswordVisible: setLoginPasswordVisible,
    showSuccess: showLoginSuccess,
    isPending: isLoginPending,
  } = useLoginOrangTua();

  const {
    register: registerSignup,
    onSubmit: onSubmitSignup,
    displayError: registerError,
    passwordVisible: registerPasswordVisible,
    setPasswordVisible: setRegisterPasswordVisible,
    confirmPasswordVisible: registerConfirmPasswordVisible,
    setConfirmPasswordVisible: setRegisterConfirmPasswordVisible,
    showSuccess: showRegisterSuccess,
    isPending: isRegisterPending,
  } = useRegisterOrangTua();

  const error = activeTab === "login" ? loginError : registerError;
  const isLoading = activeTab === "login" ? isLoginPending : isRegisterPending;
  const showSuccess = showLoginSuccess || showRegisterSuccess;
  const successType = showLoginSuccess ? "login" : "register";

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-0 sm:px-0 text-slate-800 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Top Gradient Header Section */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-10 pb-16 flex flex-col relative z-0 shrink-0">
          <button
            onClick={() => router.push("/")}
            className="w-10 h-10 rounded-full border border-white/35 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all self-start mb-8 cursor-pointer"
            title="Kembali ke Beranda"
          >
            <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <h1 className="text-[28px] font-bold text-white tracking-tight leading-tight transition-all duration-300">
            {activeTab === "login" ? (
              <>
                Login Sebagai<br />Orang Tua
              </>
            ) : (
              <>
                Daftar Sebagai<br />Orang Tua
              </>
            )}
          </h1>
          <p className="text-white/80 text-sm mt-2 font-medium">
            Silakan masuk untuk melanjutkan.
          </p>
        </div>

        {/* White Form Card Overlap Section */}
        <div className="bg-white rounded-t-[2.5rem] -mt-8 pt-8 px-6 pb-8 flex-1 flex flex-col justify-between relative z-10">
          
          <div className="flex flex-col">
            {/* Dynamic Tab Switcher */}
            <div className="bg-slate-100 p-1.5 rounded-[1.25rem] flex gap-1 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-3 text-sm font-extrabold rounded-[0.95rem] transition-all duration-300 cursor-pointer ${
                  activeTab === "login"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-650 bg-transparent"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-3 text-sm font-extrabold rounded-[0.95rem] transition-all duration-300 cursor-pointer ${
                  activeTab === "register"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-650 bg-transparent"
                }`}
              >
                Daftar
              </button>
            </div>

            {/* Error Alert Display */}
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

            {activeTab === "login" ? (
              <form id="loginForm" onSubmit={onSubmitLogin} className="flex flex-col gap-5">
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
                      {...registerLogin("email")}
                      className="bg-transparent border-none outline-none p-0 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:ring-0 w-full"
                      placeholder="contoh@email.com"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-[1.25rem] p-3 hover:border-slate-350 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                  <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Kata Sandi
                    </label>
                    <input
                      type={loginPasswordVisible ? "text" : "password"}
                      {...registerLogin("password")}
                      className="bg-transparent border-none outline-none p-0 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:ring-0 w-full"
                      placeholder="password123"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setLoginPasswordVisible(!loginPasswordVisible)}
                    className="text-slate-400 hover:text-slate-650 transition-colors p-1 cursor-pointer"
                    title={loginPasswordVisible ? "Sembunyikan" : "Tampilkan"}
                  >
                    {loginPasswordVisible ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex justify-between items-center mt-1 px-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      {...registerLogin("rememberMe")}
                      className="w-4 h-4 rounded text-blue-600 border-slate-350 focus:ring-blue-500 focus:ring-opacity-20 cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 font-bold tracking-wide">Ingat saya</span>
                  </label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline">
                    Lupa Kata Sandi?
                  </a>
                </div>
              </form>
            ) : (
              <form id="registerForm" onSubmit={onSubmitSignup} className="flex flex-col gap-5">
                <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-[1.25rem] p-3 hover:border-slate-350 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                  <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      {...registerSignup("name")}
                      className="bg-transparent border-none outline-none p-0 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:ring-0 w-full"
                      placeholder="Nama Anda"
                    />
                  </div>
                </div>

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
                      {...registerSignup("email")}
                      className="bg-transparent border-none outline-none p-0 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:ring-0 w-full"
                      placeholder="contoh@email.com"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-[1.25rem] p-3 hover:border-slate-350 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                  <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Nomor HP
                    </label>
                    <input
                      type="tel"
                      {...registerSignup("phone_number")}
                      className="bg-transparent border-none outline-none p-0 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:ring-0 w-full"
                      placeholder="081234567890"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-[1.25rem] p-3 hover:border-slate-350 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                  <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Kata Sandi
                    </label>
                    <input
                      type={registerPasswordVisible ? "text" : "password"}
                      {...registerSignup("password")}
                      className="bg-transparent border-none outline-none p-0 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:ring-0 w-full"
                      placeholder="password123"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegisterPasswordVisible(!registerPasswordVisible)}
                    className="text-slate-400 hover:text-slate-650 transition-colors p-1 cursor-pointer"
                    title={registerPasswordVisible ? "Sembunyikan" : "Tampilkan"}
                  >
                    {registerPasswordVisible ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-[1.25rem] p-3 hover:border-slate-350 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                  <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Verifikasi Kata Sandi
                    </label>
                    <input
                      type={registerConfirmPasswordVisible ? "text" : "password"}
                      {...registerSignup("confirmPassword")}
                      className="bg-transparent border-none outline-none p-0 text-sm text-slate-800 placeholder-slate-400 font-semibold focus:ring-0 w-full"
                      placeholder="password123"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegisterConfirmPasswordVisible(!registerConfirmPasswordVisible)}
                    className="text-slate-400 hover:text-slate-650 transition-colors p-1 cursor-pointer"
                    title={registerConfirmPasswordVisible ? "Sembunyikan" : "Tampilkan"}
                  >
                    {registerConfirmPasswordVisible ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <button
              type="submit"
              form={activeTab === "login" ? "loginForm" : "registerForm"}
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
                <span className="tracking-wide text-sm">{activeTab === "login" ? "Masuk" : "Daftar"}</span>
              )}
            </button>

            <div className="flex items-center my-1">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="px-3 text-xs font-bold text-slate-400 tracking-wide bg-white">Atau masuk dengan</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold py-3.5 rounded-full flex items-center justify-center gap-3 transition-all duration-200 shadow-sm active:scale-98 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.48 3.77v3.13h3.99c2.34-2.16 3.68-5.32 3.68-8.75z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.99-3.13a7.5 7.5 0 0 1-11.4 0H.55v3.13C2.53 21.08 7.53 24 12 24z" />
                <path fill="#FBBC05" d="M6.54 14.71a7.25 7.25 0 0 1 0-4.58V7h-4A11.94 11.94 0 0 0 12 12c0 1.2-.21 2.37-.58 3.48l3.99 3.13a7.25 7.25 0 0 1-8.87-3.9z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.93 1.19 15.22 0 12 0 7.53 0 2.53 2.92.55 7.15l3.99 3.13a7.25 7.25 0 0 1 7.46-5.53z" />
              </svg>
              <span className="text-sm tracking-wide">Google</span>
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
              {successType === "login" ? "Berhasil Masuk" : "Berhasil Mendaftar"}
            </h2>
            <p className="text-xs text-slate-500 leading-normal font-semibold">
              {successType === "login" 
                ? "Selamat datang kembali! Mengarahkan ke dasbor..." 
                : "Akun Anda berhasil dibuat! Mengarahkan ke halaman verifikasi OTP..."}
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
