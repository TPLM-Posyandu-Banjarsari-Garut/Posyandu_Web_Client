import { api } from "@/service/auth/authService";
import {
  KaderLoginPayload,
  KaderLoginResponse,
  ResetPasswordOTPPayload,
  GenericAuthSuccessResponse,
} from "@/interfaces/auth";

export { api as kaderApi };

export async function loginKader(
  payload: KaderLoginPayload & { captchaToken?: string }
): Promise<KaderLoginResponse> {
  const { captchaToken, ...loginPayload } = payload;
  const { data } = await api.post<KaderLoginResponse>(
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

export async function logoutKader(): Promise<void> {
  await api.post("/api/auth/sign-out");
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
