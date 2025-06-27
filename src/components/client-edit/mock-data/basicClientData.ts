
import { Tables } from "@/integrations/supabase/types";

export const createBasicClientData = (): Partial<Tables<"clients">> => ({
  id: '',
  client_number: 0,
  applicant: '',
  co_applicant: null,
  consultant_name: null,
  processor_name: null,
  total_debt: 0,
  payoff_amount: 0,
  status: 'Open',
  entry_date: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  owner_id: '',
});
