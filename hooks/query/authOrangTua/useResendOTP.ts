"use client";

import { useMutation } from "@tanstack/react-query";
import { resendEmailOTP } from "@/service/auth/orangTuaAuthService";
import { getApiErrorMessage } from "@/service/auth/authService";
import { ResendOTPPayload, GenericAuthSuccessResponse } from "@/interfaces/auth";

function getErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, "Gagal mengirim ulang OTP");
}

export function useResendOTP() {
  return useMutation<GenericAuthSuccessResponse, Error, ResendOTPPayload>({
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
