import { bidanApi } from "../auth/bidanAuthService";
import { NutritionRecord, CreateNutritionRecordPayload } from "@/interfaces/nutrition";
import { ApiResponse } from "@/interfaces/api";

export async function createNutritionRecord(
  payload: CreateNutritionRecordPayload
): Promise<NutritionRecord> {
  const { data } = await bidanApi.post<ApiResponse<NutritionRecord>>(
    "/api/nutrition-records",
    payload
  );
  return data.data;
}

export async function deleteNutritionRecord(
  id: string
): Promise<NutritionRecord> {
  const { data } = await bidanApi.delete<ApiResponse<NutritionRecord>>(
    `/api/nutrition-records/${id}`
  );
  return data.data;
}
