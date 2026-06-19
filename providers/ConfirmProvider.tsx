'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ConfirmContextType = {
    confirm: (message: string) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) throw new Error('useConfirm must be used within ConfirmProvider');
    return context.confirm;
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [resolver, setResolver] = useState<(value: boolean) => void>();

    const confirm = useCallback((msg: string) => {
        setMessage(msg);
        setIsOpen(true);
        return new Promise<boolean>((resolve) => {
            setResolver(() => resolve);
        });
    }, []);

    const handleConfirm = () => {
        if (resolver) resolver(true);
        setIsOpen(false);
    };

    const handleCancel = () => {
        if (resolver) resolver(false);
        setIsOpen(false);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col transform transition-all animate-slide-up-modal">
                        <div className="p-6 flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">Konfirmasi</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 text-sm font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-600 active:scale-95 transition-all shadow-[0_4px_12px_rgb(244,63,94,0.3)]"
                            >
                                Ya, Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmContext.Provider>
    );
};
