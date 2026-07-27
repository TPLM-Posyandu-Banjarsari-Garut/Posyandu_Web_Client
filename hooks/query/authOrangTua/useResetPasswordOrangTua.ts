"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { resetPasswordWithOTP } from "@/service/auth/orangTuaAuthService";
import { ResetPasswordOTPPayload } from "@/interfaces/auth";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Tidak dapat terhubung ke server. Pastikan koneksi internet aktif.";
    }
    const data = error.response.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? "Gagal memproses permintaan";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan yang tidak diketahui";
}

export function useResetPasswordOrangTua() {
  return useMutation<any, Error, ResetPasswordOTPPayload>({
    mutationFn: async (payload: ResetPasswordOTPPayload) => {
      try {
        const response = await resetPasswordWithOTP(payload);
        return response;
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });
}
