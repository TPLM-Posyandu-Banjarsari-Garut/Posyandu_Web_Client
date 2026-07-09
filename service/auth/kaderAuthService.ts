import { api, API_URL } from "@/service/auth/authService";
import { KaderLoginPayload, KaderLoginResponse, ResetPasswordOTPPayload } from "@/interfaces/auth";

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

export async function requestPasswordResetOTP(email: string): Promise<any> {
  const { data } = await api.post<any>("/api/auth/email-otp/send-verification-otp", {
    email,
    type: "forget-password",
  });
  return data;
}

export async function resetPasswordWithOTP(payload: ResetPasswordOTPPayload): Promise<any> {
  const { data } = await api.post<any>("/api/auth/email-otp/reset-password", payload);
  return data;
}

