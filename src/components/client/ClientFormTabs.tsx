import React, { useState } from 'react';
import { Eye, ArrowLeft, Shield, SquarePen, Save, X, Plus } from 'lucide-react';
import { useUpdateClient } from '@/hooks/useSecuriaClients';
import { toast } from 'sonner';
import NameInformationSection from './NameInformationSection';
import AddressSection from './AddressSection';
import DemographicsSection from './DemographicsSection';
import PreviousAddressSection from './PreviousAddressSection';
import EmploymentSection from './EmploymentSection';
import PreviousEmploymentSection from './PreviousEmploymentSection';
import HouseholdMembersSection from './HouseholdMembersSection';
import * as yup from 'yup';
import dayjs from 'dayjs';
import CaseInformationSection from './CaseInformationSection';
import { useUpdateApplicantBasicInfo, useUpdateApplicantAddress, useUpdateApplicantEmployment, useUpdateApplicantDemographics } from '@/hooks/clients/useApplicantMutations';
import { useUpdateCoApplicantBasicInfo, useUpdateCoApplicantAddress, useUpdateCoApplicantEmployment, useUpdateCoApplicantDemographics } from '@/hooks/clients/useCoApplicantMutations';
import LiabilitiesSection from './LiabilitiesSection';
import { createLiabilityREST } from '@/hooks/clients/useLiabilityMutations';
import MortgageApplicationSection from './MortgageApplicationSection';
import UnderwritingSection from './UnderwritingSection';
import LoanStatusTab from './LoanStatusTab';
import DriverSection from './DriverSection';

interface ClientFormProps {
  mode?: 'view' | 'edit' | 'create';
  clientData?: any;
  onSave?: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  onBack?: () => void;
}

const emptyClient = {
  applicant: { household_members: [
    { first_name: '', middle_initial: '', last_name: '', relationship: '', dob: '', age: '', sex: '', marital_status: '', ssn: '' }
  ] },
  coApplicant: {},
  householdMembers: [],
  clientId: '',
  entryDate: dayjs().format('YYYY-MM-DD'),
  status: '',
  payoffAmount: 0,
  consultantName: '',
  processorName: '',
  drivers: [{
    fullName: '',
    dateOfBirth: '',
    age: '',
    relationship: '',
    ssn: '',
    sex: '',
    maritalStatus: '',
    drivingStatus: '',
    licenseNumber: '',
    state: '',
    accidentsViolations: '0',
  }],
};

function setNestedValue(obj, path, value) {
  if (path.length === 1) {
    return { ...obj, [path[0]]: value };
  }
  const [head, ...rest] = path;
  return {
    ...obj,
    [head]: setNestedValue(obj[head] || {}, rest, value)
  };
}

// Fixed phone regex - removed unnecessary escaping
const phoneRegex = /^[\+]?[1-9][\d\s\-()]{7,15}$/;
const zipRegex = /^\d{5}(-\d{4})?$/;
const stateRegex = /^[A-Z]{2}$/;
const clientIdRegex = /^CAN\d{5}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const applicantSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  // Address/contact validation
  contact: yup.object({
    address: yup.string().max(200, 'Address too long').optional(),
    city: yup.string().max(100, 'City too long').optional(),
    state: yup.string().matches(stateRegex, 'State must be 2 uppercase letters').optional(),
    zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits or ZIP+4').optional(),
    county: yup.string().max(100, 'County too long').optional(),
    home_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
    work_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
    cell_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
    other_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
    email: yup.string().email('Invalid email').required('Email is required'),
  }).required('Contact information is required'),
  current_address: yup.object({
    address: yup.string().max(200, 'Address too long').optional(),
    city: yup.string().max(100, 'City too long').optional(),
    state: yup.string().matches(stateRegex, 'State must be 2 uppercase letters').optional(),
    zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits or ZIP+4').optional(),
    county: yup.string().max(100, 'County too long').optional(),
    home_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
    work_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
    cell_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
    other_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
    email: yup.string().email('Invalid email').optional(),
    years: yup
      .number()
      .min(0, 'Years must be 0 or greater')
      .typeError('Years must be a number')
      .optional(),
    months: yup
      .number()
      .min(0, 'Months must be between 0 and 11')
      .max(11, 'Months must be between 0 and 11')
      .typeError('Months must be a number')
      .optional(),
    how_long_at_current_address: yup.string().optional(),
    fax: yup.string().matches(phoneRegex, 'Invalid fax number').optional(),
  }).optional(),
  previous_address: yup.object({
    address: yup.string().max(200, 'Address too long').optional(),
    city: yup.string().max(100, 'City too long').optional(),
    state: yup.string().matches(stateRegex, 'State must be 2 uppercase letters').optional(),
    zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits or ZIP+4').optional(),
    years: yup
      .number()
      .min(0, 'Years must be 0 or greater')
      .typeError('Years must be a number')
      .optional(),
    months: yup
      .number()
      .min(0, 'Months must be between 0 and 11')
      .max(11, 'Months must be between 0 and 11')
      .typeError('Months must be a number')
      .optional(),
    duration: yup.string().optional(),
  }).optional(),
  employment: yup.object({
    status: yup.string().oneOf(['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student', 'Part time', 'Contract']).optional(),
    is_business_owner: yup.string().optional(),
    employer_name: yup.string().optional(),
    employer_address: yup.string().optional(),
    employer_city: yup.string().optional(),
    employer_state: yup.string().matches(stateRegex, 'State must be 2 uppercase letters').optional(),
    employer_zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits or ZIP+4').optional(),
    occupation: yup.string().optional(),
    monthly_salary: yup.string().matches(/^\d+(\.\d{1,2})?$/, 'Monthly salary must be a number').optional(),
    other_income: yup.string().matches(/^\d+(\.\d{1,2})?$/, 'Other income must be a number').optional(),
    start_date: yup.string().matches(dateRegex, 'Start date must be YYYY-MM-DD').optional(),
    end_date: yup.string().matches(dateRegex, 'End date must be YYYY-MM-DD').optional(),
    supervisor: yup.string().optional(),
    supervisor_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
    source: yup.string().optional(),
  }).optional(),
  previous_employment: yup.object({
    employer_name: yup.string().optional(),
    employer_address: yup.string().optional(),
    employer_city: yup.string().optional(),
    employer_state: yup.string().matches(stateRegex, 'State must be 2 uppercase letters').optional(),
    employer_zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits or ZIP+4').optional(),
    from_date: yup.string().matches(dateRegex, 'From date must be YYYY-MM-DD').optional(),
    to_date: yup.string().matches(dateRegex, 'To date must be YYYY-MM-DD').optional(),
    occupation: yup.string().optional(),
  }).optional(),
  credit_scores: yup.object({
    equifax: yup.string().matches(/^\d+$/, 'Equifax score must be a number').optional(),
    experian: yup.string().matches(/^\d+$/, 'Experian score must be a number').optional(),
    transunion: yup.string().matches(/^\d+$/, 'Transunion score must be a number').optional(),
  }).optional(),
});

