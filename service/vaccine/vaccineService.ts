import { bidanApi } from "../auth/bidanAuthService";
import { Vaccine, CreateVaccinePayload } from "@/interfaces/vaccine";

export interface FetchVaccinesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface FetchVaccinesResponse {
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

export interface CreateVaccineResponse {
  success: boolean;
  message: string;
  data: Vaccine;
}

export async function fetchVaccines(
  params?: FetchVaccinesParams
): Promise<FetchVaccinesResponse> {
  const { data } = await bidanApi.get<FetchVaccinesResponse>("/api/vaccines", {
    params: {
      ...params,
      limit: params?.limit || 100, // Load a larger list by default to cover the dropdown and modals
    },
  });
  return data;
}

export async function createVaccine(
  payload: CreateVaccinePayload
): Promise<CreateVaccineResponse> {
  const { data } = await bidanApi.post<CreateVaccineResponse>("/api/vaccines", payload);
  return data;
}

export async function updateVaccine(
  id: string,
  payload: Partial<CreateVaccinePayload>
): Promise<CreateVaccineResponse> {
  const { data } = await bidanApi.put<CreateVaccineResponse>(`/api/vaccines/${id}`, payload);
  return data;
}

export async function deleteVaccine(
  id: string
): Promise<CreateVaccineResponse> {
  const { data } = await bidanApi.delete<CreateVaccineResponse>(`/api/vaccines/${id}`);
  return data;
}
