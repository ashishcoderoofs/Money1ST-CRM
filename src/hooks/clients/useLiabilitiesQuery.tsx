import { useQuery } from "@tanstack/react-query";
import { useClientByIdQuery } from "./useClientByIdQuery";

export function useLiabilitiesQuery(clientId?: string) {
  const { data: client } = useClientByIdQuery(clientId);
  
  return useQuery({
    queryKey: ["liabilities", clientId],
    queryFn: async () => {
      console.log("[useLiabilitiesQuery] Extracting liabilities from client data");
      
      if (!client || !client.liabilities) {
        console.log("[useLiabilitiesQuery] No liabilities found in client data, returning empty array");
        return [];
      }
      
      console.log("[useLiabilitiesQuery] Found liabilities:", client.liabilities);
      return client.liabilities || [];
    },
    enabled: !!clientId && !!client,
  });
}
