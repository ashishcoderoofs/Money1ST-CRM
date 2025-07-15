import { Schema, model, Types, Document } from 'mongoose';
import Counter from './Counter';

export type ClientStatus = 'Active' | 'Pending' | 'Inactive';
// If consultant_name and processor_name should be enums, define them here, e.g.:
// export type ConsultantName = 'John Doe' | 'Jane Smith' | 'Other';
// export type ProcessorName = 'Processor A' | 'Processor B' | 'Other';

export interface IClient extends Document {
  _id: Types.ObjectId;
  client_id: string;
  entry_date: Date;
  status: ClientStatus;
  payoff_amount: number;
  consultant_name: string;
  processor_name: string;
  applicant: Types.ObjectId;
  co_applicant: Types.ObjectId;
  liabilities: Types.ObjectId[];
  property: Types.ObjectId;
  first_mortgage: Types.ObjectId;
  second_mortgage: Types.ObjectId;
  loan_details: Types.ObjectId;
  proposed_first_loan: Types.ObjectId;
  proposed_second_loan: Types.ObjectId;
  loan_options: Types.ObjectId;
  underwriting: Types.ObjectId;
  chm: Types.ObjectId;
  tud: Types.ObjectId;
  loanStatus?: any; // Add this line for loan status tracking
  drivers?: Array<{
    fullName: string;
    dateOfBirth: string;
    age: string;
    relationship: string;
    ssn: string;
    sex: string;
    maritalStatus: string;
    drivingStatus: string;
    licenseNumber: string;
    state: string;
    accidentsViolations: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>({
  client_id: { type: String, unique: true, index: true },
  entry_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Pending', 'Inactive'], required: true },
  payoff_amount: { type: Number },
  consultant_name: { type: String },
  processor_name: { type: String },
  applicant: { type: Schema.Types.ObjectId, ref: 'Applicant' },
  co_applicant: { type: Schema.Types.ObjectId, ref: 'Applicant' },
  liabilities: [{ type: Schema.Types.ObjectId, ref: 'Liability' }],
  property: { type: Schema.Types.ObjectId, ref: 'Property' },
  first_mortgage: { type: Schema.Types.ObjectId, ref: 'Mortgage' },
  second_mortgage: { type: Schema.Types.ObjectId, ref: 'Mortgage' },
  loan_details: { type: Schema.Types.ObjectId, ref: 'LoanDetails' },
  proposed_first_loan: { type: Schema.Types.ObjectId, ref: 'Mortgage' },
  proposed_second_loan: { type: Schema.Types.ObjectId, ref: 'Mortgage' },
  loan_options: { type: Schema.Types.ObjectId, ref: 'LoanOptions' },
  underwriting: { type: Schema.Types.ObjectId, ref: 'Underwriting' },
  chm: { type: Schema.Types.ObjectId, ref: 'CHM' },
  tud: { type: Schema.Types.ObjectId, ref: 'TUD' },
  loanStatus: { type: Schema.Types.Mixed }, // Add this line for loan status tracking
  drivers: [{
    fullName: { type: String },
    dateOfBirth: { type: String },
    age: { type: String },
    relationship: { type: String },
    ssn: { type: String },
    sex: { type: String },
    maritalStatus: { type: String },
    drivingStatus: { type: String },
    licenseNumber: { type: String },
    state: { type: String },
    accidentsViolations: { type: String },
  }],
}, { timestamps: true });

// Pre-save hook to auto-generate incremental client_id if not present
ClientSchema.pre<IClient>('save', async function (next) {
  if (!this.client_id) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'client_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const padded = counter.seq.toString().padStart(5, '0'); // e.g., 00001
    this.client_id = `CAN${padded}`;
  }
  next();
});

export default model<IClient>('Client', ClientSchema); 