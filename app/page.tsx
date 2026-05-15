"use client";

import Image from "next/image";

export default function Home() {
  const sendNotification = async () => {
    if (!("Notification" in window)) {
      alert("Browser ini tidak mendukung notifikasi.");
      return;
    }

    if (Notification.permission === "granted") {
      showNotification();
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        showNotification();
      }
    }
  };

  const showNotification = () => {
    console.log("Mencoba mengirim notifikasi...");
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      console.log("Menggunakan Service Worker untuk notifikasi...");
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification("POSYANDU BANJARSARI", {
          body: "Halo! Anda Waktunya Melahirkan 1 jam lagi.",
          icon: "/icon-192x192.png",
          badge: "/icon-192x192.png",
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
          },
        } as any);
      });
    } else {
      console.log("Service Worker tidak ditemukan/aktif, menggunakan Browser Notification...");
      new Notification("POSYANDU BANJARSARI", {
        body: "Halo! Ini adalah notifikasi browser (Fallback).",
        icon: "/icon-192x192.png",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Mantap
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Aplikasi PWA Posyandu Banjarsari sudah siap. Klik tombol di bawah
            untuk mencoba fitur push notification.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            onClick={sendNotification}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 text-white transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 md:w-auto"
          >
            🔔 Kirim Notifikasi
          </button>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
