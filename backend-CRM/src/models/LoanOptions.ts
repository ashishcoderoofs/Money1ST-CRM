import { Schema, model, Types, Document } from 'mongoose';

interface IOption {
  rate?: string;
  payment?: string;
}

export interface ILoanOptions extends Document {
  client_id: Types.ObjectId;
  arm_5_1?: IOption;
  arm_7_1?: IOption;
  arm_10_1?: IOption;
  fixed_15?: IOption;
  fixed_30?: IOption;
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema<IOption>({
  rate: { type: String },
  payment: { type: String }
}, { _id: false });

const LoanOptionsSchema = new Schema<ILoanOptions>({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  arm_5_1: { type: OptionSchema },
  arm_7_1: { type: OptionSchema },
  arm_10_1: { type: OptionSchema },
  fixed_15: { type: OptionSchema },
  fixed_30: { type: OptionSchema }
}, { timestamps: true });

export default model<ILoanOptions>('LoanOptions', LoanOptionsSchema); 