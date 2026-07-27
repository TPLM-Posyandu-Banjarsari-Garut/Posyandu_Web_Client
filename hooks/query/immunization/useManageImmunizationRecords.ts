"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchImmunizationRecords,
  createImmunizationRecord,
  updateImmunizationRecord,
  deleteImmunizationRecord,
  FetchImmunizationRecordsParams,
} from "@/service/immunization/immunizationRecordService";
import { CreateImmunizationRecordPayload } from "@/interfaces/immunization";

export function useGetImmunizationRecords(params?: FetchImmunizationRecordsParams) {
  return useQuery({
    queryKey: ["immunization-records", params],
    queryFn: () => fetchImmunizationRecords(params),
    staleTime: 5000,
  });
}

export function useCreateImmunizationRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateImmunizationRecordPayload) => createImmunizationRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immunization-records"] });
      // Also invalidate child details to update latest_nutrition etc
      queryClient.invalidateQueries({ queryKey: ["child"] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
}

export function useUpdateImmunizationRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateImmunizationRecordPayload> }) =>
      updateImmunizationRecord(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immunization-records"] });
      queryClient.invalidateQueries({ queryKey: ["child"] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
}

export function useDeleteImmunizationRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteImmunizationRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["immunization-records"] });
      queryClient.invalidateQueries({ queryKey: ["child"] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
}
