import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key-here';
const ALGORITHM = 'aes-256-cbc';

export interface ISecuriaClient extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth: Date;
  ssn: string;
  status: 'active' | 'inactive';
  consultantId: mongoose.Types.ObjectId;
  financialInfo: {
    annualIncome: number;
    netWorth: number;
    investmentGoals: string;
    riskTolerance: 'low' | 'medium' | 'high';
  };
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  encryptSSN(ssn: string): string;
  decryptSSN(): string;
}

const AddressSchema = new Schema({
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true,
    maxlength: [200, 'Street address cannot exceed 200 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [100, 'City cannot exceed 100 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [50, 'State cannot exceed 50 characters']
  },
  zipCode: {
    type: String,
    required: [true, 'Zip code is required'],
    trim: true,
    match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid zip code']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxlength: [50, 'Country cannot exceed 50 characters'],
    default: 'USA'
  }
}, { _id: false });

const FinancialInfoSchema = new Schema({
  annualIncome: {
    type: Number,
    required: [true, 'Annual income is required'],
    min: [0, 'Annual income cannot be negative']
  },
  netWorth: {
    type: Number,
    required: [true, 'Net worth is required']
  },
  investmentGoals: {
    type: String,
    required: [true, 'Investment goals are required'],
    trim: true,
    maxlength: [1000, 'Investment goals cannot exceed 1000 characters']
  },
  riskTolerance: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: [true, 'Risk tolerance is required']
  }
}, { _id: false });

const SecuriaClientSchema = new Schema<ISecuriaClient>({
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
  address: {
    type: AddressSchema,
    required: [true, 'Address is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value: Date) {
        return value < new Date();
      },
      message: 'Date of birth must be in the past'
    }
  },
  ssn: {
    type: String,
    required: [true, 'SSN is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  consultantId: {
    type: Schema.Types.ObjectId,
    ref: 'SecuriaConsultant',
    required: [true, 'Consultant assignment is required']
  },
  financialInfo: {
    type: FinancialInfoSchema,
    required: [true, 'Financial information is required']
  }
}, {
  timestamps: true,
  collection: 'securia_clients'
});

// Encryption methods
SecuriaClientSchema.methods.encryptSSN = function(ssn: string): string {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(ssn, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('SSN encryption error:', error);
    return ssn; // Return original if encryption fails
  }
};

SecuriaClientSchema.methods.decryptSSN = function(): string {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    
    const parts = this.ssn.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('SSN decryption error:', error);
    return this.ssn; // Return encrypted if decryption fails
  }
};

// Create indexes
SecuriaClientSchema.index({ email: 1 });
SecuriaClientSchema.index({ consultantId: 1 });
SecuriaClientSchema.index({ status: 1 });
SecuriaClientSchema.index({ firstName: 1, lastName: 1 });
SecuriaClientSchema.index({ 'financialInfo.riskTolerance': 1 });

export default mongoose.model<ISecuriaClient>('SecuriaClient', SecuriaClientSchema);
