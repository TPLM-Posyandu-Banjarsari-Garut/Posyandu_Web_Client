'use client';

import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

interface EdukasiDetail {
    id: number;
    tema: string;
    judul: string;
    estimasiBaca: string;
    kontenParagraf: string[];
}

function BacaEdukasiContent() {
    const searchParams = useSearchParams();
    const idParam = searchParams.get('id');

    const edukasiDb: Record<number, EdukasiDetail> = {
        1: {
            id: 1,
            tema: 'Kesehatan Ibu',
            judul: 'Pentingnya Gizi Selama Kehamilan',
            estimasiBaca: '4 menit baca',
            kontenParagraf: [
                'Selama masa kehamilan, kebutuhan nutrisi ibu hamil meningkat secara signifikan untuk mendukung tumbuh kembang janin secara optimal dan menjaga stamina ibu sendiri. Pemenuhan gizi yang seimbang merupakan faktor utama dalam mencegah risiko kelahiran prematur atau bayi lahir dengan berat badan rendah.',
                'Salah satu nutrisi paling penting di trimester pertama adalah Asam Folat, yang sangat krusial untuk mencegah kelainan tabung saraf otak bayi. Ibu hamil dapat memenuhi kebutuhan ini dengan mengonsumsi sayuran berdaun hijau gelap seperti bayam, brokoli, serta buah sitrus dan kacang-kacangan secara rutin.',
                'Selain itu, pemenuhan Zat Besi untuk memproduksi sel darah merah juga tidak kalah krusial agar terhindar dari anemia. Kalsium, Vitamin D, dan Asam Lemak Omega-3 dari susu, produk olahan keju, tahu, serta ikan salmon juga sangat direkomendasikan demi mendukung pembentukan tulang dan mengoptimalkan perkembangan sel otak janin.',
                'Ibu hamil juga sangat disarankan untuk menerapkan pola makan sehat dengan porsi kecil namun sering demi meminimalkan mual. Cukupi kebutuhan hidrasi harian dengan minum minimal 2.5 liter air putih setiap hari, serta pastikan untuk menghindari makanan mentah, membatasi konsumsi kafein, dan mengonsumsi suplemen tambahan hanya sesuai petunjuk dokter kandungan atau bidan.'
            ]
        },
        2: {
            id: 2,
            tema: 'Kesehatan Bayi',
            judul: 'Jadwal Imunisasi Dasar Anak',
            estimasiBaca: '5 menit baca',
            kontenParagraf: [
                'Imunisasi merupakan langkah preventif medis paling aman dan terbukti efektif untuk membangun kekebalan tubuh anak terhadap serangan kuman dan virus penyebab infeksi berat. Memberikan imunisasi secara lengkap dan tepat waktu sangat dianjurkan demi memastikan tumbuh kembang sang buah hati terproteksi maksimal.',
                'Proses imunisasi dimulai langsung saat bayi lahir (usia 0 bulan) dengan suntikan Hepatitis B untuk mencegah kerusakan hati. Dilanjutkan pada umur 1 bulan dengan imunisasi BCG untuk mencegah tuberkulosis paru yang parah, dan imunisasi Polio tetes pertama agar terhindar dari kelumpuhan kaki yang permanen.',
                'Pada masa usia 2 hingga 4 bulan, anak akan menerima rangkaian imunisasi kombinasi DPT-HB-Hib sebanyak tiga kali berturut-turut untuk membentenginya dari difteri, pertusis, tetanus, hepatitis B, meningitis, dan pneumonia. Selain itu, pada rentang usia ini juga diberikan imunisasi Polio tetes susulan, vaksin PCV, serta vaksin Rotavirus secara terjadwal.',
                'Terakhir, pada fase usia 9 bulan, anak dijadwalkan menerima vaksin MR (Measles & Rubella) demi melindunginya dari campak dan rubella yang rentan memicu radang paru-paru hingga radang otak. Selaku orang tua, sangat disarankan untuk tetap tenang jika anak mengalami demam ringan setelah divaksin, cukup kompres air dingin dan berikan ASI lebih sering.'
            ]
        },
        3: {
            id: 3,
            tema: 'Pola Asuh',
            judul: 'Cara Mengatasi Anak Tantrum',
            estimasiBaca: '3 menit baca',
            kontenParagraf: [
                'Tantrum merupakan fase perkembangan psikososial yang sangat wajar dialami oleh anak usia balita. Kondisi ini biasanya timbul karena ketidakmampuan anak dalam mengomunikasikan rasa frustrasi, rasa lelah, rasa lapar, ataupun kemauan mereka yang tidak terpenuhi menggunakan bahasa verbal secara lancar.',
                'Langkah paling bijak saat mendapati anak sedang mengalami tantrum adalah dengan tetap tenang dan tidak terpancing ikut marah. Ketenangan emosi dari orang tua bertindak sebagai jangkar emosional yang sangat membantu anak untuk merasa aman dan segera menenangkan sistem sarafnya kembali.',
                'Selama tantrum berlangsung, pastikan juga lingkungan sekitar anak dalam keadaan aman dari sudut meja yang tajam atau benda-benda pecah belah. Berikan validasi empati secara lembut, misalnya dengan menyatakan bahwa Anda memahami rasa kesal mereka, lalu tawarkan pelukan hangat setelah emosi histeris mereka berangsur-angsur mereda.',
                'Sebaliknya, sangat penting untuk menghindari tindakan membentak, memukul fisik, atau justru membiarkan anak berlama-lama sendirian tanpa perhatian. Jangan pula tergesa-gesa menuruti segala keinginan awalnya hanya karena merasa malu dilihat orang sekitar, sebab hal ini akan mendidik anak bahwa tantrum adalah senjata ampuh untuk mengontrol kemauan orang tua.'
            ]
        }
    };

    const activeId = Number(idParam) && edukasiDb[Number(idParam)] ? Number(idParam) : 1;
    const artikel = edukasiDb[activeId];

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
                                {artikel.tema}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                                ⏱️ {artikel.estimasiBaca}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-xl font-extrabold text-slate-800 mb-5 leading-snug pb-4 border-b border-slate-100">
                            {artikel.judul}
                        </h1>

                        {/* Content Body (Paragraphs only) */}
                        <div className="flex flex-col gap-4 text-sm text-slate-650 leading-relaxed font-medium">
                            {artikel.kontenParagraf.map((paragraf, index) => (
                                <p key={index} className="text-justify">
                                    {paragraf}
                                </p>
                            ))}
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
