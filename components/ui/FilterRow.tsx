import type { ReactNode } from 'react';

type FilterRowProps = {
    children: ReactNode;
};

/** Baris 2 filter setengah lebar; w-[calc(50%-0.25rem)] agar stabil di iOS Safari */
export function FilterRow({ children }: FilterRowProps) {
    return (
        <div className="flex w-full min-w-0 max-w-full gap-2">
            {children}
        </div>
    );
}

export function FilterHalf({ children }: { children: ReactNode }) {
    return (
        <div className="w-[calc(50%-0.25rem)] min-w-0 shrink-0 grow-0 overflow-hidden">
            {children}
        </div>
    );
}
