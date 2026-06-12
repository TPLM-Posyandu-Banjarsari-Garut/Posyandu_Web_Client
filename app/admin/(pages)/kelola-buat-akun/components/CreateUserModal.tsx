import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { CreateFormInputs } from '@/hooks/query/userAdmin/useManageUsersPage';
import { useGetAdminPosyandus } from '@/hooks/query/userAdmin/UseManageUsers';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isPending: boolean;
  register: UseFormRegister<CreateFormInputs>;
  firstFormError: string | undefined;
  formPasswordVisible: boolean;
  onToggleFormPasswordVisible: () => void;
  watchedRole: string;
}

const inputClass =
  'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400';

const labelClass = 'text-xs font-bold text-slate-500 uppercase tracking-wider mb-1';

export default function CreateUserModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  register,
  firstFormError,
  formPasswordVisible,
  onToggleFormPasswordVisible,
  watchedRole
}: CreateUserModalProps) {
  const { data: posyandusResponse } = useGetAdminPosyandus();
  const posyandusList = posyandusResponse?.data || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-40 flex items-end justify-center animate-fade-in">
      {/* Click outer area to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Box */}
      <div className="bg-white w-full rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col max-h-[85%] z-50 animate-slide-up relative">
        {/* Top Drag Indicator / Accent Bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5 shrink-0" />

        {/* Title Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Registrasi Akun Baru</h2>
            <p className="text-[10px] text-slate-400">Silakan lengkapi formulir pendaftaran di bawah.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto pr-1 pb-6 flex flex-col gap-4 custom-scrollbar">
          {/* Form Error Message */}
          {firstFormError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 animate-shake shrink-0">
              <svg className="w-4 h-4 shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{firstFormError}</span>
            </div>
          )}

          {/* Input Nama */}
          <div className="flex flex-col">
            <label className={labelClass}>Nama Lengkap</label>
            <input
              type="text"
              {...register('name', {
                required: 'Nama lengkap tidak boleh kosong',
                minLength: {
                  value: 3,
                  message: 'Nama minimal harus 3 karakter',
                },
              })}
              className={inputClass}
              placeholder="Masukkan nama pengguna..."
            />
          </div>

          {/* Input Email */}
          <div className="flex flex-col">
            <label className={labelClass}>Alamat Email</label>
            <input
              type="email"
              autoComplete="username"
              {...register('email', {
                required: 'Email tidak boleh kosong',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Format email tidak valid',
                },
              })}
              className={inputClass}
              placeholder="nama@email.com"
            />
          </div>

          {/* Input Password */}
          <div className="flex flex-col">
            <label className={labelClass}>Kata Sandi (Password)</label>
            <div className="relative">
              <input
                type={formPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('password', {
                  required: 'Password tidak boleh kosong',
                  minLength: {
                    value: 8,
                    message: 'Password minimal harus 8 karakter',
                  },
                })}
                className={`${inputClass} pr-11`}
                placeholder="Masukkan minimal 8 karakter..."
              />
              <button
                type="button"
                onClick={onToggleFormPasswordVisible}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors p-1"
                title={formPasswordVisible ? 'Sembunyikan' : 'Tampilkan'}
              >
                {formPasswordVisible ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {/* Password Security Reminder Box */}
            <div className="mt-2 bg-amber-50 border border-amber-100 rounded-[1rem] p-3 text-[10px] text-amber-800 leading-normal flex items-start gap-2 animate-fade-in shadow-sm">
              <svg className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <strong className="font-bold">Perhatian Keamanan:</strong> Sandi dienkripsi secara aman di database dan tidak dapat dilihat lagi setelah disimpan. Pastikan Anda mencatat/menyimpan sandi ini di tempat aman sebelum mendaftarkan akun.
              </div>
            </div>
          </div>

          {/* Dropdown Select Role */}
          <div className="flex flex-col">
            <label className={labelClass}>Pilih Peran (Role)</label>
            <div className="relative">
              <select
                {...register('role')}
                className={`${inputClass} appearance-none pr-10 font-semibold text-slate-700`}
              >
                <option value="orang tua">Orang Tua</option>
                <option value="kader">Kader Posyandu</option>
                <option value="bidan">Bidan</option>
                <option value="admin desa">Admin Desa</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dropdown Select Posyandu for Bidan / Kader */}
          {(watchedRole === 'bidan' || watchedRole === 'kader') && (
            <div className="flex flex-col animate-fade-in">
              <label className={labelClass}>
                Pilih Posyandu Penugasan <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('posyanduId', {
                    required: `Posyandu penugasan wajib dipilih untuk peran ${watchedRole}`,
                  })}
                  className={`${inputClass} appearance-none pr-10 font-semibold text-slate-700`}
                >
                  <option value="">Pilih Posyandu...</option>
                  {posyandusList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Form Buttons */}
          <div className="flex gap-3 pt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-500 font-bold text-xs py-3.5 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all text-center cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-2xl active:scale-95 transition-all shadow-[0_6px_15px_rgba(37,99,235,0.25)] flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Daftarkan Akun</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
