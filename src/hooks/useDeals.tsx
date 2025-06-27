
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { Database } from "@/integrations/supabase/types";

type DealStage = Database["public"]["Enums"]["deal_stage"];

export function useDeals() {
  return useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deals")
        .select(`
          *,
          contact:contacts(first_name, last_name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (deal: {
      title: string;
      amount?: number;
      expected_close_date?: string;
      contact_id?: string;
      stage?: DealStage;
      probability?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("deals")
        .insert({
          ...deal,
          owner_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Deal created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create deal: ${error.message}`);
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<{
      title: string;
      amount: number;
      expected_close_date: string;
      contact_id: string;
      stage: DealStage;
      probability: number;
    }>) => {
      const { data, error } = await supabase
        .from("deals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Deal updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update deal: ${error.message}`);
    },
  });
}
