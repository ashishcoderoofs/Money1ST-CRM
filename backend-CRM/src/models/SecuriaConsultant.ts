import mongoose, { Document, Schema } from 'mongoose';

export interface ISecuriaConsultant extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  certifications: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const SecuriaConsultantSchema = new Schema<ISecuriaConsultant>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
    maxlength: [100, 'Specialization cannot exceed 100 characters']
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true,
    maxlength: [500, 'Experience cannot exceed 500 characters']
  },
  certifications: [{
    type: String,
    trim: true,
    maxlength: [100, 'Each certification cannot exceed 100 characters']
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'securia_consultants'
});

// Create indexes
SecuriaConsultantSchema.index({ email: 1 });
SecuriaConsultantSchema.index({ status: 1 });
SecuriaConsultantSchema.index({ firstName: 1, lastName: 1 });

export default mongoose.model<ISecuriaConsultant>('SecuriaConsultant', SecuriaConsultantSchema);
