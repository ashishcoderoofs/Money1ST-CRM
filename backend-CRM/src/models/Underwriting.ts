import { Schema, model, Types, Document } from 'mongoose';

export interface IUnderwriting extends Document {
  client_id: Types.ObjectId;
  address?: string;
  city?: string;
  state?: string;
  chm_selection?: string;
  tud_selection?: string;
  equifax_applicant?: number;
  equifax_co_applicant?: number;
  experian_applicant?: number;
  experian_co_applicant?: number;
  transunion_applicant?: number;
  transunion_co_applicant?: number;
  underwriting_notes?: string;
  terms?: string;
  programs?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UnderwritingSchema = new Schema<IUnderwriting>({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  chm_selection: { 
    type: String, 
    enum: ['credit', 'equity', 'ltv', 'bankrupt', 'no_benefit', 'suspend_fu_date', 'collateral', 'dti'] 
  },
  tud_selection: { 
    type: String, 
    enum: ['no_interest', 'rate', 'terms_payment', 'fee', 'no_value', 'went_elsewhere'] 
  },
  equifax_applicant: { type: Number, min: 300, max: 850 },
  equifax_co_applicant: { type: Number, min: 300, max: 850 },
  experian_applicant: { type: Number, min: 300, max: 850 },
  experian_co_applicant: { type: Number, min: 300, max: 850 },
  transunion_applicant: { type: Number, min: 300, max: 850 },
  transunion_co_applicant: { type: Number, min: 300, max: 850 },
  underwriting_notes: { type: String, maxlength: 500 },
  terms: { 
    type: String, 
    enum: ['15_year', '20_year', '30_year', '3_27', '2_28'] 
  },
  programs: { 
    type: String, 
    enum: ['pay_option_arm', 'secure_option_arm', 'interest_only', 'principle_interest'] 
  }
}, { timestamps: true });

export default model<IUnderwriting>('Underwriting', UnderwritingSchema); 