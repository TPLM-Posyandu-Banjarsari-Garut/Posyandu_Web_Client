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
      // Clear React Query cache to prevent data leaks
      queryClient.clear();
      
      // Redirect back to Kader login page
      router.push("/kader/login");
      router.refresh();
    },
  });
}
