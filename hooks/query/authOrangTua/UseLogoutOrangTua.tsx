"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutOrangTua } from "@/service/auth/orangTuaAuthService";
import { useRouter } from "next/navigation";

export function useLogoutOrangTua() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutOrangTua,
    onSuccess: () => {
      queryClient.clear();
      router.push("/orangtua/login");
    },
    onError: (error) => {
      console.error("Logout gagal:", error);
      // Tetap paksa redirect meskipun API gagal
      router.push("/orangtua/login");
    },
  });
}
