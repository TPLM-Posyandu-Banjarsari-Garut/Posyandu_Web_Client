import axios from "axios";
import { api } from "@/service/auth/authService";
import {
  OrangTuaLoginPayload,
  OrangTuaLoginResponse,
  OrangTuaRegisterPayload,
  VerifyOTPPayload,
  ResendOTPPayload,
  OrangTuaUser,
} from "@/interfaces/auth";

export { api as orangTuaApi };

export async function loginOrangTua(
  payload: OrangTuaLoginPayload
): Promise<OrangTuaLoginResponse> {
  const { data } = await api.post<OrangTuaLoginResponse>(
    "/api/auth/sign-in/email",
    payload
  );
  return data;
}

export async function registerOrangTua(
  payload: OrangTuaRegisterPayload
): Promise<{ user: OrangTuaUser; token?: string }> {
  const { data } = await api.post<{ user: OrangTuaUser; token?: string }>(
    "/api/auth/sign-up/email",
    payload
  );
  return data;
}

export async function verifyEmailOTP(payload: VerifyOTPPayload): Promise<any> {
  const { data } = await api.post<any>("/api/auth/email-otp/verify-email", payload);
  return data;
}

export async function resendEmailOTP(payload: ResendOTPPayload): Promise<any> {
  const { data } = await api.post<any>("/api/auth/email-otp/send-verification-otp", payload);
  return data;
}

export async function logoutOrangTua(): Promise<void> {
  await api.post("/api/auth/sign-out");
}

export async function signInOrangTuaGoogle(
  callbackURL: string
): Promise<{ url: string }> {
  // Bypass proxy to ensure oauth_state cookie is set on the backend domain
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.posyandubanjarsari.my.id";
  const { data } = await axios.post<{ url: string }>(
    `${API_URL}/api/auth/sign-in/social`,
    {
      provider: "google",
      callbackURL: `${window.location.origin}/orangtua/auth/sync`,
      errorCallbackURL: `${window.location.origin}/orangtua/login?error=oauth_failed`,
    },
    { withCredentials: true }
  );
  return data;
}

