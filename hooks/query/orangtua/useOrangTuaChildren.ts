"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrangTuaChildren,
  fetchOrangTuaChildById,
  createOrangTuaChild,
  fetchOrangTuaPosyandus,
  fetchOrangTuaPosyanduById,
  fetchOrangTuaImmunizationRecords,
  fetchOrangTuaVaccines,
  fetchOrangTuaNutritionRecords,
  fetchOrangTuaEducations,
  fetchOrangTuaEducationById,
  fetchOrangTuaEducationCategories,
  fetchOrangTuaAvailableSlots,
  createOrangTuaBooking,
  fetchOrangTuaConsultations,
  fetchOrangTuaPregnancyRecords,
  fetchOrangTuaMidwives,
  FetchOrangTuaChildrenResponse,
  FetchPosyandusResponse,
  FetchOrangTuaImmunizationRecordsResponse,
  FetchOrangTuaVaccinesResponse,
  FetchOrangTuaNutritionRecordsResponse,
  FetchOrangTuaConsultationsResponse,
  FetchOrangTuaPregnancyRecordsResponse,
  FetchOrangTuaMidwivesResponse,
} from "@/service/orangtua/orangTuaChildService";
import { Child, CreateChildPayload } from "@/interfaces/child";
import {
  FetchEducationsParams,
  FetchEducationsResponse,
  EducationResponse,
  FetchEducationCategoriesResponse,
} from "@/interfaces/education";
import { Consultation, CreateBookingPayload, AvailableSlot } from "@/interfaces/consultation";
import { PregnancyRecord } from "@/interfaces/pregnancy";
import { Posyandu } from "@/interfaces/posyandu";

export function useGetOrangTuaChildren(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<FetchOrangTuaChildrenResponse, Error>({
    queryKey: ["orangtua-children", params],
    queryFn: () => fetchOrangTuaChildren(params),
    staleTime: 5000,
  });
}

export function useGetOrangTuaChildById(id: string, enabled: boolean = true) {
  return useQuery<Child, Error>({
    queryKey: ["orangtua-child", id],
    queryFn: () => fetchOrangTuaChildById(id),
    enabled: enabled && !!id,
    staleTime: 5000,
  });
}

export function useCreateOrangTuaChild() {
  const queryClient = useQueryClient();

  return useMutation<Child, Error, CreateChildPayload>({
    mutationFn: (payload: CreateChildPayload) => createOrangTuaChild(payload),
    onSuccess: () => {
      // Invalidate both cache keys to trigger re-fetches
      queryClient.invalidateQueries({ queryKey: ["orangtua-children"] });
    },
  });
}

export function useGetOrangTuaPosyandus(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<FetchPosyandusResponse, Error>({
    queryKey: ["orangtua-posyandus", params],
    queryFn: () => fetchOrangTuaPosyandus(params),
    staleTime: 60000,
  });
}

export function useGetOrangTuaImmunizationRecords(params?: {
  children_id?: string;
  vaccine_id?: string;
  posyandu_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<FetchOrangTuaImmunizationRecordsResponse, Error>({
    queryKey: ["orangtua-immunization-records", params],
    queryFn: () => fetchOrangTuaImmunizationRecords(params),
    staleTime: 5000,
  });
}

export function useGetOrangTuaVaccines(params?: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<FetchOrangTuaVaccinesResponse, Error>({
    queryKey: ["orangtua-vaccines", params],
    queryFn: () => fetchOrangTuaVaccines(params),
    staleTime: 60000,
  });
}

export function useGetOrangTuaNutritionRecords(params?: {
  children_id?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<FetchOrangTuaNutritionRecordsResponse, Error>({
    queryKey: ["orangtua-nutrition-records", params],
    queryFn: () => fetchOrangTuaNutritionRecords(params),
    staleTime: 5000,
  });
}

export function useGetOrangTuaEducations(params?: FetchEducationsParams) {
  return useQuery<FetchEducationsResponse, Error>({
    queryKey: ["orangtua-educations", params],
    queryFn: () => fetchOrangTuaEducations(params),
    staleTime: 5000,
  });
}

export function useGetOrangTuaEducationById(id: string) {
  return useQuery<EducationResponse, Error>({
    queryKey: ["orangtua-education", id],
    queryFn: () => fetchOrangTuaEducationById(id),
    enabled: !!id,
    staleTime: 5000,
  });
}

export function useGetOrangTuaEducationCategories() {
  return useQuery<FetchEducationCategoriesResponse, Error>({
    queryKey: ["orangtua-education-categories"],
    queryFn: fetchOrangTuaEducationCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGetOrangTuaAvailableSlots(
  posyandu_id: string,
  consultation_type: string,
  date: string,
  midwife_id?: string | null,
  enabled: boolean = true
) {
  return useQuery<AvailableSlot[], Error>({
    queryKey: ["orangtua-available-slots", posyandu_id, consultation_type, date, midwife_id],
    queryFn: () => fetchOrangTuaAvailableSlots(posyandu_id, consultation_type, date, midwife_id),
    enabled: enabled && !!posyandu_id && !!consultation_type && !!date,
    staleTime: 15000, // 15 seconds
  });
}

export function useCreateOrangTuaBooking() {
  const queryClient = useQueryClient();
  return useMutation<Consultation, Error, CreateBookingPayload>({
    mutationFn: (payload: CreateBookingPayload) => createOrangTuaBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orangtua-consultations"] });
      queryClient.invalidateQueries({ queryKey: ["orangtua-available-slots"] });
    },
  });
}

export function useGetOrangTuaConsultations(params?: {
  status?: string;
  consultation_type?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<FetchOrangTuaConsultationsResponse, Error>({
    queryKey: ["orangtua-consultations", params],
    queryFn: () => fetchOrangTuaConsultations(params),
    staleTime: 5000,
  });
}

export function useGetOrangTuaPregnancyRecords(params?: {
  is_active?: boolean;
  page?: number;
  limit?: number;
}) {
  return useQuery<FetchOrangTuaPregnancyRecordsResponse, Error>({
    queryKey: ["orangtua-pregnancy-records", params],
    queryFn: () => fetchOrangTuaPregnancyRecords(params),
    staleTime: 5000,
  });
}

export function useGetOrangTuaMidwives(params?: {
  posyandu_id?: string;
  limit?: number;
  page?: number;
}) {
  return useQuery<FetchOrangTuaMidwivesResponse, Error>({
    queryKey: ["orangtua-midwives", params],
    queryFn: () => fetchOrangTuaMidwives(params),
    enabled: !!params?.posyandu_id,
    staleTime: 60000,
  });
}

export function useGetOrangTuaPosyanduById(id: string, enabled: boolean = true) {
  return useQuery<Posyandu, Error>({
    queryKey: ["orangtua-posyandu", id],
    queryFn: () => fetchOrangTuaPosyanduById(id),
    enabled: enabled && !!id,
    staleTime: 60000,
  });
}

