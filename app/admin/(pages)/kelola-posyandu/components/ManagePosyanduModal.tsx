import React from "react";

interface ManagePosyanduModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isMutating: boolean;
  editing: boolean;
  name: string;
  setName: (v: string) => void;
  jalan: string;
  setJalan: (v: string) => void;
  rt: string;
  setRt: (v: string) => void;
  rw: string;
  setRw: (v: string) => void;
  patokan: string;
  setPatokan: (v: string) => void;
  villageName: string;
  setVillageName: (v: string) => void;
  formError: string;
}

export default function ManagePosyanduModal({
  isOpen,
  onClose,
  onSubmit,
  isMutating,
  editing,
  name,
  setName,
  jalan,
  setJalan,
  rt,
  setRt,
  rw,
  setRw,
  patokan,
  setPatokan,
  villageName,
  setVillageName,
  formError,
}: ManagePosyanduModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-sm z-[1010] flex flex-col justify-end animate-fade-in">
      <div className="bg-white w-full rounded-t-[2.5rem] p-6 shadow-2xl border-t border-slate-100 flex flex-col max-h-[85%] animate-slide-up overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {editing ? "Edit Posyandu" : "Tambah Posyandu Baru"}
            </h2>
            <p className="text-[10px] text-slate-400">
              Isi data informasi posyandu di bawah ini
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 flex flex-col gap-4 custom-scrollbar">
          {formError && (
            <div className="bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl p-3.5 text-[11px] font-bold leading-normal">
              {formError}
            </div>
          )}

          <form
            onSubmit={onSubmit}
            id="posyandu-form"
            className="flex flex-col gap-4"
          >
            {/* Nama Posyandu */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nama Posyandu
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Posyandu Mawar I"
                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                required
              />
            </div>

            {/* Alamat Jalan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Alamat Jalan
              </label>
              <input
                type="text"
                value={jalan}
                onChange={(e) => setJalan(e.target.value)}
                placeholder="Nama jalan, nomor rumah, gang..."
                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                required
              />
            </div>

            {/* RT & RW Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  RT
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={rt}
                  onChange={(e) => setRt(e.target.value.replace(/\D/g, ""))} // Numeric only
                  placeholder="Contoh: 02"
                  className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  RW
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={rw}
                  onChange={(e) => setRw(e.target.value.replace(/\D/g, ""))} // Numeric only
                  placeholder="Contoh: 04"
                  className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                  required
                />
              </div>
            </div>

            {/* Patokan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Patokan Lokasi
              </label>
              <input
                type="text"
                value={patokan}
                onChange={(e) => setPatokan(e.target.value)}
                placeholder="Contoh: Dekat masjid / seberang lapangan bola..."
                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
              />
            </div>

            {/* Tempat Pelaksanaan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tempat Pelaksanaan (Desa/Kelurahan)
              </label>
              <input
                type="text"
                value={villageName}
                onChange={(e) => setVillageName(e.target.value)}
                placeholder="Contoh: Aula Desa / Rumah Ketua RW"
                className="w-full box-border px-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm text-slate-750 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-inner transition-all"
                required
              />
            </div>
          </form>
        </div>

        {/* Modal Footer (Sticky bottom) */}
        <div className="pt-4 border-t border-slate-100 flex gap-3.5 shrink-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={isMutating}
            className="w-1/3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 font-bold text-sm py-4 rounded-[1.25rem] active:scale-95 transition-all text-center cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            form="posyandu-form"
            disabled={isMutating}
            className="w-2/3 bg-blue-600 text-white font-bold text-sm py-4 rounded-[1.25rem] shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 disabled:opacity-70 active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer"
          >
            {isMutating ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                <span>Simpan Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
