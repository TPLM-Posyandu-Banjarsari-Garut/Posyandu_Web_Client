import React from "react";
import { Posyandu } from "@/interfaces/posyandu";

interface PosyanduCardProps {
  item: Posyandu;
  onEdit: (item: Posyandu) => void;
  onDelete: (id: string, name: string) => void;
  isDeletePending: boolean;
}

// Helper to parse address_line into jalan and patokan
const parseAddress = (addressLine: string | null | undefined) => {
  if (!addressLine) return { jalan: "", patokan: "" };
  const parts = addressLine.split(" | Patokan: ");
  if (parts.length > 1) {
    return { jalan: parts[0], patokan: parts[1] };
  }
  return { jalan: addressLine, patokan: "" };
};

export default function PosyanduCard({
  item,
  onEdit,
  onDelete,
  isDeletePending,
}: PosyanduCardProps) {
  const { jalan, patokan } = parseAddress(item.address_line);

  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">
      {/* Posyandu Name & RT/RW */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-850 leading-tight">
              {item.name}
            </h3>
            <span className="inline-block mt-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-100/50">
              RT. {item.rt || "-"} / RW. {item.rw || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="flex flex-col gap-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
        <div className="flex gap-2 items-start text-xs text-slate-605 leading-relaxed font-medium">
          <svg
            className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <span>{jalan || "Alamat belum diatur"}</span>
        </div>
        {patokan && (
          <div className="flex gap-2 items-start text-xs text-slate-500 font-medium">
            <svg
              className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="italic">Patokan: {patokan}</span>
          </div>
        )}
      </div>

      {/* Tempat / Venue */}
      <div className="flex justify-between items-center text-xs font-semibold border-b border-slate-50 pb-2">
        <span className="text-slate-400">Tempat Pelaksanaan</span>
        <span className="text-slate-800 font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-xl border border-amber-100">
          {item.village_name || "Belum diatur"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 border-t border-slate-50 pt-3">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3 py-2 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(item.id, item.name)}
          disabled={isDeletePending}
          className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold px-3.5 py-2 rounded-xl active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer disabled:opacity-50"
          title="Hapus"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
