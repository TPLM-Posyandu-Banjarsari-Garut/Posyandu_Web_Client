"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutOrangTua } from "@/service/auth/orangTuaAuthService";

const ORANGTUA_LOGIN_PATH = "/orangtua/login";

export function useLogoutOrangTua() {
  const queryClient = useQueryClient();

  const handlePostLogout = () => {
    queryClient.clear();
    if (typeof window !== "undefined") {
      window.location.replace(ORANGTUA_LOGIN_PATH);
    }
  };

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutOrangTua();
    },
    onSuccess: handlePostLogout,
    onError: handlePostLogout,
  });
}
