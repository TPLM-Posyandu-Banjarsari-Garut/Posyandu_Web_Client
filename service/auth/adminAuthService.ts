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
  await api.post("/api/auth/sign-out");
}
