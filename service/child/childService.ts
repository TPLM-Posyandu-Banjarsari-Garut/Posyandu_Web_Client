import { bidanApi } from "../auth/bidanAuthService";
import { Child, CreateChildPayload } from "@/interfaces/child";

export interface FetchChildrenParams {
  posyandu_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface FetchChildrenResponse {
  success: boolean;
  message: string;
  data: {
    data: Child[];
    meta: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
    };
  };
}

export interface CreateChildResponse {
  success: boolean;
  message: string;
  data: Child;
}

export async function fetchChildren(
  params?: FetchChildrenParams
): Promise<FetchChildrenResponse> {
  const { data } = await bidanApi.get<FetchChildrenResponse>("/api/childrens", {
    params,
  });
  return data;
}

export async function createChild(
  payload: CreateChildPayload
): Promise<CreateChildResponse> {
  const { data } = await bidanApi.post<CreateChildResponse>("/api/childrens", payload);
  return data;
}
