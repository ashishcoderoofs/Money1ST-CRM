import { Schema, model, Types, Document } from 'mongoose';

export interface IDriver extends Document {
  _id: Types.ObjectId;
  fullName: string;
  dateOfBirth: string;
  age: number;
  relationship: string;
  ssn: string;
  sex: string;
  maritalStatus: string;
  drivingStatus: string;
  licenseNumber?: string;
  state: string;
  accidentsViolations: string;
  client_id: Types.ObjectId; // Reference to Client
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>({
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  age: { type: Number, required: true, min: 16, max: 99 },
  relationship: { type: String, required: true },
  ssn: { type: String, required: true },
  sex: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  drivingStatus: { type: String, required: true },
  licenseNumber: { type: String },
  state: { type: String, required: true },
  accidentsViolations: { type: String, default: '0' },
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true }
}, { timestamps: true });

export default model<IDriver>('Driver', DriverSchema); 