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
import { US_STATES } from '../../constants';
import IncomeProtectionSection from './IncomeProtectionSection';
import VehicleCoverageSection from './VehicleCoverageSection';
import RetirementSection from './RetirementSection';
import HomeownersSection from './HomeownersSection';
import RentersSection from './RentersSection';

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
  // drivers: [{
  //   fullName: '',
  //   dateOfBirth: '',
  //   age: '',
  //   relationship: '',
  //   ssn: '',
  //   sex: '',
  //   maritalStatus: '',
  //   drivingStatus: '',
  //   licenseNumber: '',
  //   state: '',
  //   accidentsViolations: '0',
  // }],
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
// US States array for dropdowns
// Remove the US_STATES array from here and import it from the shared constants file
// export const US_STATES = [
//   { value: 'AL', label: 'Alabama' },
//   { value: 'AK', label: 'Alaska' },
//   { value: 'AZ', label: 'Arizona' },
//   { value: 'AR', label: 'Arkansas' },
//   { value: 'CA', label: 'California' },
//   { value: 'CO', label: 'Colorado' },
//   { value: 'CT', label: 'Connecticut' },
//   { value: 'DE', label: 'Delaware' },
//   { value: 'FL', label: 'Florida' },
//   { value: 'GA', label: 'Georgia' },
//   { value: 'HI', label: 'Hawaii' },
//   { value: 'ID', label: 'Idaho' },
//   { value: 'IL', label: 'Illinois' },
//   { value: 'IN', label: 'Indiana' },
//   { value: 'IA', label: 'Iowa' },
//   { value: 'KS', label: 'Kansas' },
//   { value: 'KY', label: 'Kentucky' },
//   { value: 'LA', label: 'Louisiana' },
//   { value: 'ME', label: 'Maine' },
//   { value: 'MD', label: 'Maryland' },
//   { value: 'MA', label: 'Massachusetts' },
//   { value: 'MI', label: 'Michigan' },
//   { value: 'MN', label: 'Minnesota' },
//   { value: 'MS', label: 'Mississippi' },
//   { value: 'MO', label: 'Missouri' },
//   { value: 'MT', label: 'Montana' },
//   { value: 'NE', label: 'Nebraska' },
//   { value: 'NV', label: 'Nevada' },
//   { value: 'NH', label: 'New Hampshire' },
//   { value: 'NJ', label: 'New Jersey' },
//   { value: 'NM', label: 'New Mexico' },
//   { value: 'NY', label: 'New York' },
//   { value: 'NC', label: 'North Carolina' },
//   { value: 'ND', label: 'North Dakota' },
//   { value: 'OH', label: 'Ohio' },
//   { value: 'OK', label: 'Oklahoma' },
//   { value: 'OR', label: 'Oregon' },
//   { value: 'PA', label: 'Pennsylvania' },
//   { value: 'RI', label: 'Rhode Island' },
//   { value: 'SC', label: 'South Carolina' },
//   { value: 'SD', label: 'South Dakota' },
//   { value: 'TN', label: 'Tennessee' },
//   { value: 'TX', label: 'Texas' },
//   { value: 'UT', label: 'Utah' },
//   { value: 'VT', label: 'Vermont' },
//   { value: 'VA', label: 'Virginia' },
//   { value: 'WA', label: 'Washington' },
//   { value: 'WV', label: 'West Virginia' },
//   { value: 'WI', label: 'Wisconsin' },
//   { value: 'WY', label: 'Wyoming' }
// ];

const clientIdRegex = /^CAN\d{5}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Update validation schemas
const nameRegex = /^[A-Za-z]+$/;
const zipRegex = /^\d{5}$/;

// const applicantSchema = yup.object().shape({
//   first_name: yup.string().required('First name is required').matches(nameRegex, 'First name can only contain letters'),
//   last_name: yup.string().required('Last name is required').matches(nameRegex, 'Last name can only contain letters'),
//   contact: yup.object({
//     email: yup.string().email('Invalid email').required('Email is required'),
//     // All other fields optional
//   }).required(),
//   current_address: yup.object({
//     address: yup.string().max(200, 'Address too long').optional(),
//     city: yup.string().max(100, 'City too long').optional(),
//     state: yup.string().oneOf(US_STATES.map(s => s.value), 'Select a valid state').optional(),
//     zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits').optional(),
//     county: yup.string().max(100, 'County too long').optional(),
//     home_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
//     work_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
//     cell_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
//     other_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
//     email: yup.string().email('Invalid email').optional(),
//     years: yup
//       .number()
//       .min(0, 'Years must be 0 or greater')
//       .typeError('Years must be a number')
//       .optional(),
//     months: yup
//       .number()
//       .min(0, 'Months must be between 0 and 11')
//       .max(11, 'Months must be between 0 and 11')
//       .typeError('Months must be a number')
//       .optional(),
//     how_long_at_current_address: yup.string().optional(),
//     // fax: yup.string().matches(phoneRegex, 'Invalid fax number').optional(),
//   }).optional(),
//   previous_address: yup.object({
//     address: yup.string().max(200, 'Address too long').optional(),
//     city: yup.string().max(100, 'City too long').optional(),
//     state: yup.string().oneOf(US_STATES.map(s => s.value), 'Select a valid state').optional(),
//     zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits').optional(),
//     years: yup
//       .number()
//       .min(0, 'Years must be 0 or greater')
//       .typeError('Years must be a number')
//       .optional(),
//     months: yup
//       .number()
//       .min(0, 'Months must be between 0 and 11')
//       .max(11, 'Months must be between 0 and 11')
//       .typeError('Months must be a number')
//       .optional(),
//     duration: yup.string().optional(),
//   }).optional(),
//   employment: yup.object({
//     status: yup.string().oneOf(['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student', 'Part time', 'Contract']).optional(),
//     is_business_owner: yup.string().optional(),
//     employer_name: yup.string().optional(),
//     employer_address: yup.string().optional(),
//     employer_city: yup.string().optional(),
//     employer_state: yup.string().oneOf(US_STATES.map(s => s.value), 'Select a valid state').optional(),
//     employer_zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits').optional(),
//     occupation: yup.string().optional(),
//     // monthly_salary: yup.string().matches(/^[\d.]+$/, 'Monthly salary must be a number').optional(),
//     // other_income: yup.string().matches(/^[\d.]+$/, 'Other income must be a number').optional(),
//     start_date: yup.string().matches(dateRegex, 'Start date must be YYYY-MM-DD').optional(),
//     end_date: yup.string().matches(dateRegex, 'End date must be YYYY-MM-DD').optional(),
//     supervisor: yup.string().optional(),
//     supervisor_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
//     source: yup.string().optional(),
//   }).optional(),
//   previous_employment: yup.object({
//     employer_name: yup.string().optional(),
//     employer_address: yup.string().optional(),
//     employer_city: yup.string().optional(),
//     employer_state: yup.string().oneOf(US_STATES.map(s => s.value), 'Select a valid state').optional(),
//     employer_zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits').optional(),
//     from_date: yup.string().matches(dateRegex, 'From date must be YYYY-MM-DD').optional(),
//     to_date: yup.string().matches(dateRegex, 'To date must be YYYY-MM-DD').optional(),
//     occupation: yup.string().optional(),
//   }).optional(),
//   credit_scores: yup.object({
//     equifax: yup.string().matches(/^\d+$/, 'Equifax score must be a number').optional(),
//     experian: yup.string().matches(/^\d+$/, 'Experian score must be a number').optional(),
//     transunion: yup.string().matches(/^\d+$/, 'Transunion score must be a number').optional(),
//   }).optional(),
// });

