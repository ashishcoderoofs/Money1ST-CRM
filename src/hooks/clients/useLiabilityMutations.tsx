
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LiabilityData {
  client_id: string;
  debtor_type: string;
  liability_type?: string;
  creditor_name?: string;
  current_balance?: number;
  monthly_payment?: number;
  pay_off?: boolean;
  property_address?: string;
  property_value?: number;
  gross_rent?: number;
  escrow?: string;
  taxes?: number;
  hoi?: number;
}

export function useCreateLiability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LiabilityData) => {
      const { data: result, error } = await supabase
        .from("client_liabilities")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["liabilities", variables.client_id] });
      toast.success("Liability added successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to add liability: " + error.message);
    },
  });
}

export function useUpdateLiability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LiabilityData> }) => {
      const { data: result, error } = await supabase
        .from("client_liabilities")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["liabilities", result.client_id] });
      toast.success("Liability updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update liability: " + error.message);
    },
  });
}

export function useDeleteLiability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: string; clientId: string }) => {
      const { error } = await supabase
        .from("client_liabilities")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, clientId };
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: ["liabilities", variables.clientId] });
      toast.success("Liability deleted successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to delete liability: " + error.message);
    },
  });
}
