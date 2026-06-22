import { orangTuaApi } from "@/service/auth/orangTuaApiService";
import { Child, CreateChildPayload } from "@/interfaces/child";
import { ApiResponse } from "@/interfaces/api";
import { Posyandu } from "@/interfaces/posyandu";

export interface FetchOrangTuaChildrenResponse {
  data: Child[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export async function fetchOrangTuaChildren(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<FetchOrangTuaChildrenResponse> {
  const { data } = await orangTuaApi.get<ApiResponse<FetchOrangTuaChildrenResponse>>("/api/childrens", {
    params,
  });
  return data.data;
}

export async function fetchOrangTuaChildById(id: string): Promise<Child> {
  const { data } = await orangTuaApi.get<ApiResponse<Child>>(`/api/childrens/${id}`);
  return data.data;
}

export async function createOrangTuaChild(payload: CreateChildPayload): Promise<Child> {
  const { data } = await orangTuaApi.post<ApiResponse<Child>>("/api/childrens", payload);
  return data.data;
}

export interface FetchPosyandusResponse {
  data: Posyandu[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export async function fetchOrangTuaPosyandus(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<FetchPosyandusResponse> {
  const { data } = await orangTuaApi.get<ApiResponse<FetchPosyandusResponse>>("/api/posyandus", {
    params,
  });
  return data.data;
}
