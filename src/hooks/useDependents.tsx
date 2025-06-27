
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { Database } from "@/integrations/supabase/types";

type Dependent = Database["public"]["Tables"]["dependents"]["Row"];
type DependentInsert = Database["public"]["Tables"]["dependents"]["Insert"];
type DependentUpdate = Database["public"]["Tables"]["dependents"]["Update"];

// Hook to fetch dependents for a consultant
export function useDependents(consultantId: string | null) {
  return useQuery({
    queryKey: ["dependents", consultantId],
    queryFn: async () => {
      if (!consultantId) return [];
      const { data, error } = await supabase
        .from("dependents")
        .select("*")
        .eq("consultant_id", consultantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!consultantId,
  });
}

// Hook to create a new dependent
export function useCreateDependent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dependent: DependentInsert) => {
      const { data, error } = await supabase
        .from("dependents")
        .insert(dependent)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dependents", variables.consultant_id] });
      toast.success("Dependent added successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to add dependent: ${error.message}`);
    },
  });
}

// Hook to update a dependent
export function useUpdateDependent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, consultant_id, ...updates }: { id: string; consultant_id: string } & DependentUpdate) => {
      const { data, error } = await supabase
        .from("dependents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dependents", variables.consultant_id] });
      toast.success("Dependent updated successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to update dependent: ${error.message}`);
    },
  });
}

// Hook to delete a dependent
export function useDeleteDependent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, consultant_id }: { id: string; consultant_id: string }) => {
      const { error } = await supabase
        .from("dependents")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dependents", variables.consultant_id] });
      toast.success("Dependent deleted successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to delete dependent: ${error.message}`);
    },
  });
}
