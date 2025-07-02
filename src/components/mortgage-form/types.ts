import { Tables } from "@/integrations/supabase/types";

export interface MortgageFormDialogProps {
  client: Tables<"clients">;
  mortgage?: any;
  isOpen: boolean;
  onClose: () => void;
}

export interface MortgageFormFieldProps {
  formData: any;
  updateField: (field: string, value: any) => void;
}
