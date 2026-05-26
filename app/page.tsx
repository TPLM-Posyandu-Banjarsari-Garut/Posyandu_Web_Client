"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Register PWA Service Worker on Mount
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered successfully with scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("Service Worker registration failed:", err);
        });
    }
  }, []);

  // Notification utilities
  const sendNotification = async () => {
    if (!("Notification" in window)) {
      alert("Browser ini tidak mendukung notifikasi.");
      return;
    }

    if (Notification.permission === "granted") {
      await showNotification();
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await showNotification();
      }
    }
  };

  const showNotification = async () => {
    console.log("Mencoba mengirim notifikasi...");

    if ("serviceWorker" in navigator) {
      try {
        const swReadyPromise = navigator.serviceWorker.ready;
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout waiting for Service Worker")), 1200)
        );
        const registration = (await Promise.race([
          swReadyPromise,
          timeoutPromise,
        ])) as ServiceWorkerRegistration;

        console.log("Menggunakan Service Worker untuk notifikasi...");
        const options: NotificationOptions & { vibrate?: number[] } = {
          body: "Halo! Anda Waktunya Melahirkan 1 jam lagi.",
          icon: "/icon-192x192.png",
          badge: "/icon-192x192.png",
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
          },
        };
        await registration.showNotification("POSYANDU BANJARSARI", options);
        return;
      } catch (err) {
        console.warn("SW notification gagal, fallback:", err);
      }
    }

    console.log("Menggunakan Browser Notification (fallback)...");
    new Notification("POSYANDU BANJARSARI", {
      body: "Halo! Ini adalah notifikasi browser (Fallback).",
      icon: "/icon-192x192.png",
    });
  };

  // Roles list
  const roles = [
    {
      id: "orangtua",
      title: "Orang Tua",
      description: "Pantau tumbuh kembang & jadwal imunisasi buah hati Anda.",
      path: "/orangtua/login",
      colorClass: "bg-emerald-50 text-emerald-600 border-emerald-100/60 shadow-[0_4px_12px_rgba(16,185,129,0.06)]",
      hoverBgGradient: "to-emerald-50/15",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
    },
    {
      id: "bidan",
      title: "Bidan",
      description: "Kelola data kesehatan ibu hamil & rekam medis imunisasi anak.",
      path: "/bidan/login",
      colorClass: "bg-rose-50 text-rose-600 border-rose-100/60 shadow-[0_4px_12px_rgba(244,63,94,0.06)]",
      hoverBgGradient: "to-rose-50/15",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
    {
      id: "kader",
      title: "Kader",
      description: "Bantu pencatatan & monitoring kegiatan posyandu berkala.",
      path: "/kader/login",
      colorClass: "bg-violet-50 text-violet-600 border-violet-100/60 shadow-[0_4px_12px_rgba(139,92,246,0.06)]",
      hoverBgGradient: "to-violet-50/15",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0112 20.25a11.38 11.38 0 01-3-1.013v-.11c0-1.103.285-2.147.786-3.045M7.5 14.25a4.125 4.125 0 00-7.533 2.493 9.337 9.337 0 004.121.952 9.38 9.38 0 002.625-.372M7.5 14.25v-.003c0-1.113.285-2.16.786-3.07M7.5 14.25v.109A11.386 11.386 0 0112 15c.668 0 1.32-.058 1.953-.17v.109a11.386 11.386 0 01-3.167 1.282M18 7.5a3 3 0 11-6 0 3 3 0 016 0zM6 7.5a3 3 0 11-6 0 3 3 0 016 0zm12 9a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: "admin",
      title: "Admin",
      description: "Kelola otorisasi akun, sistem, & konfigurasi umum posyandu.",
      path: "/admin/login",
      colorClass: "bg-amber-50 text-amber-600 border-amber-100/60 shadow-[0_4px_12px_rgba(245,158,11,0.06)]",
      hoverBgGradient: "to-amber-50/15",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-10 pt-4 px-0 sm:px-0 text-slate-800 flex justify-center animate-fade-in">
      {/* Mobile Device Container */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[90vh] rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-[6px] border-white ring-1 ring-slate-200">

        {/* Top Gradient Header Section with Mesh Glow */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-12 pb-20 flex flex-col relative overflow-hidden shrink-0 text-white">

          {/* Ambient Glow Mesh Circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-cyan-400/25 blur-3xl z-0 pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-pink-400/20 blur-3xl z-0 pointer-events-none"></div>

          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-[9px] font-extrabold uppercase tracking-widest w-fit mb-4 backdrop-blur-md z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            E-Health System
          </div>

          <h1 className="text-[30px] font-extrabold tracking-tight leading-none z-10 bg-gradient-to-r from-white via-white to-blue-100 bg-clip-text text-transparent">
            Posyandu
          </h1>
          <span className="text-[24px] font-medium tracking-tight mt-1.5 text-blue-100/90 z-10">
            Banjarsari Garut
          </span>
          <p className="text-white/60 text-[10px] mt-1 font-extrabold tracking-widest uppercase z-10">
            Layanan Terpadu Jawa Barat
          </p>
        </div>

        {/* White Selector Card Overlap Section with Soft Top Shadow */}
        <div className="bg-white rounded-t-[2.5rem] -mt-10 pt-9 px-6 pb-8 flex-1 flex flex-col justify-between relative z-10 shadow-[0_-12px_30px_rgba(0,0,0,0.035)]">

          <div className="flex flex-col gap-6">
            {/* Greetings and Instruction with dynamic typography */}
            <div className="px-1">
              <h2 className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-800 to-slate-950 bg-clip-text text-transparent">
                Selamat Datang!
              </h2>
              <p className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase mt-1">
                Pilih Akses Masuk Anda:
              </p>
            </div>

            {/* List of Role Cards with hover gradients & slide effects */}
            <div className="flex flex-col gap-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => router.push(role.path)}
                  className="group flex items-center gap-4 bg-white border border-slate-100/90 rounded-[1.5rem] p-4.5 hover:border-blue-400/80 hover:bg-slate-50/50 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)] transition-all duration-300 cursor-pointer active:scale-[0.97] focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:outline-none relative overflow-hidden"
                >
                  {/* Subtle Hover Gradient Highlights */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-transparent ${role.hoverBgGradient}`}></div>

                  {/* Left Icon with shadow and bounce hover */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm ${role.colorClass} relative z-10 bg-white`}>
                    {role.icon}
                  </div>

                  {/* Middle Text Details */}
                  <div className="flex flex-col items-start text-left flex-1 relative z-10">
                    <span className="text-sm font-black text-slate-800 group-hover:text-blue-950 transition-colors">
                      {role.title}
                    </span>
                    <span className="text-[11px] text-slate-450 leading-snug  mt-0.5 group-hover:text-slate-650 transition-colors">
                      {role.description}
                    </span>
                  </div>

                  {/* Right Small Arrow Indicator with slide-out animation */}
                  <svg className="w-5 h-5 ml-auto text-slate-300 shrink-0 transform transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              ))}
            </div>
          </div>


        </div>

      </div>
    </div>
  );
}
