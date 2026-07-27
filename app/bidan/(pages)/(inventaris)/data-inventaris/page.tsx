'use client';

import BottombarBidan from '@/components/ui/bottombar/bidan/BottombarBidan';
import Link from 'next/link';
import { useState } from 'react';
import { useGetInventories, useDeleteInventory } from '@/hooks/query/inventory/useManageInventories';
import { useConfirm } from '@/providers/ConfirmProvider';
import { InventoryItemType, InventoryCondition, Inventory } from '@/interfaces/inventory';

export default function DataInventaris() {
    const confirm = useConfirm();
    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('semua');
    const [page, setPage] = useState(1);
    const limit = 10;

    const queryParams: any = { page, limit, search: searchTerm || undefined };
    if (selectedCategory !== 'semua') {
        queryParams.item_type = selectedCategory as InventoryItemType;
    }

    const { data: response, isLoading } = useGetInventories(queryParams);
    // Backend returns { success, message, data: { data: [], meta: {} } } because of ApiResponse.ok
    const inventarisList = (response?.data as any)?.data || [];
    const meta = (response?.data as any)?.meta;
    const totalPages = meta?.total_pages || 1;

    const deleteMutation = useDeleteInventory();

    const handleDelete = async (id: string, name: string) => {
        if (await confirm(`Apakah Anda yakin ingin menghapus inventaris "${name}"?`)) {
            deleteMutation.mutate({ id }, {
                onSuccess: () => {
                    // triggerToast(`Inventaris "${name}" berhasil dihapus.`);
                },
                onError: (error) => {
                    alert(`Gagal menghapus inventaris: ${(error as any).response?.data?.message || error.message}`);
                }
            });
        }
    };

    // Helper functions for badges and icons based on category
    const getCategoryStyles = (category: string) => {
        switch (category) {
            case 'vaccine':
                return {
                    bg: 'bg-purple-50 text-purple-700 border-purple-100',
                    label: 'Vaksin',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    )
                };
            case 'vitamin':
                return {
                    bg: 'bg-amber-50 text-amber-700 border-amber-100',
                    label: 'Vitamin',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                    )
                };
            case 'general':
            default:
                return {
                    bg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                    label: 'Barang',
                    icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    )
                };
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
                
                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/bidan/home" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Data Inventaris</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28 custom-scrollbar bg-slate-50">
                    
                    {/* Search & Filter Container */}
                    <div className="flex flex-col gap-3 mb-6">
                        {/* Search Input */}
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                                placeholder="Cari nama item inventaris..."
                            />
                        </div>

                        {/* Category Dropdown Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                            >
                                <option value="semua">Semua Kategori</option>
                                <option value="vaccine">Vaksin</option>
                                <option value="general">Barang</option>
                                <option value="vitamin">Vitamin</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center mb-4">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            Sebelumnnya
                        </button>
                        <span className="text-sm font-medium text-slate-500">
                            Hal {page} dari {totalPages || 1}
                        </span>
                        <button 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            Selanjutnya
                        </button>
                    </div>

                    {/* Inventory Stack */}
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <div className="text-center py-10 text-slate-500 text-sm">Memuat data...</div>
                        ) : inventarisList.length > 0 ? (
                            inventarisList.map((item: Inventory) => {
                                const cat = getCategoryStyles(item.item_type);
                                const isOut = item.quantity === 0 || item.condition === 'out_of_stock';
                                const isAvailable = item.quantity > 0 && item.condition !== 'out_of_stock';

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-3.5 transition-all hover:translate-y-[-1px] hover:shadow-[0_6px_18px_rgb(0,0,0,0.05)]"
                                    >
                                        {/* Row 1: Icon, Name & Category */}
                                        <div className="flex items-start gap-3">
                                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${cat.bg}`}>
                                                {cat.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-sm font-bold text-slate-800 leading-tight mb-1 break-words">
                                                    {item.item_name}
                                                </h2>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${cat.bg}`}>
                                                    {cat.label}
                                                </span>
                                                {item.condition === 'major_damage' && (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider bg-rose-50 text-rose-700 border-rose-100">
                                                        Rusak Berat
                                                    </span>
                                                )}
                                                {item.condition === 'minor_damage' && (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-100">
                                                        Rusak Ringan
                                                    </span>
                                                )}
                                                {item.condition === 'under_repair' && (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-100">
                                                        Diperbaiki
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Row 2: Status & Stock Stack */}
                                        <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100/80 gap-2">
                                            
                                            {/* Status Badge */}
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                                                    Status
                                                </span>
                                                {isAvailable ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/50">
                                                        Tersedia
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/50">
                                                        Habis
                                                    </span>
                                                )}
                                            </div>

                                            {/* Divider */}
                                            <div className="w-px h-7 bg-slate-200"></div>

                                            {/* Stock Info */}
                                            <div className="flex flex-col flex-1 pl-2">
                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                                                    Jumlah Stok
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`text-sm font-extrabold ${
                                                        isOut ? 'text-rose-600' : 'text-slate-700'
                                                    }`}>
                                                        {item.quantity}
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-medium">{item.unit}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Link 
                                                    href={`/bidan/edit-inventaris/${item.id}`} 
                                                    className="bg-amber-50 text-amber-600 hover:bg-amber-100 active:scale-95 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.item_name)}
                                                    disabled={deleteMutation.isPending && deleteMutation.variables?.id === item.id}
                                                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 text-xs font-bold px-3 py-2 rounded-xl transition-all disabled:opacity-50"
                                                >
                                                    {deleteMutation.isPending && deleteMutation.variables?.id === item.id ? 'Menghapus...' : 'Hapus'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            /* Empty State */
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center flex flex-col items-center justify-center min-h-[300px]">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 mb-1">Tidak Ada Inventaris</h3>
                                <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
                                    Item tidak ditemukan. Coba ubah kata kunci pencarian atau kategori.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Add (+) Button */}
                <div className="fixed bottom-[100px] w-full max-w-md mx-auto z-40 pointer-events-none flex justify-end px-6 left-1/2 -translate-x-1/2">
                    <Link
                        href="/bidan/buat-data-inventaris"
                        className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all pointer-events-auto"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                    </Link>
                </div>

                {/* Bottom Navigation */}
                <BottombarBidan />
            </div>
        </div>
    );
}
