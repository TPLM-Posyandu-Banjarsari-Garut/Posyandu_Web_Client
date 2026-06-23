'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBarBooking from '@/components/ui/appbar/AppBarBooking';
import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import PilihPukesmas from '../(section)/PilihPukesmas';
import PilihLayanan from '../(section)/PilihLayanan';
import PilihWaktu from '../(section)/PilihWaktu';
import KonfirmasiBooking from '../(section)/KonfirmasiBooking';
import { useCreateOrangTuaBooking } from '@/hooks/query/orangtua/useOrangTuaChildren';

export default function BookingLayananPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Selections state
  const [bookingData, setBookingData] = useState({
    posyandu_id: '',
    posyandu_name: '',
    consultation_type: '' as 'pregnancy' | 'child_development' | 'general' | '',
    children_id: null as string | null,
    pregnancy_record_id: null as string | null,
    date: '', // format YYYY-MM-DD
    time: '', // format HH:MM
    queue_number: undefined as number | undefined
  });

  const { mutateAsync: createBooking, isPending } = useCreateOrangTuaBooking();

  const handleSelectPuskesmas = (id: string, name: string) => {
    setBookingData(prev => ({
      ...prev,
      posyandu_id: id,
      posyandu_name: name
    }));
    setStep(2);
  };

  const handleSelectLayanan = (
    type: 'pregnancy' | 'child_development' | 'general',
    children_id: string | null,
    pregnancy_record_id: string | null
  ) => {
    setBookingData(prev => ({
      ...prev,
      consultation_type: type,
      children_id,
      pregnancy_record_id
    }));
    setStep(3);
  };

  const handleSelectWaktu = (dateStr: string, timeStr: string) => {
    setBookingData(prev => ({ ...prev, date: dateStr, time: timeStr }));
  };

  const handleNextWaktu = async () => {
    setErrorMessage(null);
    try {
      const [year, month, day] = bookingData.date.split('-').map(Number);
      const [hours, minutes] = bookingData.time.split(':').map(Number);
      
      // Construct UTC date-time string to match backend timezone logic
      const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
      
      const payload = {
        posyandu_id: bookingData.posyandu_id,
        consultation_type: bookingData.consultation_type as 'pregnancy' | 'child_development' | 'general',
        scheduled_at: utcDate.toISOString(),
        pregnancy_record_id: bookingData.pregnancy_record_id,
        children_id: bookingData.children_id,
        notes: "Dibuat oleh orang tua melalui portal",
      };

      const result = await createBooking(payload);
      
      // Update queue number and move to step 4
      setBookingData(prev => ({
        ...prev,
        queue_number: result.queue_number
      }));
      setStep(4);
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Gagal membuat booking. Silakan coba lagi.";
      setErrorMessage(msg);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else {
      router.back();
    }
  };

  const handleGoHome = () => {
    router.push('/orangtua/home');
  };

  const handleGoToQueue = () => {
    router.push('/orangtua/lihat-antrean');
  };

  // Determine AppBar title
  const getAppBarTitle = () => {
    if (step === 4) return 'Booking Berhasil';
    return 'Booking Layanan';
  };

  const getLayananLabel = (type: string) => {
    if (type === 'pregnancy') return 'ANC / Ibu Hamil';
    if (type === 'child_development') return 'Imunisasi / Tumbuh Kembang';
    return 'Layanan Umum';
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-2 sm:px-0 text-slate-800 flex justify-center">
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-[#FFFDF6] min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">
        
        {/* Sticky AppBar */}
        <AppBarBooking 
          title={getAppBarTitle()} 
          onBack={handleBack} 
          showBack={step !== 4} 
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-28 custom-scrollbar">
          
          {/* Progress Indicator (hidden in Step 4) */}
          {step < 4 && (
            <div className="flex gap-2.5 px-6 pt-5 pb-2 shrink-0">
              {[1, 2, 3, 4].map((s) => {
                const isActive = s <= step;
                return (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      isActive ? 'bg-blue-600' : 'bg-[#E2E8F0]'
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* Error Message Box */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-250 text-red-650 rounded-2xl text-xs font-semibold leading-relaxed">
              {errorMessage}
            </div>
          )}

          {/* Conditional Steps Rendering */}
          <div className="px-6 py-4">
            {step === 1 && (
              <PilihPukesmas onSelect={handleSelectPuskesmas} />
            )}
            
            {step === 2 && (
              <PilihLayanan onSelect={handleSelectLayanan} />
            )}
            
            {step === 3 && (
              <div className={isPending ? 'pointer-events-none opacity-60' : ''}>
                <PilihWaktu 
                  posyandu_id={bookingData.posyandu_id}
                  consultation_type={bookingData.consultation_type}
                  onSelect={handleSelectWaktu} 
                  onNext={handleNextWaktu} 
                />
                {isPending && (
                  <div className="flex justify-center items-center mt-4 gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-bold text-blue-600">Memproses pendaftaran...</span>
                  </div>
                )}
              </div>
            )}
            
            {step === 4 && (
              <KonfirmasiBooking 
                bookingDetails={{
                  puskesmas: bookingData.posyandu_name,
                  layanan: getLayananLabel(bookingData.consultation_type),
                  date: bookingData.date,
                  time: bookingData.time,
                  queue_number: bookingData.queue_number
                }} 
                onHome={handleGoHome} 
                onViewQueue={handleGoToQueue} 
              />
            )}
          </div>
        </div>

        {/* Bottombar */}
        <BottombarOrtu />
      </div>
    </div>
  );
}
