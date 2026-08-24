"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNutritionRecord,
  fetchNutritionRecordsByChild,
  FetchNutritionRecordsParams,
} from "@/service/nutrition/nutritionRecordService";
import { CreateNutritionRecordPayload } from "@/interfaces/nutrition";


export function useGetNutritionRecordsByChild(params: FetchNutritionRecordsParams) {
  return useQuery({
    queryKey: ["nutrition-records-child", params],
    queryFn: () => fetchNutritionRecordsByChild(params),
    enabled: !!params.children_id,
    staleTime: 5000,
  });
}

export function useCreateNutritionRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNutritionRecordPayload) => createNutritionRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["child"] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
      queryClient.invalidateQueries({ queryKey: ["nutrition-records-child"] });
    },
  });
}
