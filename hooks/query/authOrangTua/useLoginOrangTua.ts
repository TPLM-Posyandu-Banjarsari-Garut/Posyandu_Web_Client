"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginOrangTua, signInOrangTuaGoogle } from "@/service/auth/orangTuaAuthService";
import { isEmailNotVerifiedError, getApiErrorMessage } from "@/service/auth/authService";
import { OrangTuaLoginPayload } from "@/interfaces/auth";
import { clearIdentityBoundQueryCache } from "@/service/auth/clearIdentityBoundQueryCache";

interface LoginOrangTuaVariables extends OrangTuaLoginPayload {
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

export interface UseLoginOrangTuaOptions {
  onAuthError?: () => void;
}

export function useLoginOrangTua(options?: UseLoginOrangTuaOptions) {
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
    const rememberedEmail = localStorage.getItem("rememberedEmail_orangtua");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  const loginMutation = useMutation<{ requiresOtp: boolean }, Error, LoginOrangTuaVariables>({
    mutationFn: async ({ email, password, captchaToken }) => {
      await clearIdentityBoundQueryCache(queryClient);
      try {
        const response = await loginOrangTua({ email, password, captchaToken });

        if (!response.user) {
          throw new Error("Email atau kata sandi tidak valid");
        }

        if (response.user.emailVerified === false) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("verify_email", email);
            sessionStorage.setItem("verify_role", "orangtua");
          }
          router.push("/orangtua/otp");
          return { requiresOtp: true };
        }

        if (response.user.role !== "parent") {
          throw new Error("Akses ditolak. Hanya Orang Tua yang dapat masuk ke halaman ini.");
        }

        // Invalidate current-user cache so fresh data is fetched
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
        return { requiresOtp: false };
      } catch (error) {
        if (isEmailNotVerifiedError(error)) {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("verify_email", email);
            sessionStorage.setItem("verify_role", "orangtua");
          }
          router.push("/orangtua/otp");
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
              localStorage.setItem("rememberedEmail_orangtua", data.email);
            } else {
              localStorage.removeItem("rememberedEmail_orangtua");
            }
            setShowSuccess(true);
            setTimeout(() => {
              router.push("/orangtua/home");
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

  const [isGooglePending, setIsGooglePending] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGooglePending(true);
    setApiError("");
    try {
      await clearIdentityBoundQueryCache(queryClient);
      const callbackURL = `${window.location.origin}/orangtua/home`;
      const response = await signInOrangTuaGoogle(callbackURL);
      if (response && response.url) {
        window.location.href = response.url;
      } else {
        throw new Error("Gagal mendapatkan URL login Google.");
      }
    } catch (error) {
      setIsGooglePending(false);
      setApiError(getErrorMessage(error));
    }
  };

  const displayError = errors.email?.message || errors.password?.message || apiError || "";

  return {
    register,
    onSubmit,
    errors,
    displayError,
    passwordVisible,
    setPasswordVisible,
    showSuccess,
    isPending: loginMutation.isPending || isSubmitting,
    handleGoogleLogin,
    isGooglePending,
  };
}

