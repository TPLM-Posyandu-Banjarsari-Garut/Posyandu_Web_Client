"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchChildren,
  createChild,
  fetchChildById,
  updateChild,
  FetchChildrenParams,
} from "@/service/child/childService";
import { CreateChildPayload } from "@/interfaces/child";

export function useGetChildren(params: FetchChildrenParams) {
  return useQuery({
    queryKey: ["children", params],
    queryFn: () => fetchChildren(params),
    staleTime: 5000,
  });
}

export function useGetChildById(id: string) {
  return useQuery({
    queryKey: ["child", id],
    queryFn: () => fetchChildById(id),
    enabled: !!id,
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

export function useUpdateChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateChildPayload> }) =>
      updateChild(id, payload),
    onSuccess: (data, variables) => {
      // Refresh children lists and single child cache
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["child", variables.id] });
    },
  });
}
