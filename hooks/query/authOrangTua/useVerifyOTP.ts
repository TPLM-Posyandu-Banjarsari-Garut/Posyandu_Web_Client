"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { verifyEmailOTP } from "@/service/auth/orangTuaAuthService";
import { VerifyOTPPayload } from "@/interfaces/auth";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Tidak dapat terhubung ke server.";
    }
    const data = error.response.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? "Verifikasi gagal";
  }
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan";
}

export function useVerifyOTP() {
  return useMutation<any, Error, VerifyOTPPayload>({
    mutationFn: async ({ email, otp }) => {
      try {
        const response = await verifyEmailOTP({ email, otp });
        return response;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });
}
