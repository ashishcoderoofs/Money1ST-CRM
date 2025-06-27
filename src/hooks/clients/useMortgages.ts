
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MortgageFormValues, Mortgage } from "./mortgageTypes";

export function useMortgagesByClient(clientId: string) {
  return useQuery({
    queryKey: ["mortgages", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mortgages")
        .select("*")
        .eq("client_id", clientId)
        .order("mortgage_id", { ascending: true });
      if (error) throw error;
      return data as Mortgage[];
    },
    enabled: !!clientId,
  });
}

export function useCreateMortgage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: MortgageFormValues) => {
      const { data, error } = await supabase
        .from("mortgages")
        .insert([input])
        .select()
        .single();
      if (error) throw error;
      return data as Mortgage;
    },
    onSuccess: (_data, _vars, ctx) => {
      qc.invalidateQueries({ queryKey: ["mortgages"] });
    },
  });
}

export function useUpdateMortgage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: MortgageFormValues) => {
      if (!input.id) throw new Error("ID required");
      const { id, ...update } = input;
      const { data, error } = await supabase
        .from("mortgages")
        .update(update)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Mortgage;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mortgages"] });
    },
  });
}

export function useDeleteMortgage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from("mortgages").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mortgages"] });
    },
  });
}
