import { Schema, model, Types, Document } from 'mongoose';

export interface ILiability extends Document {
  client_id: Types.ObjectId;
  debtor?: string;
  debtName?: string;
  balance?: string;
  payment?: string;
  payOff?: string;
  propertyAddress?: string;
  propertyValue?: string;
  grossRent?: string;
  escrow?: string;
  taxes?: string;
  hoi?: string;
  totalEsc?: string;
  netRent?: string;
}

const LiabilitySchema = new Schema<ILiability>({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  debtor: { type: String },
  debtName: { type: String },
  balance: { type: String },
  payment: { type: String },
  payOff: { type: String },
  propertyAddress: { type: String },
  propertyValue: { type: String },
  grossRent: { type: String },
  escrow: { type: String },
  taxes: { type: String },
  hoi: { type: String },
  totalEsc: { type: String },
  netRent: { type: String }
}, { timestamps: true });

export default model<ILiability>('Liability', LiabilitySchema); 