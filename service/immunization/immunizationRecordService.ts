import { bidanApi } from "../auth/bidanAuthService";
import { ImmunizationRecord, CreateImmunizationRecordPayload } from "@/interfaces/immunization";
import { ApiResponse } from "@/interfaces/api";

export interface FetchImmunizationRecordsParams {
  children_id?: string;
  vaccine_id?: string;
  posyandu_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface FetchImmunizationRecordsResponse {
  data: ImmunizationRecord[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export async function fetchImmunizationRecords(
  params?: FetchImmunizationRecordsParams
): Promise<FetchImmunizationRecordsResponse> {
  const { data } = await bidanApi.get<ApiResponse<FetchImmunizationRecordsResponse>>(
    "/api/immunization-records",
    {
      params: {
        ...params,
        limit: params?.limit || 100, // Fetch a large list to cover history and unique dose calculations
      },
    }
  );
  return data.data;
}

export async function createImmunizationRecord(
  payload: CreateImmunizationRecordPayload
): Promise<ImmunizationRecord> {
  const { data } = await bidanApi.post<ApiResponse<ImmunizationRecord>>(
    "/api/immunization-records",
    payload
  );
  return data.data;
}

export async function updateImmunizationRecord(
  id: string,
  payload: Partial<CreateImmunizationRecordPayload>
): Promise<ImmunizationRecord> {
  const { data } = await bidanApi.put<ApiResponse<ImmunizationRecord>>(
    `/api/immunization-records/${id}`,
    payload
  );
  return data.data;
}

export async function deleteImmunizationRecord(
  id: string
): Promise<ImmunizationRecord> {
  const { data } = await bidanApi.delete<ApiResponse<ImmunizationRecord>>(
    `/api/immunization-records/${id}`
  );
  return data.data;
}
