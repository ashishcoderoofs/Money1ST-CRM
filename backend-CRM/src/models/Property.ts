import { Schema, model, Types, Document } from 'mongoose';

export interface IProperty extends Document {
  client_id: Types.ObjectId;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  occupancy_type?: string;
  market_value?: string;
  property_taxes?: string;
  taxes_included_in_payment?: string;
  homeowners_insurance?: string;
  hoi_included_in_payment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zip_code: { type: String },
  occupancy_type: { type: String },
  market_value: { type: String },
  property_taxes: { type: String },
  taxes_included_in_payment: { type: String },
  homeowners_insurance: { type: String },
  hoi_included_in_payment: { type: String }
}, { timestamps: true });

export default model<IProperty>('Property', PropertySchema); 