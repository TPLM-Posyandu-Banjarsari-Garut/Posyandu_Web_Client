"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchMidwives } from "@/service/midwife/midwifeService";
import { BidanUser } from "@/interfaces/auth";

export function useGetMidwifeProfile() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("bidan_user") ?? sessionStorage.getItem("bidan_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser) as BidanUser;
          setCurrentUserId(parsed.id);
        } catch (e) {
          console.error("Gagal membaca session user untuk profil bidan:", e);
        }
      }
    }
  }, []);

  return useQuery({
    queryKey: ["midwife-profile", currentUserId],
    queryFn: async () => {
      if (!currentUserId) {
        throw new Error("User belum login");
      }
      const response = await fetchMidwives();
      const midwives = response.data.data;
      const matched = midwives.find((m) => m.user_id === currentUserId);
      if (!matched) {
        throw new Error("Data Bidan tidak ditemukan untuk akun ini.");
      }
      return matched;
    },
    enabled: !!currentUserId,
    staleTime: Infinity, // The midwife assignment does not change during the session
  });
}
