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
      // Clear all React Query cache to prevent data leaks between sessions
      queryClient.clear();
      router.push("/admin/login");
      router.refresh();
    },
    onError: () => {
      // Force redirect even if API fails
      queryClient.clear();
      router.push("/admin/login");
    },
  });
}
