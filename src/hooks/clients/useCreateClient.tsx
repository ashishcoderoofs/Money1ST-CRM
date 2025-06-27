
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { processDateFields } from "./utils/dateProcessing";
import { processHouseholdMembers } from "./utils/householdMembersProcessing";
import { processLiabilitiesForCreate, isValidLiability } from "./utils/liabilitiesProcessing";

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: any) => {
      console.log("Creating client with values:", values);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to create a client');
      }

      let processedValues = processDateFields(values);
      processedValues = processHouseholdMembers(processedValues);
      processedValues = processLiabilitiesForCreate(processedValues);
      
      // Add the owner_id from the authenticated user
      const clientData = {
        ...processedValues,
        owner_id: user.id
      };

      console.log("Final client data for creation:", clientData);

      const { data, error } = await supabase.from("clients").insert([clientData]).select("*").single();
      if (error) {
        console.error("Error creating client:", error);
        throw error;
      }
      
      // Handle liabilities separately after client creation
      if (values.liabilities && values.liabilities.length > 0) {
        // Filter valid liabilities using the validation function
        const validLiabilities = values.liabilities.filter(isValidLiability);
        
        if (validLiabilities.length > 0) {
          const liabilitiesWithClientId = validLiabilities.map((liability: any) => ({
            client_id: data.id,
            debtor_type: liability.debtor_type || "Applicant",
            liability_type: liability.liability_type || null,
            creditor_name: liability.creditor_name || null,
            current_balance: liability.current_balance || 0,
            monthly_payment: liability.monthly_payment || 0,
            pay_off: liability.pay_off || false,
            property_address: liability.property_address || null,
            property_value: liability.property_value || 0,
            gross_rent: liability.gross_rent || 0,
            escrow: liability.escrow || null,
            taxes: liability.taxes || 0,
            hoi: liability.hoi || 0,
          }));
          
          const { error: liabilityError } = await supabase
            .from("client_liabilities")
            .insert(liabilitiesWithClientId);
            
          if (liabilityError) {
            console.error("Error inserting liabilities:", liabilityError);
            // Don't throw here as the client was created successfully
          }
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
