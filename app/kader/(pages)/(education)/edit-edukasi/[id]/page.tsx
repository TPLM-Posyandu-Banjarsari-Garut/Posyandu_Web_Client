'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { 
    useGetEducationCategories, 
    useCreateEducationCategory, 
    useUpdateEducationCategory, 
    useDeleteEducationCategory, 
    useUpdateEducation,
    useGetEducationById
} from '@/hooks/query/education/useManageEducations';
import { useConfirm } from '@/providers/ConfirmProvider';

// Dynamically import ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EditEdukasiPage() {
    const params = useParams();
    const router = useRouter();
    const confirm = useConfirm();
    const id = params.id as string;
    
    const { data: educationResponse, isLoading: isLoadingEducation } = useGetEducationById(id);
    const education = educationResponse?.data;

    const [value, setValue] = useState('');
    const [selectedTema, setSelectedTema] = useState('');
    const [title, setTitle] = useState('');
    
    // Populate form when data is loaded
    useEffect(() => {
        if (education) {
            setTitle(education.title);
            setValue(education.content);
            setSelectedTema(education.category_id);
        }
    }, [education]);

    const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetEducationCategories();
    const categories = categoriesResponse?.data?.data || [];
    
    const createCategoryMutation = useCreateEducationCategory();
    const updateCategoryMutation = useUpdateEducationCategory();
    const deleteCategoryMutation = useDeleteEducationCategory();

    const updateEducationMutation = useUpdateEducation();

    const [isAddingTema, setIsAddingTema] = useState(false);
    const [isEditingTema, setIsEditingTema] = useState(false);
    const [newTema, setNewTema] = useState('');

    const fontSizes = ['small', false, 'large', 'huge'] as const;

    const modules = {
        toolbar: [
            [{ 'font': [] }],
            [{ size: fontSizes }],
            ['bold', 'italic'],
            [{ 'color': [] }],
            [{ 'align': [] }],
            ['image']
        ],
    };

    const formats = [
        'font',
        'size',
        'bold', 'italic',
        'color',
        'align',
        'image'
    ];

    if (isLoadingEducation) {
        return (
            <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
                <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col justify-center items-center">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="text-slate-500 font-medium text-sm mt-3">Memuat form edit...</div>
                </div>
            </div>
        );
    }

    if (!education) {
        return (
            <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
                <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col justify-center items-center gap-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="text-slate-800 font-bold text-lg">Edukasi Tidak Ditemukan</div>
                    <Link href="/kader/edukasi" className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-[1.25rem] text-sm font-bold">Kembali ke Daftar</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/kader/edukasi" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Edit Edukasi</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-slate-50">
                    <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-5">
                        
                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-slate-700">Tema Edukasi</label>
                            
                            {!isAddingTema && !isEditingTema ? (
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <select 
                                            value={selectedTema}
                                            onChange={(e) => setSelectedTema(e.target.value)}
                                            disabled={isLoadingCategories}
                                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner appearance-none transition-all disabled:opacity-50"
                                        >
                                            <option value="">{isLoadingCategories ? "Memuat Kategori..." : "Pilih Tema Edukasi"}</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setIsAddingTema(true)}
                                        className="px-4 bg-blue-50 text-blue-600 border border-blue-100 rounded-[1.25rem] font-medium text-sm hover:bg-blue-100 transition-colors flex items-center gap-1 shrink-0"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                        Baru
                                    </button>
                                    {selectedTema && (
                                        <>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    const cat = categories.find(c => c.id === selectedTema);
                                                    if (cat) {
                                                        setNewTema(cat.name);
                                                        setIsEditingTema(true);
                                                    }
                                                }}
                                                className="px-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-[1.25rem] hover:bg-amber-100 transition-colors flex items-center shrink-0"
                                                title="Edit Tema"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={async () => {
                                                    if (await confirm("Apakah Anda yakin ingin menghapus tema ini?")) {
                                                        deleteCategoryMutation.mutate(selectedTema, {
                                                            onSuccess: () => {
                                                                setSelectedTema('');
                                                            }
                                                        });
                                                    }
                                                }}
                                                disabled={deleteCategoryMutation.isPending}
                                                className="px-3 bg-red-50 text-red-600 border border-red-100 rounded-[1.25rem] hover:bg-red-100 transition-colors flex items-center shrink-0 disabled:opacity-50"
                                                title="Hapus Tema"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newTema}
                                        onChange={(e) => setNewTema(e.target.value)}
                                        className="flex-1 min-w-0 px-3 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400" 
                                        placeholder={isEditingTema ? "Ubah nama tema..." : "Tema baru..."} 
                                        autoFocus
                                    />
                                    <button 
                                        type="button"
                                        disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                                        onClick={() => {
                                            if (newTema.trim()) {
                                                const slug = newTema.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                                
                                                if (isEditingTema) {
                                                    updateCategoryMutation.mutate(
                                                        { id: selectedTema, payload: { name: newTema.trim(), slug } },
                                                        {
                                                            onSuccess: () => {
                                                                setIsEditingTema(false);
                                                                setNewTema('');
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    const existing = categories.find(c => c.name.toLowerCase() === newTema.trim().toLowerCase());
                                                    if (!existing) {
                                                        createCategoryMutation.mutate(
                                                            { name: newTema.trim(), slug },
                                                            {
                                                                onSuccess: (response) => {
                                                                    setSelectedTema(response.data.id);
                                                                    setIsAddingTema(false);
                                                                    setNewTema('');
                                                                }
                                                            }
                                                        );
                                                    } else {
                                                        setSelectedTema(existing.id);
                                                        setIsAddingTema(false);
                                                        setNewTema('');
                                                    }
                                                }
                                            } else {
                                                setIsAddingTema(false);
                                                setIsEditingTema(false);
                                                setNewTema('');
                                            }
                                        }}
                                        className="px-3 sm:px-4 bg-blue-600 text-white rounded-[1.25rem] font-medium text-sm hover:bg-blue-700 transition-colors flex items-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {(createCategoryMutation.isPending || updateCategoryMutation.isPending) ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsAddingTema(false);
                                            setIsEditingTema(false);
                                            setNewTema('');
                                        }}
                                        className="px-3 sm:px-4 bg-slate-100 text-slate-600 rounded-[1.25rem] font-medium text-sm hover:bg-slate-200 transition-colors flex items-center shrink-0"
                                    >
                                        Batal
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-slate-700">Judul Edukasi</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400" 
                                placeholder="Masukkan judul edukasi..." 
                            />
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-slate-700">Isi Edukasi / Deskripsi</label>
                            
                            <div className="bg-white border border-slate-200 rounded-[1.25rem] overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                <ReactQuill 
                                    theme="snow"
                                    value={value}
                                    onChange={setValue}
                                    modules={modules}
                                    formats={formats}
                                    placeholder="Tuliskan isi edukasi di sini..."
                                    className="custom-quill"
                                />
                                <style>{`
                                    .custom-quill .ql-toolbar {
                                        border: none !important;
                                        border-bottom: 1px solid #e2e8f0 !important;
                                        background: #f8fafc !important;
                                    }
                                    .custom-quill .ql-container {
                                        border: none !important;
                                        font-family: inherit !important;
                                        font-size: 0.875rem !important;
                                        min-height: 200px !important;
                                    }
                                    .custom-quill .ql-editor {
                                        min-height: 200px !important;
                                    }
                                    .custom-quill .ql-stroke {
                                        stroke: #475569 !important;
                                    }
                                    .custom-quill .ql-fill {
                                        fill: #475569 !important;
                                    }
                                    .custom-quill .ql-picker {
                                        color: #475569 !important;
                                    }
                                `}</style>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                if (!title.trim() || !value.trim() || !selectedTema) {
                                    alert("Mohon lengkapi Tema, Judul, dan Isi Edukasi!");
                                    return;
                                }
                                updateEducationMutation.mutate({
                                    id,
                                    payload: {
                                        title: title.trim(),
                                        content: value,
                                        category_id: selectedTema,
                                    }
                                }, {
                                    onSuccess: () => {
                                        router.push('/kader/edukasi');
                                    }
                                });
                            }}
                            disabled={updateEducationMutation.isPending}
                            className="w-full mt-2 bg-blue-600 text-white font-bold text-sm py-4 rounded-[1.25rem] hover:bg-blue-700 active:scale-95 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                            {updateEducationMutation.isPending ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
