"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPosyandus,
  fetchPosyanduById,
  createPosyandu,
  updatePosyandu,
  deletePosyandu,
} from "@/service/posyandu/posyanduService";
import { CreatePosyanduPayload, UpdatePosyanduPayload } from "@/interfaces/posyandu";

export function useGetPosyandus(params?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["posyandus", params],
    queryFn: () => fetchPosyandus(params),
    staleTime: 5000,
  });
}

export function useGetPosyanduById(publicId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["posyandu", publicId],
    queryFn: () => fetchPosyanduById(publicId),
    enabled: enabled && !!publicId,
    staleTime: 60000, // Posyandu details don't change frequently
  });
}

export function useCreatePosyandu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePosyanduPayload) => createPosyandu(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posyandus"] });
    },
  });
}

export function useUpdatePosyandu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ publicId, payload }: { publicId: string; payload: UpdatePosyanduPayload }) =>
      updatePosyandu(publicId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posyandus"] });
      queryClient.invalidateQueries({ queryKey: ["posyandu", variables.publicId] });
    },
  });
}

export function useDeletePosyandu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (publicId: string) => deletePosyandu(publicId),
    onSuccess: (_, publicId) => {
      queryClient.invalidateQueries({ queryKey: ["posyandus"] });
      queryClient.invalidateQueries({ queryKey: ["posyandu", publicId] });
    },
  });
}
