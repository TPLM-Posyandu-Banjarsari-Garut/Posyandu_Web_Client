"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { resetPasswordWithOTP } from "@/service/auth/bidanAuthService";
import { ResetPasswordOTPPayload, GenericAuthSuccessResponse } from "@/interfaces/auth";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Tidak dapat terhubung ke server.";
    }
    const data = error.response.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? "Gagal mereset kata sandi";
  }
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan";
}

export function useResetPasswordBidan() {
  return useMutation<GenericAuthSuccessResponse, Error, ResetPasswordOTPPayload>({
    mutationFn: async ({ email, otp, password }) => {
      try {
        const response = await resetPasswordWithOTP({ email, otp, password });
        return response;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });
}
