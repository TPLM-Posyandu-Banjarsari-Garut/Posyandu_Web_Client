"use client";

import Link from "next/link";
import BottombarKader from "@/components/ui/bottombar/kader/BottombarKader";
import FiturAplikasi from "@/components/ui/bottombar/kader/Fitur-aplikasi";
import { useCurrentUser } from "@/hooks/query/auth/useCurrentUser";
import { useGetSchedules } from "@/hooks/query/schedule/useManageSchedules";
import { useGetEducations } from "@/hooks/query/education/useManageEducations";
import { useMemo } from "react";

export default function Home() {
  const { data: user } = useCurrentUser();
  // Fetch Schedules & Educations
  const { data: schedulesData } = useGetSchedules({ limit: 20 });
  const { data: educationsData } = useGetEducations({ limit: 1 });

  const nearestSchedule = useMemo(() => {
    const rawData = schedulesData?.data;
    const schedules = Array.isArray(rawData) ? rawData : (rawData as any)?.data || [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcoming = schedules
      .filter((s: any) => new Date(s.scheduled_date) >= now && (s.status === 'pending' || s.status === 'in_progress'))
      .sort((a: any, b: any) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [schedulesData]);

  const rawEduData = educationsData?.data;
  const educations = Array.isArray(rawEduData) ? rawEduData : (rawEduData as any)?.data || [];
  const latestEducation = educations?.[0] || null;

  const scheduleDateStr = nearestSchedule
    ? new Date(nearestSchedule.scheduled_date).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Belum Ada Jadwal";

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-white min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-28 custom-scrollbar">

          {/* Header Background */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-50 via-blue-50/80 to-white z-0"></div>

          <div className="relative z-10 px-6 pt-10 pb-6">
            {/* User Profile */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-white shadow-sm p-1 border border-blue-100">
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  <svg className="w-8 h-8 text-blue-500 mt-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">{user?.name || "Kader Posyandu"}</h1>
                <p className="text-sm text-slate-500 font-medium">Selamat datang kembali 👋</p>
              </div>
            </div>

            {/* Schedule Card (Jadwal) */}
            <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-8 border border-slate-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-slate-800 tracking-wide">Jadwal Posyandu Terdekat</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${nearestSchedule ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                  {nearestSchedule ? 'Terjadwal' : 'Kosong'}
                </span>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    {nearestSchedule ? 'Tanggal Pelaksanaan' : 'Belum Ada Jadwal'}
                  </p>
                  <p className="text-sm font-bold text-slate-800 truncate">{scheduleDateStr}</p>
                </div>
              </div>
            </div>

            {/* Fitur Aplikasi */}
            <FiturAplikasi />

            {/* Edukasi (Event replacement) */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-slate-800">Edukasi Terkini</h2>
                <Link href="/kader/edukasi" className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">Lihat Semua</Link>
              </div>

              {latestEducation ? (
                <Link href={`/kader/edukasi/${latestEducation.id}`} className="block bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] p-6 text-white shadow-[0_10px_20px_rgba(79,70,229,0.25)] relative overflow-hidden group cursor-pointer">
                  <div className="absolute top-0 right-0 opacity-10 transition-transform duration-500 group-hover:scale-110">
                    <svg className="w-32 h-32 transform translate-x-8 -translate-y-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  </div>
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider uppercase mb-3 border border-white/20">
                      {latestEducation.category_name || 'Edukasi'}
                    </span>
                    <h3 className="text-lg font-bold mb-2 leading-snug">{latestEducation.title}</h3>
                    <p className="text-blue-100 text-xs mb-5 line-clamp-2 leading-relaxed">{latestEducation.summary || 'Baca selengkapnya artikel edukasi ini.'}</p>
                    <div className="inline-block bg-white text-indigo-600 text-xs font-bold py-2.5 px-5 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95">
                      Baca Selengkapnya
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-medium">
                  Belum ada edukasi terbaru.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottombarKader />

      </div>
    </div>
  );
}
