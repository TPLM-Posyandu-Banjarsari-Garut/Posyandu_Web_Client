"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrangTuaChildren,
  fetchOrangTuaChildById,
  createOrangTuaChild,
  fetchOrangTuaPosyandus,
  fetchOrangTuaImmunizationRecords,
  fetchOrangTuaVaccines,
  fetchOrangTuaNutritionRecords,
  FetchOrangTuaChildrenResponse,
  FetchPosyandusResponse,
  FetchOrangTuaImmunizationRecordsResponse,
  FetchOrangTuaVaccinesResponse,
  FetchOrangTuaNutritionRecordsResponse,
} from "@/service/orangtua/orangTuaChildService";
import { Child, CreateChildPayload } from "@/interfaces/child";

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
