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
    useDeleteSchedule,
    useBroadcastScheduleNotification
} from '@/hooks/query/schedule/useManageSchedules';
import { 
    useGetExaminations,
    useCreateExamination,
    useUpdateExamination,
    useDeleteExamination
} from '@/hooks/query/examination/useManageExaminations';
import { CreateSchedulePayload, ExaminationSchedule } from '@/interfaces/schedule';
import { useConfirm } from '@/providers/ConfirmProvider';

import BroadcastNotificationModal from '@/components/ui/posyandu/BroadcastNotificationModal';
import ScheduleFormModal, { ScheduleFormValues, ExaminationItem } from '@/components/ui/posyandu/ScheduleFormModal';
import ExaminationManageModal from '@/components/ui/posyandu/ExaminationManageModal';
import ScheduleCardItem from '@/components/ui/posyandu/ScheduleCardItem';

interface ApiErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export default function JadwalPosyandu() {
    // Register Service Worker explicitly on mount
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch((err) => {
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

    // 3. Fetch Examinations
    const { data: examinationsData } = useGetExaminations({ posyandu_id });
    const rawExams = (examinationsData as unknown as { data?: { data?: ExaminationItem[] } })?.data?.data;
    const examinationsList: ExaminationItem[] = Array.isArray(rawExams) ? rawExams : [];

    const posyanduExaminations = useMemo(() => {
        if (!posyandu_id || !examinationsList) return [];
        return examinationsList.filter((ex) => ex.posyandu_id === posyandu_id);
    }, [posyandu_id, examinationsList]);

    // 4. Fetch Schedules
    const [filterDate, setFilterDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterExamination, setFilterExamination] = useState('');
    const [page, setPage] = useState(1);
    const limit = 5;

    const { data: schedulesData, isLoading } = useGetSchedules({
        posyandu_id,
        scheduled_date: filterDate || undefined,
        examination_id: filterExamination || undefined,
        page,
        limit
    });

    const rawSchedules = (schedulesData as unknown as { data?: { data?: ExaminationSchedule[]; meta?: { total_pages?: number; total_items?: number } } })?.data?.data;
    const schedules: ExaminationSchedule[] = Array.isArray(rawSchedules) ? rawSchedules : [];
    const meta = (schedulesData as unknown as { data?: { meta?: { total_pages?: number; total_items?: number } } })?.data?.meta;
    const totalPages = meta?.total_pages || 1;

    useEffect(() => {
        setPage(1);
    }, [filterDate, filterExamination, searchQuery]);

    // Mutations
    const createMutation = useCreateSchedule();
    const updateMutation = useUpdateSchedule();
    const deleteMutation = useDeleteSchedule();
    const broadcastMutation = useBroadcastScheduleNotification();
    const createExamMutation = useCreateExamination();
    const updateExamMutation = useUpdateExamination();
    const deleteExamMutation = useDeleteExamination();

    // Modal & Toast states
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<ExaminationSchedule | null>(null);

    const [showExamManageModal, setShowExamManageModal] = useState(false);

    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [selectedBroadcastItem, setSelectedBroadcastItem] = useState<{
        schedule: ExaminationSchedule;
        examName: string;
    } | null>(null);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ScheduleFormValues>({
        defaultValues: {
            examination_id: '',
            scheduled_date: '',
            start_time: '08:00',
            end_time: '11:00',
        }
    });

    const openAddModal = () => {
        setEditingItem(null);
        reset({
            examination_id: posyanduExaminations.length > 0 ? posyanduExaminations[0].id : '',
            scheduled_date: new Date().toISOString().split('T')[0],
            start_time: '08:00',
            end_time: '11:00',
        });
        setShowModal(true);
    };

    const openEditModal = (item: ExaminationSchedule) => {
        setEditingItem(item);
        setValue('examination_id', item.examination_id);
        const formattedDate = item.scheduled_date ? item.scheduled_date.split('T')[0] : '';
        setValue('scheduled_date', formattedDate);
        setValue('start_time', item.start_time || '08:00');
        setValue('end_time', item.end_time || '11:00');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const onSubmit = (data: ScheduleFormValues) => {
        if (!posyandu_id) {
            triggerToast('Gagal: Posyandu ID tidak ditemukan');
            return;
        }

        const payload: CreateSchedulePayload = {
            posyandu_id,
            examination_id: data.examination_id,
            scheduled_date: data.scheduled_date,
            start_time: data.start_time,
            end_time: data.end_time,
        };

        if (editingItem) {
            updateMutation.mutate(
                { id: editingItem.id, payload },
                {
                    onSuccess: () => {
                        triggerToast('Jadwal posyandu berhasil diperbarui!');
                        closeModal();
                    },
                    onError: (err: unknown) => {
                        const error = err as ApiErrorResponse;
                        triggerToast(error.response?.data?.message || 'Gagal memperbarui jadwal');
                    }
                }
            );
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    triggerToast('Jadwal posyandu berhasil ditambahkan!');
                    closeModal();
                },
                onError: (err: unknown) => {
                    const error = err as ApiErrorResponse;
                    triggerToast(error.response?.data?.message || 'Gagal menambahkan jadwal');
                }
            });
        }
    };

