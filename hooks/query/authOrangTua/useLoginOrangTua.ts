"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  clearOrangTuaSession,
  loginOrangTua,
  saveOrangTuaSession,
} from "@/service/auth/orangTuaAuthService";
import { OrangTuaLoginPayload, OrangTuaUser } from "@/interfaces/auth";

interface LoginOrangTuaVariables extends OrangTuaLoginPayload {
  rememberMe?: boolean;
}

interface LoginOrangTuaResult {
  user: OrangTuaUser;
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
    const data = error.response.data as { message?: string; error?: string } | undefined;
    return data?.message ?? data?.error ?? "Email atau kata sandi tidak valid";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan saat login";
}

export function useLoginOrangTua() {
  const router = useRouter();
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

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

  const loginMutation = useMutation<LoginOrangTuaResult, Error, LoginOrangTuaVariables>({
    mutationFn: async ({ email, password, rememberMe = false }) => {
      try {
        const response = await loginOrangTua({ email, password });

        if (!response.token || !response.user) {
          throw new Error("Email atau kata sandi tidak valid");
        }

        if (response.user.role !== "parent") {
          clearOrangTuaSession();
          throw new Error("Akses ditolak. Hanya Orang Tua yang dapat masuk ke halaman ini.");
        }

        saveOrangTuaSession(response.token, response.user, rememberMe);
        return { user: response.user };
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });

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
            router.push("/orangtua/home");
          }, 1500);
        },
        onError: (err) => {
          setApiError(err.message);
        },
      }
    );
  });

  const displayError = errors.email?.message || errors.password?.message || apiError || "";

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
