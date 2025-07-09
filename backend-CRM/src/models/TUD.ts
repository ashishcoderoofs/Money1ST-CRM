import { Schema, model, Types, Document } from 'mongoose';

export interface ITUD extends Document {
  client_id: Types.ObjectId;
  no_interest?: string;
  rate?: string;
  terms_payment?: string;
  fee?: string;
  no_value?: string;
  went_elsewhere?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TUDSchema = new Schema<ITUD>({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  no_interest: { type: String },
  rate: { type: String },
  terms_payment: { type: String },
  fee: { type: String },
  no_value: { type: String },
  went_elsewhere: { type: String }
}, { timestamps: true });

export default model<ITUD>('TUD', TUDSchema); 