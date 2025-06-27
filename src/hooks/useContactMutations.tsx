
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  tags?: string[];
  notes?: string;
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contactData: ContactFormData) => {
      console.log("Creating contact with data:", contactData);
      
      const { data, error } = await supabase
        .from("contacts")
        .insert({
          ...contactData,
          owner_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Create contact error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Success",
        description: "Contact created successfully",
      });
    },
    onError: (error: any) => {
      console.error("Create contact error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create contact",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      ...contactData 
    }: ContactFormData & { id: string }) => {
      console.log("Updating contact:", id, contactData);
      
      const { data, error } = await supabase
        .from("contacts")
        .update(contactData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Update contact error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Success",
        description: "Contact updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Update contact error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update contact",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contactId: string) => {
      console.log("Deleting contact:", contactId);
      
      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", contactId);

      if (error) {
        console.error("Delete contact error:", error);
        throw error;
      }

      return contactId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error("Delete contact error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact",
        variant: "destructive",
      });
    },
  });
}
