"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutAdmin } from "@/service/auth/adminAuthService";

const ADMIN_LOGIN_PATH = "/admin/login";

/**
 * Hook logout admin dengan standar clean code dan keamanan data:
 * - Menghapus seluruh cache query React Query untuk mencegah kebocoran sesi
 * - Menggunakan full page redirect (window.location.replace) untuk membersihkan in-memory state
 */
export function useLogoutAdmin() {
  const queryClient = useQueryClient();

  const handlePostLogout = () => {
    queryClient.clear();
    if (typeof window !== "undefined") {
      window.location.replace(ADMIN_LOGIN_PATH);
    }
  };

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutAdmin();
    },
    onSuccess: handlePostLogout,
    onError: handlePostLogout,
  });
}