const coApplicantSchema = applicantSchema;

// Helper functions for random data
function randomString(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}
function randomPhone() {
  return `+1${randomInt(200,999)}${randomInt(200,999)}${randomInt(1000,9999)}`;
}
function randomEmail(first, last) {
  return `${first}.${last}${randomInt(1,99)}@example.com`;
}
function randomName() {
  const firsts = ['John','Jane','Alex','Sam','Chris','Pat','Taylor','Jordan','Morgan','Casey'];
  const lasts = ['Smith','Johnson','Lee','Brown','Garcia','Martinez','Davis','Miller','Wilson','Moore'];
  return {
    first: firsts[randomInt(0, firsts.length-1)],
    last: lasts[randomInt(0, lasts.length-1)]
  };
}
function randomRelationship() {
  const rels = ['Daughter','Son','Spouse','Parent','Sibling','Other'];
  return rels[randomInt(0, rels.length-1)];
}
function randomSex() {
  return Math.random() > 0.5 ? 'Male' : 'Female';
}
function randomMarital() {
  return ['Single','Married','Divorced','Widowed','Separated'][randomInt(0,4)];
}
function randomRace() {
  return ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Other Pacific Islander', 'White', 'Two or More Races', 'Other'][randomInt(0,7)];
}
function randomState() {
  const states = ['NY','CA','TX','FL','IL','PA','OH','GA','NC','MI'];
  return states[randomInt(0, states.length-1)];
}
function randomZip() {
  return `${randomInt(10000,99999)}`;
}
function randomSSN() {
  return `${randomInt(100,999)}-${randomInt(10,99)}-${randomInt(1000,9999)}`;
}
function randomOccupation() {
  const occs = ['Engineer','Developer','Teacher','Manager','Consultant','Nurse','Driver','Artist','Chef','Student'];
  return occs[randomInt(0, occs.length-1)];
}
function randomEmployer() {
  const emps = ['Acme Corp','Globex','Initech','Umbrella','Wayne Enterprises','Stark Industries','Wonka Inc','Hooli','Soylent','Cyberdyne'];
  return emps[randomInt(0, emps.length-1)];
}
function randomCounty() {
  const counties = ['Kings','Queens','Cook','Harris','Maricopa','San Diego','Orange','Miami-Dade','Dallas','Clark'];
  return counties[randomInt(0, counties.length-1)];
}

