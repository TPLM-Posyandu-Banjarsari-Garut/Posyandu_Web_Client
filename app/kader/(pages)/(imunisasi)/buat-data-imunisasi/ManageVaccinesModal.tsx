'use client';

import { Vaccine } from "@/interfaces/vaccine";

interface ManageVaccinesModalProps {
    showManageModal: boolean;
    setShowManageModal: (val: boolean) => void;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    newTypeName: string;
    setNewTypeName: (val: string) => void;
    editingTypeId: string | null;
    setEditingTypeId: (val: string | null) => void;
    editingTypeName: string;
    setEditingTypeName: (val: string) => void;
    filteredList: Vaccine[];
    handleAddType: (e: React.FormEvent) => void;
    handleUpdateType: (id: string, nameBeforeUpdate: string) => void;
    handleDeleteType: (id: string, nameToDelete: string) => void;
    setJenisImunisasi: (val: string) => void;
    triggerToast: (msg: string) => void;
}

export default function ManageVaccinesModal({
    showManageModal,
    setShowManageModal,
    searchQuery,
    setSearchQuery,
    newTypeName,
    setNewTypeName,
    editingTypeId,
    setEditingTypeId,
    editingTypeName,
    setEditingTypeName,
    filteredList,
    handleAddType,
    handleUpdateType,
    handleDeleteType,
    setJenisImunisasi,
    triggerToast
}: ManageVaccinesModalProps) {
    if (!showManageModal) return null;

    return (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col justify-end animate-fade-in">
            <div className="bg-white w-full rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col max-h-[80%] animate-slide-up overflow-hidden">
                {/* Modal Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Kelola Jenis Imunisasi</h2>
                        <p className="text-[10px] text-slate-400">Tambah, ubah, atau hapus jenis imunisasi</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            setShowManageModal(false);
                            setSearchQuery('');
                            setNewTypeName('');
                            setEditingTypeId(null);
                        }}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 custom-scrollbar">
                    {/* Search bar */}
                    <div className="relative shrink-0">
                        <input
                            type="text"
                            placeholder="Cari jenis imunisasi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full box-border pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Form Add New */}
                    <form onSubmit={handleAddType} className="flex gap-2 shrink-0">
                        <input
                            type="text"
                            placeholder="Tambah imunisasi..."
                            value={newTypeName}
                            onChange={(e) => setNewTypeName(e.target.value)}
                            className="flex-1 box-border px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah
                        </button>
                    </form>

                    {/* List of Types */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daftar Vaksin ({filteredList.length})</label>
                        {filteredList.length > 0 ? (
                            filteredList.map((item) => {
                                const isEditing = editingTypeId === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-150 rounded-xl transition-all"
                                    >
                                        {isEditing ? (
                                            <div className="flex-1 flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    value={editingTypeName}
                                                    onChange={(e) => setEditingTypeName(e.target.value)}
                                                    className="flex-1 box-border px-2 py-1.5 bg-white border border-blue-400 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                                                    autoFocus
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateType(item.id, item.name)}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer animate-fade-in"
                                                >
                                                    Simpan
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingTypeId(null);
                                                        setEditingTypeName('');
                                                    }}
                                                    className="bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer animate-fade-in"
                                                >
                                                    Batal
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setJenisImunisasi(item.name);
                                                        setShowManageModal(false);
                                                        setSearchQuery('');
                                                        triggerToast(`Dipilih: ${item.name}`);
                                                    }}
                                                    className="flex-1 text-left text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                                                >
                                                    {item.name}
                                                </button>
                                                <div className="flex gap-1.5 ml-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingTypeId(item.id);
                                                            setEditingTypeName(item.name);
                                                        }}
                                                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all active:scale-90 cursor-pointer"
                                                        title="Edit nama"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteType(item.id, item.name)}
                                                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all active:scale-90 cursor-pointer"
                                                        title="Hapus"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
                                Tidak ada jenis imunisasi yang cocok.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
