'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
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
import {
    CreateSchedulePayload,
    ExaminationSchedule,
    ScheduleFormValues,
    ExaminationItem
} from '@/interfaces/schedule';
import { useConfirm } from '@/providers/ConfirmProvider';

interface ApiErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export function useJadwalPosyanduPage(posyandu_id: string) {
    const confirm = useConfirm();

    // 1. Register Service Worker on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch((err) => {
                console.warn('Service Worker registration failed:', err);
            });
        }
    }, []);

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

    // 4. Fetch Schedules & Filters
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

    return {
        posyanduName,
        posyanduExaminations,
        schedules,
        filteredSchedules,
        isLoading,
        page,
        setPage,
        totalPages,
        searchQuery,
        setSearchQuery,
        filterDate,
        setFilterDate,
        filterExamination,
        setFilterExamination,
        showModal,
        editingItem,
        openAddModal,
        openEditModal,
        closeModal,
        register,
        errors,
        handleSubmit,
        onSubmit,
        showExamManageModal,
        setShowExamManageModal,
        handleCreateExam,
        handleUpdateExam,
        handleDeleteExam,
        showBroadcastModal,
        setShowBroadcastModal,
        selectedBroadcastItem,
        setSelectedBroadcastItem,
        openBroadcastModal,
        handleConfirmBroadcast,
        handleDelete,
        formatDateIndo,
        showToast,
        toastMessage,
        isCreateSchedulePending: createMutation.isPending,
        isUpdateSchedulePending: updateMutation.isPending,
        isBroadcastPending: broadcastMutation.isPending,
        isCreateExamPending: createExamMutation.isPending,
        isUpdateExamPending: updateExamMutation.isPending,
    };
}
