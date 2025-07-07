import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { processDateFields } from "./utils/dateProcessing";
import { processHouseholdMembers } from "./utils/householdMembersProcessing";
import { processLiabilities } from "./utils/liabilitiesProcessing";

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, ...values }: any) => {
      console.log("=== UPDATE CLIENT MUTATION STARTED ===");
      console.log("Client ID:", id);
      console.log("Raw values received:", Object.keys(values));
      
      if (!id) {
        const error = new Error("Client ID is required for update");
        console.error("=== UPDATE ERROR ===", error.message);
        throw error;
      }

      try {
        // Process complex fields
        const processedValues = {
          ...values,
          ...processDateFields(values),
          ...processHouseholdMembers(values),
          ...processLiabilities(values)
        };

        console.log("Processed values for MongoDB:", processedValues);

        const response = await apiCall(`/api/securia/clients/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedValues),
        });

        console.log("API Response status:", response.status);
        console.log("API Response ok:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.log("API Error response text:", errorText);
          
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = { message: errorText || 'Unknown error occurred' };
          }
          
          console.log("API Error data:", errorData);
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("=== UPDATE SUCCESS ===", result);
        return result.data;
        
      } catch (error: any) {
        console.error("=== UPDATE ERROR ===", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("=== UPDATE MUTATION SUCCESS ===");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients", variables.id] });
    },
    onError: (error: any) => {
      console.error("=== UPDATE MUTATION ERROR ===", error);
    },
  });
};
