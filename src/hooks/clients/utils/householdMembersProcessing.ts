
// Helper function to process household members data
export const processHouseholdMembers = (values: any) => {
  const processedValues = { ...values };
  
  console.log("Processing household members - before:", {
    household_members: processedValues.household_members,
    coapplicant_household_members: processedValues.coapplicant_household_members
  });
  
  // Convert household_members array to JSON string for storage
  if (processedValues.household_members && Array.isArray(processedValues.household_members)) {
    // Filter out empty household members
    const validMembers = processedValues.household_members.filter((member: any) => 
      member.first_name || member.last_name || member.date_of_birth || member.relationship
    );
    
    // Store as JSON string or null if no valid members
    processedValues.household_members_json = validMembers.length > 0 ? JSON.stringify(validMembers) : null;
  } else {
    processedValues.household_members_json = null;
  }

  // Convert co-applicant household members array to JSON string for storage
  if (processedValues.coapplicant_household_members && Array.isArray(processedValues.coapplicant_household_members)) {
    // Filter out empty co-applicant household members with more lenient criteria
    const validCoApplicantMembers = processedValues.coapplicant_household_members.filter((member: any) => 
      member.first_name || member.last_name || member.date_of_birth || member.relationship || member.age
    );
    
    // Store as JSON string or null if no valid members
    processedValues.coapplicant_household_members_json = validCoApplicantMembers.length > 0 ? JSON.stringify(validCoApplicantMembers) : null;
  } else {
    processedValues.coapplicant_household_members_json = null;
  }
  
  console.log("Processing household members - after:", {
    household_members_json: processedValues.household_members_json,
    coapplicant_household_members_json: processedValues.coapplicant_household_members_json
  });
  
  // Remove the array versions as they're not stored in the database
  delete processedValues.household_members;
  delete processedValues.coapplicant_household_members;
  
  return processedValues;
};
