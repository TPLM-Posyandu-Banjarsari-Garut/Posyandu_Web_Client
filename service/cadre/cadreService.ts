import { kaderApi } from "@/service/auth/kaderAuthService";
import { Cadre } from "@/interfaces/cadre";

export interface FetchCadresResponse {
  success: boolean;
  message: string;
  data: {
    data: Cadre[];
    meta: {
      page: number;
      limit: number;
      total_items: number;
      total_pages: number;
    };
  };
}

export async function fetchCadres(): Promise<FetchCadresResponse> {
  const { data } = await kaderApi.get<FetchCadresResponse>("/api/cadres", {
    params: {
      limit: 100, // Load a reasonable list size to scan for current cadre's assignment
    },
  });
  return data;
}
