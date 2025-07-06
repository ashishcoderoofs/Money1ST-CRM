import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole, RoleHierarchy } from '../types/index';

const userSchema = new Schema<IUser>({
  // Main Information
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
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  title: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  middleInitial: {
    type: String,
    trim: true,
    maxlength: [5, 'Middle initial cannot exceed 5 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  suffix: {
    type: String,
    trim: true,
    maxlength: [10, 'Suffix cannot exceed 10 characters']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: [500, 'Remarks cannot exceed 500 characters']
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
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
  
  // CFS Information
  membershipType: {
    type: String,
    trim: true
  },
  membershipAmount: {
    type: Number,
    min: [0, 'Membership amount cannot be negative']
  },
  jointMemberName: {
    type: String,
    trim: true,
    maxlength: [100, 'Joint member name cannot exceed 100 characters']
  },
  
  // Additional Fields
  maidenOrOtherName: {
    type: String,
    trim: true,
    maxlength: [100, 'Maiden or other name cannot exceed 100 characters']
  },
  
  // System Fields
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'],
    default: 'Field Builder'
  },
  isAdmin: {
    type: Boolean,
    default: false,
    // isAdmin is true if user is only admin or admin plus another role
    // Set this field explicitly when creating/updating users
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Role hierarchy for access control
userSchema.statics.getRoleHierarchy = function(): RoleHierarchy {
  return {
    'Admin': 6,
    'Field Builder': 5,
    'Field Trainer': 4,
    'Senior BMA': 3,
    'BMA': 2,
    'IBA': 1
  };
};

// Check if user has permission to access a role level
userSchema.methods.hasPermission = function(requiredRole: UserRole): boolean {
  const hierarchy = (this.constructor as mongoose.Model<IUser> & { getRoleHierarchy(): RoleHierarchy }).getRoleHierarchy();
  return hierarchy[this.role as UserRole] >= hierarchy[requiredRole];
};

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  // Auto-generate consultantId if new user and no consultantId provided
  if (this.isNew && !this.consultantId) {
    try {
      // Find the highest consultantId number
      const lastUser = await mongoose.model('User').findOne(
        { consultantId: { $regex: /^USR\d+$/ } },
        {},
        { sort: { consultantId: -1 } }
      );
      
      let nextNumber = 1;
      if (lastUser && lastUser.consultantId) {
        const lastNumber = parseInt(lastUser.consultantId.replace('USR', ''));
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
      
      this.consultantId = `USR${String(nextNumber).padStart(4, '0')}`;
    } catch (error) {
      return next(error as Error);
    }
  }

  // Automatically set isAdmin based on role
  if (this.isModified('role') || this.isNew) {
    this.isAdmin = this.role === 'Admin';
  }

  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Define the model interface that includes static methods
interface IUserModel extends mongoose.Model<IUser> {
  getRoleHierarchy(): RoleHierarchy;
}

export default mongoose.model<IUser, IUserModel>('User', userSchema);