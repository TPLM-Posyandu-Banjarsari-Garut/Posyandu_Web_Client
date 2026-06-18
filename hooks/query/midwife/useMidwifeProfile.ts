"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMidwives } from "@/service/midwife/midwifeService";
import { useCurrentUser } from "@/hooks/query/auth/useCurrentUser";

export function useGetMidwifeProfile() {
  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.id ?? null;

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
