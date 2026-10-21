"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutKader } from "@/service/auth/kaderAuthService";

const KADER_LOGIN_PATH = "/kader/login";

export function useLogoutKader() {
  const queryClient = useQueryClient();

  const handlePostLogout = () => {
    queryClient.clear();
    if (typeof window !== "undefined") {
      window.location.replace(KADER_LOGIN_PATH);
    }
  };

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutKader();
    },
    onSuccess: handlePostLogout,
    onError: handlePostLogout,
  });
}
