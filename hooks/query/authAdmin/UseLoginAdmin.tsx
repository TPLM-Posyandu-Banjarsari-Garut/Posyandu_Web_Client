"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  clearAdminSession,
  loginAdmin,
  saveAdminSession,
} from "@/service/auth/adminAuthService";
import { AdminLoginPayload, AdminUser } from "@/interfaces/auth";

interface LoginAdminVariables extends AdminLoginPayload {
  rememberMe?: boolean;
}

interface LoginAdminResult {
  user: AdminUser;
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
  
  // UI States
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // react-hook-form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // react-query mutation
  const loginMutation = useMutation<LoginAdminResult, Error, LoginAdminVariables>({
    mutationFn: async ({ email, password, rememberMe = false }) => {
      try {
        const response = await loginAdmin({ email, password });

        if (!response.token || !response.user) {
          throw new Error("Email atau kata sandi tidak valid");
        }

        if (response.user.role !== "village_admin") {
          clearAdminSession();
          throw new Error(
            "Akses ditolak. Hanya admin desa yang dapat masuk ke halaman ini."
          );
        }

        saveAdminSession(response.token, response.user, rememberMe);
        return { user: response.user };
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });

  // Submit handler calling mutation
  const onSubmit = handleSubmit((data) => {
    setApiError("");
    loginMutation.mutate(
      {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => {
            router.push("/admin/kelola-buat-akun");
          }, 1500);
        },
        onError: (err) => {
          setApiError(err.message);
        },
      }
    );
  });

  // Gabungkan error dari validation react-hook-form dan API backend
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
    isPending: loginMutation.isPending,
  };
}
