"use client";

import React from "react";
import { NewbornReportSummary } from "@/interfaces/child";

interface LaporanBayiSummaryCardsProps {
  summary?: NewbornReportSummary;
  monthName: string;
  year: number;
}

export default function LaporanBayiSummaryCards({
  summary,
  monthName,
  year,
}: LaporanBayiSummaryCardsProps) {
  const total = summary?.total_newborns ?? 0;
  const male = summary?.male_count ?? 0;
  const female = summary?.female_count ?? 0;
  const posyandus = summary?.total_posyandus ?? 0;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.5rem] p-5 text-white shadow-md mb-5 relative overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-10 translate-x-3 translate-y-3 pointer-events-none">
        <svg className="w-28 h-28" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a5 5 0 105 5 5 5 0 00-5-5zm0 12c-5.33 0-8 2.67-8 8v1h16v-1c0-5.33-2.67-8-8-8z" />
        </svg>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-extrabold tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
            Periode Laporan
          </span>
          <h2 className="text-base font-extrabold">
            {monthName} {year}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black">{total}</span>
          <p className="text-[10px] text-blue-100 font-semibold">Total Kelahiran</p>
        </div>
      </div>

      {/* Grid Summary Stats */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15">
        <div className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-xs">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-sky-200 mb-0.5">
            <span>👦</span> Laki-laki
          </div>
          <span className="text-sm font-extrabold">{male}</span>
        </div>

        <div className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-xs">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-pink-200 mb-0.5">
            <span>👧</span> Perempuan
          </div>
          <span className="text-sm font-extrabold">{female}</span>
        </div>

        <div className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-xs">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-200 mb-0.5">
            <span>🏥</span> Posyandu
          </div>
          <span className="text-sm font-extrabold">{posyandus}</span>
        </div>
      </div>
    </div>
  );
}
