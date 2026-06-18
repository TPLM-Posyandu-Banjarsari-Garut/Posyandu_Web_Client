"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutBidan } from "@/service/auth/bidanAuthService";
import { useRouter } from "next/navigation";

export function useLogoutBidan() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutBidan();
    },
    onSuccess: () => {
      // Clear all React Query cache to prevent data leaks between sessions
      queryClient.clear();
      router.push("/bidan/login");
      router.refresh();
    },
    onError: () => {
      // Force redirect even if API fails
      queryClient.clear();
      router.push("/bidan/login");
    },
  });
}
