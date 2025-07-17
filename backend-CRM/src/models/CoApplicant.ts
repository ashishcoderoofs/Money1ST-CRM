import mongoose, { Schema, Document } from 'mongoose';

// Reuse sub-schemas from Applicant if available, otherwise define here
const HouseholdMemberSchema = new Schema({
  first_name: String,
  middle_initial: String,
  last_name: String,
  relationship: String,
  dob: String,
  age: String,
  sex: String,
  marital_status: String,
  ssn: String,
}, { _id: false });

const NameInformationSchema = new Schema({
  title: String,
  first_name: String,
  middle_initial: String,
  last_name: String,
  suffix: String,
  maiden_name: String,
  is_consultant: Boolean,
}, { _id: false });

const AddressSchema = new Schema({
  address: String,
  city: String,
  state: String,
  zip_code: String,
  county: String,
  home_phone: String,
  work_phone: String,
  cell_phone: String,
  other_phone: String,
  email: String,
  years: Number,
  months: Number,
  how_long_at_current_address: String,
  fax: String,
}, { _id: false });

const EmploymentSchema = new Schema({
  status: String,
  is_business_owner: String,
  employer_name: String,
  employer_address: String,
  employer_city: String,
  employer_state: String,
  employer_zip_code: String,
  occupation: String,
  monthly_salary: String,
  gross_monthly_salary: String,
  additional_income: String,
  start_date: String,
  end_date: String,
  supervisor: String,
  supervisor_phone: String,
  source: String,
}, { _id: false });

const PreviousEmploymentSchema = new Schema({
  employer_name: String,
  employer_address: String,
  employer_city: String,
  employer_state: String,
  employer_zip_code: String,
  from_date: String,
  to_date: String,
  occupation: String,
}, { _id: false });

const CreditScoresSchema = new Schema({
  equifax: String,
  experian: String,
  transunion: String,
}, { _id: false });

const DemographicsInformationSchema = new Schema({
  dob: String,
  birth_place: String,
  marital_status: String,
  race: String,
  anniversary: String,
  spouse_name: String,
  spouse_occupation: String,
  number_of_dependents: String,
}, { _id: false });

const LiabilitySchema = new Schema({
  debtor: String,
  debtName: String,
  balance: String,
  payment: String,
  payOff: Boolean,
  propertyAddress: String,
  propertyValue: String,
  grossRent: String,
  escrow: String,
  taxes: String,
  hoi: String,
  totalEsc: String,
  netRent: String,
}, { _id: false });

const CoApplicantSchema = new Schema({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  include_coapplicant: { type: Boolean, default: false },
  name_information: NameInformationSchema,
  current_address: AddressSchema,
  previous_address: AddressSchema,
  employment: EmploymentSchema,
  previous_employment: PreviousEmploymentSchema,
  credit_scores: CreditScoresSchema,
  household_members: [HouseholdMemberSchema],
  demographics_information: DemographicsInformationSchema,
  fax: String,
  contact: AddressSchema,
  liabilities: [LiabilitySchema],
  entry_date: Date,
  payoff_amount: Number,
  notes: String,
  created_at: Date,
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.model<Document>('CoApplicant', CoApplicantSchema);
