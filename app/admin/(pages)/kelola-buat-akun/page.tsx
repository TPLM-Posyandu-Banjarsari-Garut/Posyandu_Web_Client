'use client';

import React from 'react';
import Link from 'next/link';
import { useManageUsersPage } from '@/hooks/query/userAdmin/useManageUsersPage';
import KelolaBuatAkunHeader from './components/KelolaBuatAkunHeader';
import KelolaBuatAkunBanner from './components/KelolaBuatAkunBanner';
import UserCard from './components/UserCard';
import CreateUserModal from './components/CreateUserModal';
import ConfirmLogoutModal from './components/ConfirmLogoutModal';
import SuccessToast from '@/components/ui/SuccessToast';

export default function KelolaBuatAkun() {
    const {
        logout,
        searchQuery,
        setSearchQuery,
        page,
        setPage,
        isLoading,
        totalItems,
        totalPages,
        paginatedUsers,
        createUserMutation,
        deleteUserMutation,
        visiblePasswords,
        togglePasswordVisibility,
        isModalOpen,
        setIsModalOpen,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        showSuccessModal,
        successMessage,
        formPasswordVisible,
        setFormPasswordVisible,
        registerCreate,
        handleCreateAccount,
        handleDeleteAccount,
        handleToggleVerify,
        isUpdatePending,
        firstFormError,
        watchedRole,
    } = useManageUsersPage();

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            {/* Mobile Device Mockup */}
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Sticky Header */}
                <KelolaBuatAkunHeader onLogoutClick={() => setIsLogoutModalOpen(true)} />

                {/* Main Content Area - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-slate-50 pb-28 pt-4 px-6 custom-scrollbar">

                    {/* Gradient Banner Info */}
                    <KelolaBuatAkunBanner totalItems={totalItems} />

                    {/* Navigation Link to Kelola Posyandu */}
                    <div className="mb-5">
                        <Link
                            href="/admin/kelola-posyandu"
                            className="flex items-center justify-between bg-white border border-slate-100 rounded-[1.25rem] p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform duration-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xs font-bold text-slate-800">Kelola Posyandu</h4>
                                    <p className="text-[10px] text-slate-400">Atur data posyandu terdaftar di sistem</p>
                                </div>
                            </div>
                            <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    </div>

                    {/* Search bar */}
                    <div className="relative mb-5">
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau role..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setPage(1); // Reset ke halaman 1 saat pencarian berubah
                            }}
                            className="w-full bg-white pl-10 pr-4 py-3 rounded-[1.25rem] text-xs text-slate-700 border border-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
                        />
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setPage(1); // Reset ke halaman 1
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 p-0.5 rounded-full"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalItems > 0 && (
                        <div className="flex justify-between items-center mb-5 px-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all shadow-sm"
                            >
                                Sebelumnya
                            </button>
                            <span className="text-[11px] font-bold text-slate-500">
                                Halaman {page} dari {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-all shadow-sm"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    )}

                    {/* Stack list of accounts */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Akun Stack</h3>
                        </div>

                        {isLoading ? (
                            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                                <h4 className="text-xs font-bold text-slate-700">Memuat Data...</h4>
                            </div>
                        ) : paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onDelete={handleDeleteAccount}
                                    isDeletePending={deleteUserMutation.isPending}
                                    onToggleVerify={handleToggleVerify}
                                    isUpdatePending={isUpdatePending}
                                />
                            ))
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
                <CreateUserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateAccount}
                    isPending={createUserMutation.isPending}
                    register={registerCreate}
                    firstFormError={firstFormError}
                    formPasswordVisible={formPasswordVisible}
                    onToggleFormPasswordVisible={() => setFormPasswordVisible(!formPasswordVisible)}
                    watchedRole={watchedRole}
                />

                {/* Confirm Logout Modal Overlay */}
                <ConfirmLogoutModal
                    isOpen={isLogoutModalOpen}
                    onClose={() => setIsLogoutModalOpen(false)}
                    onConfirm={() => {
                        setIsLogoutModalOpen(false);
                        logout.mutate();
                    }}
                    isPending={logout.isPending}
                />

                {/* Global Toast Success Notification Modal Overlay */}
                <SuccessToast isOpen={showSuccessModal} message={successMessage} />

            </div>
        </div>
    );
}
