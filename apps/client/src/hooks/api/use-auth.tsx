import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { CustomError } from "@/types/custom-error.type";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes - prevent unnecessary refetches
    retry: (failureCount, error: CustomError) => {
      // Don't retry on 401/403 errors (authentication issues)
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Don't refetch if data exists and is not stale
  });
  return query;
};

export default useAuth;
