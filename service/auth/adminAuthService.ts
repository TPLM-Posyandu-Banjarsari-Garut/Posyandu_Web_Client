import { api } from "@/service/auth/authService";
import {
  AdminLoginPayload,
  AdminLoginResponse,
  ResetPasswordOTPPayload,
  GenericAuthSuccessResponse,
} from "@/interfaces/auth";

export { api as adminApi };

export async function loginAdmin(
  payload: AdminLoginPayload & { captchaToken?: string }
): Promise<AdminLoginResponse> {
  const { captchaToken, ...loginPayload } = payload;
  const { data } = await api.post<AdminLoginResponse>(
    "/api/auth/sign-in/email",
    loginPayload,
    {
      headers: captchaToken
        ? { "X-Captcha-Token": captchaToken }
        : undefined,
    }
  );
  return data;
}

export async function logoutAdmin(): Promise<void> {
  await api.post("/api/auth/logout");
}

export async function requestPasswordResetOTP(
  email: string
): Promise<GenericAuthSuccessResponse> {
  const { data } = await api.post<GenericAuthSuccessResponse>(
    "/api/auth/email-otp/send-verification-otp",
    {
      email,
      type: "forget-password",
    }
  );
  return data;
}

export async function resetPasswordWithOTP(
  payload: ResetPasswordOTPPayload
): Promise<GenericAuthSuccessResponse> {
  const { data } = await api.post<GenericAuthSuccessResponse>(
    "/api/auth/email-otp/reset-password",
    payload
  );
  return data;
}
