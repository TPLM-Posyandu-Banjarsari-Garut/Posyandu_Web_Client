"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMidwifeConsultations,
  updateConsultationStatus,
  broadcastConsultationNotification,
  createMidwifeConsultation,
  fetchMidwifeAvailableSlots,
  FetchMidwifeConsultationsParams,
  FetchMidwifeConsultationsResponse,
} from "@/service/midwife/midwifeService";
import { Consultation, CreateBookingPayload, AvailableSlot } from "@/interfaces/consultation";

export function useGetMidwifeConsultations(
  params?: FetchMidwifeConsultationsParams,
  enabled: boolean = true
) {
  return useQuery<FetchMidwifeConsultationsResponse, Error>({
    queryKey: ["midwife-consultations", params],
    queryFn: () => fetchMidwifeConsultations(params),
    enabled: enabled,
    staleTime: 5000, // 5 seconds
  });
}

export function useUpdateConsultationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation<
    Consultation,
    Error,
    { publicId: string; status: string; cancellation_reason?: string }
  >({
    mutationFn: ({ publicId, status, cancellation_reason }) =>
      updateConsultationStatus(publicId, { status, cancellation_reason }),
    onSuccess: () => {
      // Invalidate both midwife and orangtua consultations queries
      queryClient.invalidateQueries({ queryKey: ["midwife-consultations"] });
      queryClient.invalidateQueries({ queryKey: ["orangtua-consultations"] });
      queryClient.invalidateQueries({ queryKey: ["orangtua-available-slots"] });
      queryClient.invalidateQueries({ queryKey: ["midwife-available-slots"] });
    },
  });
}

export function useBroadcastConsultationNotification() {
  return useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: {
      publicId: string;
      payload?: { custom_message?: string };
    }) => broadcastConsultationNotification(publicId, payload),
  });
}

export function useCreateMidwifeConsultation() {
  const queryClient = useQueryClient();

  return useMutation<Consultation, Error, CreateBookingPayload>({
    mutationFn: (payload: CreateBookingPayload) => createMidwifeConsultation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["midwife-consultations"] });
      queryClient.invalidateQueries({ queryKey: ["orangtua-consultations"] });
      queryClient.invalidateQueries({ queryKey: ["orangtua-available-slots"] });
      queryClient.invalidateQueries({ queryKey: ["midwife-available-slots"] });
    },
  });
}

export function useGetMidwifeAvailableSlots(
  posyandu_id: string,
  consultation_type: string,
  date: string,
  midwife_id?: string | null,
  enabled: boolean = true
) {
  return useQuery<AvailableSlot[], Error>({
    queryKey: ["midwife-available-slots", posyandu_id, consultation_type, date, midwife_id],
    queryFn: () => fetchMidwifeAvailableSlots(posyandu_id, consultation_type, date, midwife_id),
    enabled: enabled && !!posyandu_id && !!consultation_type && !!date,
    staleTime: 15000,
  });
}
