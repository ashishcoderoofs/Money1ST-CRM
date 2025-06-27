
// Helper function to convert empty strings to null for date fields
export const processDateFields = (values: any) => {
  const dateFields = [
    'entry_date',
    'applicant_dob',
    'applicant_start_date', 
    'applicant_end_date',
    'applicant_anniversary',
    'applicant_previous_employment_from',
    'applicant_previous_employment_to',
    'coapplicant_dob',
    'coapplicant_start_date',
    'coapplicant_end_date', 
    'coapplicant_anniversary',
    'coapplicant_previous_employment_from',
    'coapplicant_previous_employment_to'
  ];
  
  const processedValues = { ...values };
  
  dateFields.forEach(field => {
    if (processedValues[field] === '' || processedValues[field] === undefined) {
      processedValues[field] = null;
    }
  });
  
  return processedValues;
};
