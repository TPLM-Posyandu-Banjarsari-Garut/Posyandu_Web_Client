'use client';

import { useState } from 'react';
import { useGetOrangTuaAvailableSlots } from '@/hooks/query/orangtua/useOrangTuaChildren';

interface PilihWaktuProps {
  posyandu_id: string;
  consultation_type: string;
  midwife_id: string | null;
  onSelect: (dateStr: string, timeStr: string) => void;
  onNext: () => void;
}

export default function PilihWaktu({
  posyandu_id,
  consultation_type,
  midwife_id,
  onSelect,
  onNext,
}: PilihWaktuProps) {
  // Generate date options for Today, Tomorrow, and Lusa (Day after Tomorrow)
  const today = new Date();
  
  const formatDateStr = (date: Date) => {
    // Return YYYY-MM-DD
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDisplayLabel = (date: Date, index: number) => {
    if (index === 0) return 'Hari ini';
    if (index === 1) return 'Besok';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const dates = Array.from({ length: 3 }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() + idx);
    return {
      label: formatDisplayLabel(d, idx),
      dateStr: formatDateStr(d),
    };
  });

  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTime, setSelectedTimeState] = useState<string | null>(null);

  const selectedDateStr = dates[selectedDateIdx].dateStr;

  // Fetch available slots from backend
  const { data: slots = [], isLoading, error } = useGetOrangTuaAvailableSlots(
    posyandu_id,
    consultation_type,
    selectedDateStr,
    midwife_id,
    !!posyandu_id && !!consultation_type
  );

  const handleDateSelect = (idx: number) => {
    setSelectedDateIdx(idx);
    setSelectedTimeState(null); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeState(time);
    onSelect(selectedDateStr, time);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Date Selector Section */}
      <div>
        <h2 className="text-sm font-extrabold text-[#1E3050] tracking-wide mb-3">Pilih Tanggal & Jam</h2>
        
        {/* Horizontal Scrollable Dates */}
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide -mx-1 px-1">
          {dates.map((item, idx) => {
            const isSelected = selectedDateIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDateSelect(idx)}
                className={`flex items-center gap-1.5 px-5 py-3 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-[#1E3050] border-[#EBE8D8] hover:border-slate-300'
                }`}
              >
                <svg className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#1E3050]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#EBE8D8] my-1"></div>

      {/* Time Slots Section */}
      <div>
        <h3 className="text-xs font-bold text-[#8C9BB3] tracking-wide mb-3 uppercase">Slot tersedia</h3>
        
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-2xl border border-slate-200"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6 text-xs.5 font-bold text-red-500">
            Gagal memuat slot waktu.
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-6 text-xs.5 font-semibold text-slate-500">
            Tidak ada slot yang tersedia untuk tanggal ini.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {slots.map((slot, idx) => {
              const isSelected = selectedTime === slot.time;
              
              if (!slot.available) {
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-center gap-1.5 py-3.5 px-3 bg-[#F4F1E6] border border-[#EBE8D8] rounded-2xl text-slate-400 select-none opacity-60"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-bold line-through">{slot.time}</span>
                  </div>
                );
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTimeSelect(slot.time)}
                  className={`flex items-center justify-center gap-1.5 py-3.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-[#1E3050] border-[#EBE8D8] hover:border-blue-400'
                  }`}
                >
                  <svg className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#1E3050]'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{slot.time}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation Button */}
      <div className="mt-8">
        <button
          type="button"
          disabled={!selectedTime || isLoading}
          onClick={onNext}
          className={`w-full py-4 rounded-3xl font-bold text-sm transition-all text-white ${
            selectedTime && !isLoading
              ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-[0_8px_20px_rgba(37,99,235,0.25)]'
              : 'bg-[#B4BCCB] cursor-not-allowed'
          }`}
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}
