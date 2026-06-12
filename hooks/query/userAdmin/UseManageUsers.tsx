"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
} from "@/service/user/userService";
import { BackendRole, CreateUserPayload } from "@/interfaces/user";

export function useGetUsers(filters?: { search?: string; role?: BackendRole; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => fetchUsers(filters),
    // Hindari refetch terus menerus jika data tidak berubah
    staleTime: 5000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      // Refresh list user setelah berhasil membuat user baru
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (publicId: string) => deleteUser(publicId),
    onSuccess: () => {
      // Refresh list user setelah berhasil menghapus user
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ publicId, payload }: { publicId: string; payload: Partial<CreateUserPayload> & { email_verified?: boolean } }) =>
      updateUser(publicId, payload),
    onSuccess: () => {
      // Refresh list user setelah berhasil mengupdate user
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
