
import { Tables } from "@/integrations/supabase/types";

export const createUnderwritingData = (): Partial<Tables<"clients">> => ({
  underwriting_address: null,
  underwriting_city: null,
  underwriting_state: null,
  underwriting_client_id: null,
  underwriting_credit_scores: null,
  underwriting_cnh_option: null,
  underwriting_tud_option: null,
  underwriting_terms: null,
  underwriting_programs: null,
  underwriting_notes: null,
  household_members_json: null,
  coapplicant_household_members_json: null,
});
