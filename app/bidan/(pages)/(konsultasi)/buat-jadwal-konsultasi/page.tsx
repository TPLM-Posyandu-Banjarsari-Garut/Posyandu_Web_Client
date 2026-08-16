'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useGetMidwifeProfile } from '@/hooks/query/midwife/useMidwifeProfile';
import { useCreateMidwifeConsultation, useGetMidwifeAvailableSlots } from '@/hooks/query/midwife/useMidwifeConsultations';
import { useGetParents } from '@/hooks/query/parent/useManageParents';
import { useGetChildren } from '@/hooks/query/child/useManageChildren';
import { ConsultationType } from '@/interfaces/consultation';

const nativeInputClassName =
    'form-native-input absolute inset-0 h-full w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all';

const fieldWrapClassName = 'relative h-[3.25rem] w-full min-w-0 overflow-hidden';

interface CreateConsultationFormValues {
    consultation_type: ConsultationType;
    parent_id: string;
    children_id?: string;
    scheduled_date: string;
    scheduled_time: string;
    notes?: string;
}

export default function BuatJadwalKonsultasiPage() {
    const router = useRouter();
    const { data: profile, isLoading: isLoadingProfile } = useGetMidwifeProfile();
    const posyandu_id = profile?.posyandu_id;

    // Fetch Parents & Children per Posyandu
    const { data: parentsData, isLoading: isLoadingParents } = useGetParents({ limit: 100 });
    const { data: childrenData, isLoading: isLoadingChildren } = useGetChildren({
        posyandu_id: posyandu_id || undefined,
        limit: 100
    });

    const parentsList = parentsData?.data || [];
    const childrenList = childrenData?.data?.data || [];

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const createMutation = useCreateMidwifeConsultation();

    // Setup react-hook-form
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<CreateConsultationFormValues>({
        defaultValues: {
            consultation_type: 'child_development',
            parent_id: '',
            children_id: '',
            scheduled_date: '',
            scheduled_time: '',
            notes: ''
        }
    });

    const consultationType = watch('consultation_type');
    const selectedParentId = watch('parent_id');
    const scheduledDate = watch('scheduled_date');
    const selectedTime = watch('scheduled_time');

    // Fetch available slots from backend
    const { data: availableSlots = [], isLoading: isLoadingSlots } = useGetMidwifeAvailableSlots(
        posyandu_id || '',
        consultationType,
        scheduledDate,
        profile?.id,
        !!posyandu_id && !!consultationType && !!scheduledDate
    );

    // Filter children based on selected parent
    const selectedParent = parentsList.find(p => p.id === selectedParentId);
    const filteredChildren = childrenList.filter(child => {
        if (!selectedParentId) return true;
        if (selectedParent && child.parent_user_id === selectedParent.user_id) return true;
        if (selectedParent && child.mother_name && selectedParent.name.toLowerCase().includes(child.mother_name.toLowerCase())) return true;
        return false;
    });

    const onSubmit = async (values: CreateConsultationFormValues) => {
        setErrorMessage(null);

        if (!posyandu_id) {
            setErrorMessage('Posyandu Bidan tidak terdeteksi. Silakan coba lagi.');
            return;
        }

        try {
            const [hours, minutes] = values.scheduled_time.split(':').map(Number);
            const [year, month, day] = values.scheduled_date.split('-').map(Number);
            const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

            await createMutation.mutateAsync({
                posyandu_id,
                parent_id: values.parent_id,
                children_id: values.consultation_type === 'child_development' && values.children_id ? values.children_id : undefined,
                consultation_type: values.consultation_type,
                scheduled_at: utcDate.toISOString(),
                midwife_id: profile?.id || null,
                notes: values.notes?.trim() || null,
            });

            router.push('/bidan/jadwal-konsultasi');
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            setErrorMessage(errorObj?.response?.data?.message || 'Gagal membuat jadwal konsultasi');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md min-w-0 bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/bidan/jadwal-konsultasi" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Buat Jadwal Konsultasi</h1>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 min-h-0 min-w-0 flex-col overflow-x-hidden overflow-y-auto px-6 py-6 custom-scrollbar bg-slate-50">
                    <div className="flex flex-1 flex-col gap-5 rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-[0_4px_15px_rgb(0,0,0,0.03)] min-w-0">

                        {errorMessage && (
                            <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600 flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Layanan Konsultasi */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Jenis Layanan Konsultasi <span className="text-red-500">*</span></label>
                            <div className={fieldWrapClassName}>
                                <select
                                    {...register('consultation_type', {
                                        required: 'Jenis layanan konsultasi wajib dipilih',
                                        onChange: (e) => {
                                            if (e.target.value !== 'child_development') {
                                                setValue('children_id', '');
                                            }
                                            setValue('scheduled_time', '');
                                        }
                                    })}
                                    className="form-native-input absolute inset-0 h-full w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all appearance-none cursor-pointer"
                                >
                                    <option value="child_development">Imunisasi / Tumbuh Kembang</option>
                                    <option value="general">Layanan Umum</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.consultation_type && (
                                <span className="text-xs font-semibold text-red-500 mt-1">{errors.consultation_type.message}</span>
                            )}
                        </div>

                        {/* Pilih Orang Tua / Ibu (Required) */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Pilih Orang Tua / Ibu <span className="text-red-500">*</span></label>
                            <div className={fieldWrapClassName}>
                                <select
                                    {...register('parent_id', {
                                        required: 'Nama Orang Tua / Ibu wajib dipilih untuk pendaftaran jam antrean booking',
                                        onChange: () => {
                                            setValue('children_id', '');
                                        }
                                    })}
                                    disabled={isLoadingParents}
                                    className="form-native-input absolute inset-0 h-full w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all appearance-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value="">-- Pilih Orang Tua / Pasien Posyandu --</option>
                                    {parentsList.map((parent) => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.name} {parent.phone_number ? `(${parent.phone_number})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.parent_id && (
                                <span className="text-xs font-semibold text-red-500 mt-1">{errors.parent_id.message}</span>
                            )}
                        </div>

                        {/* Pilih Anak / Bayi (Required untuk Imunisasi / Tumbuh Kembang) */}
                        {consultationType === 'child_development' && (
                            <div className="flex min-w-0 flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700">Pilih Anak / Bayi <span className="text-red-500">*</span></label>
                                <div className={fieldWrapClassName}>
                                    <select
                                        {...register('children_id', {
                                            validate: (val) =>
                                                consultationType !== 'child_development' ||
                                                !!val ||
                                                'Nama Anak / Bayi wajib dipilih untuk layanan tumbuh kembang'
                                        })}
                                        disabled={isLoadingChildren || !selectedParentId}
                                        className="form-native-input absolute inset-0 h-full w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all appearance-none cursor-pointer disabled:opacity-50"
                                    >
                                        <option value="">
                                            {!selectedParentId
                                                ? '-- Pilih Orang Tua Terlebih Dahulu --'
                                                : filteredChildren.length === 0
                                                ? '-- Tidak ada anak terdaftar --'
                                                : '-- Pilih Anak / Bayi --'}
                                        </option>
                                        {filteredChildren.map((child) => (
                                            <option key={child.id} value={child.id}>
                                                {child.name} {child.mother_name ? `(Ibu: ${child.mother_name})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.children_id && (
                                    <span className="text-xs font-semibold text-red-500 mt-1">{errors.children_id.message}</span>
                                )}
                            </div>
                        )}

                        {/* Tanggal Konsultasi */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Tanggal Konsultasi <span className="text-red-500">*</span></label>
                            <div className={fieldWrapClassName}>
                                <input
                                    type="date"
                                    {...register('scheduled_date', {
                                        required: 'Tanggal konsultasi wajib diisi',
                                        onChange: () => {
                                            setValue('scheduled_time', '');
                                        }
                                    })}
                                    className={nativeInputClassName}
                                />
                            </div>
                            {errors.scheduled_date && (
                                <span className="text-xs font-semibold text-red-500 mt-1">{errors.scheduled_date.message}</span>
                            )}
                        </div>

                        {/* Slot Jam Konsultasi (Fetch Real-Time Slot dari Backend) */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Pilih Slot Jam Konsultasi <span className="text-red-500">*</span></label>
                            
                            {/* Hidden input for react-hook-form validation */}
                            <input
                                type="hidden"
                                {...register('scheduled_time', {
                                    required: 'Slot jam konsultasi wajib dipilih'
                                })}
                            />

                            {!scheduledDate ? (
                                <div className="text-xs font-semibold text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                                    Silakan pilih tanggal konsultasi terlebih dahulu untuk melihat slot jam yang tersedia.
                                </div>
                            ) : isLoadingSlots ? (
                                <div className="grid grid-cols-3 gap-2.5 animate-pulse">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="h-11 bg-slate-100 rounded-xl border border-slate-200"></div>
                                    ))}
                                </div>
                            ) : availableSlots.length === 0 ? (
                                <div className="text-xs font-semibold text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
                                    Tidak ada slot waktu tersedia pada tanggal ini.
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2.5">
                                    {availableSlots.map((slot, idx) => {
                                        const isSelected = selectedTime === slot.time;
                                        if (!slot.available) {
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-center gap-1 py-3 px-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 select-none opacity-60"
                                                >
                                                    <span className="text-xs font-bold line-through">{slot.time}</span>
                                                </div>
                                            );
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setValue('scheduled_time', slot.time, { shouldValidate: true })}
                                                className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400'
                                                }`}
                                            >
                                                <svg className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{slot.time}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {errors.scheduled_time && (
                                <span className="text-xs font-semibold text-red-500 mt-1">{errors.scheduled_time.message}</span>
                            )}
                        </div>

                        {/* Catatan / Keterangan (Opsional) */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Catatan / Keterangan (Opsional)</label>
                            <textarea
                                rows={3}
                                {...register('notes')}
                                placeholder="Masukkan catatan atau instruksi khusus..."
                                className="w-full min-w-0 max-w-full box-border p-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={createMutation.isPending || isLoadingProfile}
                            className="mt-4 w-full bg-blue-600 text-white font-bold text-sm py-4 rounded-[1.25rem] hover:bg-blue-700 active:scale-95 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {createMutation.isPending ? (
                                <span>Menyimpan...</span>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                    Simpan Jadwal Konsultasi
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
