'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import BottombarKader from '@/components/ui/bottombar/kader/BottombarKader';
import DateFilterInput from '@/components/ui/DateFilterInput';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import { useGetCadreProfile } from '@/hooks/query/cadre/useCadreProfile';
import { fetchPosyanduById } from '@/service/posyandu/posyanduService';
import {
    useGetSchedules,
    useCreateSchedule,
    useUpdateSchedule,
    useDeleteSchedule
} from '@/hooks/query/schedule/useManageSchedules';
import { 
    useGetExaminations,
    useCreateExamination,
    useUpdateExamination,
    useDeleteExamination
} from '@/hooks/query/examination/useManageExaminations';
import { CreateSchedulePayload, ExaminationSchedule } from '@/interfaces/schedule';
import { useConfirm } from '@/providers/ConfirmProvider';

interface ScheduleFormValues {
    examination_id: string;
    scheduled_date: string;
    start_time: string;
    end_time: string;
}

export default function JadwalPosyandu() {
    // Register Service Worker explicitly on mount to ensure push notifications work flawlessly
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then((reg) => {
                console.log('Service Worker registered successfully with scope:', reg.scope);
            }).catch((err) => {
                console.warn('Service Worker registration failed:', err);
            });
        }
    }, []);

    // 1. Fetch User Data
    const { data: cadre } = useGetCadreProfile();
    const posyandu_id = cadre?.posyandu_id || '';
    
    const confirm = useConfirm();

    // 2. Fetch Posyandu Detail
    const { data: posyandu } = useQuery({
        queryKey: ['posyandu', posyandu_id],
        queryFn: () => fetchPosyanduById(posyandu_id),
        enabled: !!posyandu_id,
    });
    const posyanduName = posyandu?.name || 'Posyandu Anda';

    // 3. Fetch Examinations (for dropdown and matching names)
    const { data: examinationsData } = useGetExaminations({ posyandu_id });
    const examinationsList = (examinationsData?.data as any)?.data || [];
    
    const posyanduExaminations = useMemo(() => {
        if (!posyandu_id || !examinationsList) return [];
        return examinationsList.filter((ex: any) => ex.posyandu_id === posyandu_id);
    }, [posyandu_id, examinationsList]);

    // 4. Fetch Schedules
    const [filterDate, setFilterDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterExamination, setFilterExamination] = useState('');
    
    // Pagination
    const [page, setPage] = useState(1);
    const limit = 5;

    const { data: schedulesData, isLoading } = useGetSchedules({
        posyandu_id,
        scheduled_date: filterDate || undefined,
        examination_id: filterExamination || undefined,
        page,
        limit
    });
    
    const schedules = (schedulesData?.data as any)?.data || [];
    const meta = (schedulesData?.data as any)?.meta;
    const totalPages = meta?.total_pages || 1;

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [filterDate, filterExamination, searchQuery]);

    // Mutations
    const createMutation = useCreateSchedule();
    const updateMutation = useUpdateSchedule();
    const deleteMutation = useDeleteSchedule();

    // Modal & Toast states
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    // Form
    const { register, handleSubmit, reset, watch, setValue } = useForm<ScheduleFormValues>();
    const selectedExaminationId = watch('examination_id');

    // Examination inline states
    const [isAddingExam, setIsAddingExam] = useState(false);
    const [isEditingExam, setIsEditingExam] = useState(false);
    const [newExamName, setNewExamName] = useState('');
    const [newExamType, setNewExamType] = useState<'infant' | 'pregnant_mother' | 'toddler' | 'young_child'>('infant');

    const createExamMutation = useCreateExamination();
    const updateExamMutation = useUpdateExamination();
    const deleteExamMutation = useDeleteExamination();

    const openAddModal = () => {
        setEditingId(null);
        setIsAddingExam(false);
        setIsEditingExam(false);
        setNewExamName('');

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');

        reset({
            examination_id: '',
            scheduled_date: `${yyyy}-${mm}-${dd}`,
            start_time: '08:00',
            end_time: '11:00',
        });
        setShowModal(true);
    };

    const openEditModal = (item: ExaminationSchedule) => {
        setEditingId(item.id);
        setIsAddingExam(false);
        setIsEditingExam(false);
        setNewExamName('');
        reset({
            examination_id: item.examination_id,
            scheduled_date: item.scheduled_date ? new Date(item.scheduled_date).toISOString().split('T')[0] : '',
            start_time: item.start_time || '',
            end_time: item.end_time || '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    const onSubmit = (data: ScheduleFormValues) => {
        if (!posyandu_id) {
            alert('Gagal mendapatkan ID Posyandu.');
            return;
        }

        const payload: CreateSchedulePayload = {
            posyandu_id,
            examination_id: data.examination_id,
            scheduled_date: data.scheduled_date,
            start_time: data.start_time,
            end_time: data.end_time,
        };

        if (editingId) {
            updateMutation.mutate(
                { id: editingId, payload },
                {
                    onSuccess: () => {
                        triggerToast('Jadwal berhasil diperbarui!');
                        closeModal();
                    },
                    onError: (err: any) => {
                        alert(err?.response?.data?.message || 'Gagal memperbarui jadwal.');
                    }
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    triggerToast('Jadwal berhasil ditambahkan!');
                    closeModal();
                },
                onError: (err: any) => {
                    alert(err?.response?.data?.message || 'Gagal menambahkan jadwal. Pastikan tidak ada duplikat.');
                }
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (await confirm(`Apakah Anda yakin ingin menghapus jadwal ini?`)) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    triggerToast(`Jadwal berhasil dihapus.`);
                },
                onError: () => {
                    alert('Gagal menghapus jadwal.');
                }
            });
        }
    };

    // PWA Push Notification Handler
    const handleLaunchNotification = async (item: ExaminationSchedule, examName: string) => {
        if (!("Notification" in window)) {
            alert("Browser ini tidak mendukung notifikasi.");
            return;
        }

        const showNotification = async () => {
            const title = "🔔 JADWAL POSYANDU BARU";
            const options: NotificationOptions & { vibrate?: number[] } = {
                body: `Jadwal ${examName} di ${posyanduName} diluncurkan pada ${formatDateIndo(item.scheduled_date)} pukul ${item.start_time} - ${item.end_time} WIB. Jangan lupa hadir!`,
                icon: "/icon-192x192.png",
                badge: "/icon-192x192.png",
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: item.id,
                },
            };

            // Try sending notification via registered service worker
            if ("serviceWorker" in navigator) {
                try {
                    const swReadyPromise = navigator.serviceWorker.ready;
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Timeout waiting for Service Worker")), 1200)
                    );
                    const registration = await Promise.race([swReadyPromise, timeoutPromise]) as ServiceWorkerRegistration;

                    await registration.showNotification(title, options);
                    triggerToast(`Notifikasi terkirim via SW!`);
                    return;
                } catch (err) {
                    console.warn("Service Worker showNotification gagal, menggunakan fallback:", err);
                }
            }

            // Fallback for standard browser notifications
            try {
                new Notification(title, options);
                triggerToast(`Notifikasi terkirim!`);
            } catch (err) {
                console.error("Gagal meluncurkan browser notification:", err);
                alert("Gagal mengirim notifikasi. Pastikan izin diaktifkan.");
            }
        };

        if (Notification.permission === "granted") {
            await showNotification();
        } else if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                await showNotification();
            } else {
                triggerToast("Izin notifikasi ditolak oleh pengguna.");
            }
        } else {
            alert("Izin notifikasi diblokir. Harap aktifkan izin notifikasi pada pengaturan browser Anda.");
        }
    };

    const formatDateIndo = (dateStr: string) => {
        if (!dateStr) return '-';
        // Extract YYYY-MM-DD from ISO string if needed
        const rawDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        const [year, month, day] = rawDate.split('-');
        if (!year || !month || !day) return rawDate;
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
    };

    // Helper to get examination name
    const getExamName = (id: string) => {
        const exam = examinationsList.find((e: any) => e.id === id);
        return exam ? exam.name : 'Kegiatan Posyandu';
    };

    // Filter schedules locally for search text / dropdown
    const filteredJadwal = schedules.filter((item: any) => {
        const examName = getExamName(item.examination_id);
        const matchesSearch = examName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesExam = filterExamination ? item.examination_id === filterExamination : true;
        return matchesSearch && matchesExam;
    });

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
                
                {/* Header Background Gradient */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

                {/* Sticky Header Nav */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/kader/home" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Jadwal Posyandu</h1>
                    <div className="w-10 h-10"></div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-44">
                    {/* Dashboard Info Banner */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex items-center gap-4 mb-6 border border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Jadwal</p>
                            <h2 className="text-xl font-bold text-slate-800 leading-tight">
                                {isLoading ? '...' : (meta?.total_items || 0)} Sesi
                            </h2>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-205 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                            placeholder="Cari jenis kegiatan..."
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="mb-4 flex gap-2">
                        {/* Date Filter */}
                        <div className="w-[calc(50%-0.25rem)] min-w-0 shrink-0 grow-0">
                            <DateFilterInput
                                value={filterDate}
                                onChange={(val) => setFilterDate(val)}
                            />
                        </div>
                        {/* Examination Filter */}
                        <div className="w-[calc(50%-0.25rem)] min-w-0 shrink-0 grow-0 relative h-[3.25rem]">
                            <select
                                value={filterExamination}
                                onChange={(e) => setFilterExamination(e.target.value)}
                                className="w-full h-full box-border px-3 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-[0_2px_10px_rgb(0,0,0,0.02)] appearance-none font-semibold truncate pr-8"
                            >
                                <option value="">Semua Kegiatan</option>
                                {examinationsList.map((ex: any) => (
                                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Reset Filter Button & Pagination Controls */}
                    <div className="flex flex-col gap-3 mb-4 px-2">
                        {(searchQuery || filterDate || filterExamination) && (
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-slate-400">Hasil: {filteredJadwal.length} Jadwal di Halaman Ini</span>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilterDate('');
                                        setFilterExamination('');
                                        setPage(1);
                                    }}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 text-[11px] font-bold bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Sebelumnya
                            </button>
                            <span className="text-[11px] font-bold text-slate-500">
                                Halaman {page} dari {totalPages}
                            </span>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || totalPages === 0}
                                className="px-3 py-1.5 text-[11px] font-bold bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>

                    {/* Schedule List */}
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <div className="text-center text-sm text-slate-500 p-8">Memuat jadwal...</div>
                        ) : filteredJadwal.length > 0 ? (
                            filteredJadwal.map((item: any) => {
                                const examName = getExamName(item.examination_id);
                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-[2rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300 animate-fade-in"
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 shrink-0">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-extrabold text-slate-850 leading-tight">
                                                        {examName}
                                                    </h3>
                                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{posyanduName}</p>
                                                    <span className="inline-block mt-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100/50">
                                                        Terjadwal
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                                            <div className="flex gap-2.5 items-center text-xs text-slate-650 font-bold">
                                                <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formatDateIndo(item.scheduled_date)}</span>
                                            </div>
                                            <div className="flex gap-2.5 items-center text-xs text-slate-650 font-bold">
                                                <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{item.start_time} - {item.end_time} WIB</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 border-t border-slate-50 pt-3.5">
                                            <button
                                                onClick={() => handleLaunchNotification(item, examName)}
                                                className="w-full bg-gradient-to-tr from-indigo-500 to-blue-600 hover:opacity-95 text-[11px] font-bold px-3 py-3 rounded-xl active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(79,70,229,0.2)] text-white cursor-pointer"
                                            >
                                                <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                </svg>
                                                Luncurkan Notifikasi
                                            </button>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3 py-2.5 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold px-3.5 py-2.5 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer"
                                                    title="Hapus"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-semibold shadow-[0_2px_10px_rgb(0,0,0,0.01)]">
                                Tidak ada jadwal posyandu yang ditemukan.
                            </div>
                        )}
                    </div>
                </div>

                {/* FAB */}
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md flex justify-end px-6 pointer-events-none z-40">
                    <button
                        onClick={openAddModal}
                        className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                        title="Tambah Jadwal Baru"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                <BottombarKader />

                {/* Bottom Modal Form */}
                {showModal && (
                    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-[1010] flex flex-col justify-end animate-fade-in">
                        <div className="bg-white w-full rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col max-h-[85%] animate-slide-up overflow-hidden">
                            
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
                                <div>
                                    <h2 className="text-base font-bold text-slate-800">
                                        {editingId ? 'Edit Jadwal Posyandu' : 'Tambah Jadwal Baru'}
                                    </h2>
                                    <p className="text-[10px] text-slate-400">Pilih jenis kegiatan, lokasi otomatis mengikuti Posyandu Anda</p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto py-4 pr-1 flex flex-col gap-4 custom-scrollbar">
                                <form onSubmit={handleSubmit(onSubmit)} id="jadwal-form" className="flex flex-col gap-4">
                                    
                                    {/* Posyandu (Read Only Info) */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi Posyandu</label>
                                        <div className="w-full box-border px-4 py-3.5 bg-slate-100 border border-slate-205 rounded-[1.25rem] text-sm text-slate-600 font-semibold">
                                            {posyanduName}
                                        </div>
                                    </div>

                                    {/* Examination Select with Inline CRUD */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Kegiatan (Pemeriksaan)</label>
                                        
                                        {!isAddingExam && !isEditingExam ? (
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <select
                                                        {...register('examination_id', { required: true })}
                                                        className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all appearance-none font-semibold"
                                                    >
                                                        <option value="">Pilih kegiatan...</option>
                                                        {posyanduExaminations.map((exam: any) => (
                                                            <option key={exam.id} value={exam.id}>{exam.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        setIsAddingExam(true);
                                                        setNewExamName('');
                                                        setNewExamType('infant');
                                                    }}
                                                    className="px-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-[1.25rem] font-medium text-sm hover:bg-blue-100 transition-colors flex items-center gap-1 shrink-0"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                                    Baru
                                                </button>
                                                {selectedExaminationId && (
                                                    <>
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                const exam = posyanduExaminations.find((exam: any) => exam.id === selectedExaminationId);
                                                                if (exam) {
                                                                    setNewExamName(exam.name);
                                                                    setNewExamType(exam.examination_type);
                                                                    setIsEditingExam(true);
                                                                }
                                                            }}
                                                            className="px-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-[1.25rem] hover:bg-amber-100 transition-colors flex items-center shrink-0"
                                                            title="Edit Kegiatan"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={async () => {
                                                                if (await confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
                                                                    deleteExamMutation.mutate(selectedExaminationId, {
                                                                        onSuccess: () => {
                                                                            setValue('examination_id', '');
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                            disabled={deleteExamMutation.isPending}
                                                            className="px-3 bg-red-50 text-red-600 border border-red-100 rounded-[1.25rem] hover:bg-red-100 transition-colors flex items-center shrink-0 disabled:opacity-50"
                                                            title="Hapus Kegiatan"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2 p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                                                <input 
                                                    type="text" 
                                                    value={newExamName}
                                                    onChange={(e) => setNewExamName(e.target.value)}
                                                    className="w-full px-3 py-3 bg-white border border-slate-200 rounded-[1rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400" 
                                                    placeholder={isEditingExam ? "Ubah nama kegiatan..." : "Nama kegiatan baru..."} 
                                                    autoFocus
                                                />
                                                <div className="flex gap-2">
                                                    <select
                                                        value={newExamType}
                                                        onChange={(e) => setNewExamType(e.target.value as any)}
                                                        className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-[1rem] text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner appearance-none font-semibold"
                                                    >
                                                        <option value="infant">Bayi (Infant)</option>
                                                        <option value="toddler">Balita (Toddler)</option>
                                                        <option value="young_child">Anak (Young Child)</option>
                                                        <option value="pregnant_mother">Ibu Hamil</option>
                                                    </select>
                                                    <button 
                                                        type="button"
                                                        disabled={createExamMutation.isPending || updateExamMutation.isPending || !newExamName.trim()}
                                                        onClick={() => {
                                                            if (isEditingExam && selectedExaminationId) {
                                                                updateExamMutation.mutate(
                                                                    { id: selectedExaminationId, payload: { name: newExamName.trim(), examination_type: newExamType } },
                                                                    {
                                                                        onSuccess: () => {
                                                                            setIsEditingExam(false);
                                                                            setNewExamName('');
                                                                        }
                                                                    }
                                                                );
                                                            } else {
                                                                createExamMutation.mutate(
                                                                    { posyandu_id, name: newExamName.trim(), examination_type: newExamType },
                                                                    {
                                                                        onSuccess: (response) => {
                                                                            setValue('examination_id', response.data.id);
                                                                            setIsAddingExam(false);
                                                                            setNewExamName('');
                                                                        }
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                        className="px-4 bg-blue-600 text-white rounded-[1rem] font-bold text-xs hover:bg-blue-700 transition-colors shrink-0 disabled:opacity-50"
                                                    >
                                                        {(createExamMutation.isPending || updateExamMutation.isPending) ? '...' : 'Simpan'}
                                                    </button>
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            setIsAddingExam(false);
                                                            setIsEditingExam(false);
                                                            setNewExamName('');
                                                        }}
                                                        className="px-4 bg-slate-200 text-slate-600 rounded-[1rem] font-bold text-xs hover:bg-slate-300 transition-colors shrink-0"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tanggal */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Pelaksanaan</label>
                                        <div className="relative h-[3.25rem] w-full overflow-hidden">
                                            <input
                                                type="date"
                                                {...register('scheduled_date', { required: true })}
                                                className="absolute inset-0 h-full w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all [color-scheme:light]"
                                            />
                                        </div>
                                    </div>

                                    {/* Waktu */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Mulai</label>
                                            <input
                                                type="time"
                                                {...register('start_time', { required: true })}
                                                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all [color-scheme:light]"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Selesai</label>
                                            <input
                                                type="time"
                                                {...register('end_time', { required: true })}
                                                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-205 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all [color-scheme:light]"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex gap-3.5 shrink-0 bg-white">
                                <button
                                    onClick={closeModal}
                                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm py-4 rounded-[1.25rem] active:scale-95 transition-all text-center cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    form="jadwal-form"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="w-2/3 bg-blue-600 text-white font-bold text-sm py-4 rounded-[1.25rem] shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {(createMutation.isPending || updateMutation.isPending) ? 'Menyimpan...' : (
                                        <>
                                            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                            </svg>
                                            Simpan Jadwal
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toast */}
                {showToast && (
                    <div className="fixed bottom-[92px] left-1/2 -translate-x-1/2 w-[85%] max-w-[calc(448px*0.85)] bg-slate-900/90 text-white text-xs font-bold px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-[1050] animate-fade-in backdrop-blur-sm border border-white/10">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="flex-1 text-slate-100">{toastMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
