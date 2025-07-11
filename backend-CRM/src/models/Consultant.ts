import mongoose, { Schema, Document } from 'mongoose';

export interface IConsultant extends Document {
  // Basic Information
  consultantId?: string;
  entryDate: Date;
  position?: string;
  status: 'Active' | 'Inactive';
  title?: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  suffix?: string;
  comment?: string;
  remarks?: string;

  // Contact Information
  email: string;
  maidenName?: string;
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  zipCode?: string;
  homePhone?: string;
  mobile?: string;
  workPhone?: string;
  otherPhone?: string;
  fax?: string;
  membershipType?: string;
  amount?: number;
  jointMemberName?: string;

  // Personal Information
  dateOfBirth?: Date;
  maritalStatus?: string;
  sex?: string;
  race?: string;
  spouseName?: string;
  anniversary?: Date;
  spouseOccupation?: string;
  educationLevel?: string;
  driversLicenseNumber?: string;
  driversLicenseState?: string;
  employmentStatus?: string;
  employer?: string;
  occupation?: string;
  industry?: string;

  // CFS Information
  ssn?: string;
  ein?: string;
  hireDate?: Date;
  yearsWithFrq?: number;
  companyName?: string;
  cfsCertificationDate?: Date;
  effectiveDate?: Date;
  memberType?: string;
  mbrAmt?: number;
  payType?: string;
  mpFee?: number;
  cfsStatus?: string;
  statusDate?: Date;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;

