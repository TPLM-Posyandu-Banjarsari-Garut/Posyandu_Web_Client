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
  // Panggil Next.js API Route yang proper:
  // 1. Hapus cache token dari validate-session layer
  // 2. Sign-out server-side ke backend
  // 3. Hapus cookie browser dengan bersih
  await api.post("/api/auth/logout");
}
