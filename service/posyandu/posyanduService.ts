import { bidanApi } from "../auth/bidanAuthService";
import { Posyandu, CreatePosyanduPayload, UpdatePosyanduPayload } from "@/interfaces/posyandu";
import { ApiResponse } from "@/interfaces/api";

export interface FetchPosyandusResponse {
  data: Posyandu[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export async function fetchPosyandus(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<FetchPosyandusResponse> {
  const { data } = await bidanApi.get<ApiResponse<FetchPosyandusResponse>>("/api/posyandus", {
    params,
  });
  return data.data;
}

export async function fetchPosyanduById(publicId: string): Promise<Posyandu> {
  const { data } = await bidanApi.get<ApiResponse<Posyandu>>(`/api/posyandus/${publicId}`);
  return data.data;
}

export async function createPosyandu(payload: CreatePosyanduPayload): Promise<Posyandu> {
  const { data } = await bidanApi.post<ApiResponse<Posyandu>>("/api/posyandus", payload);
  return data.data;
}

export async function updatePosyandu(
  publicId: string,
  payload: UpdatePosyanduPayload
): Promise<Posyandu> {
  const { data } = await bidanApi.put<ApiResponse<Posyandu>>(`/api/posyandus/${publicId}`, payload);
  return data.data;
}

export async function deletePosyandu(publicId: string): Promise<Posyandu> {
  const { data } = await bidanApi.delete<ApiResponse<Posyandu>>(`/api/posyandus/${publicId}`);
  return data.data;
}
