import { api } from "@/service/auth/authService";
import { KaderLoginPayload, KaderLoginResponse } from "@/interfaces/auth";

export { api as kaderApi };

export async function loginKader(
  payload: KaderLoginPayload
): Promise<KaderLoginResponse> {
  const { data } = await api.post<KaderLoginResponse>(
    "/api/auth/sign-in/email",
    payload
  );
  return data;
}

export async function logoutKader(): Promise<void> {
  await api.post("/api/auth/sign-out");
}
