"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { requestPasswordResetOTP } from "@/service/auth/bidanAuthService";
import { GenericAuthSuccessResponse } from "@/interfaces/auth";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Tidak dapat terhubung ke server.";
    }
    const data = error.response.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? "Gagal mengirim OTP reset kata sandi";
  }
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan";
}

export function useForgetPasswordBidan() {
  return useMutation<GenericAuthSuccessResponse, Error, string>({
    mutationFn: async (email: string) => {
      try {
        const response = await requestPasswordResetOTP(email);
        return response;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });
}
