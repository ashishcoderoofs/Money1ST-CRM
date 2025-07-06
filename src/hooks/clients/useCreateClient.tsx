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
      console.log("🚀 CREATE CLIENT MUTATION STARTED");
      console.log("Raw form values received:", values);
      
      let processedValues = processDateFields(values);
      console.log("After date processing:", processedValues);
      
      processedValues = processHouseholdMembers(processedValues);
      console.log("After household members processing:", processedValues);
      
      processedValues = processLiabilitiesForCreate(processedValues);
      console.log("After liabilities processing:", processedValues);
      
      console.log("Final client data for creation:", JSON.stringify(processedValues, null, 2));

      try {
        console.log("Making API call to /api/securia/clients");
        const response = await apiCall('/api/securia/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedValues),
        });

        console.log("API Response received:", response);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("API Error Response:", errorData);
          throw new Error(errorData.message || 'Failed to create client');
        }

        const result = await response.json();
        console.log("Client created successfully:", result);
        return result.data;
      } catch (error) {
        console.error("🔥 CREATE CLIENT ERROR:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("✅ Mutation onSuccess called with:", data);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      console.error("❌ Mutation onError called with:", error);
    },
  });
};
