import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
import { MortgageFormValues, Mortgage } from "./mortgageTypes";

export function useMortgagesByClient(clientId: string) {
  return { data: [], isLoading: false };
}

export function useCreateMortgage() {
  return { mutate: () => {} };
}

export function useUpdateMortgage() {
  return { mutate: () => {} };
}

export function useDeleteMortgage() {
  return { mutate: () => {} };
}
