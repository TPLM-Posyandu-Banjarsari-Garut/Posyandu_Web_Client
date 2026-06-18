"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser, SessionUser } from "@/service/auth/authService";

/**
 * Universal hook for getting the currently authenticated user.
 * Works for ALL roles (admin, bidan, kader, orangtua).
 * Data is fetched from /api/auth/me via HttpOnly session cookie.
 *
 * Usage: const { data: user, isLoading, isError } = useCurrentUser();
 */
export function useCurrentUser() {
  return useQuery<SessionUser, Error>({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
