import { useMutation } from "@tanstack/react-query";
import { uploadMedia } from "@/service/media/mediaService";

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: (files: File[]) => uploadMedia(files),
  });
};
