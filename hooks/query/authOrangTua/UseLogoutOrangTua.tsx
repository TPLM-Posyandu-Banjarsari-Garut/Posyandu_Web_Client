"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutOrangTua } from "@/service/auth/orangTuaAuthService";
import { clearIdentityBoundQueryCache } from "@/service/auth/clearIdentityBoundQueryCache";

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
      await clearIdentityBoundQueryCache(queryClient);
      await logoutOrangTua();
    },
    onSuccess: handlePostLogout,
    onError: handlePostLogout,
  });
}
