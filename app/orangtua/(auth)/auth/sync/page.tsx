"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function SyncSessionContent() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function sync() {
      try {
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "https://api.posyandubanjarsari.my.id";
        
        // Fetch session from backend directly
        const { data } = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });

        const token = data?.data?.session?.id || data?.data?.session?.token;

        if (token) {
          // Set cookie manually on the frontend domain
          document.cookie = `better-auth.session_token=${token}; path=/; max-age=2592000`; // 30 days
          router.replace("/orangtua/home");
        } else {
          setError("Gagal menyinkronkan sesi: Token tidak ditemukan.");
          setTimeout(() => {
            router.replace("/orangtua/login?error=sync_failed");
          }, 3000);
        }
      } catch (err: any) {
        setError("Gagal menyinkronkan sesi. Mengalihkan ke halaman login...");
        setTimeout(() => {
          router.replace("/orangtua/login?error=sync_failed");
        }, 3000);
      }
    }

    sync();
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-gray-600">Menyinkronkan sesi login, mohon tunggu...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SyncSession() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SyncSessionContent />
    </Suspense>
  );
}
