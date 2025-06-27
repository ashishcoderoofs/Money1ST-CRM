
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { Database } from "@/integrations/supabase/types";

type License = Database["public"]["Tables"]["licenses"]["Row"];
type LicenseInsert = Database["public"]["Tables"]["licenses"]["Insert"];
type LicenseUpdate = Database["public"]["Tables"]["licenses"]["Update"];

// Hook to fetch licenses for a consultant
export function useLicenses(consultantId: string | null) {
  return useQuery({
    queryKey: ["licenses", consultantId],
    queryFn: async () => {
      if (!consultantId) return [];
      const { data, error } = await supabase
        .from("licenses")
        .select("*")
        .eq("consultant_id", consultantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!consultantId,
  });
}

// Hook to create a new license
export function useCreateLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (license: LicenseInsert) => {
      const { data, error } = await supabase
        .from("licenses")
        .insert(license)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["licenses", variables.consultant_id] });
      toast.success("License added successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to add license: ${error.message}`);
    },
  });
}

// Hook to update a license
export function useUpdateLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, consultant_id, ...updates }: { id: string; consultant_id: string } & LicenseUpdate) => {
      const { data, error } = await supabase
        .from("licenses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["licenses", variables.consultant_id] });
      toast.success("License updated successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to update license: ${error.message}`);
    },
  });
}

// Hook to delete a license
export function useDeleteLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, consultant_id }: { id: string; consultant_id: string }) => {
      const { error } = await supabase
        .from("licenses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["licenses", variables.consultant_id] });
      toast.success("License deleted successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to delete license: ${error.message}`);
    },
  });
}
