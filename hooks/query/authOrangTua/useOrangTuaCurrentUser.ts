"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOrangTuaCurrentUser } from "@/service/auth/orangTuaApiService";
import { SessionUser } from "@/service/auth/authService";

export function useOrangTuaCurrentUser() {
  return useQuery<SessionUser, Error>({
    queryKey: ["orangtua-current-user"],
    queryFn: fetchOrangTuaCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
