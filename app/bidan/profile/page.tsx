"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";
import { useLogoutBidan } from "@/hooks/query/authBidan/UseLogoutBidan";
import BottombarBidan from "@/components/ui/bottombar/bidan/BottombarBidan";
import { useCurrentUser } from "@/hooks/query/auth/useCurrentUser";
import { useUploadMedia } from "@/hooks/query/media/useUploadMedia";
import { useUpdateUserProfile } from "@/hooks/query/authOrangTua/useUpdateUserProfile";
import { useChangePassword } from "@/hooks/query/auth/useChangePassword";

export default function BidanProfile() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutBidan();

  const { mutateAsync: uploadMedia, isPending: isUploading } = useUploadMedia();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateUserProfile();
  
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: updatePassword, isPending: isUpdatingPassword } = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLogout = () => {
    logout();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUpdateError("");
    setUpdateSuccess(false);

    try {
      const urls = await uploadMedia([file]);
      if (urls.length === 0) throw new Error("Gagal mengunggah gambar");
      const imageUrl = urls[0];

      await updateProfile({ image: imageUrl });
      
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
         setUpdateError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
         setUpdateError(err.message);
      } else {
         setUpdateError("Terjadi kesalahan saat mengunggah gambar");
      }
    } finally {
       if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Semua kolom kata sandi harus diisi");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Kata sandi baru dan konfirmasi tidak cocok");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Kata sandi baru minimal 8 karakter");
      return;
    }

    try {
      await updatePassword({
        currentPassword,
        newPassword
      });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setPasswordError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setPasswordError(err.message);
      } else {
        setPasswordError("Terjadi kesalahan saat mengubah kata sandi");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-28 custom-scrollbar">
          
          {/* Header section with gradient */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-10 pb-16 flex flex-col relative z-0 shrink-0">
            {/* Back Button */}
            <button
              onClick={() => router.push("/bidan/home")}
              className="w-10 h-10 rounded-full border border-white/35 bg-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all self-start mb-6"
              title="Kembali ke Beranda"
            >
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <h1 className="text-2xl font-bold text-white tracking-tight">Profil Saya</h1>
            <p className="text-white/80 text-xs mt-1 font-medium">Informasi akun Bidan Posyandu</p>
          </div>

          {/* Overlapping Content Box */}
          <div className="bg-white rounded-t-[2.5rem] -mt-8 pt-8 px-6 pb-6 flex-1 flex flex-col relative z-10">
            
            {/* Avatar & Profile Identity Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-center text-center mb-6 -mt-14 relative bg-white/95 backdrop-blur-md">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-blue-100 p-1 border-2 border-white shadow-md mb-3 flex items-center justify-center overflow-hidden relative">
                  {isUploading || isUpdating ? (
                    <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center">
                      <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : user?.image ? (
                    <img 
                      src={(() => {
                        if (user.image.startsWith('{')) {
                          try {
                            return JSON.parse(user.image).url;
                          } catch (e) {
                            return user.image;
                          }
                        }
                        return user.image;
                      })()} 
                      alt={user?.name || "Profile"} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-200 flex items-center justify-center text-blue-600">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  {/* Overlay upload button on hover */}
                  <label htmlFor="profile-upload-bidan" className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity rounded-full z-10">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-[10px] font-bold">Ubah</span>
                  </label>
                  <input
                    id="profile-upload-bidan"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={isUploading || isUpdating}
                  />
                </div>
              </div>

              {updateError && (
                <div className="text-rose-500 text-xs mt-1 mb-2 font-medium px-2 py-1 bg-rose-50 rounded-md">
                  {updateError}
                </div>
              )}
              {updateSuccess && (
                <div className="text-emerald-500 text-xs mt-1 mb-2 font-medium px-2 py-1 bg-emerald-50 rounded-md">
                  Berhasil memperbarui foto profil!
                </div>
              )}

              <h2 className="text-lg font-bold text-slate-800 leading-snug">{user?.name || "Bidan Posyandu"}</h2>
              <span className="px-3.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mt-2 border border-blue-100">
                {user?.role === "midwife" ? "Bidan" : user?.role || "Petugas Kesehatan"}
              </span>
            </div>

            {/* Profile Info Card */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">Informasi Akun</h3>

              {/* Email */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:scale-[1.01] transition-transform duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">Email</span>
                  <span className="text-sm font-bold text-slate-700 truncate">{user?.email || "-"}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:scale-[1.01] transition-transform duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">Status Akun</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${user?.status === "VERIFIED" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
                    <span className="text-sm font-bold text-slate-700">
                      {user?.status === "VERIFIED" ? "Terverifikasi" : user?.status || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Verification status */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:scale-[1.01] transition-transform duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5M12 14v.01" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">Verifikasi Email</span>
                  <span className={`text-sm font-bold ${user?.emailVerified ? "text-emerald-600" : "text-amber-600"}`}>
                    {user?.emailVerified ? "Terverifikasi" : "Belum Terverifikasi"}
                  </span>
                </div>
              </div>

              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1 mt-4">Tanggal Penting</h3>

              {/* Created At */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:scale-[1.01] transition-transform duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">Tanggal Bergabung</span>
                  <span className="text-sm font-bold text-slate-700">{formatDate(user?.createdAt)}</span>
                </div>
              </div>

              {/* Updated At */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:scale-[1.01] transition-transform duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                  </svg>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider leading-none mb-1">Terakhir Diperbarui</span>
                  <span className="text-sm font-bold text-slate-700">{formatDate(user?.updatedAt)}</span>
                </div>
              </div>

              {/* Security Section (Change Password) */}
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1 mt-4">Keamanan</h3>
              
              <div className="bg-slate-50 border border-slate-100 rounded-[1.25rem] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
                  {passwordError && (
                    <div className="text-rose-500 text-xs mb-1 font-medium px-2 py-1.5 bg-rose-50 rounded-md border border-rose-100">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="text-emerald-600 text-xs mb-1 font-medium px-2 py-1.5 bg-emerald-50 rounded-md border border-emerald-100">
                      Kata sandi berhasil diubah!
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">Kata Sandi Lama</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                      placeholder="Masukkan kata sandi saat ini"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                      placeholder="Minimal 8 karakter"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider ml-1">Konfirmasi Kata Sandi Baru</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300"
                      placeholder="Ulangi kata sandi baru"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="mt-2 w-full bg-blue-600 text-white text-sm font-extrabold py-2.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center shadow-md shadow-blue-500/20"
                  >
                    {isUpdatingPassword ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Simpan Kata Sandi"
                    )}
                  </button>
                </form>
              </div>

            </div>

            {/* Logout Action button */}
            <div className="mt-10 px-1">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100/75 font-bold py-4 rounded-full active:scale-98 transition-all shadow-[0_4px_12px_rgba(244,63,94,0.05)] flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Mengeluarkan Akun...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="tracking-wide text-sm font-extrabold">Keluar dari Akun</span>
                  </>
                )}
              </button>
            </div>
            
          </div>
        </div>

        {/* Bottom bar */}
        <BottombarBidan />

      </div>
    </div>
  );
}
