import { bidanApi } from "../auth/bidanAuthService";
import { ApiResponse } from "@/interfaces/api";

export interface ParentItem {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone_number?: string;
  address_line?: string | null;
  posyandu_id?: string | null;
}

export interface FetchParentsResponse {
  data: ParentItem[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface FetchParentsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export async function fetchParents(
  params?: FetchParentsParams
): Promise<FetchParentsResponse> {
  const { data } = await bidanApi.get<ApiResponse<FetchParentsResponse>>(
    "/api/parents",
    {
      params: {
        limit: params?.limit || 100,
        page: params?.page || 1,
        search: params?.search,
      },
    }
  );
  return data.data;
}
