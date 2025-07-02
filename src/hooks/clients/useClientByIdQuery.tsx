import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { mapMongoClientToFlatStructure } from "@/utils/clientDataMapper";

export const useClientByIdQuery = (clientId: string | undefined) => {
  const { apiCall } = useAuth();

  return useQuery({
    queryKey: ["clients", clientId],
    queryFn: async () => {
      if (!clientId) return null;

      // Log start time
      const t0 = performance.now();
      const response = await apiCall(`/api/securia/clients/${clientId}`);
      const t1 = performance.now();
      console.log(`[useClientByIdQuery] Fetch took ${(t1 - t0).toFixed(2)}ms`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Client not found');
        }
        throw new Error('Failed to fetch client');
      }
      
      const result = await response.json();
      const mongoClient = result.data;
      
      // Map MongoDB structure to flat structure expected by components
      const mappedClient = mapMongoClientToFlatStructure(mongoClient);
      console.log('[useClientByIdQuery] Mapped client data:', mappedClient);
      
      return mappedClient;
    },
    enabled: !!clientId,
  });
};
