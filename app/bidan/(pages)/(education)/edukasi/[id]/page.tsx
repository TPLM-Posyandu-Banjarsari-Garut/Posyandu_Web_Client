'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetEducationById, useGetEducationCategories } from '@/hooks/query/education/useManageEducations';
import 'react-quill-new/dist/quill.snow.css'; 

export default function EdukasiViewPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: response, isLoading, isError } = useGetEducationById(id);
    const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetEducationCategories();
    
    const education = response?.data;
    const categories = categoriesResponse?.data?.data || [];

    const getCategoryName = (catId: string) => {
        const cat = categories.find(c => c.id === catId);
        return cat ? cat.name : 'Tanpa Kategori';
    };

    if (isLoading || isLoadingCategories) {
        return (
            <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
                <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200 justify-center items-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="text-slate-500 font-medium text-sm">Memuat artikel...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !education) {
        return (
            <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
                <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200 justify-center items-center gap-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-slate-800 font-bold text-lg">Edukasi Tidak Ditemukan</div>
                    <div className="text-slate-500 text-sm text-center px-8">Artikel edukasi yang Anda cari mungkin telah dihapus atau tidak tersedia.</div>
                    <Link href="/bidan/edukasi" className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-[1.25rem] text-sm font-bold shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:bg-blue-700 active:scale-95 transition-all">Kembali ke Daftar</Link>
                </div>
            </div>
        );
    }

    const readTime = education.read_time ? `${education.read_time} menit baca` : '-';
    const cleanContent = education.content?.replace(/&nbsp;/gi, ' ') || '';

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header Background */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-500 to-indigo-600 z-0 rounded-t-[2rem] rounded-b-[2.5rem]"></div>

                {/* Sticky Header Nav */}
                <div className="relative z-10 px-6 pt-8 flex items-center justify-between">
                    <Link href="/bidan/edukasi" className="p-2 -ml-2 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">Detail Edukasi</h1>
                    <Link href={`/bidan/edit-edukasi/${education.id}`} className="px-4 py-1.5 bg-white text-indigo-600 rounded-full text-xs font-bold hover:bg-blue-50 shadow-sm transition-colors">
                        Edit
                    </Link>
                </div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 pt-16 px-6 pb-6">

                    {/* Article Container */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col mb-6 mt-4">
                        
                        {/* Topic Tag & Reading Time */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                                {getCategoryName(education.category_id)}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                                ⏱️ {readTime}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-xl font-extrabold text-slate-800 mb-5 leading-snug pb-4 border-b border-slate-100">
                            {education.title}
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

            </div>
        </div>
    );
}
