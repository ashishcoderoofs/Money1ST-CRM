import { Schema, model, Types, Document } from 'mongoose';

export interface ILoanDetails extends Document {
  client_id: Types.ObjectId;
  existing_balance?: string;
  purpose_of_loan?: string;
  cash_to_close?: string;
  loan_volume?: string;
  est_fees?: string;
  est_fees_amount?: string;
  appraisal_report_fee?: string;
  ltv?: string;
  closing_cost?: string;
  dti?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoanDetailsSchema = new Schema<ILoanDetails>({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  existing_balance: { type: String },
  purpose_of_loan: { type: String },
  cash_to_close: { type: String },
  loan_volume: { type: String },
  est_fees: { type: String },
  est_fees_amount: { type: String },
  appraisal_report_fee: { type: String },
  ltv: { type: String },
  closing_cost: { type: String },
  dti: { type: String }
}, { timestamps: true });

export default model<ILoanDetails>('LoanDetails', LoanDetailsSchema); 