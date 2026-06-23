'use client';

import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import {
    useGetOrangTuaEducationById,
    useGetOrangTuaEducationCategories,
} from '@/hooks/query/orangtua/useOrangTuaChildren';
import axios from 'axios';
import 'react-quill-new/dist/quill.snow.css';

function BacaEdukasiContent() {
    const searchParams = useSearchParams();
    const idParam = searchParams.get('id') || "";

    const { data: educationResponse, isLoading, error } = useGetOrangTuaEducationById(idParam);
    const { data: categoriesResponse } = useGetOrangTuaEducationCategories();

    const categories = categoriesResponse?.data?.data || [];
    const getCategoryName = (id: string) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : 'Tanpa Kategori';
    };

    const getErrorMessage = (err: unknown): string => {
        if (!err) return "";
        if (axios.isAxiosError(err)) {
            return (err.response?.data as { message?: string })?.message || err.message;
        }
        if (err instanceof Error) {
            return err.message;
        }
        return "Terjadi kesalahan";
    };

    const apiError = getErrorMessage(error);
    const artikel = educationResponse?.data;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
                <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200 justify-center items-center">
                    <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    if (apiError || !artikel) {
        return (
            <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
                <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200 justify-center items-center text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h2 className="font-bold text-slate-800 mb-2">Artikel tidak ditemukan</h2>
                    <p className="text-sm text-slate-500 mb-6">{apiError || "Edukasi tidak ada atau ID tidak valid."}</p>
                    <Link href="/orangtua/edukasi" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-colors">
                        Kembali
                    </Link>
                </div>
            </div>
        );
    }

    const readTime = artikel.read_time ? `${artikel.read_time} menit baca` : '-';
    
    // Replace non-breaking spaces (&nbsp;) with standard spaces to allow proper browser word wrapping
    const cleanContent = artikel.content.replace(/&nbsp;/gi, ' ');

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header Background */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

                {/* Sticky Header Nav */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/orangtua/edukasi" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Baca Edukasi</h1>
                    <div className="w-10 h-10"></div> {/* Spacing balance */}
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-28">

                    {/* Article Container */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col mb-6 mt-4">
                        
                        {/* Topic Tag & Reading Time */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                                {getCategoryName(artikel.category_id)}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                                ⏱️ {readTime}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-xl font-extrabold text-slate-800 mb-5 leading-snug pb-4 border-b border-slate-100">
                            {artikel.title}
                        </h1>

                        {/* Custom styles override for Quill content to look premium */}
                        <style>{`
                            .ql-editor img {
                                max-width: 100%;
                                height: auto;
                                border-radius: 1rem;
                                margin: 1.25rem auto;
                                display: block;
                                box-shadow: 0 4px 15px rgb(0,0,0,0.05);
                            }
                            .ql-editor p {
                                margin-bottom: 0.85rem;
                                line-height: 1.65;
                                font-size: 0.9rem;
                                color: #475569; /* text-slate-600 */
                                text-align: justify;
                            }
                            .ql-editor h1, .ql-editor h2, .ql-editor h3 {
                                margin-top: 1.25rem;
                                margin-bottom: 0.6rem;
                                font-weight: 750;
                                color: #1e293b; /* text-slate-800 */
                                line-height: 1.35;
                            }
                        `}</style>

                        {/* Article Body using Quill styles for consistency */}
                        <div className="ql-snow">
                            <div 
                                className="ql-editor p-0 text-slate-700 leading-relaxed text-[15px]" 
                                dangerouslySetInnerHTML={{ __html: cleanContent }}
                            />
                        </div>

                    </div>
                </div>

                {/* Bottom Navigation */}
                <BottombarOrtu />
            </div>
        </div>
    );
}

export default function BacaEdukasi() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
            <BacaEdukasiContent />
        </Suspense>
    );
}