  // System fields
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const consultantSchema = new Schema<IConsultant>({
  // Basic Information
  consultantId: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true
  },
  entryDate: {
    type: Date,
    required: [true, 'Entry date is required'],
    default: Date.now
  },
  position: {
    type: String,
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
    required: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [50, 'Title cannot exceed 50 characters']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [100, 'First name cannot exceed 100 characters']
  },
  middleInitial: {
    type: String,
    trim: true,
    maxlength: [10, 'Middle initial cannot exceed 10 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [100, 'Last name cannot exceed 100 characters']
  },
  suffix: {
    type: String,
    trim: true,
    maxlength: [20, 'Suffix cannot exceed 20 characters']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: [1000, 'Remarks cannot exceed 1000 characters']
  },

  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  maidenName: {
    type: String,
    trim: true,
    maxlength: [100, 'Maiden name cannot exceed 100 characters']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  city: {
    type: String,
    trim: true,
    maxlength: [100, 'City cannot exceed 100 characters']
  },
  county: {
    type: String,
    trim: true,
    maxlength: [100, 'County cannot exceed 100 characters']
  },
  state: {
    type: String,
    trim: true,
    maxlength: [50, 'State cannot exceed 50 characters']
  },
  zipCode: {
    type: String,
    trim: true,
    maxlength: [20, 'Zip code cannot exceed 20 characters']
  },
  homePhone: {
    type: String,
    trim: true,
    maxlength: [20, 'Home phone cannot exceed 20 characters']
  },
  mobile: {
    type: String,
    trim: true,
    maxlength: [20, 'Mobile cannot exceed 20 characters']
  },
  workPhone: {
    type: String,
    trim: true,
    maxlength: [20, 'Work phone cannot exceed 20 characters']
  },
  otherPhone: {
    type: String,
    trim: true,
    maxlength: [20, 'Other phone cannot exceed 20 characters']
  },
  fax: {
    type: String,
    trim: true,
    maxlength: [20, 'Fax cannot exceed 20 characters']
  },
  membershipType: {
    type: String,
    trim: true,
    maxlength: [100, 'Membership type cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    min: [0, 'Amount cannot be negative']
  },
  jointMemberName: {
    type: String,
    trim: true,
    maxlength: [200, 'Joint member name cannot exceed 200 characters']
  },

  // Personal Information
  dateOfBirth: {
    type: Date
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'],
    trim: true
  },
  sex: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    trim: true
  },
  race: {
    type: String,
    trim: true,
    maxlength: [100, 'Race cannot exceed 100 characters']
  },
  spouseName: {
    type: String,
    trim: true,
    maxlength: [200, 'Spouse name cannot exceed 200 characters']
  },
  anniversary: {
    type: Date
  },
  spouseOccupation: {
    type: String,
    trim: true,
    maxlength: [100, 'Spouse occupation cannot exceed 100 characters']
  },
  educationLevel: {
    type: String,
    enum: ['High School', 'Associate Degree', 'Bachelor Degree', 'Master Degree', 'Doctorate', 'Other'],
    trim: true
  },
  driversLicenseNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Drivers license number cannot exceed 50 characters']
  },
  driversLicenseState: {
    type: String,
    trim: true,
    maxlength: [50, 'Drivers license state cannot exceed 50 characters']
  },
  employmentStatus: {
    type: String,
    enum: ['Employed', 'Unemployed', 'Self-Employed', 'Retired', 'Student', 'Part time', 'Contract'],
    trim: true
  },
  employer: {
    type: String,
    trim: true,
    maxlength: [200, 'Employer cannot exceed 200 characters']
  },
  occupation: {
    type: String,
    trim: true,
    maxlength: [100, 'Occupation cannot exceed 100 characters']
  },
  industry: {
    type: String,
    trim: true,
    maxlength: [100, 'Industry cannot exceed 100 characters']
  },

  // CFS Information
  ssn: {
    type: String,
    trim: true,
    maxlength: [15, 'SSN cannot exceed 15 characters']
  },
  ein: {
    type: String,
    trim: true,
    maxlength: [15, 'EIN cannot exceed 15 characters']
  },
  hireDate: {
    type: Date
  },
  yearsWithFrq: {
    type: Number,
    min: [0, 'Years with FRQ cannot be negative']
  },
  companyName: {
    type: String,
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  cfsCertificationDate: {
    type: Date
  },
  effectiveDate: {
    type: Date
  },
  memberType: {
    type: String,
    trim: true,
    maxlength: [100, 'Member type cannot exceed 100 characters']
  },
  mbrAmt: {
    type: Number,
    min: [0, 'Member amount cannot be negative']
  },
  payType: {
    type: String,
    trim: true,
    maxlength: [100, 'Pay type cannot exceed 100 characters']
  },
  mpFee: {
    type: Number,
    min: [0, 'MP fee cannot be negative']
  },
  cfsStatus: {
    type: String,
    trim: true,
    maxlength: [100, 'CFS status cannot exceed 100 characters']
  },
  statusDate: {
    type: Date
  },

  // Emergency Contact
  emergencyContactName: {
    type: String,
    trim: true,
    maxlength: [200, 'Emergency contact name cannot exceed 200 characters']
  },
  emergencyContactRelationship: {
    type: String,
    trim: true,
    maxlength: [100, 'Emergency contact relationship cannot exceed 100 characters']
  },
  emergencyContactPhone: {
    type: String,
    trim: true,
    maxlength: [20, 'Emergency contact phone cannot exceed 20 characters']
  },

  // System fields
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
consultantSchema.index({ consultantId: 1 });
consultantSchema.index({ email: 1 });
consultantSchema.index({ status: 1 });
consultantSchema.index({ firstName: 1, lastName: 1 });
consultantSchema.index({ createdAt: -1 });

// Pre-save hook to auto-generate consultantId
consultantSchema.pre('save', async function(next) {
  if (this.isNew && !this.consultantId) {
    try {
      // Find the highest consultantId number
      const lastConsultant = await mongoose.model('Consultant').findOne(
        { consultantId: { $regex: /^CON\d+$/ } },
        {},
        { sort: { consultantId: -1 } }
      );
      
      let nextNumber = 1;
      if (lastConsultant && lastConsultant.consultantId) {
        const lastNumber = parseInt(lastConsultant.consultantId.replace('CON', ''));
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
      
      this.consultantId = `CON${String(nextNumber).padStart(4, '0')}`;
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Virtual for full name
consultantSchema.virtual('fullName').get(function() {
  const parts = [this.firstName, this.middleInitial, this.lastName, this.suffix].filter(Boolean);
  return parts.join(' ');
});

// Ensure virtual fields are serialized
consultantSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model<IConsultant>('Consultant', consultantSchema);
