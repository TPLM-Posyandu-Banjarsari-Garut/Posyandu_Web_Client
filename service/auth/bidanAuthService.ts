import { api } from "@/service/auth/authService";
import {
  BidanLoginPayload,
  BidanLoginResponse,
  ResetPasswordOTPPayload,
  GenericAuthSuccessResponse,
} from "@/interfaces/auth";

export { api as bidanApi };

export async function loginBidan(
  payload: BidanLoginPayload & { captchaToken?: string }
): Promise<BidanLoginResponse> {
  const { captchaToken, ...loginPayload } = payload;
  const { data } = await api.post<BidanLoginResponse>(
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

export async function logoutBidan(): Promise<void> {
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
