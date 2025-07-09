import { Schema, model, Types, Document } from 'mongoose';

export interface IMortgage extends Document {
  client_id: Types.ObjectId;
  type: 'first' | 'second' | 'proposed_first' | 'proposed_second';
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