    const handleDelete = async (id: string, name: string) => {
        const isConfirmed = await confirm(`Apakah Anda yakin ingin menghapus jadwal "${name}"? Tindakan ini tidak dapat dibatalkan.`);

        if (isConfirmed) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    triggerToast('Jadwal berhasil dihapus!');
                },
                onError: (err: unknown) => {
                    const error = err as ApiErrorResponse;
                    triggerToast(error.response?.data?.message || 'Gagal menghapus jadwal');
                }
            });
        }
    };

    const openBroadcastModal = (item: ExaminationSchedule, examName: string) => {
        setSelectedBroadcastItem({ schedule: item, examName });
        setShowBroadcastModal(true);
    };

    const handleConfirmBroadcast = (payloadData: {
        custom_message?: string;
        scheduled_push_at?: string;
        timingOption: 'instant' | 'custom';
        customPushTime: string;
    }) => {
        if (!selectedBroadcastItem) return;

        const formatPushTimestamp = (d: Date = new Date()) => {
            if (isNaN(d.getTime())) return '-';
            return d.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }) + ' WIB';
        };

        broadcastMutation.mutate(
            {
                id: selectedBroadcastItem.schedule.id,
                payload: {
                    custom_message: payloadData.custom_message,
                    scheduled_push_at: payloadData.scheduled_push_at
                }
            },
            {
                onSuccess: (res) => {
                    const count = res.data.recipient_count;
                    const isScheduled = payloadData.timingOption === 'custom' || !!res.data.is_scheduled;
                    const scheduledTimeStr = payloadData.customPushTime ? formatPushTimestamp(new Date(payloadData.customPushTime)) : '';

                    if (isScheduled && scheduledTimeStr) {
                        triggerToast(`Notifikasi berhasil dijadwalkan untuk dikirim pada ${scheduledTimeStr}!`);
                    } else {
                        triggerToast(`Notifikasi berhasil diluncurkan ke ${count} orang tua!`);
                    }
                    setShowBroadcastModal(false);
                    setSelectedBroadcastItem(null);
                },
                onError: (err: unknown) => {
                    const error = err as ApiErrorResponse;
                    triggerToast(error.response?.data?.message || 'Gagal mengirim notifikasi');
                }
            }
        );
    };

    // Examination Management Handlers
    const handleCreateExam = (name: string, examination_type: ExaminationItem['examination_type']) => {
        if (!posyandu_id) return;
        createExamMutation.mutate(
            { posyandu_id, name, examination_type },
            {
                onSuccess: () => {
                    triggerToast(`Jenis kegiatan "${name}" berhasil ditambahkan!`);
                },
                onError: (err: unknown) => {
                    const error = err as ApiErrorResponse;
                    triggerToast(error.response?.data?.message || 'Gagal menambahkan jenis kegiatan');
                }
            }
        );
    };

    const handleUpdateExam = (id: string, name: string, examination_type: ExaminationItem['examination_type']) => {
        updateExamMutation.mutate(
            { id, payload: { name, examination_type } },
            {
                onSuccess: () => {
                    triggerToast(`Jenis kegiatan "${name}" berhasil diperbarui!`);
                },
                onError: (err: unknown) => {
                    const error = err as ApiErrorResponse;
                    triggerToast(error.response?.data?.message || 'Gagal memperbarui jenis kegiatan');
                }
            }
        );
    };

    const handleDeleteExam = async (id: string, name: string) => {
        const isConfirmed = await confirm(`Apakah Anda yakin ingin menghapus kegiatan "${name}"?`);

        if (isConfirmed) {
            deleteExamMutation.mutate(id, {
                onSuccess: () => {
                    triggerToast(`Jenis kegiatan "${name}" berhasil dihapus!`);
                },
                onError: (err: unknown) => {
                    const error = err as ApiErrorResponse;
                    triggerToast(error.response?.data?.message || 'Gagal menghapus jenis kegiatan');
                }
            });
        }
    };

    const formatDateIndo = (dateStr: string) => {
        if (!dateStr) return '-';
        const rawDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        const [year, month, day] = rawDate.split('-');
        if (!year || !month || !day) return dateStr;
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
    };

    const filteredSchedules = useMemo(() => {
        if (!searchQuery.trim()) return schedules;
        return schedules.filter(item => {
            const examObj = posyanduExaminations.find(e => e.id === item.examination_id);
            const name = examObj?.name || 'Kegiatan Posyandu';
            return name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [schedules, searchQuery, posyanduExaminations]);

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
                {/* Header Background */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

                {/* Header Nav */}
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
                    {/* Posyandu Info Banner */}
                    <div className="bg-white rounded-[2rem] p-5 shadow-[0_10px_40px_rgb(0,0,0,0.06)] flex items-center gap-4 mb-6 border border-slate-100">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{posyanduName}</p>
                            <h2 className="text-xl font-bold text-slate-800 leading-tight">
                                {schedules.length} Sesi Terjadwal
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
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
                            placeholder="Cari jenis kegiatan..."
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="mb-4 flex gap-2">
                        <div className="w-[calc(50%-0.25rem)] min-w-0 shrink-0 grow-0">
                            <DateFilterInput
                                value={filterDate}
                                onChange={(val) => setFilterDate(val)}
                            />
                        </div>
                        <div className="w-[calc(50%-0.25rem)] min-w-0 shrink-0 grow-0 relative h-[3.25rem]">
                            <select
                                value={filterExamination}
                                onChange={(e) => setFilterExamination(e.target.value)}
                                className="w-full h-full box-border px-3 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-[0_2px_10px_rgb(0,0,0,0.02)] appearance-none font-semibold truncate pr-8"
                            >
                                <option value="">Semua Kegiatan</option>
                                {posyanduExaminations.map((ex) => (
                                    <option key={ex.id} value={ex.id}>
                                        {ex.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Reset Filters */}
                    {(searchQuery || filterDate || filterExamination) && (
                        <div className="flex justify-between items-center mb-4 px-2">
                            <span className="text-[11px] font-bold text-slate-400">Hasil filter: {filteredSchedules.length} Jadwal</span>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilterDate('');
                                    setFilterExamination('');
                                }}
                                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Schedule Cards Stack */}
                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-semibold">
                                Memuat jadwal posyandu...
                            </div>
                        ) : filteredSchedules.length > 0 ? (
                            filteredSchedules.map((item) => {
                                const examObj = posyanduExaminations.find(e => e.id === item.examination_id);
                                const examName = examObj?.name || 'Kegiatan Posyandu';

                                return (
                                    <ScheduleCardItem
                                        key={item.id}
                                        item={item}
                                        examName={examName}
                                        posyanduName={posyanduName}
                                        formatDateIndo={formatDateIndo}
                                        onOpenBroadcast={openBroadcastModal}
                                        onOpenEdit={openEditModal}
                                        onDelete={handleDelete}
                                    />
                                );
                            })
                        ) : (
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-semibold shadow-[0_2px_10px_rgb(0,0,0,0.01)]">
                                Tidak ada jadwal posyandu yang ditemukan.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 bg-white p-3 rounded-2xl border border-slate-100">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                                Sebelumnya
                            </button>
                            <span className="text-xs font-bold text-slate-500">
                                Halaman {page} dari {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 disabled:opacity-40 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    )}
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

                {/* Bottom navigation */}
                <BottombarKader />

                {/* Modals */}
                <ScheduleFormModal
                    isOpen={showModal}
                    onClose={closeModal}
                    editingItem={editingItem}
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    examinationsList={posyanduExaminations}
                    onOpenExaminationManage={() => setShowExamManageModal(true)}
                    isPending={createMutation.isPending || updateMutation.isPending}
                />

                <ExaminationManageModal
                    isOpen={showExamManageModal}
                    onClose={() => setShowExamManageModal(false)}
                    examinationsList={posyanduExaminations}
                    posyandu_id={posyandu_id}
                    onCreateExam={handleCreateExam}
                    onUpdateExam={handleUpdateExam}
                    onDeleteExam={handleDeleteExam}
                    isCreatePending={createExamMutation.isPending}
                    isUpdatePending={updateExamMutation.isPending}
                />

                <BroadcastNotificationModal
                    isOpen={showBroadcastModal}
                    onClose={() => {
                        setShowBroadcastModal(false);
                        setSelectedBroadcastItem(null);
                    }}
                    selectedItem={selectedBroadcastItem}
                    posyanduName={posyanduName}
                    formatDateIndo={formatDateIndo}
                    onConfirm={handleConfirmBroadcast}
                    isPending={broadcastMutation.isPending}
                />

                {/* Toast */}
                {showToast && (
                    <div className="fixed bottom-[92px] left-1/2 -translate-x-1/2 w-[85%] max-w-[calc(448px*0.85)] bg-slate-900/90 text-white text-xs font-bold px-4 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-[1050] animate-fade-in backdrop-blur-sm border border-white/10">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="flex-1">{toastMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
