'use client';

interface AppBarBookingProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export default function AppBarBooking({ title = "Booking Layanan", onBack, showBack = true }: AppBarBookingProps) {
  return (
    <div className="w-full bg-[#FFFDF6] border-b border-[#EBE8D8] h-16 flex items-center px-6 gap-4 sticky top-0 z-50 shrink-0">
      {showBack && (
        <button 
          onClick={onBack}
          className="p-1 -ml-1 rounded-full text-[#1E3050] hover:bg-slate-200/50 transition-colors focus:outline-none"
          aria-label="Kembali"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      )}
      <h1 className={`text-lg font-bold text-[#1E3050] tracking-wide ${!showBack ? 'w-full text-center pr-0' : ''}`}>{title}</h1>
    </div>
  );
}
