import { adminApi } from "@/service/auth/adminAuthService";
import { Posyandu } from "@/interfaces/posyandu";

import { ApiResponse } from "@/interfaces/api";
import {
  BackendRole,
  BackendUser,
  CreateUserPayload,
  GetUsersData,
} from "@/interfaces/user";

// Service unwraps the ApiResponse wrapper so query hooks get the business payload directly
export async function fetchUsers(params?: {
  search?: string;
  role?: BackendRole;
  page?: number;
  limit?: number;
}): Promise<GetUsersData> {
  const { data } = await adminApi.get<ApiResponse<GetUsersData>>("/api/users", {
    params,
  });
  return data.data;
}

export async function createUser(payload: CreateUserPayload): Promise<BackendUser> {
  const { data } = await adminApi.post<ApiResponse<BackendUser>>("/api/users", payload);
  return data.data;
}

export async function deleteUser(publicId: string): Promise<BackendUser> {
  const { data } = await adminApi.delete<ApiResponse<BackendUser>>(`/api/users/${publicId}`);
  return data.data;
}

export async function updateUser(
  publicId: string,
  payload: Partial<CreateUserPayload> & { email_verified?: boolean }
): Promise<BackendUser> {
  const { data } = await adminApi.put<ApiResponse<BackendUser>>(`/api/users/${publicId}`, payload);
  return data.data;
}

export interface GetPosyandusResponse {
  data: Posyandu[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export async function fetchAdminPosyandus(): Promise<GetPosyandusResponse> {
  const { data } = await adminApi.get<ApiResponse<GetPosyandusResponse>>("/api/posyandus", {
    params: {
      limit: 100,
    },
  });
  return data.data;
}

export async function createMidwifeProfile(payload: {
  user_id: string;
  posyandu_id: string;
  status?: string;
}): Promise<any> {
  const { data } = await adminApi.post<ApiResponse<any>>("/api/midwifes", payload);
  return data.data;
}

export async function createCadreProfile(payload: {
  user_id: string;
  posyandu_id: string;
  status?: string;
}): Promise<any> {
  const { data } = await adminApi.post<ApiResponse<any>>("/api/cadres", payload);
  return data.data;
}
