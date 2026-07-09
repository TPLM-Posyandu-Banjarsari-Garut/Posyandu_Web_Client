"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLogoutAdmin } from "@/hooks/query/authAdmin/UseLogoutAdmin";
import {
  useGetUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/hooks/query/userAdmin/UseManageUsers";
import { BackendRole } from "@/interfaces/user";
import { createMidwifeProfile, createCadreProfile } from "@/service/user/userService";
import { useConfirm } from "@/providers/ConfirmProvider";

export interface CreateFormInputs {
  name: string;
  email: string;
  password: string;
  role: "orang tua" | "kader" | "bidan" | "admin desa";
  posyanduId?: string;
}

interface CustomError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}


// Helpers untuk memetakan role dari UI ke database
export const roleMapToBackend = (feRole: string): BackendRole => {
  switch (feRole) {
    case "orang tua":
      return "parent";
    case "kader":
      return "cadre";
    case "bidan":
      return "midwife";
    case "admin desa":
      return "village_admin";
    case "admin posyandu":
      return "posyandu_admin";
    default:
      return "parent";
  }
};

export const roleMapToFrontend = (beRole: string): string => {
  switch (beRole) {
    case "parent":
      return "orang tua";
    case "cadre":
      return "kader";
    case "midwife":
      return "bidan";
    case "village_admin":
      return "admin desa";
    case "posyandu_admin":
      return "admin posyandu";
    default:
      return beRole;
  }
};

export function useManageUsersPage() {
  const logout = useLogoutAdmin();
  const confirm = useConfirm();

  // Search filter & pagination states
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Query untuk mengambil data users dari API (request 5 data per halaman)
  const { data: usersResponse, isLoading } = useGetUsers({
    search: searchQuery || undefined,
    page: page,
    limit: 5,
  });

  const allUsers = usersResponse?.data || [];
  const totalItems = usersResponse?.meta?.total_items || 0;
  const totalPages = usersResponse?.meta?.total_pages || 1;

  // Slice data secara defensive agar maksimal hanya 5 data yang dirender di UI
  const paginatedUsers = allUsers.slice(0, 5);

  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();
  const updateUserMutation = useUpdateUser();

  // Password visibility maps (publicId -> boolean)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Modal open states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [formPasswordVisible, setFormPasswordVisible] = useState(false);

  // react-hook-form initialization
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    setValue: setCreateValue,
    watch: watchCreate,
    formState: { errors: createErrors },
  } = useForm<CreateFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "orang tua",
      posyanduId: "",
    },
  });

  const watchedRole = watchCreate("role");

  // Toggle password visibility in the list
  const togglePasswordVisibility = (publicId: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [publicId]: !prev[publicId],
    }));
  };

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 1500);
  };

  // Handle verification status toggle
  const handleToggleVerify = (publicId: string, currentStatus: boolean) => {
    updateUserMutation.mutate(
      {
        publicId,
        payload: { email_verified: !currentStatus },
      },
      {
        onSuccess: () => {
          showToast("Status verifikasi berhasil diperbarui!");
        },
        onError: (err: CustomError) => {
          alert(err.response?.data?.message ?? err.message ?? "Gagal memperbarui status verifikasi");
        },
      }
    );
  };

  // Handle account deletion
  const handleDeleteAccount = async (publicId: string) => {
    if (await confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      deleteUserMutation.mutate(publicId, {
        onSuccess: () => {
          showToast("Akun berhasil dihapus");
        },
        onError: (err: CustomError) => {
          alert(err.response?.data?.message ?? err.message ?? "Gagal menghapus akun");
        },
      });
    }
  };

  // Form submission handler
  const handleCreateAccount = handleSubmitCreate((data) => {
    setFormError("");
    const targetRole = roleMapToBackend(data.role);

    createUserMutation.mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: targetRole,
      },
      {
        onSuccess: async (createdUser) => {
          try {
            if (targetRole === "midwife" && data.posyanduId) {
              await createMidwifeProfile({
                user_id: createdUser.id,
                posyandu_id: data.posyanduId,
                status: "active",
              });
            } else if (targetRole === "cadre" && data.posyanduId) {
              await createCadreProfile({
                user_id: createdUser.id,
                posyandu_id: data.posyanduId,
                status: "active",
              });
            }
            resetCreate();
            setIsModalOpen(false);
            showToast("Akun baru dan profil tugas berhasil dibuat!");
          } catch (error) {
            const err = error as CustomError;
            setFormError(
              "Akun dibuat, tetapi gagal mengasosiasikan Posyandu: " +
              (err.response?.data?.message ?? err.message)
            );
          }
        },
        onError: (err: CustomError) => {
          setFormError(err.response?.data?.message ?? err.message ?? "Gagal membuat akun");
        },
      }
    );
  });

  const firstFormError =
    createErrors.name?.message ||
    createErrors.email?.message ||
    createErrors.password?.message ||
    formError;

  return {
    logout,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    usersResponse,
    isLoading,
    totalItems,
    totalPages,
    paginatedUsers,
    createUserMutation,
    deleteUserMutation,
    updateUserMutation,
    handleToggleVerify,
    isUpdatePending: updateUserMutation.isPending,
    visiblePasswords,
    togglePasswordVisibility,
    isModalOpen,
    setIsModalOpen,
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    showSuccessModal,
    setShowSuccessModal,
    successMessage,
    formError,
    setFormError,
    formPasswordVisible,
    setFormPasswordVisible,
    registerCreate,
    handleCreateAccount,
    handleDeleteAccount,
    firstFormError,
    createErrors,
    watchedRole,
  };
}
