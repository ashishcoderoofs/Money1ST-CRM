
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contact: {
      first_name: string;
      last_name: string;
      email?: string;
      phone?: string;
      address?: string;
      notes?: string;
      tags?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("contacts")
        .insert({
          ...contact,
          owner_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create contact: ${error.message}`);
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<{
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
      notes: string;
      tags: string[];
    }>) => {
      const { data, error } = await supabase
        .from("contacts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
  });
}
