import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export const useClientsQuery = () => {
  const { apiCall } = useAuth();

  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await apiCall('/api/securia/clients');
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const result = await response.json();
      return result.data || [];
    }
  });
};
