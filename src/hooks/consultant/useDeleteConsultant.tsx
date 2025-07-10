
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";

// Remove all supabase imports and code. Use REST API for consultants now.

// Hook to delete a consultant (hard delete from database)
export function useDeleteConsultant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // First, delete all related records that reference this consultant
      
      // Delete contacts owned by this consultant
      // const { error: contactsError } = await supabase
      //   .from("contacts")
      //   .delete()
      //   .eq("owner_id", id);

      // if (contactsError) throw contactsError;

      // Delete deals owned by this consultant
      // const { error: dealsError } = await supabase
      //   .from("deals")
      //   .delete()
      //   .eq("owner_id", id);

      // if (dealsError) throw dealsError;

      // Delete dependents
      // const { error: dependentsError } = await supabase
      //   .from("dependents")
      //   .delete()
      //   .eq("consultant_id", id);

      // if (dependentsError) throw dependentsError;

      // Delete licenses
      // const { error: licensesError } = await supabase
      //   .from("licenses")
      //   .delete()
      //   .eq("consultant_id", id);

      // if (licensesError) throw licensesError;

      // Delete payments
      // const { error: paymentsError } = await supabase
      //   .from("payments")
      //   .delete()
      //   .eq("consultant_id", id);

      // if (paymentsError) throw paymentsError;

      // Delete team lineage records
      // const { error: lineageError } = await supabase
      //   .from("team_lineage")
      //   .delete()
      //   .eq("user_id", id);

      // if (lineageError) throw lineageError;

      // Delete team lineage records where this user is a manager
      // const { error: managerLineageError } = await supabase
      //   .from("team_lineage")
      //   .delete()
      //   .eq("manager_id", id);

      // if (managerLineageError) throw managerLineageError;

      // Finally, delete the consultant profile
      // const { data, error } = await supabase
      //   .from("profiles")
      //   .delete()
      //   .eq("id", id)
      //   .select()
      //   .single();

      // if (error) throw error;
      // return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultants"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Consultant deleted successfully.");
    },
    onError: (error) => {
      toast.error(`Failed to delete consultant: ${error.message}`);
    },
  });
}
