"use client";

import { useMutation } from "@tanstack/react-query";
import { verifyEmailOTP } from "@/service/auth/orangTuaAuthService";
import { getApiErrorMessage } from "@/service/auth/authService";
import { VerifyOTPPayload, GenericAuthSuccessResponse } from "@/interfaces/auth";

function getErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, "Verifikasi gagal");
}

export function useVerifyOTP() {
  return useMutation<GenericAuthSuccessResponse, Error, VerifyOTPPayload>({
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
