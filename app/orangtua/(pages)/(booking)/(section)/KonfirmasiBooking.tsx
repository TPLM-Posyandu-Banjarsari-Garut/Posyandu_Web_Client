'use client';

interface BookingDetails {
  puskesmas: string;
  layanan: string;
  date: string;
  time: string;
  queue_number?: number;
  bidan?: string | null;
}

interface KonfirmasiBookingProps {
  bookingDetails: BookingDetails;
  onHome: () => void;
  onViewQueue: () => void;
}

export default function KonfirmasiBooking({ bookingDetails, onHome, onViewQueue }: KonfirmasiBookingProps) {
  const displayQueue = bookingDetails.queue_number
    ? `Q-${String(bookingDetails.queue_number).padStart(3, '0')}`
    : '-';

  return (
    <div className="flex flex-col items-center pt-4 pb-6">
      {/* Checkmark Icon */}
      <div className="w-24 h-24 rounded-full bg-[#E2EEB7] flex items-center justify-center text-[#1E3050] mb-6 shadow-sm">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="4.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Success Messages */}
      <h2 className="text-xl font-extrabold text-[#1E3050] text-center tracking-wide mb-2">
        Booking Anda berhasil!
      </h2>
      <p className="text-xs text-slate-500 font-semibold text-center leading-relaxed max-w-[280px] mb-6">
        Tunjukkan nomor antrean ini saat tiba di Posyandu.
      </p>

      {/* Queue Ticket Card */}
      <div className="w-full bg-white rounded-3xl p-6 border border-[#EBE8D8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-8 flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
          Nomor Antrean
        </span>
        <span className="text-4xl font-extrabold text-[#1E3050] tracking-wide mt-2 mb-3">
          {displayQueue}
        </span>
        <div>
          <span className="inline-block bg-[#314A85] text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Antrean Aktif
          </span>
        </div>

        <div className="border-t border-[#EBE8D8] border-dashed my-5"></div>

        {/* Detail List */}
        <div className="flex flex-col gap-3.5">
          <div className="flex justify-between items-start text-xs font-semibold gap-4">
            <span className="text-slate-450 shrink-0">Posyandu</span>
            <span className="text-[#1E3050] font-bold text-right">{bookingDetails.puskesmas}</span>
          </div>
          <div className="flex justify-between items-start text-xs font-semibold gap-4">
            <span className="text-slate-450 shrink-0">Layanan</span>
            <span className="text-[#1E3050] font-bold text-right">{bookingDetails.layanan}</span>
          </div>
          {bookingDetails.bidan && (
            <div className="flex justify-between items-start text-xs font-semibold gap-4">
              <span className="text-slate-450 shrink-0">Bidan</span>
              <span className="text-[#1E3050] font-bold text-right">{bookingDetails.bidan}</span>
            </div>
          )}
          <div className="flex justify-between items-start text-xs font-semibold gap-4">
            <span className="text-slate-450 shrink-0">Tanggal</span>
            <span className="text-[#1E3050] font-bold text-right">{bookingDetails.date}</span>
          </div>
          <div className="flex justify-between items-start text-xs font-semibold gap-4">
            <span className="text-slate-450 shrink-0">Jam</span>
            <span className="text-[#1E3050] font-bold text-right">{bookingDetails.time}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={onHome}
          className="w-full bg-white border border-[#EBE8D8] text-[#1E3050] py-4 rounded-3xl font-bold text-sm text-center hover:bg-slate-50 transition-colors active:scale-[0.98]"
        >
          Beranda
        </button>
        <button
          type="button"
          onClick={onViewQueue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-3xl font-bold text-sm text-center shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition-all active:scale-[0.98]"
        >
          Lihat Antrean
        </button>
      </div>
    </div>
  );
}
