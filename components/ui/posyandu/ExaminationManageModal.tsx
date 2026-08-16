'use client';

import React, { useState } from 'react';
import { ExaminationItem } from '@/interfaces/schedule';

interface ExaminationManageModalProps {
    isOpen: boolean;
    onClose: () => void;
    examinationsList: ExaminationItem[];
    posyandu_id: string;
    onCreateExam: (name: string, type: ExaminationItem['examination_type']) => void;
    onUpdateExam: (id: string, name: string, type: ExaminationItem['examination_type']) => void;
    onDeleteExam: (id: string, name: string) => void;
    isCreatePending: boolean;
    isUpdatePending: boolean;
}

export default function ExaminationManageModal({
    isOpen,
    onClose,
    examinationsList,
    onCreateExam,
    onUpdateExam,
    onDeleteExam,
    isCreatePending,
    isUpdatePending,
}: ExaminationManageModalProps) {
    const [newExamName, setNewExamName] = useState('');
    const [newExamType, setNewExamType] = useState<ExaminationItem['examination_type']>('infant');
    const [editingExam, setEditingExam] = useState<ExaminationItem | null>(null);

    if (!isOpen) return null;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExamName.trim()) {
            alert('Nama kegiatan tidak boleh kosong!');
            return;
        }

        if (editingExam) {
            onUpdateExam(editingExam.id, newExamName.trim(), newExamType);
            setEditingExam(null);
        } else {
            onCreateExam(newExamName.trim(), newExamType);
        }
        setNewExamName('');
        setNewExamType('infant');
    };

    const startEditing = (exam: ExaminationItem) => {
        setEditingExam(exam);
        setNewExamName(exam.name);
        setNewExamType(exam.examination_type);
    };

    const cancelEditing = () => {
        setEditingExam(null);
        setNewExamName('');
        setNewExamType('infant');
    };

    return (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-[1020] flex flex-col justify-end animate-fade-in">
            <div className="bg-white w-full rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col max-h-[85%] animate-slide-up overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">
                            Kelola Jenis Kegiatan Posyandu
                        </h2>
                        <p className="text-[10px] text-slate-400">Tambah, ubah, atau hapus kategori kegiatan pemeriksaan posyandu</p>
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

                {/* Form Input for New/Edit Exam */}
                <form onSubmit={handleFormSubmit} className="py-4 border-b border-slate-100 flex flex-col gap-3 shrink-0 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 my-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-indigo-600">
                            {editingExam ? 'Edit Jenis Kegiatan' : 'Tambah Jenis Kegiatan Baru'}
                        </span>
                        {editingExam && (
                            <button
                                type="button"
                                onClick={cancelEditing}
                                className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                            >
                                Batal Edit
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            value={newExamName}
                            onChange={(e) => setNewExamName(e.target.value)}
                            placeholder="Contoh: Penimbangan & Vitamin A"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                            required
                        />

                        <div className="flex gap-2 items-center">
                            <select
                                value={newExamType}
                                onChange={(e) => setNewExamType(e.target.value as ExaminationItem['examination_type'])}
                                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                            >
                                <option value="infant">Bayi (Infant)</option>
                                <option value="toddler">Balita (Toddler)</option>
                                <option value="young_child">Anak (Young Child)</option>
                            </select>

                            <button
                                type="submit"
                                disabled={isCreatePending || isUpdatePending}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all shrink-0 cursor-pointer disabled:opacity-50"
                            >
                                {isCreatePending || isUpdatePending ? 'Simpan...' : (editingExam ? 'Update' : '+ Tambah')}
                            </button>
                        </div>
                    </div>
                </form>

                {/* List of existing Examination items */}
                <div className="flex-1 overflow-y-auto py-2 pr-1 flex flex-col gap-2 custom-scrollbar">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Daftar Kegiatan Terdaftar</span>

                    {examinationsList.length > 0 ? (
                        examinationsList.map((exam) => (
                            <div
                                key={exam.id}
                                className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-xs hover:border-slate-200 transition-colors"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-bold text-slate-800">{exam.name}</span>
                                    <span className="text-[10px] font-semibold text-slate-400 capitalize">
                                        Kategori: {exam.examination_type.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => startEditing(exam)}
                                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs transition-colors"
                                        title="Edit Kegiatan"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDeleteExam(exam.id, exam.name)}
                                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs transition-colors"
                                        title="Hapus Kegiatan"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-xs text-slate-400 font-semibold">
                            Belum ada jenis kegiatan posyandu. Silakan tambah kegiatan baru di atas.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
