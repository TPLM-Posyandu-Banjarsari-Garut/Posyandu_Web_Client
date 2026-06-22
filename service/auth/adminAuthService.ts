import { api } from "@/service/auth/authService";
import { AdminLoginPayload, AdminLoginResponse } from "@/interfaces/auth";

export { api as adminApi };

export async function loginAdmin(
  payload: AdminLoginPayload
): Promise<AdminLoginResponse> {
  const { data } = await api.post<AdminLoginResponse>(
    "/api/auth/sign-in/email",
    payload
  );
  return data;
}

export async function logoutAdmin(): Promise<void> {
  // Panggil Next.js API Route yang proper:
  // 1. Hapus cache token dari validate-session layer
  // 2. Sign-out server-side ke backend
  // 3. Hapus cookie browser dengan bersih
  await api.post("/api/auth/logout");
}
