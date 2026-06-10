'use client';

interface PilihPuskesmasProps {
  onSelect: (puskesmas: string) => void;
}

const puskesmasList = [
  { name: 'Puskesmas Bogor Tengah', location: 'Bogor Tengah', distance: '0.4 km' },
  { name: 'Puskesmas Merdeka', location: 'Bogor Utara', distance: '1.1 km' },
  { name: 'Puskesmas Belong', location: 'Bogor Selatan', distance: '1.8 km' },
  { name: 'Puskesmas Sempur', location: 'Bogor Timur', distance: '2.5 km' },
  { name: 'Puskesmas Gang Aut', location: 'Bogor Barat', distance: '3.2 km' },
  { name: 'Puskesmas Tanah Sareal', location: 'Tanah Sareal', distance: '4.0 km' },
];

export default function PilihPukesmas({ onSelect }: PilihPuskesmasProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-extrabold text-[#1E3050] tracking-wide mb-1">Pilih Puskesmas</h2>
      
      <div className="flex flex-col gap-3">
        {puskesmasList.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item.name)}
            className="w-full text-left bg-white rounded-2xl py-4.5 px-5 border border-[#EBE8D8] hover:border-blue-400 hover:shadow-sm active:scale-[0.99] transition-all flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          >
            <div>
              <h3 className="text-sm font-bold text-[#1E3050] tracking-wide leading-tight">{item.name}</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {item.location} · {item.distance}
              </p>
            </div>
            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
