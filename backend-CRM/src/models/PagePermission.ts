import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types';

export interface IPagePermission extends Document {
  pageName: string;
  rolePermissions: {
    [key in UserRole]: boolean;
  };
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pagePermissionSchema = new Schema<IPagePermission>({
  pageName: {
    type: String,
    required: [true, 'Page name is required'],
    unique: true,
    trim: true
  },
  rolePermissions: {
    Admin: {
      type: Boolean,
      default: true
    },
    'Field Builder': {
      type: Boolean,
      default: false
    },
    'Field Trainer': {
      type: Boolean,
      default: false
    },
    'Senior BMA': {
      type: Boolean,
      default: false
    },
    BMA: {
      type: Boolean,
      default: false
    },
    IBA: {
      type: Boolean,
      default: false
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
pagePermissionSchema.index({ pageName: 1 });
pagePermissionSchema.index({ isActive: 1 });

export default mongoose.model<IPagePermission>('PagePermission', pagePermissionSchema);
