"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { resendEmailOTP } from "@/service/auth/orangTuaAuthService";
import { ResendOTPPayload } from "@/interfaces/auth";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Tidak dapat terhubung ke server.";
    }
    const data = error.response.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? "Gagal mengirim ulang OTP";
  }
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan";
}

export function useResendOTP() {
  return useMutation<any, Error, ResendOTPPayload>({
    mutationFn: async ({ email, type }) => {
      try {
        const response = await resendEmailOTP({ email, type });
        return response;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });
}
