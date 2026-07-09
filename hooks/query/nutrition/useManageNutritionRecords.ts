"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNutritionRecord } from "@/service/nutrition/nutritionRecordService";
import { CreateNutritionRecordPayload } from "@/interfaces/nutrition";

export function useCreateNutritionRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNutritionRecordPayload) => createNutritionRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["child"] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });
}
