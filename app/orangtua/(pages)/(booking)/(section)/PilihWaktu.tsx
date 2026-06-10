'use client';

import { useState } from 'react';

interface PilihWaktuProps {
  onSelect: (date: string, time: string) => void;
  onNext: () => void;
}

export default function PilihWaktu({ onSelect, onNext }: PilihWaktuProps) {
  // Generate date options starting from today
  const today = new Date();
  const formatDayMonth = (date: Date) => {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const dates = [
    { label: 'Hari ini', dateStr: today.toISOString().split('T')[0] },
    { 
      label: 'Besok', 
      dateStr: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hasIcon: true 
    },
    { 
      label: formatDayMonth(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)), 
      dateStr: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hasIcon: true 
    },
    { 
      label: formatDayMonth(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)), 
      dateStr: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hasIcon: true 
    },
  ];

  const timeSlots = [
    { time: '08.00', available: true },
    { time: '08.30', available: true },
    { time: '09.00', available: true },
    { time: '09.30', available: false },
    { time: '10.00', available: true },
    { time: '10.30', available: true },
    { time: '11.00', available: false },
    { time: '13.00', available: true },
    { time: '13.30', available: true },
  ];

  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedTime, setSelectedTimeState] = useState<string | null>(null);

  const handleDateSelect = (idx: number) => {
    setSelectedDateIdx(idx);
    setSelectedTimeState(null); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeState(time);
    onSelect(dates[selectedDateIdx].label, time);
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
                {item.hasIcon && (
                  <svg className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#1E3050]'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
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
        
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map((slot, idx) => {
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
      </div>

      {/* Navigation Button */}
      <div className="mt-8">
        <button
          type="button"
          disabled={!selectedTime}
          onClick={onNext}
          className={`w-full py-4 rounded-3xl font-bold text-sm transition-all text-white ${
            selectedTime
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
