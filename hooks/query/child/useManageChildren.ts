"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchChildren, createChild, FetchChildrenParams } from "@/service/child/childService";
import { CreateChildPayload } from "@/interfaces/child";

export function useGetChildren(params: FetchChildrenParams) {
  return useQuery({
    queryKey: ["children", params],
    queryFn: () => fetchChildren(params),
    enabled: !!params.posyandu_id, // Fetch only when posyandu_id is resolved
    staleTime: 5000,
  });
}

export function useCreateChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChildPayload) => createChild(payload),
    onSuccess: () => {
      // Refresh children lists
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
}
