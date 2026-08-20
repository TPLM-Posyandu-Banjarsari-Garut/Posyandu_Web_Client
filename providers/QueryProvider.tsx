"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 3 * 60 * 1000, // 3 menit data dianggap fresh
            gcTime: 10 * 60 * 1000, // 10 menit data disimpan di cache
            refetchOnWindowFocus: false, // Tidak fetch ulang otomatis saat pindah tab
            refetchOnReconnect: true, // Tetap fetch ulang saat koneksi internet pulih
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
