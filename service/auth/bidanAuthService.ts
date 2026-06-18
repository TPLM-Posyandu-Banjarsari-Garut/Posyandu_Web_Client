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
  await api.post("/api/auth/sign-out");
}
