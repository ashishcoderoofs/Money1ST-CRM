import { Schema, model, Types, Document } from 'mongoose';

export interface ICHM extends Document {
  client_id: Types.ObjectId;
  credit?: string;
  equity?: string;
  ltv?: string;
  bankrupt?: string;
  no_benefit?: string;
  suspend_fu_date?: string;
  collateral?: string;
  dti?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CHMSchema = new Schema<ICHM>({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  credit: { type: String },
  equity: { type: String },
  ltv: { type: String },
  bankrupt: { type: String },
  no_benefit: { type: String },
  suspend_fu_date: { type: String },
  collateral: { type: String },
  dti: { type: String }
}, { timestamps: true });

export default model<ICHM>('CHM', CHMSchema); 