function randomApplicant() {
  const name = randomName();
  const dob = randomDate(new Date(1960,0,1), new Date(2005,0,1));
  const marital = randomMarital();
  const race = randomRace();
  const address = randomInt(100,9999) + ' ' + randomString(6) + ' St';
  const city = randomString(6).charAt(0).toUpperCase() + randomString(5);
  const state = randomState();
  const zip = randomZip();
  const email = randomEmail(name.first, name.last);
  const phone = randomPhone();
  const occupation = randomOccupation();
  const employer = randomEmployer();
  const county = randomCounty();
  return {
    title: ['Mr.','Mrs.','Ms.','Dr.','Prof.'][randomInt(0,4)],
    first_name: name.first,
    middle_initial: randomString(1).toUpperCase(),
    last_name: name.last,
    suffix: ['Jr.','Sr.','II','III','IV','V','MD','PhD'][randomInt(0,7)],
    maiden_name: randomString(6),
    is_consultant: Math.random() > 0.5,
    date_of_birth: dob,
    marital_status: marital,
    race: race,
    birth_place: city,
    anniversary: randomDate(new Date(1980,0,1), new Date(2020,0,1)),
    spouse_name: randomName().first,
    spouse_occupation: randomOccupation(),
    number_of_dependents: randomInt(0,5).toString(),
    fax: randomPhone(),
    contact: {
      address,
      city,
      state,
      zip_code: zip,
      county,
      home_phone: phone,
      work_phone: randomPhone(),
      cell_phone: randomPhone(),
      other_phone: randomPhone(),
      email,
    },
    current_address: {
      address,
      city,
      state,
      zip_code: zip,
      county,
      home_phone: phone,
      work_phone: randomPhone(),
      cell_phone: randomPhone(),
      other_phone: randomPhone(),
      email,
      years: randomInt(0,20),
      months: randomInt(0,11),
      how_long_at_current_address: `${randomInt(0,20)} years ${randomInt(0,11)} months`,
    },
    previous_address: {
      address: randomInt(100,9999) + ' ' + randomString(6) + ' Ave',
      city: randomString(6).charAt(0).toUpperCase() + randomString(5),
      state: randomState(),
      zip_code: randomZip(),
      years: randomInt(0,20),
      months: randomInt(0,11),
      duration: `${randomInt(0,20)} years ${randomInt(0,11)} months`,
    },
    employment: {
      status: ['Employed','Self-Employed','Unemployed','Retired','Student','Part time','Contract'][randomInt(0,6)],
      is_business_owner: Math.random() > 0.5 ? 'Yes' : 'No',
      employer_name: employer,
      employer_address: randomInt(100,9999) + ' ' + randomString(6) + ' Blvd',
      employer_city: city,
      employer_state: state,
      employer_zip_code: zip,
      occupation,
      monthly_salary: randomInt(2000,10000).toString(),
      other_income: randomInt(0,2000).toString(),
      start_date: randomDate(new Date(2000,0,1), new Date(2020,0,1)),
      end_date: randomDate(new Date(2021,0,1), new Date(2024,0,1)),
      supervisor: randomName().first,
      supervisor_phone: randomPhone(),
      source: ['Job','Business','Other'][randomInt(0,2)],
    },
    previous_employment: {
      employer_name: randomEmployer(),
      employer_address: randomInt(100,9999) + ' ' + randomString(6) + ' Rd',
      employer_city: randomString(6).charAt(0).toUpperCase() + randomString(5),
      employer_state: randomState(),
      employer_zip_code: randomZip(),
      from_date: randomDate(new Date(1990,0,1), new Date(2015,0,1)),
      to_date: randomDate(new Date(2015,0,2), new Date(2020,0,1)),
      occupation: randomOccupation(),
    },
    credit_scores: {
      equifax: randomInt(600,850).toString(),
      experian: randomInt(600,850).toString(),
      transunion: randomInt(600,850).toString(),
    },
    household_members: Array.from({length: randomInt(1,3)}, () => {
      const n = randomName();
      return {
        first_name: n.first,
        middle_initial: randomString(1).toUpperCase(),
        last_name: n.last,
        relationship: randomRelationship(),
        dob: randomDate(new Date(2005,0,1), new Date(2020,0,1)),
        age: randomInt(1,18).toString(),
        sex: randomSex(),
        marital_status: randomMarital(),
        ssn: randomSSN(),
      };
    })
  };
}

