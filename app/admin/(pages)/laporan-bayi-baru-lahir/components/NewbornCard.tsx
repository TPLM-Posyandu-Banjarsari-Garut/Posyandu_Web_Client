"use client";

import React from "react";
import { NewbornReportItem } from "@/interfaces/child";

interface NewbornCardProps {
  item: NewbornReportItem;
  onSelect: (item: NewbornReportItem) => void;
}

function formatDateIndo(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function NewbornCard({ item, onSelect }: NewbornCardProps) {
  const isMale = item.gender === "male";

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0 ${
              isMale
                ? "bg-sky-50 text-sky-600 border border-sky-100"
                : "bg-pink-50 text-pink-600 border border-pink-100"
            }`}
          >
            {isMale ? "👦" : "👧"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                {item.name}
              </h4>
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                  isMale
                    ? "bg-sky-50 text-sky-600 border border-sky-100"
                    : "bg-pink-50 text-pink-600 border border-pink-100"
                }`}
              >
                {isMale ? "Laki-laki" : "Perempuan"}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              NIK: {item.identity_number || "-"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 p-1"
          title="Lihat Detail Kependudukan"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Info Pills */}
      <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 text-slate-600">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Tgl Lahir:</span>
          <span className="font-semibold text-slate-700">
            {formatDateIndo(item.birth_date)}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Nama Ibu:</span>
          <span className="font-semibold text-slate-700 truncate block">
            {item.mother_name || "-"}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block font-medium">Posyandu:</span>
          <span className="font-semibold text-slate-700 truncate block">
            {item.posyandu_name || "-"}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block font-medium">BB / TB Lahir:</span>
          <span className="font-semibold text-slate-700">
            {item.birth_weight ? `${item.birth_weight} kg` : "-"} /{" "}
            {item.birth_length ? `${item.birth_length} cm` : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
