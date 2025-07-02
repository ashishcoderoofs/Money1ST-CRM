import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { processDateFields } from "./utils/dateProcessing";
import { processHouseholdMembers } from "./utils/householdMembersProcessing";
import { processLiabilitiesForCreate, isValidLiability } from "./utils/liabilitiesProcessing";

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();
  
  return useMutation({
    mutationFn: async (values: any) => {
      console.log("Creating client with values:", values);
      
      let processedValues = processDateFields(values);
      processedValues = processHouseholdMembers(processedValues);
      processedValues = processLiabilitiesForCreate(processedValues);
      
      console.log("Final client data for creation:", processedValues);

      const response = await apiCall('/api/securia/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedValues),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create client');
      }

      const result = await response.json();
      console.log("Client created successfully:", result);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
