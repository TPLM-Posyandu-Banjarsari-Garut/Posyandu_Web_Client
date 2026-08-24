import { bidanApi } from "../auth/bidanAuthService";
import { NutritionRecord, CreateNutritionRecordPayload } from "@/interfaces/nutrition";
import { ApiResponse } from "@/interfaces/api";

export interface FetchNutritionRecordsParams {
  children_id?: string;
  page?: number;
  limit?: number;
}

// Matches the actual API shape: { success, message, data: { data: [], meta: {} } }
export interface FetchNutritionRecordsPaginated {
  data: NutritionRecord[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

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

export async function fetchNutritionRecordsByChild(
  params: FetchNutritionRecordsParams
): Promise<FetchNutritionRecordsPaginated> {
  const { data } = await bidanApi.get<ApiResponse<FetchNutritionRecordsPaginated>>(
    "/api/nutrition-records",
    { params }
  );
  // Unwrap outer { success, message, data: { data: [], meta: {} } }
  return data.data;
}
