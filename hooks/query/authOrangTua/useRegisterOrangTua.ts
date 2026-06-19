"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { registerOrangTua } from "@/service/auth/orangTuaAuthService";
import { OrangTuaRegisterPayload, OrangTuaUser } from "@/interfaces/auth";

interface RegisterOrangTuaResult {
  user: OrangTuaUser;
}

export interface RegisterFormInputs extends OrangTuaRegisterPayload {
  confirmPassword?: string;
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Tidak dapat terhubung ke server. Pastikan koneksi internet aktif dan coba lagi.";
    }
    const data = error.response.data as { message?: string; error?: string; code?: string } | undefined;
    
    // Check for "User already exists" error from better-auth
    if (
      data?.code === "USER_ALREADY_EXISTS" || 
      data?.message?.toLowerCase().includes("already exists") ||
      data?.error?.toLowerCase().includes("already exists")
    ) {
      return "Email sudah terdaftar. Gunakan email lain.";
    }

    return data?.message ?? data?.error ?? "Terjadi kesalahan saat pendaftaran";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan saat pendaftaran";
}

export function useRegisterOrangTua() {
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation<RegisterOrangTuaResult, Error, OrangTuaRegisterPayload>({
    mutationFn: async ({ name, email, phone_number, password }) => {
      try {
        const response = await registerOrangTua({ name, email, phone_number, password });
        return { user: response.user };
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
  });

  const onSubmit = handleSubmit((data) => {
    setApiError("");
    if (data.password !== data.confirmPassword) {
      setApiError("Kata sandi verifikasi tidak cocok");
      return;
    }

    registerMutation.mutate(
      {
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        password: data.password,
      },
      {
        onSuccess: (res) => {
          setShowSuccess(true);
          // Set session storage item for OTP page to know which email to verify
          sessionStorage.setItem("verify_email", data.email);

          setTimeout(() => {
            router.push("/orangtua/otp");
          }, 1500);
        },
        onError: (err) => {
          setApiError(err.message);
        },
      }
    );
  });

  const displayError = errors.name?.message || errors.email?.message || errors.password?.message || apiError || "";

  return {
    register,
    onSubmit,
    errors,
    displayError,
    passwordVisible,
    setPasswordVisible,
    confirmPasswordVisible,
    setConfirmPasswordVisible,
    showSuccess,
    isPending: registerMutation.isPending,
  };
}
