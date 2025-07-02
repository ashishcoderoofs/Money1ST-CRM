import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { commonFieldSchemas } from "@/utils/formSchemas";

// Enhanced schema based on the backend model using shared schemas
export const consultantFormSchema = z.object({
  // Basic Information
  consultantId: z.string().optional(),
  entryDate: commonFieldSchemas.requiredDate,
  position: commonFieldSchemas.consultantPosition,
  status: commonFieldSchemas.status,
  title: z.string().optional(),
  firstName: commonFieldSchemas.firstName,
  middleInitial: commonFieldSchemas.middleInitial,
  lastName: commonFieldSchemas.lastName,
  suffix: z.string().optional(),
  comment: z.string().optional(),
  remarks: z.string().optional(),

  // Contact Information
  email: commonFieldSchemas.email,
  maidenName: z.string().optional(),
  address: commonFieldSchemas.address,
  city: commonFieldSchemas.city,
  county: z.string().optional(),
  state: commonFieldSchemas.state,
  zipCode: commonFieldSchemas.zipCode,
  homePhone: commonFieldSchemas.phone,
  mobile: commonFieldSchemas.phone,
  workPhone: commonFieldSchemas.phone,
  otherPhone: commonFieldSchemas.phone,
  fax: commonFieldSchemas.phone,
  membershipType: z.string().optional(),
  amount: commonFieldSchemas.currency,
  jointMemberName: z.string().optional(),

  // Personal Information
  dateOfBirth: commonFieldSchemas.dateField,
  maritalStatus: commonFieldSchemas.maritalStatus,
  sex: commonFieldSchemas.sex,
  race: z.string().optional(),
  spouseName: z.string().optional(),
  anniversary: commonFieldSchemas.dateField,
  spouseOccupation: z.string().optional(),
  educationLevel: commonFieldSchemas.educationLevel,
  driversLicenseNumber: z.string().optional(),
  driversLicenseState: z.string().optional(),
  employmentStatus: commonFieldSchemas.employmentStatus,
  employer: z.string().optional(),
  occupation: z.string().optional(),
  industry: z.string().optional(),

  // CFS Information
  ssn: z.string().optional(),
  ein: z.string().optional(),
  hireDate: commonFieldSchemas.dateField,
  yearsWithFrq: z.coerce.number().optional().nullable(),
  companyName: z.string().optional(),
  cfsCertificationDate: commonFieldSchemas.dateField,
  effectiveDate: commonFieldSchemas.dateField,
  memberType: z.string().optional(),
  mbrAmt: commonFieldSchemas.currency,
  payType: z.string().optional(),
  mpFee: commonFieldSchemas.currency,
  cfsStatus: z.string().optional(),
  statusDate: commonFieldSchemas.dateField,

  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactPhone: commonFieldSchemas.phone,
});

export type ConsultantFormValues = z.infer<typeof consultantFormSchema>;

export interface ConsultantFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<ConsultantFormValues>;
  isEditMode?: boolean;
  consultantId?: string;
}

// Form section props interface for tab components
export interface ConsultantFormSectionProps {
  form: UseFormReturn<ConsultantFormValues>;
}
