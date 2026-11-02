"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginKader } from "@/service/auth/kaderAuthService";
import { isEmailNotVerifiedError, getApiErrorMessage } from "@/service/auth/authService";
import { KaderLoginPayload } from "@/interfaces/auth";
import { clearIdentityBoundQueryCache } from "@/service/auth/clearIdentityBoundQueryCache";

interface LoginKaderVariables extends KaderLoginPayload {
  rememberMe?: boolean;
  captchaToken?: string;
}

export interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

function getErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, "Email atau kata sandi tidak valid");
}

export interface UseLoginKaderOptions {
  onAuthError?: () => void;
}

export function useLoginKader(options?: UseLoginKaderOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail_kader");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  const loginMutation = useMutation<{ requiresOtp: boolean }, Error, LoginKaderVariables>({
    mutationFn: async ({ email, password, captchaToken }) => {
      await clearIdentityBoundQueryCache(queryClient);
      try {
        const response = await loginKader({ email, password, captchaToken });

        if (!response.user) {
          throw new Error("Email atau kata sandi tidak valid");
        }

        if (response.user.emailVerified === false) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("verify_email", email);
            sessionStorage.setItem("verify_role", "kader");
          }
          router.push("/kader/otp");
          return { requiresOtp: true };
        }

        if (response.user.role !== "cadre") {
          throw new Error(
            "Akses ditolak. Hanya kader yang dapat masuk ke halaman ini."
          );
        }

        // Invalidate current-user cache so fresh data is fetched
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
        return { requiresOtp: false };
      } catch (error) {
        if (isEmailNotVerifiedError(error)) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("verify_email", email);
            sessionStorage.setItem("verify_role", "kader");
          }
          router.push("/kader/otp");
          return { requiresOtp: true };
        }
        throw new Error(getErrorMessage(error));
      }
    },
  });

  const onSubmit = (captchaToken: string, onAuthError?: () => void) =>
    handleSubmit((data) => {
      const triggerAuthError = () => {
        onAuthError?.();
        options?.onAuthError?.();
      };

      if (!captchaToken) {
        setApiError("Silakan selesaikan verifikasi CAPTCHA terlebih dahulu.");
        triggerAuthError();
        return;
      }
      setApiError("");
      setIsSubmitting(true);
      loginMutation.mutate(
        {
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
          captchaToken,
        },
        {
          onSuccess: (result) => {
            if (result?.requiresOtp) {
              setIsSubmitting(false);
              return;
            }
            if (data.rememberMe) {
              localStorage.setItem("rememberedEmail_kader", data.email);
            } else {
              localStorage.removeItem("rememberedEmail_kader");
            }
            setShowSuccess(true);
            setTimeout(() => {
              router.push("/kader/home");
            }, 1500);
          },
          onError: (err) => {
            setApiError(err.message);
            setIsSubmitting(false);
            triggerAuthError();
          },
        }
      );
    });

  const displayError =
    errors.email?.message || errors.password?.message || apiError || "";

  return {
    register,
    onSubmit,
    errors,
    displayError,
    passwordVisible,
    setPasswordVisible,
    showSuccess,
    isPending: loginMutation.isPending || isSubmitting,
  };
}
