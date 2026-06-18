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
      // Clear all React Query cache to prevent data leaks between sessions
      queryClient.clear();
      router.push("/orangtua/login");
    },
    onError: () => {
      // Force redirect even if API fails
      queryClient.clear();
      router.push("/orangtua/login");
    },
  });
}
