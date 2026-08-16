"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { loginAdmin } from "@/service/auth/adminAuthService";
import { AdminLoginPayload } from "@/interfaces/auth";

interface LoginAdminVariables extends AdminLoginPayload {
  rememberMe?: boolean;
  captchaToken?: string;
}

export interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Tidak dapat terhubung ke server. Pastikan koneksi internet aktif dan coba lagi.";
    }
    const data = error.response.data as
      | { message?: string; error?: string }
      | undefined;
    return (
      data?.message ??
      data?.error ??
      "Email atau kata sandi tidak valid"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan saat login";
}

export function useLoginAdmin() {
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
    const rememberedEmail = localStorage.getItem("rememberedEmail_admin");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  const loginMutation = useMutation<void, Error, LoginAdminVariables>({
    mutationFn: async ({ email, password, captchaToken }) => {
      try {
        const response = await loginAdmin({ email, password, captchaToken });

        if (!response.user) {
          throw new Error("Email atau kata sandi tidak valid");
        }

        if (
          response.user.role !== "village_admin" &&
          response.user.role !== "posyandu_admin"
        ) {
          throw new Error(
            "Akses ditolak. Hanya administrator yang dapat masuk ke halaman ini."
          );
        }

        // Invalidate current-user cache so fresh data is fetched
        await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });

  const onSubmit = (captchaToken: string) =>
    handleSubmit((data) => {
      if (!captchaToken) {
        setApiError("Silakan selesaikan verifikasi CAPTCHA terlebih dahulu.");
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
          onSuccess: () => {
            if (data.rememberMe) {
              localStorage.setItem("rememberedEmail_admin", data.email);
            } else {
              localStorage.removeItem("rememberedEmail_admin");
            }
            setShowSuccess(true);
            setTimeout(() => {
              router.push("/admin/kelola-buat-akun");
            }, 1500);
          },
          onError: (err) => {
            setApiError(err.message);
            setIsSubmitting(false);
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
