import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, ChangePasswordPayload } from "@/service/auth/authService";

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      // Optional: Invalidate anything if needed
    },
  });
};
