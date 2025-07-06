import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { processDateFields } from "./utils/dateProcessing";
import { processHouseholdMembers } from "./utils/householdMembersProcessing";
import { processLiabilitiesForCreate, isValidLiability } from "./utils/liabilitiesProcessing";
import { useCreateConsultant } from "@/hooks/useConsultantAPI";
import type { ConsultantData } from "@/hooks/useConsultantAPI";

// Function to map client data to consultant data
const mapClientToConsultantData = (clientData: any): ConsultantData => {
  return {
    // Basic Information
    title: clientData.applicant_title || '',
    firstName: clientData.applicant_first_name || '',
    middleInitial: clientData.applicant_middle_initial || '',
    lastName: clientData.applicant_last_name || '',
    suffix: clientData.applicant_suffix || '',
    status: 'Active',
    position: clientData.occupation || '',
    entryDate: new Date().toISOString(),

    // Contact Information
    email: clientData.applicant_email || clientData.email || '',
    address: clientData.applicant_address || '',
    city: clientData.applicant_city || '',
    county: clientData.applicant_county || '',
    state: clientData.applicant_state || '',
    zipCode: clientData.applicant_zip_code || '',
    homePhone: clientData.applicant_home_phone || '',
    mobile: clientData.applicant_mobile_phone || '',
    workPhone: clientData.applicant_work_phone || '',

    // Personal Information
    dateOfBirth: clientData.applicant_date_of_birth || '',
    maritalStatus: clientData.applicant_marital_status || '',
    sex: clientData.applicant_sex || '',
    race: clientData.applicant_race || '',
    spouseName: clientData.applicant_spouse_name || '',
    anniversary: clientData.applicant_anniversary || '',
    spouseOccupation: clientData.applicant_spouse_occupation || '',
    educationLevel: clientData.applicant_education_level || '',
    driversLicenseNumber: clientData.applicant_drivers_license_number || '',
    driversLicenseState: clientData.applicant_drivers_license_state || '',
    employmentStatus: clientData.applicant_employment_status || '',
    employer: clientData.applicant_employer || '',
    occupation: clientData.occupation || '',
    ssn: clientData.applicant_ssn || '',

    // Emergency Contact
    emergencyContactName: clientData.applicant_emergency_contact_name || '',
    emergencyContactRelationship: clientData.applicant_emergency_contact_relationship || '',
    emergencyContactPhone: clientData.applicant_emergency_contact_phone || '',
  };
};

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
        // Create the client first
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

        // If applicant is also a consultant, create consultant record
        if (processedValues.applicant_is_consultant) {
          console.log("🧑‍💼 Creating consultant record for client...");
          
          try {
            const consultantData = mapClientToConsultantData(processedValues);
            console.log("Consultant data mapped:", consultantData);

            const consultantResponse = await apiCall('/api/consultants', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(consultantData),
            });

            if (!consultantResponse.ok) {
              const consultantErrorData = await consultantResponse.json().catch(() => ({}));
              console.warn("Failed to create consultant record:", consultantErrorData);
              // Don't throw error here - client creation succeeded
            } else {
              const consultantResult = await consultantResponse.json();
              console.log("✅ Consultant created successfully:", consultantResult);
            }
          } catch (consultantError) {
            console.warn("Error creating consultant record:", consultantError);
            // Don't throw error here - client creation succeeded
          }
        }

        return result.data;
      } catch (error) {
        console.error("🔥 CREATE CLIENT ERROR:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("✅ Mutation onSuccess called with:", data);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      
      // If a consultant was also created, invalidate consultant queries
      if (variables.applicant_is_consultant) {
        queryClient.invalidateQueries({ queryKey: ["consultants"] });
        queryClient.invalidateQueries({ queryKey: ["consultant-stats"] });
        console.log("♻️ Invalidated consultant queries due to dual creation");
      }
    },
    onError: (error) => {
      console.error("❌ Mutation onError called with:", error);
    },
  });
};
