'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppBarBooking from '@/components/ui/appbar/AppBarBooking';
import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import PilihPukesmas from '../(section)/PilihPukesmas';
import PilihLayanan from '../(section)/PilihLayanan';
import PilihBidan from '../(section)/PilihBidan';
import PilihWaktu from '../(section)/PilihWaktu';
import KonfirmasiBooking from '../(section)/KonfirmasiBooking';
import { useCreateOrangTuaBooking, useGetOrangTuaPosyanduById, useGetOrangTuaConsultations } from '@/hooks/query/orangtua/useOrangTuaChildren';

interface BookingData {
  posyandu_id: string;
  posyandu_name: string;
  consultation_type: 'pregnancy' | 'child_development' | 'general' | '';
  children_id: string | null;
  pregnancy_record_id: string | null;
  midwife_id: string | null;
  midwife_name: string | null;
  date: string;
  time: string;
  queue_number?: number;
}

export default function BookingLayananPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch parent consultations to prevent duplicate active bookings
  const { data: consultationsResponse, isLoading: isLoadingConsultations } = useGetOrangTuaConsultations({
    limit: 10,
    page: 1
  });

  const activeBookings = consultationsResponse?.data?.filter((item: any) => 
    ['pending', 'confirmed', 'in_progress'].includes(item.status)
  ) || [];
  const hasActiveBooking = activeBookings.length > 0;
  
  // Selections state
  const [bookingData, setBookingData] = useState<BookingData>({
    posyandu_id: '',
    posyandu_name: '',
    consultation_type: '',
    children_id: null,
    pregnancy_record_id: null,
    midwife_id: null,
    midwife_name: null,
    date: '', // format YYYY-MM-DD
    time: '', // format HH:MM
    queue_number: undefined
  });

  // Query details if posyandu_id is set but name is empty
  const { data: prefilledPosyanduDetail } = useGetOrangTuaPosyanduById(
    bookingData.posyandu_id,
    !!bookingData.posyandu_id && !bookingData.posyandu_name
  );

  useEffect(() => {
    if (prefilledPosyanduDetail && !bookingData.posyandu_name) {
      setBookingData(prev => ({
        ...prev,
        posyandu_name: prefilledPosyanduDetail.name
      }));
    }
  }, [prefilledPosyanduDetail, bookingData.posyandu_name]);

  const { mutateAsync: createBooking, isPending } = useCreateOrangTuaBooking();

  const handleSelectPuskesmas = (id: string, name: string) => {
    setBookingData(prev => ({
      ...prev,
      posyandu_id: id,
      posyandu_name: name
    }));
    setStep(3); // Go to midwife selection step
  };

  const handleSelectLayanan = (
    type: 'pregnancy' | 'child_development' | 'general',
    children_id: string | null,
    pregnancy_record_id: string | null,
    posyandu_id?: string | null,
    posyandu_name?: string | null
  ) => {
    setBookingData(prev => ({
      ...prev,
      consultation_type: type,
      children_id,
      pregnancy_record_id,
      posyandu_id: posyandu_id || '',
      posyandu_name: posyandu_name || '',
      midwife_id: null,
      midwife_name: null
    }));
    setStep(2); // Go to posyandu step
  };

  const handleSelectBidan = (id: string, name: string) => {
    setBookingData(prev => ({
      ...prev,
      midwife_id: id,
      midwife_name: name
    }));
    setStep(4); // Go to time selection step
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
        midwife_id: bookingData.midwife_id,
        notes: "Dibuat oleh orang tua melalui portal",
      };

      const result = await createBooking(payload);
      
      // Update queue number and move to step 5
      setBookingData(prev => ({
        ...prev,
        queue_number: result.queue_number
      }));
      setStep(5);
    } catch (err: unknown) {
      console.error(err);
      let msg = "Gagal membuat booking. Silakan coba lagi.";
      if (err && typeof err === 'object' && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        msg = errorObj.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setErrorMessage(msg);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      // Go back to Step 2
      setStep(2);
    } else if (step === 4) {
      // Go back to Step 3
      setStep(3);
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
    if (step === 5) return 'Booking Berhasil';
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
          showBack={step !== 5} 
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-28 custom-scrollbar">
          
          {isLoadingConsultations ? (
            <div className="flex flex-col items-center justify-center py-32 h-full">
               <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <span className="text-sm font-bold text-slate-500">Memeriksa status booking...</span>
            </div>
          ) : hasActiveBooking && step !== 5 ? (
            <div className="px-6 py-10 flex flex-col items-center justify-center text-center mt-10">
               <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-5 shadow-inner">
                   <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               </div>
               <h2 className="text-xl font-extrabold text-slate-800 mb-2">Booking Sedang Berjalan</h2>
               <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed px-4">
                   Anda masih memiliki jadwal konsultasi yang belum diselesaikan oleh Bidan. Harap tunggu hingga selesai sebelum membuat booking baru.
               </p>
               <button
                   onClick={handleGoToQueue}
                   className="w-full max-w-[200px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-full active:scale-95 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] text-sm tracking-wide"
               >
                   Lihat Antrean Saya
               </button>
            </div>
          ) : (
            <>
              {/* Progress Indicator (hidden in Step 5) */}
              {step < 5 && (
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
              <PilihLayanan onSelect={handleSelectLayanan} />
            )}
            
            {step === 2 && (
              bookingData.posyandu_id ? (
                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-sm font-extrabold text-[#1E3050] tracking-wide mb-1">Posyandu Terpilih</h2>
                    <p className="text-xs font-semibold text-slate-500 font-sans">Posyandu telah ditentukan secara otomatis untuk anak/kehamilan Anda.</p>
                  </div>
                  <div className="bg-white rounded-2xl py-4.5 px-5 border border-blue-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-extrabold shrink-0">
                        P
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-[#1E3050] truncate">{bookingData.posyandu_name || 'Memuat nama posyandu...'}</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-1">Sesuai dengan Posyandu terdaftar Anda</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-full active:scale-98 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.2)] text-xs.5 uppercase tracking-wider text-center cursor-pointer"
                  >
                    Lanjut
                  </button>
                </div>
              ) : (
                <PilihPukesmas onSelect={handleSelectPuskesmas} />
              )
            )}

            {step === 3 && (
              <PilihBidan 
                posyandu_id={bookingData.posyandu_id} 
                onSelect={handleSelectBidan} 
                onBack={() => setStep(2)} 
              />
            )}
            
            {step === 4 && (
              <div className={isPending ? 'pointer-events-none opacity-60' : ''}>
                <PilihWaktu 
                  posyandu_id={bookingData.posyandu_id}
                  consultation_type={bookingData.consultation_type}
                  midwife_id={bookingData.midwife_id}
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
            
            {step === 5 && (
              <KonfirmasiBooking 
                bookingDetails={{
                  puskesmas: bookingData.posyandu_name,
                  layanan: getLayananLabel(bookingData.consultation_type),
                  bidan: bookingData.midwife_name,
                  date: bookingData.date,
                  time: bookingData.time,
                  queue_number: bookingData.queue_number
                }} 
                onHome={handleGoHome} 
                onViewQueue={handleGoToQueue} 
              />
            )}
          </div>
          </>
          )}
        </div>

        {/* Bottombar */}
        <BottombarOrtu />
      </div>
    </div>
  );
}
