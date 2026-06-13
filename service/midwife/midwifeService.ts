import { bidanApi } from "../auth/bidanAuthService";
import { Midwife } from "@/interfaces/midwife";

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

export async function fetchMidwives(): Promise<FetchMidwivesResponse> {
  const { data } = await bidanApi.get<FetchMidwivesResponse>("/api/midwifes", {
    params: {
      limit: 100, // Load a reasonable list size to scan for current midwife's assignment
    },
  });
  return data;
}
