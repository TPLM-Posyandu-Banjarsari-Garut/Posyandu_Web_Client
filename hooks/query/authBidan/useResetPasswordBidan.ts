"use client";

import { useMutation } from "@tanstack/react-query";
import { resetPasswordWithOTP } from "@/service/auth/bidanAuthService";
import { getApiErrorMessage } from "@/service/auth/authService";
import { ResetPasswordOTPPayload, GenericAuthSuccessResponse } from "@/interfaces/auth";

function getErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, "Gagal mereset kata sandi");
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
