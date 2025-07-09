import React, { useState } from 'react';
import { Eye, ArrowLeft, Shield, SquarePen, Save, X, Plus } from 'lucide-react';
import { useCreateClient, useUpdateClient } from '@/hooks/useSecuriaClients';
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

interface ClientFormProps {
  mode?: 'view' | 'edit' | 'create';
  clientData?: any;
  onSave?: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  onBack?: () => void;
}

const emptyClient = {
  // Only include the minimal structure needed for the form to work
  applicant: { household_members: [
    { name: '', dob: '', relationship: '', age: '' }
  ] },
  coApplicant: {},
  householdMembers: [],
  client_id: '',
  entry_date: dayjs().format('YYYY-MM-DD'), // Set to today by default
  status: '',
  payoff_amount: 0,
  consultant_name: '',
  processor_name: '',
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
  title: yup.string().oneOf(['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']).optional(),
  first_name: yup.string().required('First name is required'),
  middle_initial: yup.string().max(1, 'Middle initial must be 1 character').optional(),
  last_name: yup.string().required('Last name is required'),
  suffix: yup.string().oneOf(['Jr.', 'Sr.', 'II', 'III', 'IV', 'V', 'MD', 'PhD']).optional(),
  maiden_name: yup.string().optional(),
  is_consultant: yup.boolean().optional(),
  date_of_birth: yup.string().matches(dateRegex, 'Date of birth must be YYYY-MM-DD').optional(),
  marital_status: yup.string().oneOf(['Single', 'Married', 'Divorced', 'Widowed', 'Separated']).optional(),
  race: yup.string().oneOf(['White', 'Black', 'Asian', 'Hispanic', 'Other']).optional(),
  birth_place: yup.string().optional(),
  anniversary: yup.string().matches(dateRegex, 'Anniversary must be YYYY-MM-DD').optional(),
  spouse_name: yup.string().optional(),
  spouse_occupation: yup.string().optional(),
  number_of_dependents: yup.string().matches(/^\d+$/, 'Number of dependents must be a number').optional(),
  fax: yup.string().matches(phoneRegex, 'Invalid fax number').optional(),
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
    email: yup.string().email('Invalid email').optional(),
  }).optional(),
  current_address: yup.object({
    months: yup.string().matches(/^\d+$/, 'Months must be a number').optional(),
    years: yup.string().matches(/^\d+$/, 'Years must be a number').optional(),
    how_long_at_current_address: yup.string().optional(),
  }).optional(),
  previous_address: yup.object({
    address: yup.string().max(200, 'Address too long').optional(),
    city: yup.string().max(100, 'City too long').optional(),
    state: yup.string().matches(stateRegex, 'State must be 2 uppercase letters').optional(),
    zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits or ZIP+4').optional(),
    months: yup.string().matches(/^\d+$/, 'Months must be a number').optional(),
    years: yup.string().matches(/^\d+$/, 'Years must be a number').optional(),
    duration: yup.string().optional(),
  }).optional(),
  employment: yup.object({
    status: yup.string().oneOf(['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student']).optional(),
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
  return ['White','Black','Asian','Hispanic','Other'][randomInt(0,4)];
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
      months: randomInt(0,11).toString(),
      years: randomInt(0,20).toString(),
      how_long_at_current_address: `${randomInt(0,20)} years ${randomInt(0,11)} months`,
    },
    previous_address: {
      address: randomInt(100,9999) + ' ' + randomString(6) + ' Ave',
      city: randomString(6).charAt(0).toUpperCase() + randomString(5),
      state: randomState(),
      zip_code: randomZip(),
      months: randomInt(0,11).toString(),
      years: randomInt(0,20).toString(),
      duration: `${randomInt(0,20)} years ${randomInt(0,11)} months`,
    },
    employment: {
      status: ['Employed','Self-Employed','Unemployed','Retired','Student'][randomInt(0,4)],
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
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const isReadOnly = mode === 'view';
  const isCreate = mode === 'create';
  const isEdit = mode === 'edit';
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({ applicant: {}, coApplicant: {} });

  React.useEffect(() => {
    if (clientData) {
      console.log('ClientFormTabs received clientData:', clientData);
    }
    if (clientData) {
      setFormData(clientData);
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
      const coApplicantErrors = await validateSection('coApplicant', formData.coApplicant);
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
      
      // Remove client_id from payload
      const { client_id, coApplicant: coApplicantPayload, householdMembers, ...rest } = formData;
      const payload = {
        ...rest,
        applicant,
        co_applicant: coApplicant,
        household_members: applicant.household_members || [],
      };
      
      if (isCreate) {
        console.log('📤 Sending create request...');
        const result = await createClientMutation.mutateAsync(payload);
        toast.success('Client created successfully!');
        onSave(result?.data || formData);
      } else if (isEdit) {
        if (!formData._id) throw new Error('Missing client ID');
        const { _id, createdAt, updatedAt, ...update } = payload;
        console.log('📤 Sending update request...');
        const result = await updateClientMutation.mutateAsync({ id: formData._id, update });
        toast.success('Client updated successfully!');
        onSave(result?.data || formData);
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
    { id: 'drivers', label: 'Drivers' },
    { id: 'vehicle-coverage', label: 'Vehicle Coverage' },
    { id: 'homeowners', label: 'Homeowners' },
    { id: 'renters', label: 'Renters' },
    { id: 'income-protection', label: 'Income Protection' },
    { id: 'retirement', label: 'Retirement' },
    { id: 'lineage', label: 'Lineage' },
    { id: 'notes', label: 'Notes' }
  ];

  const getClientId = () => (clientData?.client_id || '');
  const getEntryDate = () => {
    if (mode === 'create') return dayjs().format('YYYY-MM-DD');
    return clientData?.entry_date ? dayjs(clientData.entry_date).format('YYYY-MM-DD') : '';
  };

  const handleFillDummyData = () => {
    setFormData(prev => ({
      ...prev,
      applicant: randomApplicant(),
      coApplicant: randomApplicant(),
      status: ['Active','Pending','Inactive'][randomInt(0,2)],
      payoff_amount: randomInt(0,100000),
      consultant_name: randomName().first + ' ' + randomName().last,
      processor_name: randomName().first + ' ' + randomName().last,
      entry_date: dayjs().format('YYYY-MM-DD'),
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form onSubmit triggered');
    handleSave();
  };

  return (
    <form onSubmit={handleFormSubmit} className="min-h-screen bg-gray-50">
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
          {isCreate ? 'Create Client' : isReadOnly ? 'Client Details' : 'Edit Client'}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-5 h-5 mr-2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                {clientData?.applicant?.firstName} {clientData?.applicant?.lastName}
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
                  </div>
                  <div className="mt-6">
                    {activeTab === 'applicant' && (
                      <>
                        <CaseInformationSection
                          client_id={formData.client_id}
                          entry_date={formData.entry_date}
                          payoff_amount={formData.payoff_amount}
                          status={formData.status}
                          consultant_name={formData.consultant_name}
                          processor_name={formData.processor_name}
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
                          formData={formData.applicant} 
                          isReadOnly={isReadOnly} 
                          isCreate={isCreate}
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)} 
                        />
                        <PreviousAddressSection 
                          formData={formData.applicant} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)} 
                        />
                        <EmploymentSection 
                          formData={formData.applicant} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)} 
                        />
                        <PreviousEmploymentSection 
                          formData={formData.applicant} 
                          isReadOnly={isReadOnly} 
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)} 
                        />
                        <DemographicsSection 
                          formData={formData.applicant} 
                          isReadOnly={isReadOnly} 
                          isCreate={isCreate}
                          handleNestedInputChange={(path, value) => handleNestedInputChange(['applicant', ...path], value)} 
                        />
                        <HouseholdMembersSection 
                          formData={formData.applicant} 
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
                    <NameInformationSection 
                      formData={formData.coApplicant || {}} 
                      isReadOnly={isReadOnly} 
                      isCreate={isCreate}
                      errors={errors.coApplicant}
                      handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                    />
                    <AddressSection 
                      formData={formData.coApplicant} 
                      isReadOnly={isReadOnly} 
                      isCreate={isCreate}
                      handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                    />
                    <PreviousAddressSection 
                      formData={formData.coApplicant} 
                      isReadOnly={isReadOnly} 
                      handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                    />
                    <EmploymentSection 
                      formData={formData.coApplicant} 
                      isReadOnly={isReadOnly} 
                      handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                    />
                    <PreviousEmploymentSection 
                      formData={formData.coApplicant} 
                      isReadOnly={isReadOnly} 
                      handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                    />
                    <DemographicsSection 
                      formData={formData.coApplicant} 
                      isReadOnly={isReadOnly} 
                      handleNestedInputChange={(path, value) => handleNestedInputChange(['coApplicant', ...path], value)} 
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
  );
};

export default ClientForm;