export interface Education {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  image_url: string | null;
  category_id: string;
  views_count: number;
  read_time: number | null;
  posyandu_id: string | null;
  created_by_user_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface FetchEducationsParams {
  search?: string;
  category_id?: string;
  posyandu_id?: string;
  status?: "active" | "inactive";
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
}

export interface EducationPaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface FetchEducationsResponse {
  success: boolean;
  message: string;
  data: {
    data: Education[];
    totalItems: number;
  };
}

export interface CreateEducationPayload {
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  category_id: string;
  posyandu_id?: string;
  status?: "active" | "inactive";
}

export interface EducationResponse {
  success: boolean;
  message: string;
  data: Education;
}

export interface EducationCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface FetchEducationCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    data: EducationCategory[];
    totalItems: number;
  };
}

export interface CreateEducationCategoryPayload {
  name: string;
  slug: string;
  description?: string;
}

export interface EducationCategoryResponse {
  success: boolean;
  message: string;
  data: EducationCategory;
}

