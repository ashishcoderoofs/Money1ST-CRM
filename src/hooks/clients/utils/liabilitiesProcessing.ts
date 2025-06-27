
import { supabase } from "@/integrations/supabase/client";

// Helper function to check if a liability has meaningful data
export const isValidLiability = (liability: any) => {
  return (
    liability.debtor_type && 
    (liability.liability_type || 
     liability.creditor_name || 
     (liability.current_balance && liability.current_balance > 0) || 
     (liability.monthly_payment && liability.monthly_payment > 0) ||
     liability.property_address ||
     (liability.property_value && liability.property_value > 0))
  );
};

// Helper function to process liabilities data for create
export const processLiabilitiesForCreate = (values: any) => {
  const processedValues = { ...values };
  
  // Remove liabilities from the client data as they're handled separately
  // We'll store them after the client is created
  delete processedValues.liabilities;
  
  return processedValues;
};

// Helper function to process liabilities data for update
export const processLiabilities = async (values: any) => {
  const processedValues = { ...values };
  const liabilities = processedValues.liabilities || [];
  
  console.log("Processing liabilities for client:", processedValues.id, "liabilities:", liabilities);
  
  if (liabilities.length > 0) {
    // First, delete all existing liabilities for this client
    if (processedValues.id) {
      const { error: deleteError } = await supabase
        .from("client_liabilities")
        .delete()
        .eq("client_id", processedValues.id);
        
      if (deleteError) {
        console.error("Error deleting existing liabilities:", deleteError);
        throw deleteError;
      }
    }
    
    // Filter out empty liabilities using the validation function
    const validLiabilities = liabilities.filter(isValidLiability);
    
    console.log("Valid liabilities to insert:", validLiabilities);
    
    if (validLiabilities.length > 0) {
      // Add client_id to each liability and ensure all required fields have defaults
      const liabilitiesWithClientId = validLiabilities.map((liability: any) => ({
        client_id: processedValues.id,
        debtor_type: liability.debtor_type || "Applicant",
        liability_type: liability.liability_type || null,
        creditor_name: liability.creditor_name || null,
        current_balance: liability.current_balance || 0,
        monthly_payment: liability.monthly_payment || 0,
        pay_off: liability.pay_off || false,
        property_address: liability.property_address || null,
        property_value: liability.property_value || 0,
        gross_rent: liability.gross_rent || 0,
        escrow: liability.escrow || null,
        taxes: liability.taxes || 0,
        hoi: liability.hoi || 0,
      }));
      
      const { error } = await supabase
        .from("client_liabilities")
        .insert(liabilitiesWithClientId);
        
      if (error) {
        console.error("Error inserting liabilities:", error);
        throw error;
      }
    }
  } else {
    // If no liabilities in the form, still delete existing ones
    if (processedValues.id) {
      const { error: deleteError } = await supabase
        .from("client_liabilities")
        .delete()
        .eq("client_id", processedValues.id);
        
      if (deleteError) {
        console.error("Error deleting existing liabilities:", deleteError);
        throw deleteError;
      }
    }
  }
  
  // Remove liabilities from the client update as they're handled separately
  delete processedValues.liabilities;
  
  return processedValues;
};
