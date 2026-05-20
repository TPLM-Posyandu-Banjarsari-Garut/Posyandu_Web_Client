'use client';

import Link from 'next/link';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to prevent SSR issues (document is not defined)
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CreateEdukasiPage() {
    const [value, setValue] = useState('');
    const [categories, setCategories] = useState(['Kesehatan Ibu', 'Kesehatan Bayi', 'Pola Asuh']);
    const [selectedTema, setSelectedTema] = useState('');
    const [isAddingTema, setIsAddingTema] = useState(false);
    const [newTema, setNewTema] = useState('');

    // Allow only a known set of sizes so the dropdown works consistently.
    // Quill uses class-based sizes: ql-size-small|large|huge (or default).
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

    return (
        <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

                {/* Header */}
                <div className="bg-white px-6 pt-8 pb-4 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/bidan/edukasi" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </Link>
                        <h1 className="text-xl font-bold text-slate-800">Buat Edukasi Baru</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-slate-50">
                    <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-5">
                        
                        <div className="flex flex-col gap-2.5">
                            <label className="text-sm font-bold text-slate-700">Tema Edukasi</label>
                            
                            {!isAddingTema ? (
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <select 
                                            value={selectedTema}
                                            onChange={(e) => setSelectedTema(e.target.value)}
                                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner appearance-none transition-all"
                                        >
                                            <option value="">Pilih Tema Edukasi</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
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
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newTema}
                                        onChange={(e) => setNewTema(e.target.value)}
                                        className="flex-1 min-w-0 px-3 py-3.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all placeholder-slate-400" 
                                        placeholder="Tema baru..." 
                                        autoFocus
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            if (newTema.trim()) {
                                                if (!categories.includes(newTema.trim())) {
                                                    setCategories([...categories, newTema.trim()]);
                                                }
                                                setSelectedTema(newTema.trim());
                                            }
                                            setIsAddingTema(false);
                                            setNewTema('');
                                        }}
                                        className="px-3 sm:px-4 bg-blue-600 text-white rounded-[1.25rem] font-medium text-sm hover:bg-blue-700 transition-colors flex items-center shrink-0"
                                    >
                                        Simpan
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsAddingTema(false);
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
                                    /* Fix for tooltips and icons */
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

                        <button className="w-full mt-2 bg-blue-600 text-white font-bold text-sm py-4 rounded-[1.25rem] hover:bg-blue-700 active:scale-95 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)] flex justify-center items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                            Simpan Edukasi
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
