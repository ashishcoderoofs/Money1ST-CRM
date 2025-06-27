
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLiabilitiesQuery(clientId?: string) {
  return useQuery({
    queryKey: ["liabilities", clientId],
    queryFn: async () => {
      console.log("[useLiabilitiesQuery] Fetching liabilities for client:", clientId);
      
      if (!clientId) {
        console.log("[useLiabilitiesQuery] No clientId provided, returning empty array");
        return [];
      }
      
      const { data, error } = await supabase
        .from("client_liabilities")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("[useLiabilitiesQuery] Error fetching liabilities:", error);
        throw error;
      }
      
      console.log("[useLiabilitiesQuery] Fetched liabilities:", data);
      return data || [];
    },
    enabled: !!clientId,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always fetch fresh data
  });
}
