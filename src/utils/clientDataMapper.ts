// Utility to map MongoDB client structure to the expected flat structure
// This is a temporary solution to bridge the gap between MongoDB nested structure and component expectations

export function mapMongoClientToFlatStructure(mongoClient: any) {
  if (!mongoClient) return null;

  const { applicant, coApplicant, liabilities, ...rest } = mongoClient;

  return {
    ...rest,
    // Ensure both id and _id are available for backward compatibility
    id: mongoClient._id,
    _id: mongoClient._id,
    // Applicant basic info
    applicant_title: applicant?.title || '',
    applicant_first_name: applicant?.firstName || '',
    applicant_mi: applicant?.mi || '',
    applicant_last_name: applicant?.lastName || '',
    applicant_suffix: applicant?.suffix || '',
    applicant_maiden_name: applicant?.maidenName || '',
    
    // Applicant contact
    applicant_home_phone: applicant?.homePhone || '',
    applicant_mobile_phone: applicant?.mobilePhone || '',
    applicant_other_phone: applicant?.otherPhone || '',
    applicant_fax: applicant?.fax || '',
    applicant_email: applicant?.email || '',
    
    // Applicant address
    applicant_address: applicant?.address?.street || '',
    applicant_city: applicant?.address?.city || '',
    applicant_county: applicant?.address?.county || '',
    applicant_state: applicant?.address?.state || '',
    applicant_zip: applicant?.address?.zipCode || '',
    applicant_country: applicant?.address?.country || '',
    
    // Applicant employment
    applicant_employer_name: applicant?.employment?.employerName || '',
    applicant_occupation: applicant?.employment?.position || '',
    applicant_work_phone: applicant?.employment?.workPhone || '',
    applicant_years_at_job: applicant?.employment?.yearsAtJob || 0,
    applicant_monthly_salary: applicant?.employment?.monthlyIncome || 0,
    applicant_annual_income: applicant?.employment?.annualIncome || 0,
    applicant_employment_status: applicant?.employment?.employmentType || '',
    
    // Applicant demographics
    applicant_dob: applicant?.demographics?.dateOfBirth || '',
    applicant_age: applicant?.demographics?.age || 0,
    applicant_ssn: applicant?.demographics?.ssn || '',
    applicant_sex: applicant?.demographics?.sex || '',
    applicant_marital_status: applicant?.demographics?.maritalStatus || '',
    applicant_race: applicant?.demographics?.race || '',
    applicant_ethnicity: applicant?.demographics?.ethnicity || '',
    
    // Co-Applicant basic info
    coapplicant_title: coApplicant?.title || '',
    coapplicant_first_name: coApplicant?.firstName || '',
    coapplicant_mi: coApplicant?.mi || '',
    coapplicant_last_name: coApplicant?.lastName || '',
    coapplicant_suffix: coApplicant?.suffix || '',
    coapplicant_maiden_name: coApplicant?.maidenName || '',
    
    // Co-Applicant contact
    coapplicant_home_phone: coApplicant?.homePhone || '',
    coapplicant_mobile_phone: coApplicant?.mobilePhone || '',
    coapplicant_other_phone: coApplicant?.otherPhone || '',
    coapplicant_fax: coApplicant?.fax || '',
    coapplicant_email: coApplicant?.email || '',
    
    // Co-Applicant address
    coapplicant_address: coApplicant?.address?.street || '',
    coapplicant_city: coApplicant?.address?.city || '',
    coapplicant_county: coApplicant?.address?.county || '',
    coapplicant_state: coApplicant?.address?.state || '',
    coapplicant_zip: coApplicant?.address?.zipCode || '',
    coapplicant_country: coApplicant?.address?.country || '',
    
    // Co-Applicant employment
    coapplicant_employer_name: coApplicant?.employment?.employerName || '',
    coapplicant_occupation: coApplicant?.employment?.position || '',
    coapplicant_work_phone: coApplicant?.employment?.workPhone || '',
    coapplicant_years_at_job: coApplicant?.employment?.yearsAtJob || 0,
    coapplicant_monthly_salary: coApplicant?.employment?.monthlyIncome || 0,
    coapplicant_annual_income: coApplicant?.employment?.annualIncome || 0,
    coapplicant_employment_status: coApplicant?.employment?.employmentType || '',
    
    // Co-Applicant demographics
    coapplicant_dob: coApplicant?.demographics?.dateOfBirth || '',
    coapplicant_age: coApplicant?.demographics?.age || 0,
    coapplicant_ssn: coApplicant?.demographics?.ssn || '',
    coapplicant_sex: coApplicant?.demographics?.sex || '',
    coapplicant_marital_status: coApplicant?.demographics?.maritalStatus || '',
    coapplicant_race: coApplicant?.demographics?.race || '',
    coapplicant_ethnicity: coApplicant?.demographics?.ethnicity || '',
    
    // Preserve original nested structures for components that can use them
    applicant,
    coApplicant,
    liabilities
  };
}
