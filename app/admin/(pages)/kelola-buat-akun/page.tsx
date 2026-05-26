'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Interfaces for user account data
interface Account {
    id: string;
    nama: string;
    tanggalDibuat: string;
    email: string;
    passwordText: string;
    role: 'orang tua' | 'kader' | 'bidan';
}

const inputClass =
    'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400';

const labelClass = 'text-xs font-bold text-slate-500 uppercase tracking-wider mb-1';

export default function KelolaBuatAkun() {
    const router = useRouter();

    // Mock initial account list
    const [accounts, setAccounts] = useState<Account[]>([
        {
            id: '1',
            nama: 'Siti Rahmawati',
            tanggalDibuat: '2026-05-10',
            email: 'sitirahma@bidan.posyandu.id',
            passwordText: 'BidanRahma2026!',
            role: 'bidan',
        },
        {
            id: '2',
            nama: 'Eka Lestari',
            tanggalDibuat: '2026-05-15',
            email: 'eka.kader@gmail.com',
            passwordText: 'KaderLestari88',
            role: 'kader',
        },
        {
            id: '3',
            nama: 'Budi Santoso',
            tanggalDibuat: '2026-05-20',
            email: 'budi.santoso@gmail.com',
            passwordText: 'AyahBudiPintar',
            role: 'orang tua',
        },
        {
            id: '4',
            nama: 'Budi Santoso',
            tanggalDibuat: '2026-05-20',
            email: 'budi.santoso@gmail.com',
            passwordText: 'AyahBudiPintar',
            role: 'orang tua',
        },
        {
            id: '5',
            nama: 'Budi Santoso',
            tanggalDibuat: '2026-05-20',
            email: 'budi.santoso@gmail.com',
            passwordText: 'AyahBudiPintar',
            role: 'orang tua',
        },
        {
            id: '6',
            nama: 'Budi Santoso',
            tanggalDibuat: '2026-05-20',
            email: 'budi.santoso@gmail.com',
            passwordText: 'AyahBudiPintar',
            role: 'orang tua',
        },
    ]);

    // Search filter
    const [searchQuery, setSearchQuery] = useState('');

    // Password visibility maps (id -> boolean)
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

    // Modal open states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Form states for creating account
    const [formNama, setFormNama] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [formRole, setFormRole] = useState<'orang tua' | 'kader' | 'bidan'>('orang tua');
    const [formTanggal, setFormTanggal] = useState('');
    const [formPasswordVisible, setFormPasswordVisible] = useState(false);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set today's date as default when modal opens
    useEffect(() => {
        if (isModalOpen) {
            const today = new Date().toISOString().split('T')[0];
            setFormTanggal(today);
        }
    }, [isModalOpen]);

    // Toggle password visibility in the list
    const togglePasswordVisibility = (id: string) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Handle account deletion
    const handleDeleteAccount = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
            setAccounts((prev) => prev.filter((acc) => acc.id !== id));
            showToast('Akun berhasil dihapus');
        }
    };

    const showToast = (message: string) => {
        setSuccessMessage(message);
        setShowSuccessModal(true);
        setTimeout(() => {
            setShowSuccessModal(false);
        }, 1500);
    };

    // Form submission handler
    const handleCreateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        // Basic Validation
        if (!formNama.trim()) {
            setFormError('Nama lengkap tidak boleh kosong');
            return;
        }
        if (!formEmail.trim()) {
            setFormError('Email tidak boleh kosong');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formEmail)) {
            setFormError('Format email tidak valid');
            return;
        }
        if (!formPassword.trim()) {
            setFormError('Password tidak boleh kosong');
            return;
        }
        if (formPassword.length < 6) {
            setFormError('Password minimal harus berisi 6 karakter');
            return;
        }
        if (!formTanggal) {
            setFormError('Tanggal akun dibuat tidak boleh kosong');
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            const newAccount: Account = {
                id: Date.now().toString(),
                nama: formNama,
                email: formEmail,
                passwordText: formPassword,
                role: formRole,
                tanggalDibuat: formTanggal,
            };

            setAccounts((prev) => [newAccount, ...prev]);
            setIsSubmitting(false);
            setIsModalOpen(false);

            // Reset form fields
            setFormNama('');
            setFormEmail('');
            setFormPassword('');
            setFormRole('orang tua');
            setFormPasswordVisible(false);

            showToast('Akun baru berhasil dibuat!');
        }, 1000);
    };

    // Filtered accounts
    const filteredAccounts = accounts.filter((acc) => {
        const query = searchQuery.toLowerCase();
        return (
            acc.nama.toLowerCase().includes(query) ||
            acc.email.toLowerCase().includes(query) ||
            acc.role.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            {/* Mobile Device Mockup */}
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Sticky Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-20 sticky top-0 shadow-sm border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm font-bold text-lg">
                            A
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-slate-800">Kelola Akun</h1>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Admin Posyandu</p>
                        </div>
                    </div>

                    {/* Logout Trigger Icon */}
                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="p-2.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
                        title="Keluar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>

                {/* Main Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-slate-50 pb-28 pt-4 px-6 custom-scrollbar">

                    {/* Gradient Banner Info */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-5 text-white shadow-md mb-6 relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-10 translate-x-2 translate-y-2">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <h2 className="text-sm font-bold mb-1">Manajemen Pengguna</h2>
                        <p className="text-[11px] text-blue-100 leading-normal mb-3">
                            Gunakan halaman ini untuk mendaftarkan dan memantau akun Kader, Bidan, serta Orang Tua.
                        </p>
                        <div className="flex gap-2">
                            <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg">
                                Total: {accounts.length} Akun
                            </span>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative mb-5">
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white pl-10 pr-4 py-3 rounded-[1.25rem] text-xs text-slate-700 border border-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                        />
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 p-0.5 rounded-full"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Stack list of accounts */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Akun Stack</h3>
                            <span className="text-[10px] font-bold text-slate-400">Tampilkan Sandi via Mata 👁️</span>
                        </div>

                        {filteredAccounts.length > 0 ? (
                            filteredAccounts.map((account) => {
                                const isPasswordShown = visiblePasswords[account.id] || false;

                                // Color badges for roles
                                let roleColor = 'bg-teal-50 text-teal-600 border-teal-100';
                                if (account.role === 'bidan') {
                                    roleColor = 'bg-purple-50 text-purple-600 border-purple-100';
                                } else if (account.role === 'kader') {
                                    roleColor = 'bg-indigo-50 text-indigo-600 border-indigo-100';
                                }

                                return (
                                    <div
                                        key={account.id}
                                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)] flex flex-col gap-3.5 relative group"
                                    >
                                        {/* Top item: Avatar, Name & Role, plus Delete */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                {/* Circle Role Icon */}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${account.role === 'bidan'
                                                    ? 'bg-purple-100 border-purple-200 text-purple-600'
                                                    : account.role === 'kader'
                                                        ? 'bg-indigo-100 border-indigo-200 text-indigo-600'
                                                        : 'bg-teal-100 border-teal-200 text-teal-600'
                                                    }`}>
                                                    {account.role === 'bidan' ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    ) : account.role === 'kader' ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800 leading-tight">{account.nama}</h4>
                                                    <span className={`inline-block px-2.5 py-0.5 mt-1 text-[9px] font-extrabold uppercase border rounded-full tracking-wider ${roleColor}`}>
                                                        {account.role}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delete account icon */}
                                            <button
                                                onClick={() => handleDeleteAccount(account.id)}
                                                className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                                title="Hapus Akun"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Metadata stack: Email, Date, Password */}
                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs flex flex-col gap-2">
                                            {/* Email Row */}
                                            <div className="flex items-center gap-2.5 text-slate-600">
                                                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="font-medium truncate">{account.email}</span>
                                            </div>

                                            {/* Created Date Row */}
                                            <div className="flex items-center gap-2.5 text-slate-600">
                                                <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>
                                                    Dibuat: <span className="font-semibold text-slate-700">{account.tanggalDibuat}</span>
                                                </span>
                                            </div>

                                            {/* Password Row with Eye Icon */}
                                            <div className="flex items-center justify-between gap-2.5 pt-1 border-t border-slate-200/60 mt-1">
                                                <div className="flex items-center gap-2.5 text-slate-600 overflow-hidden w-full">
                                                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                    <span className="font-mono text-slate-700 tracking-wide font-medium truncate">
                                                        {isPasswordShown ? account.passwordText : '••••••••'}
                                                    </span>
                                                </div>

                                                {/* Visibility Toggle Eye */}
                                                <button
                                                    onClick={() => togglePasswordVisibility(account.id)}
                                                    className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                                                    title={isPasswordShown ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                                >
                                                    {isPasswordShown ? (
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
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-xs font-bold text-slate-700 mb-0.5">Akun Tidak Ditemukan</h4>
                                <p className="text-[10px] text-slate-400">Cobalah kata kunci pencarian yang lain.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Add Account Button - Fixed Position matching other pages */}
                <div className="fixed bottom-[32px] w-full max-w-md mx-auto z-30 pointer-events-none flex justify-end px-6 left-1/2 -translate-x-1/2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="pointer-events-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.5)] cursor-pointer hover:scale-110 active:scale-95 transition-all group"
                        title="Tambah Akun Baru"
                    >
                        <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Creation Dialog Modal - Slide Up Overlay with overflow-y-auto */}
                {isModalOpen && (
                    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-40 flex items-end justify-center animate-fade-in">
                        {/* Click outer area to dismiss */}
                        <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

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
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Scrollable Form Body (overflow-y-auto) */}
                            <form onSubmit={handleCreateAccount} className="flex-1 overflow-y-auto pr-1 pb-6 flex flex-col gap-4 custom-scrollbar">

                                {/* Form Error Message */}
                                {formError && (
                                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2 animate-shake shrink-0">
                                        <svg className="w-4 h-4 shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{formError}</span>
                                    </div>
                                )}

                                {/* Input Nama */}
                                <div className="flex flex-col">
                                    <label className={labelClass}>Nama Lengkap</label>
                                    <input
                                        type="text"
                                        value={formNama}
                                        onChange={(e) => setFormNama(e.target.value)}
                                        className={inputClass}
                                        placeholder="Masukkan nama pengguna..."
                                    />
                                </div>

                                {/* Input Email */}
                                <div className="flex flex-col">
                                    <label className={labelClass}>Alamat Email</label>
                                    <input
                                        type="email"
                                        value={formEmail}
                                        onChange={(e) => setFormEmail(e.target.value)}
                                        className={inputClass}
                                        placeholder="nama@email.com"
                                    />
                                </div>

                                {/* Input Password with inline eye icon */}
                                <div className="flex flex-col">
                                    <label className={labelClass}>Kata Sandi (Password)</label>
                                    <div className="relative">
                                        <input
                                            type={formPasswordVisible ? 'text' : 'password'}
                                            value={formPassword}
                                            onChange={(e) => setFormPassword(e.target.value)}
                                            className={`${inputClass} pr-11`}
                                            placeholder="Masukkan minimal 6 karakter..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormPasswordVisible(!formPasswordVisible)}
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
                                </div>

                                {/* Dropdown Select Role */}
                                <div className="flex flex-col">
                                    <label className={labelClass}>Pilih Peran (Role)</label>
                                    <div className="relative">
                                        <select
                                            value={formRole}
                                            onChange={(e) => setFormRole(e.target.value as 'orang tua' | 'kader' | 'bidan')}
                                            className={`${inputClass} appearance-none pr-10`}
                                        >
                                            <option value="orang tua">Orang Tua (Pasien/Warga)</option>
                                            <option value="kader">Kader Posyandu</option>
                                            <option value="bidan">Bidan Puskesmas/Desa</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Tanggal Akun Dibuat */}
                                <div className="flex flex-col">
                                    <label className={labelClass}>Tanggal Akun Dibuat</label>
                                    <input
                                        type="date"
                                        value={formTanggal}
                                        onChange={(e) => setFormTanggal(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>

                                {/* Form Buttons */}
                                <div className="flex gap-3 pt-4 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 border border-slate-200 text-slate-500 font-bold text-xs py-3.5 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all text-center"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-2xl active:scale-95 transition-all shadow-[0_6px_15px_rgba(37,99,235,0.25)] flex justify-center items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
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
                )}

                {/* Confirm Logout Modal Overlay */}
                {isLogoutModalOpen && (
                    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
                        <div className="bg-white w-full max-w-[280px] rounded-[2rem] p-6 shadow-2xl border border-slate-100 flex flex-col items-center justify-center animate-scale-up text-center">
                            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(244,63,94,0.15)]">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <h2 className="text-base font-bold text-slate-800 mb-1">Konfirmasi Keluar</h2>
                            <p className="text-xs text-slate-400 leading-normal mb-5">
                                Apakah Anda yakin ingin keluar dari halaman panel admin?
                            </p>
                            <div className="flex w-full gap-2.5">
                                <button
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-500 font-bold text-xs py-3 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => {
                                        setIsLogoutModalOpen(false);
                                        router.push('/');
                                    }}
                                    className="flex-1 bg-rose-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-600/10"
                                >
                                    Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Global Toast Success Notification Modal Overlay */}
                {showSuccessModal && (
                    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
                        <div className="bg-white w-full max-w-[280px] rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center justify-center animate-scale-up text-center">
                            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(16,185,129,0.2)] animate-bounce">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-base font-bold text-slate-800 mb-1">Transaksi Sukses</h2>
                            <p className="text-xs text-slate-400 leading-normal">
                                {successMessage || 'Aksi berhasil disimpan.'}
                            </p>
                        </div>
                    </div>
                )}

            </div>

            {/* Embedded Animations and Keyframes */}
            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
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
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
        
        /* Premium custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
        </div>
    );
}
