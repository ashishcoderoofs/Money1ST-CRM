import { Schema, model, Types, Document } from 'mongoose';

export interface IUnderwriting extends Document {
  client_id: Types.ObjectId;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  terms_dropdown?: string;
  programs_dropdown?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UnderwritingSchema = new Schema<IUnderwriting>({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  notes: { type: String },
  terms_dropdown: { type: String },
  programs_dropdown: { type: String }
}, { timestamps: true });

export default model<IUnderwriting>('Underwriting', UnderwritingSchema); 