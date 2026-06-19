'use client';

interface HistoryItem {
    id: string;
    tanggal: string;
    jenis: string;
    status: 'Selesai' | 'Terjadwal' | 'Ditunda';
    keterangan: string;
}

interface ImmunizationHistoryProps {
    history: HistoryItem[];
    showHistory: boolean;
    setShowHistory: (val: boolean) => void;
    formatDateIndo: (dateStr?: string | null) => string;
    getStatusColor: (statusVal: string) => string;
    handleEditItem: (item: HistoryItem) => void;
    handleDeleteItem: (id: string) => void;
}

export default function ImmunizationHistory({
    history,
    showHistory,
    setShowHistory,
    formatDateIndo,
    getStatusColor,
    handleEditItem,
    handleDeleteItem
}: ImmunizationHistoryProps) {
    return (
        <div className="mb-6">
            <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex justify-between items-center px-2 py-1 mb-3 transition-colors active:opacity-75 focus:outline-none"
            >
                <h3 className="text-sm font-bold text-slate-800">Riwayat Imunisasi</h3>
                <div className={`p-1.5 rounded-lg bg-slate-100 text-slate-500 transition-transform duration-350 ${showHistory ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {showHistory && (
                <div className="flex flex-col gap-3.5 animate-fade-in">
                    {history.length > 0 ? (
                        history.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-[1.5rem] p-4 shadow-[0_4px_15px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col gap-3"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <h4 className="text-sm font-extrabold text-slate-800 leading-tight">
                                            {item.jenis}
                                        </h4>
                                        <span className="text-[10px] text-slate-400 font-bold">
                                            {formatDateIndo(item.tanggal)}
                                        </span>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>

                                {item.keterangan && (
                                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 leading-relaxed font-medium">
                                        {item.keterangan}
                                    </p>
                                )}

                                <div className="flex justify-end gap-2.5 border-t border-slate-50 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => handleEditItem(item)}
                                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center text-xs text-slate-400 font-medium">
                            Belum ada riwayat imunisasi terdaftar.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
