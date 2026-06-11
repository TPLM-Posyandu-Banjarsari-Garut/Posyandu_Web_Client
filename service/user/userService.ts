import { adminApi } from "@/service/auth/adminAuthService";

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
