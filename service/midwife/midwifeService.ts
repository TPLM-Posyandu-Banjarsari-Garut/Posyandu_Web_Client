import { bidanApi } from "../auth/bidanAuthService";
import { Midwife } from "@/interfaces/midwife";
import { Consultation } from "@/interfaces/consultation";
import { ApiResponse } from "@/interfaces/api";

export interface FetchMidwivesResponse {
  success: boolean;
  message: string;
  data: {
    data: Midwife[];
    meta: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
    };
  };
}

export interface MidwifeConsultation extends Consultation {
  parent_name?: string | null;
  children_name?: string | null;
  posyandu_name?: string | null;
  midwife_name?: string | null;
}

export interface FetchMidwifeConsultationsResponse {
  data: MidwifeConsultation[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface FetchMidwifeConsultationsParams {
  status?: string;
  consultation_type?: string;
  page?: number;
  limit?: number;
  search?: string;
  midwife_id?: string;
}

export async function fetchMidwives(): Promise<FetchMidwivesResponse> {
  const { data } = await bidanApi.get<FetchMidwivesResponse>("/api/midwifes", {
    params: {
      limit: 100, // Load a reasonable list size to scan for current midwife's assignment
    },
  });
  return data;
}

export async function fetchMidwifeConsultations(
  params?: FetchMidwifeConsultationsParams
): Promise<FetchMidwifeConsultationsResponse> {
  const { data } = await bidanApi.get<ApiResponse<FetchMidwifeConsultationsResponse>>(
    "/api/consultations",
    {
      params: {
        ...params,
        limit: params?.limit || 10,
        page: params?.page || 1,
      },
    }
  );
  return data.data;
}

export async function updateConsultationStatus(
  publicId: string,
  payload: { status: string; cancellation_reason?: string }
): Promise<Consultation> {
  const { data } = await bidanApi.put<ApiResponse<Consultation>>(
    `/api/consultations/${publicId}/status`,
    payload
  );
  return data.data;
}
