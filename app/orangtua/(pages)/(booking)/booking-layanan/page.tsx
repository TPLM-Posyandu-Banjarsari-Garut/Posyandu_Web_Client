'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBarBooking from '@/components/ui/appbar/AppBarBooking';
import BottombarOrtu from '@/components/ui/bottombar/orangtua/BottombarOrtu';
import PilihPukesmas from '../(section)/PilihPukesmas';
import PilihLayanan from '../(section)/PilihLayanan';
import PilihWaktu from '../(section)/PilihWaktu';
import KonfirmasiBooking from '../(section)/KonfirmasiBooking';

export default function BookingLayananPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Selections state
  const [bookingData, setBookingData] = useState({
    puskesmas: '',
    layanan: '',
    date: '',
    time: ''
  });

  const handleSelectPuskesmas = (puskesmas: string) => {
    setBookingData(prev => ({ ...prev, puskesmas }));
    setStep(2);
  };

  const handleSelectLayanan = (layanan: string) => {
    setBookingData(prev => ({ ...prev, layanan }));
    setStep(3);
  };

  const handleSelectWaktu = (date: string, time: string) => {
    setBookingData(prev => ({ ...prev, date, time }));
  };

  const handleNextWaktu = () => {
    setStep(4);
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
    const params = new URLSearchParams({
      puskesmas: bookingData.puskesmas,
      layanan: bookingData.layanan,
      date: bookingData.date,
      time: bookingData.time
    });
    router.push(`/orangtua/lihat-antrean?${params.toString()}`);
  };

  // Determine AppBar title
  const getAppBarTitle = () => {
    if (step === 4) return 'Booking Berhasil';
    return 'Booking Layanan';
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

          {/* Conditional Steps Rendering */}
          <div className="px-6 py-4">
            {step === 1 && (
              <PilihPukesmas onSelect={handleSelectPuskesmas} />
            )}
            
            {step === 2 && (
              <PilihLayanan onSelect={handleSelectLayanan} />
            )}
            
            {step === 3 && (
              <PilihWaktu 
                onSelect={handleSelectWaktu} 
                onNext={handleNextWaktu} 
              />
            )}
            
            {step === 4 && (
              <KonfirmasiBooking 
                bookingDetails={bookingData} 
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
