import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useApi = (queryKey, apiFunction, options = {}) => {
  return useQuery({
    queryKey,
    queryFn: apiFunction,
    ...options,
  });
};

export const useSubmit = (mutationFn, queryKeyToInvalidate, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      }
    },
    ...options,
  });
};
