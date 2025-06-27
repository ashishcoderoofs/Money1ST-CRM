
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useClientByIdQuery = (clientId: string | undefined) => {
  return useQuery({
    queryKey: ["clients", clientId],
    queryFn: async () => {
      if (!clientId) return null;

      // Log start time
      const t0 = performance.now();
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .maybeSingle();
      const t1 = performance.now();
      console.log(`[useClientByIdQuery] Fetch took ${(t1 - t0).toFixed(2)}ms`);

      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });
};
