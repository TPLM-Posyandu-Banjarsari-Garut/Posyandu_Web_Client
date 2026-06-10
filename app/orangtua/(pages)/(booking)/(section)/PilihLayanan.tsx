'use client';

interface PilihLayananProps {
  onSelect: (layanan: string) => void;
}

const layananList = [
  'Layanan Umum',
  'ANC / Ibu Hamil',
  'Imunisasi',
  'Keluarga Berencana',
  'Pemeriksaan Gigi',
  'Laboratorium',
  'Kontrol Hipertensi',
  'Kontrol Diabetes',
  'USG'
];

export default function PilihLayanan({ onSelect }: PilihLayananProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-extrabold text-[#1E3050] tracking-wide mb-1">Pilih Layanan</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {layananList.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item)}
            className="w-full min-h-[64px] text-left bg-white rounded-2xl py-3.5 px-4.5 border border-[#EBE8D8] hover:border-blue-400 hover:shadow-sm active:scale-[0.98] transition-all flex items-center shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          >
            <span className="text-xs.5 font-bold text-[#1E3050] leading-tight tracking-wide">
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
