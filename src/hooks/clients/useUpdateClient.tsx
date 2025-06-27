
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { processDateFields } from "./utils/dateProcessing";
import { processHouseholdMembers } from "./utils/householdMembersProcessing";
import { processLiabilities } from "./utils/liabilitiesProcessing";

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...values }: any) => {
      console.log("=== UPDATE CLIENT MUTATION STARTED ===");
      console.log("Client ID:", id);
      console.log("Raw values received:", Object.keys(values));
      
      // Check authentication status first
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      console.log("Auth session check:", {
        hasSession: !!session,
        userId: session?.user?.id,
        authError: authError?.message
      });
      
      if (!session) {
        console.error("=== NO ACTIVE SESSION ===");
        throw new Error("Authentication required - please log in again");
      }
      
      if (!id) {
        const error = new Error("Client ID is required for update");
        console.error("=== VALIDATION ERROR ===", error.message);
        throw error;
      }
      
      try {
        // Process data through pipeline
        console.log("=== STARTING DATA PROCESSING PIPELINE ===");
        
        let processedValues = { ...values };
        console.log("Initial processed values keys:", Object.keys(processedValues));
        
        // Step 1: Process date fields
        console.log("Step 1: Processing date fields...");
        processedValues = processDateFields(processedValues);
        
        // Step 2: Process household members
        console.log("Step 2: Processing household members...");
        processedValues = processHouseholdMembers(processedValues);
        
        // Step 3: Process liabilities
        console.log("Step 3: Processing liabilities...");
        processedValues = await processLiabilities({ ...processedValues, id });
        
        // Final validation before database update
        console.log("=== FINAL VALIDATION BEFORE DATABASE UPDATE ===");
        
        if (!processedValues.applicant) {
          const error = new Error("Applicant name is required and cannot be empty");
          console.error("=== APPLICANT VALIDATION ERROR ===", error.message);
          throw error;
        }
        
        // Execute database update with detailed logging
        console.log("=== EXECUTING DATABASE UPDATE ===");
        console.log("Updating client ID:", id);
        console.log("Final update payload keys:", Object.keys(processedValues));
        
        // Check if client exists first
        const { data: existingClient, error: fetchError } = await supabase
          .from("clients")
          .select("id, owner_id")
          .eq("id", id)
          .single();
          
        if (fetchError) {
          console.error("=== CLIENT FETCH ERROR ===", fetchError);
          throw new Error(`Client not found: ${fetchError.message}`);
        }
        
        console.log("Existing client check:", {
          clientExists: !!existingClient,
          ownerId: existingClient?.owner_id,
          currentUserId: session.user.id
        });
        
        const { data, error } = await supabase
          .from("clients")
          .update(processedValues)
          .eq("id", id)
          .select("*")
          .single();
          
        if (error) {
          console.error("=== SUPABASE DATABASE ERROR ===");
          console.error("Error details:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          
          // Create user-friendly error message based on error code
          let userMessage = "Database update failed";
          if (error.code === '23505') {
            userMessage = "Duplicate entry error - this data already exists";
          } else if (error.code === '23502') {
            userMessage = "Required field is missing";
          } else if (error.code === '42501') {
            userMessage = "Access denied - you don't have permission to update this client";
          } else if (error.code === '42P01') {
            userMessage = "Database table not found";
          } else if (error.message) {
            userMessage = `Database error: ${error.message}`;
          }
          
          throw new Error(userMessage);
        }
        
        if (!data) {
          const error = new Error("Update succeeded but no data returned - client may have been deleted");
          console.error("=== NO DATA RETURNED ERROR ===", error.message);
          throw error;
        }
        
        console.log("=== DATABASE UPDATE SUCCESSFUL ===");
        console.log("Updated client:", {
          id: data.id,
          client_number: data.client_number,
          applicant: data.applicant,
          updated_at: data.updated_at
        });
        
        return data;
        
      } catch (error: any) {
        console.error("=== UPDATE CLIENT MUTATION FATAL ERROR ===");
        console.error("Error details:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        });
        
        // Re-throw with enhanced context
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("=== MUTATION SUCCESS CALLBACK TRIGGERED ===");
      console.log("Successful update for client:", data?.id);
      
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["liabilities"] });
      queryClient.invalidateQueries({ queryKey: ["client", data?.id] });
      
      console.log("All related queries invalidated for UI refresh");
    },
    onError: (error: any) => {
      console.error("=== MUTATION ERROR CALLBACK TRIGGERED ===");
      console.error("Mutation onError details:", {
        error: error,
        message: error?.message,
        name: error?.name,
        stack: error?.stack
      });
    }
  });
};
