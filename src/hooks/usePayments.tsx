
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { Database } from "@/integrations/supabase/types";

type Payment = Database["public"]["Tables"]["payments"]["Row"];
type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];

// Hook to fetch payments for a consultant
export function usePayments(consultantId: string | null) {
  return useQuery({
    queryKey: ["payments", consultantId],
    queryFn: async () => {
      if (!consultantId) return [];
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("consultant_id", consultantId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!consultantId,
  });
}

// Hook to create a new payment
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payment: PaymentInsert) => {
      const { data, error } = await supabase
        .from("payments")
        .insert(payment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", variables.consultant_id] });
      toast.success("Payment added successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to add payment: ${error.message}`);
    },
  });
}

// Hook to update a payment
export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, consultant_id, ...updates }: { id: string; consultant_id: string } & PaymentUpdate) => {
      const { data, error } = await supabase
        .from("payments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", variables.consultant_id] });
      toast.success("Payment updated successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to update payment: ${error.message}`);
    },
  });
}

// Hook to delete a payment
export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, consultant_id }: { id: string; consultant_id: string }) => {
      const { error } = await supabase
        .from("payments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", variables.consultant_id] });
      toast.success("Payment deleted successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to delete payment: ${error.message}`);
    },
  });
}
