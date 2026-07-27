import { api } from "../auth/authService";

export interface UploadMediaResponse {
  status: string;
  message: string;
  data: {
    url: string;
    [key: string]: unknown;
  }[];
}

export async function uploadMedia(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await api.post<UploadMediaResponse>("/api/medias/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data.map((item) => item.url);
}
