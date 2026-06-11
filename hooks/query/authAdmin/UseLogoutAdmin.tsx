"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutAdmin } from "@/service/auth/adminAuthService";
import { useRouter } from "next/navigation";

export function useLogoutAdmin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutAdmin();
    },
    onSuccess: () => {
      // Bersihkan semua cache React Query untuk menghindari data bocor
      queryClient.clear();
      
      // Redirect kembali ke halaman login admin
      router.push("/admin/login");
      router.refresh();
    },
  });
}
