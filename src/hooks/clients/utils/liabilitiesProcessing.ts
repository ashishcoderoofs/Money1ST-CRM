
// Remove all supabase imports and code. Use REST API for liabilities now.

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
      // Use REST API for liabilities
      // This part of the code would need to be replaced with actual REST API calls
      // For example, using fetch or axios to delete liabilities from an external endpoint
      console.warn("REST API call for deleting liabilities not implemented yet.");
      // Example:
      // try {
      //   const response = await fetch(`${API_BASE_URL}/clients/${processedValues.id}/liabilities`, {
      //     method: 'DELETE',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${token}`, // Assuming token is available
      //     },
      //   });
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }
      // } catch (error) {
      //   console.error("Error deleting existing liabilities:", error);
      //   throw error;
      // }
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
      
      // Use REST API for inserting liabilities
      // This part of the code would need to be replaced with actual REST API calls
      console.warn("REST API call for inserting liabilities not implemented yet.");
      // Example:
      // try {
      //   const response = await fetch(`${API_BASE_URL}/clients/${processedValues.id}/liabilities`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${token}`, // Assuming token is available
      //     },
      //     body: JSON.stringify(liabilitiesWithClientId),
      //   });
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }
      // } catch (error) {
      //   console.error("Error inserting liabilities:", error);
      //   throw error;
      // }
    }
  } else {
    // If no liabilities in the form, still delete existing ones
    if (processedValues.id) {
      // Use REST API for liabilities
      // This part of the code would need to be replaced with actual REST API calls
      console.warn("REST API call for deleting liabilities not implemented yet.");
      // Example:
      // try {
      //   const response = await fetch(`${API_BASE_URL}/clients/${processedValues.id}/liabilities`, {
      //     method: 'DELETE',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${token}`, // Assuming token is available
      //     },
      //   });
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }
      // } catch (error) {
      //   console.error("Error deleting existing liabilities:", error);
      //   throw error;
      // }
    }
  }
  
  // Remove liabilities from the client update as they're handled separately
  delete processedValues.liabilities;
  
  return processedValues;
};
