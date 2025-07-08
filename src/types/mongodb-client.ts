// MongoDB Client types for Money1ST CRM
// Refactored to match the unified, nested structure as per the latest requirements

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  county?: string;
  howLongYears?: number;
  howLongMonths?: number;
}

export interface Employment {
  employmentStatus?:
    | 'Employed'
    | 'Full-time'
    | 'Self-Employed'
    | 'Unemployed'
    | 'Retired'
    | 'Student'
    | 'Part-Time'
    | 'Contract';
  isBusinessOwner?: boolean;
  occupation?: string;
  employerName?: string;
  employerAddress?: string;
  employerCity?: string;
  employerState?: string;
  employerZipCode?: string;
  monthlyGrossSalary?: number;
  startDate?: string;
  endDate?: string;
  supervisor?: string;
  supervisorPhone?: string;
  additionalIncome?: number;
  source?: string;
}

export interface PreviousEmployment {
  employerName?: string;
  employerAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  occupation?: string;
  fromDate?: string;
  toDate?: string;
}

export interface Demographics {
  birthPlace?: string;
  dateOfBirth?: string;
  ssn?: string;
  race?:
    | 'American Indian or Alaska Native'
    | 'Asian'
    | 'Black or African American'
    | 'Hispanic or Latino'
    | 'Native Hawaiian or Other Pacific Islander'
    | 'White'
    | 'Two or More Races'
    | 'Other';
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';
  anniversary?: string;
  spouseName?: string;
  spouseOccupation?: string;
  numberOfDependents?: number;
}

export interface HouseholdMember {
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  relationship?:
    | 'Applicant'
    | 'Co-Applicant'
    | 'Spouse'
    | 'Partner'
    | 'Son'
    | 'Daughter'
    | 'Parent'
    | 'Sibling'
    | 'Other';
  dateOfBirth?: string;
  age?: number;
  sex?: 'Male' | 'Female';
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  ssn?: string;
}

export interface Applicant {
  // Name Information
  title?: 'Mr.' | 'Mrs.' | 'Ms.' | 'Dr.';
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  suffix?: 'Jr.' | 'Sr.' | 'II' | 'III' | 'IV';
  maidenName?: string;
  isConsultant?: boolean;
  // Contact & Address
  currentAddress?: Address;
  previousAddress?: Address;
  homePhone?: string;
  workPhone?: string;
  cellPhone?: string;
  otherPhone?: string;
  email?: string;
  fax?: string;
  // Employment
  employment?: Employment;
  previousEmployment?: PreviousEmployment;
  // Demographics
  demographics?: Demographics;
}

export interface CoApplicant extends Applicant {
  includeCoApplicant?: boolean;
}

export interface Client {
  _id?: string;
  clientId?: string;
  entryDate?: string;
  payoffAmount?: number;
  status?: 'Active' | 'Pending' | 'Inactive';
  consultant?: string;
  processor?: string;
  applicant?: Applicant;
  coApplicant?: CoApplicant;
  householdMembers?: HouseholdMember[];
}
