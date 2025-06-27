
import { Client } from "./types";
import { getBasicFormDefaults } from "./defaults/basicFormDefaults";
import { getApplicantFormDefaults } from "./defaults/applicantFormDefaults";
import { getCoApplicantFormDefaults } from "./defaults/coApplicantFormDefaults";
import { getSampleFormData } from "./defaults/sampleFormData";

export function getClientFormDefaults(existingClient?: Client) {
  if (existingClient) {
    return {
      ...getBasicFormDefaults(existingClient),
      ...getApplicantFormDefaults(existingClient),
      ...getCoApplicantFormDefaults(existingClient),
      household_members: existingClient.household_members_json 
        ? JSON.parse(existingClient.household_members_json as string) 
        : [],
      coapplicant_household_members: existingClient.coapplicant_household_members_json 
        ? JSON.parse(existingClient.coapplicant_household_members_json as string) 
        : [],
      liabilities: [],
      underwriting_address: existingClient.underwriting_address || "",
      underwriting_city: existingClient.underwriting_city || "",
      underwriting_state: existingClient.underwriting_state || "",
      underwriting_client_id: existingClient.underwriting_client_id || "",
      underwriting_credit_scores: existingClient.underwriting_credit_scores || "",
      underwriting_cnh_option: existingClient.underwriting_cnh_option || "",
      underwriting_tud_option: existingClient.underwriting_tud_option || "",
      underwriting_terms: existingClient.underwriting_terms || "",
      underwriting_programs: existingClient.underwriting_programs || "",
      underwriting_notes: existingClient.underwriting_notes || "",
    };
  }

  // Return pre-filled data for new clients
  return getSampleFormData();
}
