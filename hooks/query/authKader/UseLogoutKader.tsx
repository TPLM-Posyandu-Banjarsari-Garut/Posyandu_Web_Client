"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutKader } from "@/service/auth/kaderAuthService";
import { useRouter } from "next/navigation";

export function useLogoutKader() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutKader();
    },
    onSuccess: () => {
      // Clear all React Query cache to prevent data leaks between sessions
      queryClient.clear();
      router.push("/kader/login");
      router.refresh();
    },
    onError: () => {
      // Force redirect even if API fails
      queryClient.clear();
      router.push("/kader/login");
    },
  });
}
