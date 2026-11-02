"use client";

import { useMutation } from "@tanstack/react-query";
import { requestPasswordResetOTP } from "@/service/auth/orangTuaAuthService";
import { getApiErrorMessage } from "@/service/auth/authService";
import { GenericAuthSuccessResponse } from "@/interfaces/auth";

function getErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, "Gagal mengirim OTP reset kata sandi");
}

export function useForgetPasswordOrangTua() {
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
