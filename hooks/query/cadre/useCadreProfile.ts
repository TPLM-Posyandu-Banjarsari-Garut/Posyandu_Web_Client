"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCadres } from "@/service/cadre/cadreService";
import { useCurrentUser } from "@/hooks/query/auth/useCurrentUser";

export function useGetCadreProfile() {
  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.id ?? null;

  return useQuery({
    queryKey: ["cadre-profile", currentUserId],
    queryFn: async () => {
      if (!currentUserId) {
        throw new Error("User belum login");
      }
      const response = await fetchCadres();
      const cadres = response.data.data;
      const matched = cadres.find((c) => c.user_id === currentUserId);
      if (!matched) {
        throw new Error("Data Kader tidak ditemukan untuk akun ini.");
      }
      return matched;
    },
    enabled: !!currentUserId,
    staleTime: Infinity, // The cadre assignment does not change during the session
  });
}
