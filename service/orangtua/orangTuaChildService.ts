import { orangTuaApi } from "@/service/auth/orangTuaApiService";
import { Child, CreateChildPayload } from "@/interfaces/child";
import { ApiResponse } from "@/interfaces/api";
import { Posyandu } from "@/interfaces/posyandu";
import { Vaccine } from "@/interfaces/vaccine";
import { ImmunizationRecord } from "@/interfaces/immunization";
import { NutritionRecord } from "@/interfaces/nutrition";
import {
  FetchEducationsParams,
  FetchEducationsResponse,
  EducationResponse,
  FetchEducationCategoriesResponse,
} from "@/interfaces/education";

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

export interface FetchOrangTuaImmunizationRecordsResponse {
  data: ImmunizationRecord[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface FetchOrangTuaVaccinesResponse {
  success: boolean;
  message: string;
  data: {
    data: Vaccine[];
    meta: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
    };
  };
}

export async function fetchOrangTuaImmunizationRecords(params?: {
  children_id?: string;
  vaccine_id?: string;
  posyandu_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<FetchOrangTuaImmunizationRecordsResponse> {
  const { data } = await orangTuaApi.get<ApiResponse<FetchOrangTuaImmunizationRecordsResponse>>(
    "/api/immunization-records",
    {
      params: {
        ...params,
        limit: params?.limit || 100,
      },
    }
  );
  return data.data;
}

export async function fetchOrangTuaVaccines(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<FetchOrangTuaVaccinesResponse> {
  const { data } = await orangTuaApi.get<FetchOrangTuaVaccinesResponse>("/api/vaccines", {
    params: {
      ...params,
      limit: params?.limit || 100,
    },
  });
  return data;
}

export interface FetchOrangTuaNutritionRecordsResponse {
  data: NutritionRecord[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export async function fetchOrangTuaNutritionRecords(params?: {
  children_id?: string;
  page?: number;
  limit?: number;
}): Promise<FetchOrangTuaNutritionRecordsResponse> {
  const { data } = await orangTuaApi.get<ApiResponse<FetchOrangTuaNutritionRecordsResponse>>(
    "/api/nutrition-records",
    {
      params: {
        ...params,
        limit: params?.limit || 100,
      },
    }
  );
  return data.data;
}

export async function fetchOrangTuaEducations(
  params?: FetchEducationsParams
): Promise<FetchEducationsResponse> {
  const { data } = await orangTuaApi.get<FetchEducationsResponse>("/api/educations", {
    params: {
      ...params,
      limit: params?.limit || 10,
      page: params?.page || 1,
    },
  });
  return data;
}

export async function fetchOrangTuaEducationById(
  id: string
): Promise<EducationResponse> {
  const { data } = await orangTuaApi.get<EducationResponse>(`/api/educations/${id}`);
  return data;
}

export async function fetchOrangTuaEducationCategories(): Promise<FetchEducationCategoriesResponse> {
  const { data } = await orangTuaApi.get<FetchEducationCategoriesResponse>("/api/education-categories", {
    params: {
      limit: 100, // Fetch all categories
    }
  });
  return data;
}
