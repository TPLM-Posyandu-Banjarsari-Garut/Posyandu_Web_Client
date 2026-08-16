"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchParents, FetchParentsParams, FetchParentsResponse } from "@/service/parent/parentService";

export function useGetParents(params?: FetchParentsParams, enabled: boolean = true) {
  return useQuery<FetchParentsResponse, Error>({
    queryKey: ["parents", params],
    queryFn: () => fetchParents(params),
    enabled,
    staleTime: 10000,
  });
}
