import mongoose, { Document, Schema } from 'mongoose';

export interface ISecuriaAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details: any;
}

const SecuriaAuditLogSchema = new Schema<ISecuriaAuditLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    trim: true
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true,
    maxlength: [100, 'Action cannot exceed 100 characters']
  },
  resource: {
    type: String,
    required: [true, 'Resource is required'],
    trim: true,
    maxlength: [50, 'Resource cannot exceed 50 characters']
  },
  resourceId: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    required: [true, 'IP address is required'],
    trim: true
  },
  userAgent: {
    type: String,
    required: [true, 'User agent is required'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  details: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  collection: 'securia_audit_logs'
});

// Create indexes for efficient querying
SecuriaAuditLogSchema.index({ userId: 1 });
SecuriaAuditLogSchema.index({ action: 1 });
SecuriaAuditLogSchema.index({ resource: 1 });
SecuriaAuditLogSchema.index({ timestamp: -1 });
SecuriaAuditLogSchema.index({ userEmail: 1 });

export default mongoose.model<ISecuriaAuditLog>('SecuriaAuditLog', SecuriaAuditLogSchema);
