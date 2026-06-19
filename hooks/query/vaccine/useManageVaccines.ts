"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchVaccines,
  createVaccine,
  updateVaccine,
  deleteVaccine,
  FetchVaccinesParams,
} from "@/service/child/../vaccine/vaccineService";
import { CreateVaccinePayload } from "@/interfaces/vaccine";

export function useGetVaccines(params?: FetchVaccinesParams) {
  return useQuery({
    queryKey: ["vaccines", params],
    queryFn: () => fetchVaccines(params),
    staleTime: 5000,
  });
}

export function useCreateVaccine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVaccinePayload) => createVaccine(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaccines"] });
    },
  });
}

export function useUpdateVaccine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateVaccinePayload> }) =>
      updateVaccine(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaccines"] });
    },
  });
}

export function useDeleteVaccine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVaccine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaccines"] });
    },
  });
}
