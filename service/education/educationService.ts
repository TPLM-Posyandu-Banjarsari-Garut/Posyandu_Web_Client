import { bidanApi } from "../auth/bidanAuthService";
import {
  Education,
  CreateEducationPayload,
  FetchEducationsParams,
  FetchEducationsResponse,
  EducationResponse,
  FetchEducationCategoriesResponse,
  CreateEducationCategoryPayload,
  EducationCategoryResponse,
} from "@/interfaces/education";

export async function fetchEducations(
  params?: FetchEducationsParams
): Promise<FetchEducationsResponse> {
  const { data } = await bidanApi.get<FetchEducationsResponse>("/api/educations", {
    params: {
      ...params,
      limit: params?.limit || 10,
      page: params?.page || 1,
    },
  });
  return data;
}

export async function fetchEducationById(
  id: string
): Promise<EducationResponse> {
  const { data } = await bidanApi.get<EducationResponse>(`/api/educations/${id}`);
  return data;
}

export async function createEducation(
  payload: CreateEducationPayload
): Promise<EducationResponse> {
  const { data } = await bidanApi.post<EducationResponse>("/api/educations", payload);
  return data;
}

export async function updateEducation(
  id: string,
  payload: Partial<CreateEducationPayload>
): Promise<EducationResponse> {
  const { data } = await bidanApi.put<EducationResponse>(`/api/educations/${id}`, payload);
  return data;
}

export async function deleteEducation(
  id: string
): Promise<EducationResponse> {
  const { data } = await bidanApi.delete<EducationResponse>(`/api/educations/${id}`);
  return data;
}

export async function fetchEducationCategories(): Promise<FetchEducationCategoriesResponse> {
  const { data } = await bidanApi.get<FetchEducationCategoriesResponse>("/api/education-categories", {
    params: {
      limit: 100, // Fetch all categories
    }
  });
  return data;
}

export async function createEducationCategory(
  payload: CreateEducationCategoryPayload
): Promise<EducationCategoryResponse> {
  const { data } = await bidanApi.post<EducationCategoryResponse>("/api/education-categories", payload);
  return data;
}

export async function updateEducationCategory(
  id: string,
  payload: Partial<CreateEducationCategoryPayload>
): Promise<EducationCategoryResponse> {
  const { data } = await bidanApi.put<EducationCategoryResponse>(`/api/education-categories/${id}`, payload);
  return data;
}

export async function deleteEducationCategory(
  id: string
): Promise<EducationCategoryResponse> {
  const { data } = await bidanApi.delete<EducationCategoryResponse>(`/api/education-categories/${id}`);
  return data;
}


