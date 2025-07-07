/**
 * Client Data Mapper Utility
 * 
 * Handles the mapping between MongoDB's nested client structure and the frontend's 
 * flat structure for backward compatibility and ease of use.
 * 
 * Features:
 * - Supports both legacy nested format and modern flat format
 * - Automatic format detection
 * - Safe data extraction with fallbacks
 * - Maintains data integrity across different storage formats
 * 
 * Use Cases:
 * - API response transformation
 * - Database migration support
 * - Component data standardization
 */

// ================================
// TYPE DEFINITIONS
// ================================

/**
 * Nested applicant structure (legacy MongoDB format)
 */

interface NestedApplicant {
  title?: string;
  firstName?: string;
  mi?: string;
  lastName?: string;
  suffix?: string;
  maidenName?: string;
  homePhone?: string;
  mobilePhone?: string;
  otherPhone?: string;
  fax?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    county?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  employment?: {
    employerName?: string;
    position?: string;
    workPhone?: string;
    yearsAtJob?: number;
    monthlyIncome?: number;
    annualIncome?: number;
    employmentType?: string;
  };
  demographics?: {
    dateOfBirth?: string;
    age?: number;
    ssn?: string;
    sex?: string;
    maritalStatus?: string;
    race?: string;
    ethnicity?: string;
  };
}

interface LegacyClientStructure {
  _id: string;
  clientId?: string;
  applicant?: NestedApplicant;
  coApplicant?: NestedApplicant;
  liabilities?: any[];
  [key: string]: any;
}

interface ModernClientStructure {
  _id: string;
  clientId?: string;
  applicant_first_name?: string;
  coapplicant_first_name?: string;
  [key: string]: any;
}

/**
 * Determines if the client data is in the modern flat format
 */
function isModernFormat(data: any): data is ModernClientStructure {
  // Check if we have flat fields that indicate the new backend format
  return data.applicant_first_name !== undefined || 
         data.coapplicant_first_name !== undefined ||
         data.applicant_address !== undefined ||
         data.coapplicant_address !== undefined ||
         // Also check if it's already been processed by the new backend
         (data.type === 'Applicant' || data.type === 'SecuriaClient');
}

/**
 * Maps legacy nested applicant data to flat structure
 */
function mapApplicantData(applicant: NestedApplicant | undefined, prefix: 'applicant' | 'coapplicant') {
  if (!applicant) return {};
  
  return {
    [`${prefix}_title`]: applicant.title || '',
    [`${prefix}_first_name`]: applicant.firstName || '',
    [`${prefix}_mi`]: applicant.mi || '',
    [`${prefix}_last_name`]: applicant.lastName || '',
    [`${prefix}_suffix`]: applicant.suffix || '',
    [`${prefix}_maiden_name`]: applicant.maidenName || '',
    
    // Contact info
    [`${prefix}_home_phone`]: applicant.homePhone || '',
    [`${prefix}_mobile_phone`]: applicant.mobilePhone || '',
    [`${prefix}_other_phone`]: applicant.otherPhone || '',
    [`${prefix}_fax`]: applicant.fax || '',
    [`${prefix}_email`]: applicant.email || '',
    
    // Address
    [`${prefix}_address`]: applicant.address?.street || '',
    [`${prefix}_city`]: applicant.address?.city || '',
    [`${prefix}_county`]: applicant.address?.county || '',
    [`${prefix}_state`]: applicant.address?.state || '',
    [`${prefix}_zip`]: applicant.address?.zipCode || '',
    [`${prefix}_country`]: applicant.address?.country || '',
    
    // Employment
    [`${prefix}_employer_name`]: applicant.employment?.employerName || '',
    [`${prefix}_occupation`]: applicant.employment?.position || '',
    [`${prefix}_other_phone`]: applicant.employment?.workPhone || '',
    [`${prefix}_years_at_job`]: applicant.employment?.yearsAtJob || 0,
    [`${prefix}_monthly_salary`]: applicant.employment?.monthlyIncome || 0,
    [`${prefix}_annual_income`]: applicant.employment?.annualIncome || 0,
    [`${prefix}_employment_status`]: applicant.employment?.employmentType || '',
    
    // Demographics
    [`${prefix}_dob`]: applicant.demographics?.dateOfBirth || '',
    [`${prefix}_age`]: applicant.demographics?.age || 0,
    [`${prefix}_ssn`]: applicant.demographics?.ssn || '',
    [`${prefix}_sex`]: applicant.demographics?.sex || '',
    [`${prefix}_marital_status`]: applicant.demographics?.maritalStatus || '',
    [`${prefix}_race`]: applicant.demographics?.race || '',
    [`${prefix}_ethnicity`]: applicant.demographics?.ethnicity || '',
  };
}

/**
 * Main function to map MongoDB client structure to flat structure
 */
export function mapMongoClientToFlatStructure(mongoClient: any) {
  if (!mongoClient) return null;

  console.log('[Mapper] Processing client data with type:', mongoClient.type);
  console.log('[Mapper] Has applicant_first_name:', !!mongoClient.applicant_first_name);
  console.log('[Mapper] Has nested applicant:', !!mongoClient.applicant);

  // Handle modern flat format - the new backend already provides flat data
  if (isModernFormat(mongoClient)) {
    console.log('[Mapper] Detected modern format, using data as-is');
    return {
      ...mongoClient,
      // Ensure both id and _id are available for backward compatibility
      id: mongoClient._id,
      _id: mongoClient._id,
      // Add client_number if not present
      client_number: mongoClient.client_number || 
                    mongoClient.clientId || 
                    `CLI${mongoClient._id.toString().slice(-6).toUpperCase()}`,
    };
  }

  console.log('[Mapper] Detected legacy format, mapping nested structure');
  
  // Handle legacy nested format
  const { applicant, coApplicant, liabilities, ...rest } = mongoClient as LegacyClientStructure;

  return {
    ...rest,
    // Core identifiers
    id: mongoClient._id,
    _id: mongoClient._id,
    client_number: mongoClient.clientId || `CLI${mongoClient._id.slice(-6).toUpperCase()}`,
    
    // Map applicant data
    ...mapApplicantData(applicant, 'applicant'),
    
    // Map co-applicant data  
    ...mapApplicantData(coApplicant, 'coapplicant'),
    
    // Preserve original nested structures for components that can use them
    applicant,
    coApplicant,
    liabilities,
  };
}
