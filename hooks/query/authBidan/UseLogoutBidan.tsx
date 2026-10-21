"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutBidan } from "@/service/auth/bidanAuthService";

const BIDAN_LOGIN_PATH = "/bidan/login";

export function useLogoutBidan() {
  const queryClient = useQueryClient();

  const handlePostLogout = () => {
    queryClient.clear();
    if (typeof window !== "undefined") {
      window.location.replace(BIDAN_LOGIN_PATH);
    }
  };

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutBidan();
    },
    onSuccess: handlePostLogout,
    onError: handlePostLogout,
  });
}