// Helper to map backend applicant/coApplicant to form structure
function mapApplicantFromBackend(app: any) {
  if (!app) return {};
  return {
    // Name info - map from name_information object
    title: app.name_information?.title || '',
    first_name: app.name_information?.first_name || '',
    middle_initial: app.name_information?.middle_initial || '',
    last_name: app.name_information?.last_name || '',
    maiden_name: app.name_information?.maiden_name || '',
    suffix: app.name_information?.suffix || '',
    is_consultant: app.name_information?.is_consultant || false,
    // Contact info - map from current_address object
    contact: {
      address: app.current_address?.address || '',
      city: app.current_address?.city || '',
      state: app.current_address?.state || '',
      zip_code: app.current_address?.zip_code || '',
      county: app.current_address?.county || '',
      home_phone: app.current_address?.home_phone || '',
      work_phone: app.current_address?.work_phone || '',
      cell_phone: app.current_address?.cell_phone || '',
      other_phone: app.current_address?.other_phone || '',
      email: app.current_address?.email || '',
      fax: app.current_address?.fax || '',
    },
    current_address: {
      address: app.current_address?.address || '',
      city: app.current_address?.city || '',
      state: app.current_address?.state || '',
      zip_code: app.current_address?.zip_code || '',
      county: app.current_address?.county || '',
      home_phone: app.current_address?.home_phone || '',
      work_phone: app.current_address?.work_phone || '',
      cell_phone: app.current_address?.cell_phone || '',
      other_phone: app.current_address?.other_phone || '',
      email: app.current_address?.email || '',
      fax: app.current_address?.fax || '',
      years: app.current_address?.years || '',
      months: app.current_address?.months || '',
      how_long_at_current_address: app.current_address?.how_long_at_current_address || '',
    },
    previous_address: {
      address: app.previous_address?.address || '',
      city: app.previous_address?.city || '',
      state: app.previous_address?.state || '',
      zip_code: app.previous_address?.zip_code || '',
      years: app.previous_address?.years || '',
      months: app.previous_address?.months || '',
      duration: app.previous_address?.duration || '',
    },
    employment: {
      status: app.current_employment?.status || '',
      is_business_owner: app.current_employment?.is_business_owner || '',
      employer_name: app.current_employment?.employer_name || '',
      employer_address: app.current_employment?.employer_address || '',
      employer_city: app.current_employment?.employer_city || '',
      employer_state: app.current_employment?.employer_state || '',
      employer_zip_code: app.current_employment?.employer_zip_code || '',
      occupation: app.current_employment?.occupation || '',
      monthly_salary: app.current_employment?.monthly_salary || '',
      other_income: app.current_employment?.other_income || '',
      start_date: app.current_employment?.start_date || '',
      end_date: app.current_employment?.end_date || '',
      supervisor: app.current_employment?.supervisor || '',
      supervisor_phone: app.current_employment?.supervisor_phone || '',
      source: app.current_employment?.source || '',
    },
    previous_employment: {
      employer_name: app.previous_employment?.employer_name || '',
      employer_address: app.previous_employment?.employer_address || '',
      employer_city: app.previous_employment?.employer_city || '',
      employer_state: app.previous_employment?.employer_state || '',
      employer_zip_code: app.previous_employment?.employer_zip_code || '',
      from_date: app.previous_employment?.from_date || '',
      to_date: app.previous_employment?.to_date || '',
      occupation: app.previous_employment?.occupation || '',
    },
    // Demographics - map from demographics_information object
    birth_place: app.demographics_information?.birth_place || '',
    dob: app.demographics_information?.dob ? app.demographics_information.dob.slice(0,10) : '',
    marital_status: app.demographics_information?.marital_status || '',
    race: app.demographics_information?.race || '',
    anniversary: app.demographics_information?.anniversary || '',
    spouse_name: app.demographics_information?.spouse_name || '',
    spouse_occupation: app.demographics_information?.spouse_occupation || '',
    number_of_dependents: app.demographics_information?.number_of_dependents || '',
    household_members: Array.isArray(app.household_members)
      ? app.household_members.map((m: any) => ({
          first_name: m.first_name || '',
          middle_initial: m.middle_initial || '',
          last_name: m.last_name || '',
          relationship: m.relationship || '',
          dob: m.dob || '',
          age: m.age || '',
          sex: m.sex || '',
          marital_status: m.marital_status || '',
          ssn: m.ssn || '',
        }))
      : [],
  };
}

