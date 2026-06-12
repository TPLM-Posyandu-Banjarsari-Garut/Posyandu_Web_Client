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
      // Clear React Query cache to prevent data leaks
      queryClient.clear();
      
      // Redirect back to Bidan login page
      router.push("/bidan/login");
      router.refresh();
    },
  });
}
