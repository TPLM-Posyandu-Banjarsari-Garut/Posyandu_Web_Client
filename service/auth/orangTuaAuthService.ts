import { orangTuaApi as api } from "@/service/auth/orangTuaApiService";
import {
  OrangTuaLoginPayload,
  OrangTuaLoginResponse,
  OrangTuaRegisterPayload,
  VerifyOTPPayload,
  ResendOTPPayload,
  OrangTuaUser,
  ResetPasswordOTPPayload,
  GenericAuthSuccessResponse,
} from "@/interfaces/auth";

export { api as orangTuaApi };

export async function loginOrangTua(
  payload: OrangTuaLoginPayload & { captchaToken?: string }
): Promise<OrangTuaLoginResponse> {
  const { captchaToken, ...loginPayload } = payload;
  const { data } = await api.post<OrangTuaLoginResponse>(
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

export async function registerOrangTua(
  payload: OrangTuaRegisterPayload & { captchaToken?: string }
): Promise<{ user: OrangTuaUser; token?: string }> {
  const { captchaToken, ...registerPayload } = payload;
  const { data } = await api.post<{ user: OrangTuaUser; token?: string }>(
    "/api/auth/sign-up/email",
    registerPayload,
    {
      headers: captchaToken
        ? { "X-Captcha-Token": captchaToken }
        : undefined,
    }
  );
  return data;
}

export async function verifyEmailOTP(
  payload: VerifyOTPPayload
): Promise<GenericAuthSuccessResponse> {
  const { data } = await api.post<GenericAuthSuccessResponse>(
    "/api/auth/email-otp/verify-email",
    payload
  );
  return data;
}

export async function resendEmailOTP(
  payload: ResendOTPPayload
): Promise<GenericAuthSuccessResponse> {
  const { data } = await api.post<GenericAuthSuccessResponse>(
    "/api/auth/email-otp/send-verification-otp",
    payload
  );
  return data;
}

export async function logoutOrangTua(): Promise<void> {
  await api.post("/api/auth/sign-out");
}

export async function signInOrangTuaGoogle(
  callbackURL: string
): Promise<{ url: string }> {
  const { data } = await api.post<{ url: string }>(
    "/api/auth/sign-in/social",
    {
      provider: "google",
      callbackURL,
      errorCallbackURL: `${window.location.origin}/orangtua/login?error=oauth_failed`,
    }
  );
  return data;
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
