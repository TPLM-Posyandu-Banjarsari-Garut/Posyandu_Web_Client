'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBarBooking from '@/components/ui/appbar/AppBarBooking';
import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import { useGetOrangTuaConsultations, useGetOrangTuaPosyandus } from '@/hooks/query/orangtua/useOrangTuaChildren';
import Link from 'next/link';

function LihatAntreanContent() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  // Fetch parent consultations list
  const { data: consultationsData, isLoading: isLoadingConsultations, error: errorConsultations } = useGetOrangTuaConsultations({
    page,
    limit: 50,
  });

  // Fetch Posyandu list for mapping posyandu_id to name
  const { data: posyandusData } = useGetOrangTuaPosyandus({
    limit: 100,
  });

  const posyandus = posyandusData?.data || [];
  const consultations = consultationsData?.data || [];

  // Filter for active/upcoming bookings
  const activeConsultations = consultations.filter(
    (item) => item.status === 'pending' || item.status === 'confirmed' || item.status === 'in_progress'
  );

  const mainActiveBooking = activeConsultations[0];
  const otherActiveBookings = activeConsultations.slice(1);

  const handleGoHome = () => {
    router.push('/orangtua/home');
  };

  const getLayananLabel = (type: string) => {
    if (type === 'pregnancy') return 'ANC / Ibu Hamil';
    if (type === 'child_development') return 'Imunisasi / Tumbuh Kembang';
    return 'Layanan Umum';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Sedang Diperiksa
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-block bg-blue-100 text-blue-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Terkonfirmasi
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Menunggu
          </span>
        );
    }
  };

  // Helper to format date & time strictly in UTC
  const formatUtcDateTime = (isoString: string) => {
    const d = new Date(isoString);
    const dateStr = d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
    
    const h = String(d.getUTCHours()).padStart(2, '0');
    const m = String(d.getUTCMinutes()).padStart(2, '0');
    const timeStr = `${h}.${m}`;

    return { dateStr, timeStr };
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-[#FFFDF6] min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Sticky AppBar */}
        <AppBarBooking
          title="Nomor Antrean"
          onBack={handleGoHome}
          showBack={true}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-28 custom-scrollbar px-6 pt-6">
          {isLoadingConsultations ? (
            <div className="flex flex-col items-center pt-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-xs font-bold text-slate-500">Memuat data antrean...</span>
            </div>
          ) : errorConsultations ? (
            <div className="text-center py-10 text-xs font-bold text-red-500">
              Gagal memuat data antrean. Silakan coba beberapa saat lagi.
            </div>
          ) : !mainActiveBooking ? (
            // Empty State
            <div className="flex flex-col items-center pt-8 pb-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-6">
                <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-base font-extrabold text-[#1E3050] text-center tracking-wide mb-2">
                Tidak Ada Antrean Aktif
              </h2>
              <p className="text-xs text-slate-550 font-semibold text-center leading-relaxed max-w-[270px] mb-8">
                Anda tidak memiliki jadwal janji temu check-up yang aktif saat ini.
              </p>
              <Link
                href="/orangtua/booking-layanan"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-8 rounded-full font-bold text-xs.5 shadow-[0_6px_18px_rgba(37,99,235,0.2)] active:scale-95 transition-all text-center"
              >
                Booking Layanan Sekarang
              </Link>
            </div>
          ) : (
            // Active Queue Ticket
            <div className="flex flex-col items-center pt-2 pb-6">
              {/* Checkmark Icon */}
              <div className="w-20 h-20 rounded-full bg-[#E2EEB7] flex items-center justify-center text-[#1E3050] mb-5 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="4.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-lg font-extrabold text-[#1E3050] text-center tracking-wide mb-1">
                Antrean Aktif Anda
              </h2>
              <p className="text-[11px] text-slate-500 font-semibold text-center leading-relaxed max-w-[280px] mb-5">
                Tunjukkan nomor antrean ini saat tiba di lokasi Posyandu.
              </p>

              {/* Main Ticket Card */}
              {(() => {
                const posyanduName = posyandus.find(p => p.id === mainActiveBooking.posyandu_id)?.name || 'Posyandu';
                const { dateStr, timeStr } = formatUtcDateTime(mainActiveBooking.scheduled_at);

                return (
                  <div className="w-full bg-white rounded-3xl p-6 border border-[#EBE8D8] shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-6 flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                      Nomor Antrean
                    </span>
                    <span className="text-4xl font-extrabold text-[#1E3050] tracking-wide mt-1.5 mb-2.5">
                      {mainActiveBooking.queue_number ? `Q-${String(mainActiveBooking.queue_number).padStart(3, '0')}` : '-'}
                    </span>
                    <div>
                      {getStatusBadge(mainActiveBooking.status)}
                    </div>

                    <div className="border-t border-[#EBE8D8] border-dashed my-4.5"></div>

                    {/* Details */}
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start text-xs font-semibold gap-4">
                        <span className="text-slate-450 shrink-0">Posyandu</span>
                        <span className="text-[#1E3050] font-bold text-right leading-tight">{posyanduName}</span>
                      </div>
                      <div className="flex justify-between items-start text-xs font-semibold gap-4">
                        <span className="text-slate-450 shrink-0">Layanan</span>
                        <span className="text-[#1E3050] font-bold text-right">{getLayananLabel(mainActiveBooking.consultation_type)}</span>
                      </div>
                      <div className="flex justify-between items-start text-xs font-semibold gap-4">
                        <span className="text-slate-450 shrink-0">Tanggal</span>
                        <span className="text-[#1E3050] font-bold text-right">{dateStr}</span>
                      </div>
                      <div className="flex justify-between items-start text-xs font-semibold gap-4">
                        <span className="text-slate-450 shrink-0">Jam</span>
                        <span className="text-[#1E3050] font-bold text-right">{timeStr} WIB</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Other Upcoming Active Bookings */}
              {otherActiveBookings.length > 0 && (
                <div className="w-full mb-6">
                  <h3 className="text-xs font-extrabold text-[#1E3050] tracking-wide mb-3 uppercase">Jadwal Janji Temu Lainnya</h3>
                  <div className="flex flex-col gap-2.5">
                    {otherActiveBookings.map((booking) => {
                      const posyanduName = posyandus.find(p => p.id === booking.posyandu_id)?.name || 'Posyandu';
                      const { dateStr, timeStr } = formatUtcDateTime(booking.scheduled_at);

                      return (
                        <div key={booking.id} className="bg-white rounded-2xl p-4.5 border border-[#EBE8D8] flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                          <div className="min-w-0 flex-1 pr-3">
                            <h4 className="text-xs.5 font-bold text-[#1E3050] truncate">{getLayananLabel(booking.consultation_type)}</h4>
                            <p className="text-[11px] text-slate-500 font-semibold mt-1">
                              {posyanduName}
                            </p>
                            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                              {dateStr} · {timeStr} WIB
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs.5 font-extrabold text-[#1E3050]">
                              Q-{String(booking.queue_number).padStart(3, '0')}
                            </div>
                            <div className="mt-1">
                              <span className="inline-block bg-slate-100 text-slate-650 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                {booking.status === 'confirmed' ? 'Terkonfirmasi' : 'Menunggu'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Home Link */}
              <button
                type="button"
                onClick={handleGoHome}
                className="w-full bg-white border border-[#EBE8D8] text-[#1E3050] py-4 rounded-3xl font-bold text-sm text-center hover:bg-slate-50 transition-colors active:scale-[0.98]"
              >
                Kembali ke Beranda
              </button>
            </div>
          )}
        </div>

        {/* Bottombar */}
        <BottombarOrtu />
      </div>
    </div>
  );
}

export default function LihatAntreanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LihatAntreanContent />
    </Suspense>
  );
}
