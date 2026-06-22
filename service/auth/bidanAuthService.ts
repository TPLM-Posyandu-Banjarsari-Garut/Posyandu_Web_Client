import { api } from "@/service/auth/authService";
import { BidanLoginPayload, BidanLoginResponse } from "@/interfaces/auth";

export { api as bidanApi };

export async function loginBidan(
  payload: BidanLoginPayload
): Promise<BidanLoginResponse> {
  const { data } = await api.post<BidanLoginResponse>(
    "/api/auth/sign-in/email",
    payload
  );
  return data;
}

export async function logoutBidan(): Promise<void> {
  // Panggil Next.js API Route yang proper:
  // 1. Hapus cache token dari validate-session layer
  // 2. Sign-out server-side ke backend
  // 3. Hapus cookie browser dengan bersih
  await api.post("/api/auth/logout");
}
