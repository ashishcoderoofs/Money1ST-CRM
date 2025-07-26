import { Schema, model, Types, Document } from 'mongoose';
import Counter from './Counter';

export type ClientStatus = 'Active' | 'Pending' | 'Inactive';

export interface IClient extends Document {
  _id: Types.ObjectId;
  client_id: string;
  entry_date: Date;
  status: ClientStatus;
  payoff_amount: number;
  consultant_name: string;
  processor_name: string;
  
  // References to related documents
  applicant: Types.ObjectId;
  co_applicant: Types.ObjectId | null;
  liabilities: Types.ObjectId[];
  mortgages: Types.ObjectId[];
  underwriting: Types.ObjectId | null;
  chm: Types.ObjectId | null;
  tud: Types.ObjectId | null;
  loan_details: Types.ObjectId | null;
  loan_options: Types.ObjectId | null;
  drivers: Types.ObjectId[]; // Reference to Driver model
  
  // Metadata
  loanStatus?: any;
  
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>({
  // Core client fields only
  client_id: { type: String, unique: true, index: true },
  entry_date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Pending', 'Inactive'], required: true },
  payoff_amount: { type: Number, default: 0 },
  consultant_name: { type: String, required: true },
  processor_name: { type: String, required: true },
  
  // References to related documents
  applicant: { type: Schema.Types.ObjectId, ref: 'Applicant', required: true },
  co_applicant: { type: Schema.Types.ObjectId, ref: 'CoApplicant', default: null },
  liabilities: [{ type: Schema.Types.ObjectId, ref: 'Liability' }],
  mortgages: [{ type: Schema.Types.ObjectId, ref: 'Mortgage' }],
  underwriting: { type: Schema.Types.ObjectId, ref: 'Underwriting' },
  chm: { type: Schema.Types.ObjectId, ref: 'CHM' },
  tud: { type: Schema.Types.ObjectId, ref: 'TUD' },
  loan_details: { type: Schema.Types.ObjectId, ref: 'LoanDetails' },
  loan_options: { type: Schema.Types.ObjectId, ref: 'LoanOptions' },
  drivers: [{ type: Schema.Types.ObjectId, ref: 'Driver' }], // Reference to Driver model
  
  // Metadata fields
  loanStatus: { type: Schema.Types.Mixed },
}, { timestamps: true });

// Pre-save hook to auto-generate incremental client_id if not present
ClientSchema.pre<IClient>('save', async function (next) {
  if (!this.client_id) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'client_id' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const padded = counter.seq.toString().padStart(5, '0');
    this.client_id = `CAN${padded}`;
  }
  next();
});

export default model<IClient>('Client', ClientSchema); 