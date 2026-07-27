"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEducations,
  fetchEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
  fetchEducationCategories,
  createEducationCategory,
  updateEducationCategory,
  deleteEducationCategory,
} from "@/service/education/educationService";
import { CreateEducationPayload, FetchEducationsParams, CreateEducationCategoryPayload } from "@/interfaces/education";

export function useGetEducations(params?: FetchEducationsParams) {
  return useQuery({
    queryKey: ["educations", params],
    queryFn: () => fetchEducations(params),
    staleTime: 5000,
  });
}

export function useGetEducationById(id: string) {
  return useQuery({
    queryKey: ["education", id],
    queryFn: () => fetchEducationById(id),
    enabled: !!id,
    staleTime: 5000,
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEducationPayload) => createEducation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateEducationPayload> }) =>
      updateEducation(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      queryClient.invalidateQueries({ queryKey: ["education", variables.id] });
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
    },
  });
}

export function useGetEducationCategories() {
  return useQuery({
    queryKey: ["education-categories"],
    queryFn: fetchEducationCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateEducationCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEducationCategoryPayload) => createEducationCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-categories"] });
    },
  });
}

export function useUpdateEducationCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateEducationCategoryPayload> }) => 
      updateEducationCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-categories"] });
    },
  });
}

export function useDeleteEducationCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEducationCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-categories"] });
    },
  });
}


