import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile, UpdateUserPayload } from "@/service/auth/authService";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orangtua-current-user"] });
    },
  });
};