const ClientForm = ({ 
  mode = 'view',
  clientData = null,
  onSave = () => {},
  onCancel = () => {},
  onBack = () => {}
}: ClientFormProps) => {
  // Use emptyClient for create, clientData for edit/view
  const [formData, setFormData] = useState<any>(
    mode === 'create' ? emptyClient : (clientData || emptyClient)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const updateClientMutation = useUpdateClient();
  const updateApplicantBasic = useUpdateApplicantBasicInfo();
  const updateApplicantAddress = useUpdateApplicantAddress();
  const updateApplicantEmployment = useUpdateApplicantEmployment();
  const updateApplicantDemographics = useUpdateApplicantDemographics();
  const updateCoApplicantBasic = useUpdateCoApplicantBasicInfo();
  const updateCoApplicantAddress = useUpdateCoApplicantAddress();
  const updateCoApplicantEmployment = useUpdateCoApplicantEmployment();
  const updateCoApplicantDemographics = useUpdateCoApplicantDemographics();
  const isReadOnly = mode === 'view';
  const isCreate = mode === 'create';
  const isEdit = mode === 'edit';
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({ applicant: {}, coApplicant: {} });

  React.useEffect(() => {
    if (clientData) {
      const mortgageData = {
        // Property information - map from first mortgage
        address: clientData.first_mortgage?.address || '',
        city: clientData.first_mortgage?.city || '',
        state: clientData.first_mortgage?.state || '',
        zip_code: clientData.first_mortgage?.zip_code || '',
        occupancy_type: clientData.first_mortgage?.occupancy_type || '',
        
        // First mortgage data
        first_loan_amount: clientData.proposed_first_loan?.amount || '',
        first_mortgage_balance: clientData.first_mortgage?.balance || '',
        first_mortgage_rate: clientData.first_mortgage?.rate || '',
        first_loan_rate: clientData.proposed_first_loan?.rate || '',
        first_mortgage_term: clientData.first_mortgage?.term || '',
        first_loan_term: clientData.proposed_first_loan?.term || '',
        first_loan_int_term: clientData.proposed_first_loan?.int_term || '',
        first_mortgage_payment: clientData.first_mortgage?.payment || '',
        first_loan_new_payment: clientData.proposed_first_loan?.new_payment || '',
        lienholder_1: clientData.first_mortgage?.lienholder || '',
        
        // Second mortgage data
        second_mortgage_balance: clientData.second_mortgage?.balance || '',
        second_loan_amount: clientData.proposed_second_loan?.amount || '',
        second_mortgage_rate: clientData.second_mortgage?.rate || '',
        second_loan_rate: clientData.proposed_second_loan?.rate || '',
        second_mortgage_term: clientData.second_mortgage?.term || '',
        second_loan_term: clientData.proposed_second_loan?.term || '',
        second_mortgage_payment: clientData.second_mortgage?.payment || '',
        second_loan_new_payment: clientData.proposed_second_loan?.new_payment || '',
        lienholder_2: clientData.second_mortgage?.lienholder || '',
        
        // Additional fields
        existing_balance: clientData.first_mortgage?.balance || '',
        property_taxes: clientData.first_mortgage?.property_taxes || '',
        homeowners_insurance: clientData.first_mortgage?.homeowners_insurance || '',
        hoi_included: clientData.first_mortgage?.hoi_included || false,
        taxes_included: clientData.first_mortgage?.taxes_included || false,
        loan_purpose: clientData.first_mortgage?.loan_purpose || '',
        market_value: clientData.first_mortgage?.market_value || '',
        estimated_fees: clientData.first_mortgage?.estimated_fees || '',
        cash_to_close: clientData.first_mortgage?.cash_to_close || '',
        appraisal_fee: clientData.first_mortgage?.appraisal_fee || '',
        loan_volume: clientData.first_mortgage?.loan_volume || '',
      };
      
      setFormData({
        ...clientData,
        clientId: clientData.client_id || clientData.clientId || '',
        entryDate: clientData.entry_date || clientData.entryDate || '',
        payoffAmount: clientData.payoff_amount || clientData.payoffAmount || 0,
        status: clientData.status || '',
        consultantName: clientData.consultant_name || clientData.consultantName || '',
        processorName: clientData.processor_name || clientData.processorName || '',
        applicant: mapApplicantFromBackend(clientData.applicant || clientData.Applicant),
        coApplicant: mapApplicantFromBackend(clientData.co_applicant || clientData.coApplicant),
        liabilities: clientData.liabilities || [],
        mortgage: mortgageData,
      });
    } else {
      setFormData(emptyClient);
    }
  }, [clientData]);

  const handleNestedInputChange = (path, value) => {
    if (isReadOnly) return;
    setFormData(prev => setNestedValue(prev, path, value));
  };

  const validateSection = async (section, data) => {
    try {
      if (section === 'applicant') await applicantSchema.validate(data, { abortEarly: false });
      if (section === 'coApplicant') await coApplicantSchema.validate(data, { abortEarly: false });
      return {};
    } catch (err) {
      const errorObj = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          errorObj[e.path] = e.message;
        });
      }
      return errorObj;
    }
  };

  const handleSave = async () => {
    const now = Date.now();
    
    // Enhanced duplicate prevention
    if (isSubmitting || (now - lastSubmitTime < 2000)) {
      console.log('🛑 Prevented duplicate submission - isSubmitting:', isSubmitting, 'timeDiff:', now - lastSubmitTime);
      return;
    }
    
    console.log('🚀 Starting form submission at:', new Date().toISOString());
    setLastSubmitTime(now);
    setIsSubmitting(true);
    setErrorMsg(null);
    
    try {
      // Validate applicant and co-applicant
      const applicantErrors = await validateSection('applicant', formData.applicant);
      let coApplicantErrors = {};
      if (formData.coApplicant?.include_coapplicant) {
        coApplicantErrors = await validateSection('coApplicant', formData.coApplicant);
      }
      setErrors({ applicant: applicantErrors, coApplicant: coApplicantErrors });
      
      console.log('Applicant validation errors:', applicantErrors);
      console.log('CoApplicant validation errors:', coApplicantErrors);
      
      if (Object.keys(applicantErrors).length > 0 || Object.keys(coApplicantErrors).length > 0) {
        toast.error('Please fix validation errors.');
        return;
      }
      
      // Trim middle_initial to 1 char if present
      const applicant = { ...formData.applicant };
      if (applicant.middle_initial) applicant.middle_initial = applicant.middle_initial[0];
      const coApplicant = { ...formData.coApplicant };
      if (coApplicant.middle_initial) coApplicant.middle_initial = coApplicant.middle_initial[0];

      // --- NEST name fields under name_information for backend ---
      const {
        title, first_name, middle_initial, last_name, suffix, maiden_name, is_consultant, ...restApplicant
      } = applicant;
      const applicantPayload = {
        ...restApplicant,
        name_information: {
          title, first_name, middle_initial, last_name, suffix, maiden_name, is_consultant
        },
        liabilities: formData.liabilities || [] // Add liabilities to applicant payload
      };
      const {
        title: coTitle, first_name: coFirstName, middle_initial: coMiddleInitial, last_name: coLastName, suffix: coSuffix, maiden_name: coMaidenName, is_consultant: coIsConsultant, ...restCoApplicant
      } = coApplicant;
      const coApplicantPayload = formData.coApplicant?.include_coapplicant
        ? {
            ...restCoApplicant,
            name_information: {
              title: coTitle, first_name: coFirstName, middle_initial: coMiddleInitial, last_name: coLastName, suffix: coSuffix, maiden_name: coMaidenName, is_consultant: coIsConsultant
            },
            include_coapplicant: true
          }
        : { include_coapplicant: false };
      // Remove client_id from payload
      const { clientId, coApplicant: coApplicantRaw, householdMembers, ...rest } = formData;
      const payload = {
        ...rest,
        applicant: applicantPayload,
        co_applicant: coApplicantPayload,
        household_members: (applicant.household_members || []).map(m => ({
          first_name: m.first_name || '',
          middle_initial: m.middle_initial || '',
          last_name: m.last_name || '',
          relationship: m.relationship || '',
          dob: m.dob || '',
          age: m.age || '',
          sex: m.sex || '',
          marital_status: m.marital_status || '',
          ssn: m.ssn || ''
        })),
        mortgage: formData.mortgage || {}, // Add mortgage data to payload
        loanStatus: formData.loanStatus || undefined // Add loanStatus if present
      };
      
      if (isCreate) {
        console.log('📤 Preparing create data...');
        await onSave(payload); // Send applicant.liabilities only
        toast.success('Client created successfully!');
        if (typeof onBack === 'function') {
          onBack();
        }
        setIsSubmitting(false);
        return;
      } else if (isEdit) {
        if (!formData.clientId) throw new Error('Missing client ID');
        // Update applicant and co_applicant separately
        if (formData.applicant && formData.applicant._id) {
          await updateApplicantBasic.mutateAsync({ clientId: formData.clientId, data: applicantPayload.name_information });
          await updateApplicantAddress.mutateAsync({ clientId: formData.clientId, data: { currentAddress: applicantPayload.current_address, previousAddress: applicantPayload.previous_address } });
          await updateApplicantEmployment.mutateAsync({ clientId: formData.clientId, data: { employment: applicantPayload.employment, previousEmployment: applicantPayload.previous_employment } });
          await updateApplicantDemographics.mutateAsync({ clientId: formData.clientId, data: {
            birth_place: applicantPayload.birth_place,
            dob: applicantPayload.date_of_birth,
            ssn: applicantPayload.ssn,
            race: applicantPayload.race,
            marital_status: applicantPayload.marital_status,
            anniversary: applicantPayload.anniversary,
            spouse_name: applicantPayload.spouse_name,
            spouse_occupation: applicantPayload.spouse_occupation,
            number_of_dependents: applicantPayload.number_of_dependents
          }});
        }
        if (formData.coApplicant && formData.coApplicant._id) {
          await updateCoApplicantBasic.mutateAsync({ clientId: formData.clientId, data: coApplicantPayload.name_information });
          await updateCoApplicantAddress.mutateAsync({ clientId: formData.clientId, data: { currentAddress: coApplicantPayload.current_address, previousAddress: coApplicantPayload.previous_address } });
          await updateCoApplicantEmployment.mutateAsync({ clientId: formData.clientId, data: { employment: coApplicantPayload.employment, previousEmployment: coApplicantPayload.previous_employment } });
          await updateCoApplicantDemographics.mutateAsync({ clientId: formData.clientId, data: {
            birth_place: coApplicantPayload.birth_place,
            dob: coApplicantPayload.date_of_birth,
            race: coApplicantPayload.race,
            marital_status: coApplicantPayload.marital_status,
            anniversary: coApplicantPayload.anniversary,
            spouse_name: coApplicantPayload.spouse_name,
            spouse_occupation: coApplicantPayload.spouse_occupation,
            number_of_dependents: coApplicantPayload.number_of_dependents
          }});
        }
        const { clientId, createdAt, updatedAt, ...update } = payload;
        const updateSnake = {
          ...update,
          client_id: formData.clientId,
          entry_date: (update.entryDate || '').split('T')[0],
          payoff_amount: update.payoffAmount,
          consultant_name: update.consultantName,
          processor_name: update.processorName,
          status: (update.status || '').toLowerCase(),
          applicant: formData.applicant || undefined,
          co_applicant: formData.coApplicant || undefined,
          liabilities: formData.liabilities || undefined,
          mortgage: formData.mortgage || undefined,
          underwriting: formData.underwriting || undefined,
          loanStatus: formData.loanStatus || undefined
        };
        delete updateSnake.entryDate;
        delete updateSnake.payoffAmount;
        delete updateSnake.consultantName;
        delete updateSnake.processorName;
        console.log('📤 Sending update request...');
        console.log('Payload for updateClient:', updateSnake);
        const result = await updateClientMutation.mutateAsync({ id: formData.clientId, update: updateSnake });
        toast.success('Client updated successfully!');
        onSave(formData);
      }
      
      console.log('✅ Form submission completed successfully');
    } catch (err: any) {
      console.error('❌ Form submission error:', err);
      setErrorMsg(err?.message || 'An error occurred.');
      toast.error('Failed to save client: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const [activeTab, setActiveTab] = useState('applicant');

  const handleAddHouseholdMember = () => {
    if (isReadOnly) return;
    const newMember = {
      first_name: '',
      middle_initial: '',
      last_name: '',
      relationship: '',
      dob: '',
      age: '',
      sex: '',
      marital_status: '',
      ssn: ''
    };
    setFormData(prev => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        household_members: [...(prev.applicant.household_members || []), newMember]
      }
    }));
  };

  const updateHouseholdMember = (index, field, value) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        household_members: prev.applicant.household_members.map((member, i) => 
          i === index ? { ...member, [field]: value } : member
        )
      }
    }));
  };

  const removeHouseholdMember = (index) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      applicant: {
        ...prev.applicant,
        household_members: prev.applicant.household_members.filter((_, i) => i !== index)
      }
    }));
  };

  const getTitle = () => {
    if (isCreate) return 'Create New Client';
    if (isEdit) return 'Edit Client';
    return 'Client Details';
  };

  const getSubtitle = () => {
    if (isCreate) return 'Enter client information';
    if (isEdit) return 'Modify client information';
    return 'Viewing comprehensive client information';
  };

  const tabs = [
    { id: 'applicant', label: 'Applicant' },
    { id: 'co-applicant', label: 'Co-Applicant' },
    { id: 'liabilities', label: 'Liabilities' },
    { id: 'mortgages', label: 'Mortgages' },
    { id: 'underwriting', label: 'Underwriting' },
    { id: 'loan-status', label: 'Loan Status' },
    { id: 'mortgage-application', label: 'Mortgage' },
    { id: 'driver', label: 'Driver' },
    { id: 'vehicle-coverage', label: 'Vehicle Coverage' },
    { id: 'homeowners', label: 'Homeowners' },
    { id: 'renters', label: 'Renters' },
    { id: 'income-protection', label: 'Income Protection' },
    { id: 'retirement', label: 'Retirement' },
    { id: 'lineage', label: 'Lineage' },
    { id: 'notes', label: 'Notes' }
  ];

  // Update getClientId and getEntryDate to use camelCase
  const getClientId = () => (clientData?.clientId || '');
  const getEntryDate = () => {
    if (mode === 'create') return dayjs().format('YYYY-MM-DD');
    return clientData?.entryDate ? dayjs(clientData.entryDate).format('YYYY-MM-DD') : '';
  };

  const handleFillDummyData = () => {
    setFormData(prev => ({
      ...prev,
      applicant: randomApplicant(),
      coApplicant: randomApplicant(),
      status: ['Active','Pending','Inactive'][randomInt(0,2)],
      payoffAmount: randomInt(0,100000),
      consultantName: randomName().first + ' ' + randomName().last,
      processorName: randomName().first + ' ' + randomName().last,
      entryDate: dayjs().format('YYYY-MM-DD'),
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form onSubmit triggered');
    handleSave();
  };

  return (
    <form onSubmit={handleFormSubmit} className="min-h-screen">
      <div className="text-white p-6 shadow-lg bg-[#34495e]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-10 px-4 py-2 text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Clients
            </button>
          </div>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-green-100 text-green-800 ml-4">
            <Shield className="w-3 h-3 mr-1" />
                Authenticated
              </div>
            </div>
        <h1 className="text-3xl font-bold">
          {isCreate ? 'Create New Client' : isReadOnly ? 'Client Details' : 'Edit Client'}
        </h1>
        <p className="text-gray-300 mt-2">
          {isCreate ? 'Enter new client information' : isReadOnly ? 'Viewing comprehensive client information' : 'Edit client details and save changes'}
        </p>
      </div>
      <div className="p-6 bg-gray-50">
        {errorMsg && (
          <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>
        )}
        <button
          type="button"
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleFillDummyData}
          style={{ display: isReadOnly ? 'none' : 'block' }}
        >
          Fill Dummy Data
        </button>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="text-2xl font-semibold leading-none tracking-tight flex items-center justify-between">
              <span className="flex items-center">
                {mode === 'create' ? (
                  <>
                    <span className="text-xl font-semibold">+ New Client Information</span>
                    {clientData?.client_id && (
                      <span className="ml-4 text-lg font-normal">
                        {clientData.client_id}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2 text-gray-500" />
                    {clientData?.client_id && (
                      <span className="text-xl font-semibold">
                        {clientData.client_id}
                      </span>
                    )}
                    {clientData?.applicant?.name_information && (
                      <>
                        {clientData?.client_id && <span className="mx-2">|</span>}
                        <span className="text-lg font-normal">
                          {clientData.applicant.name_information.first_name} {clientData.applicant.name_information.last_name}
                        </span>
                      </>
                    )}
                  </>
                )}
              </span>
              <div className="flex gap-2">
                {isReadOnly && (
                  <button 
                    type="button"
                    onClick={() => onSave && onSave('edit')}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    <SquarePen className="w-4 h-4 mr-2" />
                    Edit Client
                  </button>
                )}
                {!isReadOnly && (
                  <>
                    <button 
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
                      disabled={isSubmitting}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Saving...' : (isCreate ? 'Create Client' : 'Save Changes')}
                    </button>
                    <button 
                      type="button"
                      onClick={onCancel}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-gray-100 h-10 px-4 py-2"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="w-full">
                  <div role="tablist" aria-orientation="horizontal" className="items-center rounded-md text-muted-foreground flex flex-wrap w-full gap-1 p-2 h-auto bg-muted/50 justify-start">
                <button type="button" role="tab" aria-selected={activeTab === 'applicant'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'applicant' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('applicant')}>Applicant</button>
                <button type="button" role="tab" aria-selected={activeTab === 'co-applicant'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'co-applicant' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('co-applicant')}>Co-Applicant</button>
                <button type="button" role="tab" aria-selected={activeTab === 'liabilities'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'liabilities' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('liabilities')}>Liabilities</button>
                <button type="button" role="tab" aria-selected={activeTab === 'mortgage-application'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'mortgage-application' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('mortgage-application')}>Mortgage</button>
                <button type="button" role="tab" aria-selected={activeTab === 'underwriting'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'underwriting' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('underwriting')}>Underwriting</button>
                <button type="button" role="tab" aria-selected={activeTab === 'loan-status'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'loan-status' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('loan-status')}>Loan Status</button>
                <button type="button" role="tab" aria-selected={activeTab === 'driver'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'driver' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('driver')}>Driver</button>
                  </div>
                  <div className="m-2 mt-6  bg-gray-200 rounded-xl">
                    {activeTab === 'applicant' && (
                      <>
                        <CaseInformationSection
                          clientId={formData.clientId}
                          entryDate={formData.entryDate}
                          payoffAmount={formData.payoffAmount}
                          status={formData.status}
                          consultantName={formData.consultantName}
                          processorName={formData.processorName}
                          isReadOnly={isReadOnly}
                          isCreate={isCreate}
                          errors={errors.applicant}
                          handleInputChange={(field, value) => handleNestedInputChange([field], value)}
                        />
                        <NameInformationSection
                          formData={formData.applicant || {}}
                          isReadOnly={isReadOnly}
                          isCreate={isCreate}
                          errors={errors.applicant}
                          clientId={getClientId()}
                          entryDate={getEntryDate()}
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)}
                        />
                        <AddressSection 
                          formData={formData.applicant || {}} 
                          isReadOnly={isReadOnly} 
                          isCreate={isCreate}
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)} 
                        />
                        <PreviousAddressSection 
                          formData={formData.applicant || {}} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)} 
                        />
                        <EmploymentSection 
                          formData={formData.applicant || {}} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)} 
                        />
                        <PreviousEmploymentSection 
                          formData={formData.applicant || {}} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)} 
                        />
                        <DemographicsSection 
                          formData={formData.applicant || {}} 
                          isReadOnly={isReadOnly} 
                          isCreate={isCreate}
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)} 
                        />
                        <HouseholdMembersSection 
                          formData={formData.applicant || {}} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={handleNestedInputChange}
                          updateHouseholdMember={updateHouseholdMember}
                          removeHouseholdMember={removeHouseholdMember}
                          handleAddHouseholdMember={handleAddHouseholdMember}
                        />
                      </>
                    )}
                {activeTab === 'co-applicant' && (
                  <>
                    <div className="bg-blue-100 rounded-lg p-6 mb-6 flex items-center justify-between">
                      <span className="text-xl font-semibold text-blue-900">Co-Applicant Information</span>
                      <label className="flex items-center gap-2 text-base font-medium text-black">
                        <input
                          type="checkbox"
                          checked={!!formData.coApplicant?.include_coapplicant}
                          onChange={e => {
                            const checked = e.target.checked;
                            setFormData(prev => ({
                              ...prev,
                              coApplicant: {
                                ...prev.coApplicant,
                                include_coapplicant: checked
                              }
                            }));
                          }}
                          disabled={isReadOnly}
                        />
                        Include Co-Applicant
                      </label>
                    </div>
                    {formData.coApplicant?.include_coapplicant ? (
                      <>
                        <NameInformationSection 
                          formData={formData.coApplicant || {}} 
                          isReadOnly={isReadOnly} 
                          isCreate={isCreate}
                          errors={errors.coApplicant}
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                        />
                        <AddressSection 
                          formData={formData.coApplicant || {}} 
                          isReadOnly={isReadOnly} 
                          isCreate={isCreate}
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                        />
                        <PreviousAddressSection 
                          formData={formData.coApplicant || {}} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                        />
                        <EmploymentSection 
                          formData={formData.coApplicant || {}} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                        />
                        <PreviousEmploymentSection 
                          formData={formData.coApplicant || {}} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                        />
                        <DemographicsSection 
                          formData={formData.coApplicant || {}} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                        />
                      </>
                    ) : null}
                  </>
                )}
                {activeTab === 'liabilities' && (
                  <LiabilitiesSection
                    formData={formData}
                    setFormData={setFormData}
                    isReadOnly={isReadOnly}
                    clientId={formData.clientId}
                  />
                )}
                {activeTab === 'mortgage-application' && (
                  <MortgageApplicationSection formData={formData} setFormData={setFormData} isReadOnly={isReadOnly} />
                )}
                {activeTab === 'underwriting' && (
                  <UnderwritingSection formData={formData} setFormData={setFormData} isReadOnly={isReadOnly} />
                )}
                {activeTab === 'loan-status' && (
                  <LoanStatusTab
                    data={formData.loanStatus || {}}
                    onUpdate={updates => setFormData(prev => ({ ...prev, loanStatus: { ...prev.loanStatus, ...updates } }))}
                    isReadOnly={isReadOnly}
                  />
                )}
                {activeTab === 'driver' && (
                  <DriverSection
                    drivers={formData.drivers || [{
                      fullName: '', dateOfBirth: '', age: '', relationship: '', ssn: '', sex: '', maritalStatus: '', drivingStatus: '', licenseNumber: '', state: '', accidentsViolations: '0',
                    }]}
                    setDrivers={drivers => setFormData(prev => ({ ...prev, drivers }))}
                    isReadOnly={isReadOnly}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
  );
};

export default ClientForm;