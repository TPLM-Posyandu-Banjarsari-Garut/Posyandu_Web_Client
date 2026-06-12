import React from 'react';
import { BackendUser } from '@/interfaces/user';
import { roleMapToFrontend } from '@/hooks/query/userAdmin/useManageUsersPage';

interface UserCardProps {
  user: BackendUser;
  onDelete: (id: string) => void;
  isDeletePending: boolean;
  onToggleVerify: (id: string, currentStatus: boolean) => void;
  isUpdatePending: boolean;
}

export default function UserCard({
  user,
  onDelete,
  isDeletePending,
  onToggleVerify,
  isUpdatePending
}: UserCardProps) {
  const feRole = roleMapToFrontend(user.role);

  // Color badges for roles
  let roleColor = 'bg-teal-50 text-teal-600 border-teal-100';
  if (feRole === 'bidan') {
    roleColor = 'bg-purple-50 text-purple-600 border-purple-100';
  } else if (feRole === 'kader') {
    roleColor = 'bg-indigo-50 text-indigo-600 border-indigo-100';
  } else if (feRole === 'admin desa') {
    roleColor = 'bg-blue-50 text-blue-600 border-blue-100';
  } else if (feRole === 'admin posyandu') {
    roleColor = 'bg-rose-50 text-rose-600 border-rose-100';
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)] flex flex-col gap-3.5 relative group">
      {/* Top item: Avatar, Name & Role, plus Delete */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* Circle Role Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            feRole === 'bidan'
              ? 'bg-purple-100 border-purple-200 text-purple-600'
              : feRole === 'kader'
                ? 'bg-indigo-100 border-indigo-200 text-indigo-600'
                : feRole === 'admin desa'
                  ? 'bg-blue-100 border-blue-200 text-blue-600'
                  : feRole === 'admin posyandu'
                    ? 'bg-rose-100 border-rose-200 text-rose-600'
                    : 'bg-teal-100 border-teal-200 text-teal-600'
          }`}>
            {feRole === 'bidan' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ) : feRole === 'kader' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (feRole === 'admin desa' || feRole === 'admin posyandu') ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 leading-tight">{user.name}</h4>
            <span className={`inline-block px-2.5 py-0.5 mt-1 text-[9px] font-extrabold uppercase border rounded-full tracking-wider ${roleColor}`}>
              {feRole}
            </span>
          </div>
        </div>

        {/* Delete account icon */}
        <button
          onClick={() => onDelete(user.id)}
          disabled={isDeletePending}
          className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
          title="Hapus Akun"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Metadata stack: Email, Date */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs flex flex-col gap-2">
        {/* Email Row */}
        <div className="flex items-center gap-2.5 text-slate-600">
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-medium truncate">{user.email}</span>
        </div>

        {/* Created Date Row */}
        <div className="flex items-center gap-2.5 text-slate-600">
          <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>
            Dibuat: <span className="font-semibold text-slate-700">{new Date(user.created_at).toISOString().split('T')[0]}</span>
          </span>
        </div>

        {/* Email Verification Row */}
        <div className="flex justify-between items-center text-slate-600 border-t border-slate-100/60 pt-2.5 mt-0.5">
          <div className="flex items-center gap-2.5">
            <svg className={`w-3.5 h-3.5 ${user.email_verified ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">Verifikasi Email</span>
          </div>
          <button
            onClick={() => onToggleVerify(user.id, user.email_verified)}
            disabled={isUpdatePending}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
              user.email_verified
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
            }`}
            title={user.email_verified ? "Batalkan Verifikasi Email" : "Verifikasi Email Sekarang"}
          >
            {user.email_verified ? 'Terverifikasi' : 'Belum Verifikasi'}
          </button>
        </div>
      </div>
    </div>
  );
}
