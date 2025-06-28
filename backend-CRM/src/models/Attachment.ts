import mongoose, { Schema, Document } from 'mongoose';

export interface IAttachment extends Document {
  recordId: string;
  category: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
  tags?: string[];
  description?: string;
  fileUrl?: string; // Virtual field
}

const attachmentSchema = new Schema<IAttachment>({
  recordId: {
    type: String,
    required: [true, 'Record ID is required'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['note', 'contact', 'deal', 'client', 'document', 'image', 'other'],
    index: true
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original file name is required'],
    trim: true
  },
  filePath: {
    type: String,
    required: [true, 'File path is required'],
    trim: true
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: 0
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required'],
    trim: true
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploaded by user ID is required']
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for efficient queries
attachmentSchema.index({ recordId: 1, category: 1 });
attachmentSchema.index({ uploadedBy: 1, uploadedAt: -1 });

// Virtual for file URL (you can customize this based on your file serving strategy)
attachmentSchema.virtual('fileUrl').get(function() {
  return `/api/attachments/file/${this._id}`;
});

// Pre-remove middleware to clean up files
attachmentSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const fullPath = path.join(process.cwd(), 'uploads', this.filePath);
    await fs.unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
});

export const Attachment = mongoose.model<IAttachment>('Attachment', attachmentSchema);
