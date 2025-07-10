import { Schema, model, Types, Document } from 'mongoose';

export interface IMortgage extends Document {
  client_id: Types.ObjectId;
  type: 'first' | 'second' | 'proposed_first' | 'proposed_second';
  // Property information
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  occupancy_type?: string;
  // Mortgage details
  amount?: string;
  balance?: string;
  rate?: string;
  term?: string;
  payment?: string;
  lienholder?: string;
  int_term?: string;
  new_payment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MortgageSchema = new Schema<IMortgage>({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  type: { type: String, enum: ['first', 'second', 'proposed_first', 'proposed_second'], required: true },
  // Property information
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zip_code: { type: String },
  occupancy_type: { type: String },
  // Mortgage details
  amount: { type: String },
  balance: { type: String },
  rate: { type: String },
  term: { type: String },
  payment: { type: String },
  lienholder: { type: String },
  int_term: { type: String },
  new_payment: { type: String }
}, { timestamps: true });

export default model<IMortgage>('Mortgage', MortgageSchema); 