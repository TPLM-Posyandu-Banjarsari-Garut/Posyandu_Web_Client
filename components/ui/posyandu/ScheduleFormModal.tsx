'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { ExaminationSchedule, ScheduleFormValues, ExaminationItem } from '@/interfaces/schedule';

interface ScheduleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingItem: ExaminationSchedule | null;
    register: UseFormRegister<ScheduleFormValues>;
    errors: FieldErrors<ScheduleFormValues>;
    handleSubmit: UseFormHandleSubmit<ScheduleFormValues>;
    onSubmit: (data: ScheduleFormValues) => void;
    examinationsList: ExaminationItem[];
    onOpenExaminationManage: () => void;
    isPending: boolean;
}

export default function ScheduleFormModal({
    isOpen,
    onClose,
    editingItem,
    register,
    errors,
    handleSubmit,
    onSubmit,
    examinationsList,
    onOpenExaminationManage,
    isPending,
}: ScheduleFormModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-[1010] flex flex-col justify-end animate-fade-in">
            <div className="bg-white w-full rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col max-h-[85%] animate-slide-up overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">
                            {editingItem ? 'Edit Jadwal Posyandu' : 'Tambah Jadwal Baru'}
                        </h2>
                        <p className="text-[10px] text-slate-400">Tentukan jenis pemeriksaan, tanggal, dan waktu pelaksanaan posyandu</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto py-4 pr-1 flex flex-col gap-4 custom-scrollbar">
                    <form onSubmit={handleSubmit(onSubmit)} id="jadwal-form" className="flex flex-col gap-4">
                        {/* Examination Selection Dropdown */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pemeriksaan / Kegiatan</label>
                                <button
                                    type="button"
                                    onClick={onOpenExaminationManage}
                                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Kelola Jenis Kegiatan
                                </button>
                            </div>
                            <div className="relative">
                                <select
                                    {...register('examination_id', { required: 'Pemeriksaan wajib dipilih' })}
                                    className="w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-inner transition-all appearance-none font-semibold"
                                >
                                    <option value="">-- Pilih Jenis Pemeriksaan --</option>
                                    {examinationsList.map((exam) => (
                                        <option key={exam.id} value={exam.id}>
                                            {exam.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.examination_id && (
                                <p className="text-[11px] font-semibold text-rose-500">{errors.examination_id.message}</p>
                            )}
                        </div>

                        {/* Scheduled Date */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Pelaksanaan</label>
                            <div className="relative h-[3.25rem] w-full overflow-hidden">
                                <input
                                    type="date"
                                    {...register('scheduled_date', { required: 'Tanggal wajib diisi' })}
                                    className="absolute inset-0 h-full w-full box-border px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-inner transition-all [color-scheme:light]"
                                />
                            </div>
                            {errors.scheduled_date && (
                                <p className="text-[11px] font-semibold text-rose-500">{errors.scheduled_date.message}</p>
                            )}
                        </div>

                        {/* Time Slots */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Mulai</label>
                                <input
                                    type="time"
                                    {...register('start_time', { required: 'Jam mulai wajib diisi' })}
                                    className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-inner transition-all [color-scheme:light]"
                                />
                                {errors.start_time && (
                                    <p className="text-[11px] font-semibold text-rose-500">{errors.start_time.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Selesai</label>
                                <input
                                    type="time"
                                    {...register('end_time', { required: 'Jam selesai wajib diisi' })}
                                    className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-inner transition-all [color-scheme:light]"
                                />
                                {errors.end_time && (
                                    <p className="text-[11px] font-semibold text-rose-500">{errors.end_time.message}</p>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 flex gap-3.5 shrink-0 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm py-4 rounded-[1.25rem] active:scale-95 transition-all text-center cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="jadwal-form"
                        disabled={isPending}
                        className="w-2/3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm py-4 rounded-[1.25rem] shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:opacity-95 active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isPending ? (
                            'Menyimpan...'
                        ) : (
                            <>
                                <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                {editingItem ? 'Perbarui Jadwal' : 'Simpan Jadwal'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