// const coApplicantSchema = yup.object().shape({
//   first_name: yup.string().matches(nameRegex, 'First name can only contain letters').optional(),
//   last_name: yup.string().matches(nameRegex, 'Last name can only contain letters').optional(),
//   contact: yup.object({
//     email: yup.string().email('Invalid email').optional(),
//   }).optional(),
//   // All other fields optional
//   current_address: yup.object({
//     address: yup.string().max(200, 'Address too long').optional(),
//     city: yup.string().max(100, 'City too long').optional(),
//     state: yup.string().oneOf(US_STATES.map(s => s.value), 'Select a valid state').optional(),
//     zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits').optional(),
//     county: yup.string().max(100, 'County too long').optional(),
//     home_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
//     work_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
//     cell_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
//     other_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
//     email: yup.string().email('Invalid email').optional(),
//     years: yup
//       .number()
//       .min(0, 'Years must be 0 or greater')
//       .typeError('Years must be a number')
//       .optional(),
//     months: yup
//       .number()
//       .min(0, 'Months must be between 0 and 11')
//       .max(11, 'Months must be between 0 and 11')
//       .typeError('Months must be a number')
//       .optional(),
//     how_long_at_current_address: yup.string().optional(),
//     // fax: yup.string().matches(phoneRegex, 'Invalid fax number').optional(),
//   }).optional(),
//   previous_address: yup.object({
//     address: yup.string().max(200, 'Address too long').optional(),
//     city: yup.string().max(100, 'City too long').optional(),
//     state: yup.string().oneOf(US_STATES.map(s => s.value), 'Select a valid state').optional(),
//     zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits').optional(),
//     years: yup
//       .number()
//       .min(0, 'Years must be 0 or greater')
//       .typeError('Years must be a number')
//       .optional(),
//     months: yup
//       .number()
//       .min(0, 'Months must be between 0 and 11')
//       .max(11, 'Months must be between 0 and 11')
//       .typeError('Months must be a number')
//       .optional(),
//     duration: yup.string().optional(),
//   }).optional(),
//   employment: yup.object({
//     status: yup.string().oneOf(['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student', 'Part time', 'Contract']).optional(),
//     is_business_owner: yup.string().optional(),
//     employer_name: yup.string().optional(),
//     employer_address: yup.string().optional(),
//     employer_city: yup.string().optional(),
//     employer_state: yup.string().oneOf(US_STATES.map(s => s.value), 'Select a valid state').optional(),
//     employer_zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits').optional(),
//     occupation: yup.string().optional(),
//     // monthly_salary: yup.string().matches(/^[\d.]+$/, 'Monthly salary must be a number').optional(),
//     // other_income: yup.string().matches(/^[\d.]+$/, 'Other income must be a number').optional(),
//     start_date: yup.string().matches(dateRegex, 'Start date must be YYYY-MM-DD').optional(),
//     end_date: yup.string().matches(dateRegex, 'End date must be YYYY-MM-DD').optional(),
//     supervisor: yup.string().optional(),
//     supervisor_phone: yup.string().matches(phoneRegex, 'Invalid phone number').optional(),
//     source: yup.string().optional(),
//   }).optional(),
//   previous_employment: yup.object({
//     employer_name: yup.string().optional(),
//     employer_address: yup.string().optional(),
//     employer_city: yup.string().optional(),
//     employer_state: yup.string().oneOf(US_STATES.map(s => s.value), 'Select a valid state').optional(),
//     employer_zip_code: yup.string().matches(zipRegex, 'Zip code must be 5 digits').optional(),
//     from_date: yup.string().matches(dateRegex, 'From date must be YYYY-MM-DD').optional(),
//     to_date: yup.string().matches(dateRegex, 'To date must be YYYY-MM-DD').optional(),
//     occupation: yup.string().optional(),
//   }).optional(),
//   credit_scores: yup.object({
//     equifax: yup.string().matches(/^\d+$/, 'Equifax score must be a number').optional(),
//     experian: yup.string().matches(/^\d+$/, 'Experian score must be a number').optional(),
//     transunion: yup.string().matches(/^\d+$/, 'Transunion score must be a number').optional(),
//   }).optional(),
// });

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
      // other_income: randomInt(0,2000).toString(),
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
      gross_monthly_salary: app.current_employment?.gross_monthly_salary || app.current_employment?.monthly_salary || '',
      additional_income: app.current_employment?.additional_income || app.current_employment?.other_income || '',
      monthly_salary: app.current_employment?.monthly_salary || '',
      // other_income: app.current_employment?.other_income || '',
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
        coApplicant: {
          ...mapApplicantFromBackend(clientData.co_applicant || clientData.coApplicant),
          include_coapplicant: !!(
            clientData.co_applicant &&
            (clientData.co_applicant.include_coapplicant === true || clientData.co_applicant.is_consultant === true)
          )
        },
        liabilities: clientData.liabilities || [],
        mortgage: mortgageData,
      });
    } else {
      setFormData(emptyClient);
    }
  }, [clientData]);

  // Ensure coApplicant.include_coapplicant is always present and correct
  // (Removed problematic useEffect that caused infinite loop)

  const handleNestedInputChange = (path, value) => {
    if (isReadOnly) return;
    setFormData(prev => setNestedValue(prev, path, value));
  };

  const validateSection = async (section, data) => {
    try {
      //if (section === 'applicant') await applicantSchema.validate(data, { abortEarly: false });
      //if (section === 'coApplicant') await coApplicantSchema.validate(data, { abortEarly: false });
      return {};
    } catch (err) {
      const errorObj = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          // Map email error to 'contact.email' for consistent error display
          if (e.path === 'email' || e.path === 'contact.email') {
            errorObj['contact.email'] = e.message;
          } else {
            errorObj[e.path] = e.message;
          }
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
    // incomeProtection: formData.incomeProtection || undefined,

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
        const errorMessages = [
          ...Object.values(applicantErrors),
          ...Object.values(coApplicantErrors)
        ];
        toast.error('Please fix validation errors: ' + errorMessages.join('; '));
        // Scroll to first applicant error field if present
        const applicantErrorFields = Object.keys(applicantErrors);
        if (applicantErrorFields.length > 0) {
          // Map schema keys to input IDs (for first_name, last_name, email)
          const fieldIdMap = {
            first_name: 'first_name',
            last_name: 'last_name',
            'contact.email': 'email',
            email: 'email',
          };
          let firstErrorField = applicantErrorFields[0];
          // If the error is for contact.email, use 'email' as id
          if (firstErrorField.startsWith('contact.')) {
            firstErrorField = 'email';
          }
          const inputId = fieldIdMap[firstErrorField] || firstErrorField;
          const el = document.getElementById(inputId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (el as HTMLElement).focus();
          }
        }
        return;
      }
      
      // Trim middle_initial to 1 char if present
      const applicant = { ...formData.applicant };
      if (applicant.middle_initial) applicant.middle_initial = applicant.middle_initial[0];
      const coApplicant = { ...formData.coApplicant };
      if (coApplicant.middle_initial) coApplicant.middle_initial = coApplicant.middle_initial[0];

      // --- NEST name fields under name_information for backend ---
      const {
        title, first_name, middle_initial, last_name, suffix, maiden_name, is_consultant, date_of_birth, birth_place, marital_status, race, anniversary, spouse_name, spouse_occupation, number_of_dependents, ...restApplicant
      } = applicant;
      // Filter out empty household members
      const filteredHouseholdMembers = (applicant.household_members || []).filter(m =>
        m && (m.first_name || m.last_name || m.relationship || m.dob || m.age || m.sex || m.marital_status || m.ssn)
      );
      // Filter out empty applicant liabilities
      const filteredApplicantLiabilities = (formData.applicant?.liabilities || []).filter(l =>
        l && Object.values(l).some(v => v !== '' && v !== null && v !== undefined)
      );
      const applicantPayload = {
        ...restApplicant,
        employment: applicant.employment, // Ensure all employment fields, including additional_income, are included
        name_information: {
          title, first_name, middle_initial, last_name, suffix, maiden_name, is_consultant
        },
        demographics_information: {
          dob: date_of_birth || '',
          birth_place,
          marital_status,
          race,
          anniversary,
          spouse_name,
          spouse_occupation,
          number_of_dependents
        },
        household_members: filteredHouseholdMembers.length > 0 ? filteredHouseholdMembers : undefined,
        liabilities: filteredApplicantLiabilities.length > 0 ? filteredApplicantLiabilities : undefined
      };
      const {
        title: coTitle, first_name: coFirstName, middle_initial: coMiddleInitial, last_name: coLastName, suffix: coSuffix, maiden_name: coMaidenName, is_consultant: coIsConsultant, ...restCoApplicant
      } = coApplicant;
      const coApplicantPayload = formData.coApplicant?.include_coapplicant
        ? {
            ...restCoApplicant,
            is_consultant: coIsConsultant || false,
            name_information: {
              title: coTitle, first_name: coFirstName, middle_initial: coMiddleInitial, last_name: coLastName, suffix: coSuffix, maiden_name: coMaidenName
            },
            include_coapplicant: true
          }
        : { is_consultant: false, include_coapplicant: false };
      // Remove client_id from payload
      const { clientId, coApplicant: coApplicantRaw, householdMembers, ...rest } = formData;
      // Filter out empty drivers
      const filteredDrivers = (formData.drivers || []).filter(d =>
        d && Object.values(d).some(v => v !== '' && v !== null && v !== undefined)
      );
      // Filter out empty liabilities
      const filteredLiabilities = (formData.liabilities || []).filter(l =>
        l && Object.values(l).some(v => v !== '' && v !== null && v !== undefined)
      );
      const payload = {
        ...rest,
        applicant: applicantPayload,
        co_applicant: coApplicantPayload, // always an object
        drivers: filteredDrivers.length > 0 ? filteredDrivers : undefined,
        liabilities: filteredLiabilities.length > 0 ? filteredLiabilities : undefined,
        household_members: filteredHouseholdMembers.length > 0 ? filteredHouseholdMembers : undefined,
        mortgage: formData.mortgage || {}, // Add mortgage data to payload
        loanStatus: formData.loanStatus || undefined, // Add loanStatus if present
        incomeProtection: formData.incomeProtection || undefined,
        vehicleCoverage: formData.vehicleCoverage || undefined,
        retirement: formData.retirement || undefined,
        homeowners: formData.homeowners || undefined,

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
          await updateCoApplicantBasic.mutateAsync({ clientId: formData.clientId, data: coApplicantPayload?.name_information });
          await updateCoApplicantAddress.mutateAsync({ clientId: formData.clientId, data: { currentAddress: coApplicantPayload?.current_address, previousAddress: coApplicantPayload?.previous_address } });
          await updateCoApplicantEmployment.mutateAsync({ clientId: formData.clientId, data: { employment: coApplicantPayload?.employment, previousEmployment: coApplicantPayload?.previous_employment } });
          await updateCoApplicantDemographics.mutateAsync({ clientId: formData.clientId, data: {
            birth_place: coApplicantPayload?.birth_place,
            dob: coApplicantPayload?.date_of_birth,
            race: coApplicantPayload?.race,
            marital_status: coApplicantPayload?.marital_status,
            anniversary: coApplicantPayload?.anniversary,
            spouse_name: coApplicantPayload?.spouse_name,
            spouse_occupation: coApplicantPayload?.spouse_occupation,
            number_of_dependents: coApplicantPayload?.number_of_dependents
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
          loanStatus: formData.loanStatus || undefined,
          incomeProtection: formData.incomeProtection || undefined,
          vehicleCoverage: formData.vehicleCoverage || undefined,
          retirement: formData.retirement || undefined,
          homeowners: formData.homeowners || undefined,
          renters: formData.renters || undefined,
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
      applicant: {
        ...randomApplicant(),
        date_of_birth: '1990-01-01',
        marital_status: 'Married',
        race: 'White',
        birth_place: 'Springfield',
        anniversary: '2010-06-20',
        spouse_name: 'Jane Doe',
        spouse_occupation: 'Teacher',
        number_of_dependents: '2',
        fax: '+1234567890',
        contact: {
          address: '123 Main St',
          city: 'Springfield',
          state: 'CA',
          zip_code: '90001',
          county: 'LA',
          home_phone: '555-1234',
          work_phone: '555-5678',
          cell_phone: '555-8765',
          other_phone: '555-4321',
          email: 'john.doe@email.com'
        },
        credit_scores: { equifax: '700', experian: '710', transunion: '720' },
        household_members: [
          {
            first_name: 'Child1',
            middle_initial: '',
            last_name: 'Doe',
            relationship: 'Son',
            dob: '2012-03-10',
            age: '12',
            sex: 'Male',
            marital_status: '',
            ssn: ''
          }
        ]
      },
      coApplicant: {
        ...randomApplicant(),
        date_of_birth: '1992-02-02',
        marital_status: 'Single',
        race: 'Asian',
        birth_place: 'Metropolis',
        anniversary: '2015-05-15',
        spouse_name: 'John Smith',
        spouse_occupation: 'Engineer',
        number_of_dependents: '1',
        fax: '+1987654321',
        contact: {
          address: '456 Elm St',
          city: 'Metropolis',
          state: 'NY',
          zip_code: '10001',
          county: 'NYC',
          home_phone: '555-2222',
          work_phone: '555-3333',
          cell_phone: '555-4444',
          other_phone: '555-5555',
          email: 'jane.smith@email.com'
        },
        credit_scores: { equifax: '750', experian: '760', transunion: '770' },
        household_members: [
          {
            first_name: 'Child2',
            middle_initial: '',
            last_name: 'Smith',
            relationship: 'Daughter',
            dob: '2015-07-20',
            age: '9',
            sex: 'Female',
            marital_status: '',
            ssn: ''
          }
        ],
        include_coapplicant: true
      },
      liabilities: [
        {
          debtor: 'Applicant',
          debtName: 'Car Loan',
          balance: '5000',
          payment: '200',
          payOff: false,
          propertyAddress: '123 Main St',
          propertyValue: '200000',
          grossRent: '0',
          escrow: '0',
          taxes: '0',
          hoi: '0',
          totalEsc: '0',
          netRent: '0'
        }
      ],
      drivers: [
        {
          fullName: 'Jane Doe',
          dateOfBirth: '1990-01-01',
          age: '34',
          relationship: 'Spouse',
          ssn: '123-45-6789',
          sex: 'Female',
          maritalStatus: 'Married',
          drivingStatus: 'licensed',
          licenseNumber: 'D1234567',
          state: 'CA',
          accidentsViolations: '0'
        }
      ],
      mortgage: {
        address: '123 Main St',
        city: 'Springfield',
        state: 'CA',
        zip_code: '90001',
        occupancy_type: 'Primary',
        first_mortgage_balance: '200000',
        first_loan_amount: '250000',
        first_mortgage_rate: '3.5',
        first_loan_rate: '4.0',
        first_mortgage_term: '30',
        first_loan_term: '30',
        first_loan_int_term: '30',
        first_loan_new_payment: '1300',
        first_mortgage_payment: '1200',
        lienholder_1: 'Bank A',
        second_mortgage_balance: '50000',
        second_loan_amount: '60000',
        second_mortgage_rate: '5.0',
        second_loan_rate: '5.5',
        second_mortgage_term: '15',
        second_loan_term: '15',
        second_loan_int_term: '15',
        second_loan_new_payment: '450',
        second_mortgage_payment: '400',
        lienholder_2: 'Bank B',
        existing_balance: '10000',
        property_taxes: '2000',
        homeowners_insurance: '1200',
        taxes_included: true,
        loan_purpose: 'Purchase',
        market_value: '300000',
        estimated_fees: '5000',
        cash_to_close: '15000',
        appraisal_fee: '500',
        loan_volume: '310000',
        arm_rate_0: '3.5',
        arm_payment_0: '1200',
        arm_rate_1: '4.0',
        arm_payment_1: '1300',
        arm_rate_2: '4.5',
        arm_payment_2: '1400',
        fixed_rate_0: '3.5',
        fixed_rate_1: '4.0',
        fixed_payment_0: '1200',
        fixed_payment_1: '1300',
        closing_cost: '4000',
        dti: '35'
      },
      underwriting: {
        address: '123 Main St',
        city: 'Springfield',
        state: 'CA',
        chm_selection: 'credit',
        tud_selection: 'rate',
        equifax_applicant: 720,
        equifax_co_applicant: 710,
        experian_applicant: 730,
        experian_co_applicant: 720,
        transunion_applicant: 740,
        transunion_co_applicant: 730,
        underwriting_notes: 'Good credit',
        terms: '30_year',
        programs: 'pay_option_arm'
      },
      loanStatus: {
        stage: 'Processing',
        status: 'In Progress',
        lastUpdated: '2025-07-16T00:00:00.000Z',
        notes: 'Waiting for documents',
        address: '123 Main St',
        city: 'Springfield',
        state: 'CA',
        zipCode: '90001',
        lenderId: 'LEND123',
        loanAmount: 250000,
        mortgageType: 'Conventional',
        loanPurpose: 'Purchase',
        loanStatus: 'Submitted',
        statusDate: '2025-07-16',
        dateCreditPulled: '2025-07-15',
        registrationDate: '2025-07-10',
        ausDuDateNA: false,
        lockDate: '2025-07-12',
        lockExpirationDate: '2025-07-30',
        lenderDisclosuresSent: '2025-07-13',
        lenderDisclosuresSigned: '2025-07-14',
        brokerDisclosuresSent: '2025-07-15',
        brokerDisclosuresSigned: '2025-07-16',
        loanSubmissionDate: '2025-07-17',
        conditionalApprovalReceived: '2025-07-18',
        approvalReviewedWithCrm: '2025-07-19',
        submittedForFinalReview: '2025-07-20',
        clearedToCloseDate: '2025-07-21',
        closedDate: '2025-07-22',
        fundedDate: '2025-07-23',
        disbursedDate: '2025-07-24',
        disbursedAmount: 15000,
        stackedDate: '2025-07-25',
        stackedBy: 'Admin',
        title: {
          company: 'Title Co',
          ordered: '2025-07-11',
          feeSheetReceived: '2025-07-12',
          docsReceived: '2025-07-13'
        },
        appraisal: {
          ordered: '2025-07-14',
          received: '2025-07-15',
          company: 'Appraisal Co',
          value: 300000,
          avm: 295000,
          fee: 500,
          feePaid: true
        },
        voe: {
          phone: '555-1111',
          sent: '2025-07-16',
          received: '2025-07-17',
          contact: 'HR',
          email: 'hr@company.com'
        },
        vom: {
          sent: '2025-07-18',
          contact: 'Manager',
          phone: '555-2222',
          email: 'manager@company.com',
          received: '2025-07-19'
        }
      },
      incomeProtection: {
  applicant: {
    firstName: "John",
    middleInitial: "A",
    lastName: "Doe",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
    zip: "62704",
    dateIn: "2025-07-22",
    timeIn: "10:30",
    agent: "Agent Smith",
    fieldTrainer: "Trainer Jane",
    referringAgent: "Ref Agent"
  },
  coApplicant: {
    firstName: "Jane",
    middleInitial: "B",
    lastName: "Doe"
  },
  bankComparison: {
    bankA: {
      provider: "ABC Life",
      faceAmount: 250000,
      insuranceType: "Term",
      term: 20,
      monthlyPremium: 45.00,
      annualPremium: 540.00
    },
    bankB: {
      provider: "XYZ Life",
      faceAmount: 250000,
      insuranceType: "Term",
      term: 20,
      monthlyPremium: 30.00,
      annualPremium: 360.00,
      savings: 180.00
    }
  },
  applicationDetails: {
    applicationDate: "2025-07-20",
    policyNumber: "POL123456",
    rating: "Preferred",
    tableRating: "A",
    policyStatus: "Approved",
    statusDate: "2025-07-21",
    issueDate: "2025-07-22",
    disburseDate: "2025-07-23",
    numberOfUnits: 1,
    processingManager: "Manager Name",
    dft: "DFT Info",
    dftNo: "DFT123",
    grossAnnualPremium: 360.00,
    gap: 360.00
  },
  familyMembers: [
    {
      name: "Anna Doe",
      dob: "2010-05-15",
      age: 15,
      sex: "F",
      relationship: "Daughter",
      ssn: "123-45-6789",
      height: "5'2\"",
      weight: "110",
      tobacco: false,
      quitDate: "",
      military: false,
      flyingHazard: false,
      dutyAircraft: "",
      rider: "None",
      isStudent: true
    }
  ],
  owner: {
    name: "John Doe",
    relationship: "Father",
    address: "123 Main St",
    ssn: "111-22-3333"
  },
  processMilestones: {
    implementation: "2025-07-20",
    applicationSigned: "2025-07-20",
    personalHistoryInterviewCompleted: "2025-07-21",
    appSubmission: "2025-07-21",
    paramedsOrdered: "2025-07-21",
    paramedsScheduled: "2025-07-22",
    paramedsDecisioned: "2025-07-22",
    paramedsCompleted: "2025-07-23",
    apsOrdered: "2025-07-23",
    apsDecisioned: "2025-07-24",
    issuedDate: "2025-07-24",
    approvedRating: "Preferred",
    datePolicyMailedToClient: "2025-07-25",
    deliveryRequirementsReceived: "2025-07-26",
    commissionsReceived: "2025-07-27"
  }
      },
      vehicleCoverage: {
        applicant: {
          firstName: "John",
          middleInitial: "A",
          lastName: "Doe",
          coApplicant: {
            firstName: "Jane",
            middleInitial: "B",
            lastName: "Doe"
          },
          address: "123 Main St",
          city: "Springfield",
          state: "IL",
          zip: "62704",
          dateIn: "2025-07-22",
          timeIn: "09:30",
          fieldTrainer: "Mike Smith",
          bma: "BMA Name",
          stateLicensed: "Yes"
        },
        insuranceDetails: {
          bankA: {
            carrier: "State Farm",
            sixMonthPremium: 600,
            annualPremium: 1200,
            savings: 100
          },
          bankB: {
            carrier: "Geico",
            sixMonthPremium: 550,
            annualPremium: 1100
          },
          application: {
            applicationDate: "2025-07-01",
            status: "Pending",
            statusDate: "2025-07-15",
            issueDate: "2025-07-20",
            disburseDate: "2025-07-21",
            dft: "John Admin",
            dftNo: "DFT123456",
            numberOfUnits: 2,
            expirationDate: "2026-07-01"
          }
        },
        householdMembers: [
          {
            firstName: "John",
            middleInitial: "A",
            lastName: "Doe",
            sex: "M",
            dob: "1985-04-10",
            age: 40,
            ssn: "123-45-6789",
            relationship: "Self",
            maritalStatus: "Married",
            drivingStatus: "Active",
            licenseNumber: "D1234567",
            state: "IL",
            accidentsOrViolations: "None"
          },
          {
            firstName: "Jane",
            middleInitial: "B",
            lastName: "Doe",
            sex: "F",
            dob: "1986-05-15",
            age: 39,
            ssn: "987-65-4321",
            relationship: "Spouse",
            maritalStatus: "Married",
            drivingStatus: "Active",
            licenseNumber: "D7654321",
            state: "IL",
            accidentsOrViolations: "1 speeding ticket"
          }
        ],
        currentVehicleCoverage: {
          bankA: [
            {
              year: 2018,
              make: "Toyota",
              model: "Camry",
              vin: "1HGCM82633A004352",
              premium: 600,
              comprehensive: 100,
              collision: 200,
              bodilyInjury: 100000,
              propertyDamage: 50000,
              medicalPayment: 5000,
              towing: 100,
              rental: 300
            }
          ],
          numberOfVehicles: 1
        },
        proposedVehicleCoverage: {
          bankB: [
            {
              year: 2022,
              make: "Honda",
              model: "Civic",
              vin: "2HGFB2F59CH512345",
              premium: 550,
              comprehensive: 120,
              collision: 180,
              bodilyInjury: 100000,
              propertyDamage: 60000,
              medicalPayment: 6000,
              towing: 120,
              rental: 350
            }
          ],
          numberOfVehicles: 1
        },
        processMilestones: {
          finalQuoteSentToUW: "2025-07-10",
          finalQuoteReceived: "2025-07-12",
          finalQuoteExpires: "2025-08-01",
          finalQuoteClientReviewDate: "2025-07-15",
          clientDecision: "Accepted",
          dateBinded: "2025-07-20",
          netAnnualPremium: 1100,
          totalAnnualPremium: 1150,
          bindedPremiumPaid: true,
          autoPremiumPaid: true
        }
      },
      retirement: {
        applicant: {
          firstName: "John",
          middleInitial: "A",
          lastName: "Doe",
          address: "123 Main St",
          city: "Springfield",
          state: "IL",
          zip: "62704",
          dateIn: "2025-07-22",
          timeIn: "10:00",
          agent: "Jane Smith",
          fieldTrainer: "Mike Trainer",
          referringAgent: "Agent Referral",
          coApplicant: {
            firstName: "Jane",
            middleInitial: "B",
            lastName: "Doe"
          }
        },
        investmentAccounts: {
          bankA: [
            {
              accountId: "1A",
              accountName: "Retirement Fund A",
              investmentFirm: "Fidelity",
              accountBalance: 100000,
              investmentAccountType: "IRA",
              investmentType: "Stocks",
              ownership: "Joint Tenancy",
              remarks: "Long-term"
            },
            {
              accountId: "2A",
              accountName: "Growth Fund",
              investmentFirm: "Vanguard",
              accountBalance: 75000,
              investmentAccountType: "Roth IRA",
              investmentType: "Bonds",
              ownership: "Individual",
              remarks: "Stable"
            }
          ],
          bankB: [
            {
              accountId: "1B",
              accountName: "Trust Fund",
              investmentFirm: "Chase",
              accountBalance: 200,
              investmentAccountType: "401K",
              investmentType: "Mixed",
              ownership: "Individual",
              remarks: ""
            },
            {
              accountId: "2B",
              accountName: "Emergency Fund",
              investmentFirm: "Wells Fargo",
              accountBalance: 300,
              investmentAccountType: "Cash",
              investmentType: "Money Market",
              ownership: "Joint Tenancy",
              remarks: ""
            }
          ]
        },
        pensionInformation: {
          pensionAmount: 3500,
          pensionInfo: "Monthly military pension",
          remarks: "COLA adjusted yearly",
          totalInvestmentValue: 175500,
          totalQualifiedAccounts: 140000,
          totalNonQualifiedAccounts: 35500
        },
        additionalIncomeSources: [
          {
            incomeSource: "Rental Property",
            amount: 1200,
            taxable: true,
            colaAdjusted: false,
            startAge: 60,
            endAge: 80
          },
          {
            incomeSource: "Consulting",
            amount: 800,
            taxable: true,
            colaAdjusted: true,
            startAge: 62,
            endAge: 70
          }
        ],
        processMilestones: [
          {
            accountId: "1B",
            accountName: "Trust Fund",
            investmentFirm: "Chase",
            accountBalance: 200,
            investmentAccountType: "401K",
            investmentType: "Mixed",
            ownership: "Individual",
            remarks: "",
            milestones: {
              implementationCall: true,
              financialSuitabilityCompleted: true,
              applicationSentToClient: true,
              applicationSignedAndSubmitted: true,
              suitabilityApprovedByAthene: true,
              suitabilityEmailSent: true,
              transferFormsSent: true,
              medallionSignatureObtained: true,
              wetSignatureMailed: true,
              wetSignatureReceived: true,
              wetSignatureSentToAthene: true,
              wetSignatureFaxedToProvider: true,
              threeWayClientCall: false,
              tspCall1: false,
              tspCall2: false,
              accountLiquidated: false,
              fundsMailedToClient: true,
              checkReceived: false,
              fundsReceivedByAthene: true,
              contractIssued: true,
              expectedFunds: 200,
              actualReceivedFunds: 200,
              policyAcknowledged: true,
              athenePortalSetup: true
            }
          },
          {
            accountId: "2B",
            accountName: "Emergency Fund",
            investmentFirm: "Wells Fargo",
            accountBalance: 300,
            investmentAccountType: "Cash",
            investmentType: "Money Market",
            ownership: "Joint Tenancy",
            remarks: "",
            milestones: {
              implementationCall: true,
              financialSuitabilityCompleted: true,
              applicationSentToClient: true,
              applicationSignedAndSubmitted: true,
              suitabilityApprovedByAthene: true,
              suitabilityEmailSent: true,
              transferFormsSent: true,
              medallionSignatureObtained: true,
              wetSignatureMailed: true,
              wetSignatureReceived: true,
              wetSignatureSentToAthene: true,
              wetSignatureFaxedToProvider: true,
              threeWayClientCall: false,
              tspCall1: false,
              tspCall2: false,
              accountLiquidated: true,
              fundsMailedToClient: true,
              checkReceived: false,
              fundsReceivedByAthene: true,
              contractIssued: true,
              expectedFunds: 300,
              actualReceivedFunds: 300,
              policyAcknowledged: true,
              athenePortalSetup: true
            }
          }
        ]
      },
      homeowners: {
      applicant: {
        firstName: "John",
        middleInitial: "A",
        lastName: "Doe"
      },
      coApplicant: {
        firstName: "Jane",
        middleInitial: "B",
        lastName: "Doe"
      },
      contactInfo: {
        address: "123 Main St",
        city: "Springfield",
        state: "IL",
        zip: "62704"
      },
      additionalInfo: {
        dateIn: "2025-07-22",
        timeIn: "10:00",
        fieldTrainer: "Mike Trainer",
        BMA: "BMA Springfield",
        stateLicensed: "Yes"
      },
      scheduledProperty: {
        propertyDescription: "Two-story colonial home with attached garage",
        value: 350000,
        bankA: {
          carrier: "State Farm",
          premium: 1200,
          deductible: 1000,
          medicalPayments: 5000,
          liability: 300000,
          savings: 200
        },
        bankB: {
          carrier: "Allstate",
          premium: 1000,
          deductible: 1000,
          medicalPayments: 5000,
          liability: 300000,
          savings: 400
        }
      },
      applicationDetails: {
        applicationDate: "2025-07-01",
        status: "Approved",
        statusDate: "2025-07-15",
        issueDate: "2025-07-20",
        policyNumber: "HO-123456789",
        disburseDate: "2025-07-21",
        DFT: "John Admin",
        DFTNo: "DFT789",
        numberOfUnits: 1
      },
      propertyCharacteristics: {
        yearBuilt: 1995,
        mortgageBalance: 250000,
        housingType: "Single Family",
        style: "Colonial",
        ownerOccupied: true,
        tenantOccupied: false,
        monthlyRentalIncome: 0,
        squareFootage: 2500,
        foundation: "Basement",
        foundationPercent: 100,
        construction: "Frame",
        roof: "Asphalt Shingle",
        purchaseDate: "2020-06-15",
        newPurchase: false,
        payment: 1800,
        offeredSaleLast12Months: false,
        refinancedLast12Months: false,
        businessOnPremises: false,
        percentBasementFinished: 50,
        deckSqFootage: 200,
        openPorchSqFt: 0,
        enclosedPorchSqFt: 0,
        garage: "Attached",
        numCarsGarageCanHold: 2,
        numFullBaths: 3,
        numHalfBaths: 1,
        numFireplaces: 1,
        pool: false,
        trampoline: false,
        numPets: 1,
        selfLockingGate: false,
        numClaimsLast5Years: 0,
        amtOfClaims: 0
      },
      credits: {
        homeAssocFee: 0,
        floodPolicy: false,
        monitoredBurglarAlarm: true,
        monitoredFireAlarm: true,
        twentyFourHrSecurity: false,
        fireExtinguisher: true,
        smokeProtector: true,
        nonSmokingHousehold: true,
        deadboltLocks: true,
        accountCredit: 50
      },
      processMilestones: {
        finalQuoteSentToUW: "2025-07-10",
        finalQuoteReceived: "2025-07-12",
        finalQuoteExpires: "2025-08-01",
        finalQuoteClientReviewDate: "2025-07-15",
        clientDecision: "Accepted",
        dateBinded: "2025-07-20",
        netAnnualPremium: 1000,
        totalAnnualPremium: 1050,
        bindedPremiumPaid: true,
        homePremiumPaid: true
      },
      bindingMilestones: {
        frontRearSidePhotosProvided: true,
        photosReceived: true,
        newMortgageClause: "Wells Fargo Bank, N.A.",
        newLoanNumber: "WF12345678",
        paymentSentForm: true,
        paymentFormReceived: true
      }
    },
    renters: {
        applicant: {
          firstName: "John",
          middleInitial: "A",
          lastName: "Doe"
        },
        coApplicant: {
          firstName: "Jane",
          middleInitial: "B",
          lastName: "Doe"
        },
        contactInfo: {
          address: "456 Rental Ave",
          city: "Springfield",
          state: "IL",
          zip: "62704"
        },
        additionalInfo: {
          dateIn: "2025-07-22",
          timeIn: "14:30",
          fieldTrainer: "Sarah Trainer",
          BMA: "BMA Renters",
          stateLicensed: "Yes"
        },
        bankInfo: {
          bankA: {
            carrier: "State Farm",
            premium: 180,
            expirationDate: "2025-12-31",
            savings: 50
          },
          bankB: {
            carrier: "Progressive",
            premium: 130,
            expirationDate: "2026-07-31",
            savings: 100
          }
        },
        applicationDetails: {
          applicationDate: "2025-07-01",
          rentStatus: "Approved",
          statusDate: "2025-07-15",
          issueDate: "2025-07-20",
          policyNumber: "RN-987654321",
          disburseDate: "2025-07-21",
          DFT: "Jane Admin",
          DFTNo: "DFT456",
          GAP: 130,
          numberOfUnits: 1
        },
        propertyCharacteristics: {
          yearBuilt: 2010,
          yearsAtCurrentAddress: 2,
          housingType: "Apartment",
          style: "Contemporary",
          numberOfStories: 3,
          squareFootage: 1200,
          construction: "Frame",
          roof: "Asphalt Shingle",
          garage: "None"
        },
        coverage: {
          current: {
            deductible: 500,
            liability: 100000,
            contents: 25000,
            medicalPayments: 1000,
            scheduledProperty: 5000,
            propertyTypeAndValue: "Electronics: $3000, Jewelry: $2000"
          },
          proposed: {
            deductible: 500,
            liability: 300000,
            contents: 30000,
            medicalPayments: 5000,
            scheduledProperty: 8000,
            propertyTypeAndValue: "Electronics: $4000, Jewelry: $3000, Art: $1000"
          }
        }
      },
      status: 'Active',
      payoffAmount: 10000,
      consultantName: 'Consultant X',
      processorName: 'Processor Y',
      entryDate: '2025-07-16'
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
                <button type="button" role="tab" aria-selected={activeTab === 'income-protection'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'income-protection' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('income-protection')}>Income Protection</button>
                <button type="button" role="tab" aria-selected={activeTab === 'retirement'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'retirement' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('retirement')}>Retirement</button>
                <button type="button" role="tab" aria-selected={activeTab === 'vehicle-coverage'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'vehicle-coverage' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('vehicle-coverage')}>Vehicle Coverage</button>
                <button type="button" role="tab" aria-selected={activeTab === 'homeowners'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'homeowners' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('homeowners')}>Homeowners</button>
                <button type="button" role="tab" aria-selected={activeTab === 'renters'} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-2 py-1.5 flex-shrink-0 ${activeTab === 'renters' ? 'bg-background text-foreground shadow-sm' : ''}`} onClick={() => setActiveTab('renters')}>Renters</button>
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
                              coApplicant: checked
                                ? { ...prev.coApplicant, include_coapplicant: true }
                                : { include_coapplicant: false } // clear all fields if unchecked
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
                {activeTab === 'income-protection' && (
                    <IncomeProtectionSection
                      formData={formData}
                      setFormData={setFormData}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {activeTab === 'retirement' && (
                    <RetirementSection
                      formData={formData}
                      setFormData={setFormData}
                      isReadOnly={isReadOnly}
                    />
                  )}
                  {activeTab === 'vehicle-coverage' && (
                  <VehicleCoverageSection
                    formData={formData}
                    setFormData={setFormData}
                    isReadOnly={isReadOnly}
                  />
                )}
                {activeTab === 'homeowners' && (
                  <HomeownersSection
                    formData={formData}
                    setFormData={setFormData}
                    isReadOnly={isReadOnly}
                  />
                )}
                {activeTab === 'renters' && (
                  <RentersSection
                    formData={formData}
                    setFormData={setFormData}
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