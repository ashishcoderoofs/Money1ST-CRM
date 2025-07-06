/**
 * Client Creation Hook
 * 
 * Handles client record creation with advanced features:
 * - Dual client/consultant creation when applicant is a consultant
 * - Data processing and validation before submission
 * - Optimistic UI updates and cache invalidation
 * - Comprehensive error handling and logging
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { processDateFields } from "./utils/dateProcessing";
import { processHouseholdMembers } from "./utils/householdMembersProcessing";
import { processLiabilitiesForCreate } from "./utils/liabilitiesProcessing";
import type { ConsultantData } from "@/hooks/useConsultantAPI";

// ================================
// DATA MAPPING UTILITIES
// ================================

/**
 * Maps client form data to consultant data structure
 * Used when creating both client and consultant records (dual creation)
 */
const mapClientToConsultantData = (clientData: any): ConsultantData => {
  return {
    // Basic Information
    title: clientData.applicant_title || '',
    firstName: clientData.applicant_first_name || '',
    middleInitial: clientData.applicant_middle_initial || '',
    lastName: clientData.applicant_last_name || '',
    suffix: clientData.applicant_suffix || '',
    status: 'Active',
    position: clientData.occupation || clientData.applicant_occupation || '',
    entryDate: new Date().toISOString(),

    // Contact Information
    email: clientData.applicant_email || clientData.email || '',
    address: clientData.applicant_address || '',
    city: clientData.applicant_city || '',
    county: clientData.applicant_county || '',
    state: clientData.applicant_state || '',
    zipCode: clientData.applicant_zip_code || '',
    homePhone: clientData.applicant_home_phone || '',
    mobile: clientData.applicant_mobile_phone || clientData.applicant_cell_phone || '',
    workPhone: clientData.applicant_work_phone || '',

    // Personal Information
    dateOfBirth: clientData.applicant_date_of_birth || clientData.applicant_dob || '',
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
    employer: clientData.applicant_employer || clientData.applicant_employer_name || '',
    occupation: clientData.occupation || clientData.applicant_occupation || '',
    ssn: clientData.applicant_ssn || '',

    // Emergency Contact
    emergencyContactName: clientData.applicant_emergency_contact_name || '',
    emergencyContactRelationship: clientData.applicant_emergency_contact_relationship || '',
    emergencyContactPhone: clientData.applicant_emergency_contact_phone || '',
  };
};

// ================================
// API INTERACTION FUNCTIONS
// ================================

/**
 * Creates a consultant record from client data
 * Used in dual client/consultant creation scenarios
 */
async function createConsultantRecord(apiCall: any, consultantData: ConsultantData): Promise<void> {
  console.log('Creating consultant record:', consultantData);
  
  const response = await apiCall('/api/consultants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(consultantData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Consultant creation failed:', errorData);
    throw new Error(errorData.message || `Failed to create consultant: ${response.status}`);
  }

  const result = await response.json();
  console.log('Consultant created successfully:', result);
  return result;
}

// ================================
// MAIN HOOK
// ================================

/**
 * Hook for creating client records with optional consultant creation
 * 
 * Features:
 * - Processes and validates form data before submission
 * - Creates consultant record when applicant_is_consultant is true
 * - Handles cache invalidation for affected queries
 * - Provides detailed logging for debugging
 * 
 * @returns Mutation object with mutate function and state
 */
export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();
  
  return useMutation({
    mutationFn: async (values: any) => {
      console.log("🚀 CREATE CLIENT MUTATION STARTED");
      console.log("Raw form values received:", values);
      
      // Process form data
      let processedValues = processDateFields(values);
      processedValues = processHouseholdMembers(processedValues);
      processedValues = processLiabilitiesForCreate(processedValues);
      
      console.log("Final client data for creation:", JSON.stringify(processedValues, null, 2));

      try {
        // Create the client first
        console.log("Making API call to /api/securia/clients");
        const clientResponse = await apiCall('/api/securia/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedValues),
        });

        if (!clientResponse.ok) {
          const errorData = await clientResponse.json().catch(() => ({}));
          console.error("Client creation failed:", errorData);
          throw new Error(errorData.message || 'Failed to create client');
        }

        const clientResult = await clientResponse.json();
        console.log("✅ Client created successfully:", clientResult);

        // Create consultant record if requested
        if (processedValues.applicant_is_consultant) {
          console.log("🧑‍💼 Creating consultant record for client...");
          
          try {
            const consultantData = mapClientToConsultantData(processedValues);
            console.log("Consultant data mapped:", consultantData);

            const consultantResult = await createConsultantRecord(apiCall, consultantData);
            console.log("✅ Consultant created successfully:", consultantResult);
          } catch (consultantError) {
            console.warn("Failed to create consultant record:", consultantError);
            // Don't throw error here - client creation succeeded
            // Could show a warning toast to user instead
          }
        }

        return clientResult.data;
      } catch (error) {
        console.error("🔥 CREATE CLIENT ERROR:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("✅ Mutation onSuccess called with:", data);
      
      // Invalidate relevant queries
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
