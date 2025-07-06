import { Request, Response } from 'express';
import { Attachment, IAttachment } from '../models/Attachment';
import { AuthRequest } from '../types/types';
import fs from 'fs/promises';
import path from 'path';
import logger from '../../utils/logger';

export class AttachmentController {
  // Upload attachment
  static async uploadAttachment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { recordId, category, description, tags } = req.body;
      const userId = req.user?.id;

      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      if (!recordId || !category) {
        res.status(400).json({ error: 'Record ID and category are required' });
        return;
      }

      // Create attachment record
      const attachment = new Attachment({
        recordId,
        category,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path.replace(path.join(process.cwd(), 'uploads'), '').replace(/\\/g, '/'),
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedBy: userId,
        description,
        tags: tags ? JSON.parse(tags) : []
      });

      await attachment.save();

      logger.info(`File uploaded: ${req.file.originalname} by user ${userId}`);

      res.status(201).json({
        message: 'File uploaded successfully',
        attachment: {
          id: attachment._id,
          fileName: attachment.fileName,
          originalName: attachment.originalName,
          fileSize: attachment.fileSize,
          mimeType: attachment.mimeType,
          fileUrl: `/api/attachments/file/${attachment._id}`,
          uploadedAt: attachment.uploadedAt,
          description: attachment.description,
          tags: attachment.tags
        }
      });
    } catch (error) {
      logger.error('Error uploading attachment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // List attachments for a record
  static async listAttachments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { recordId, category } = req.params;
      const { page = 1, limit = 50, tags } = req.query;

      const query: any = { recordId };
      if (category && category !== 'all') {
        query.category = category;
      }

      if (tags) {
        query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
      }

      const skip = (Number(page) - 1) * Number(limit);

      const attachments = await Attachment.find(query)
        .populate('uploadedBy', 'firstName lastName consultantId')
        .sort({ uploadedAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Attachment.countDocuments(query);

      res.json({
        attachments: attachments.map(att => ({
          id: att._id,
          fileName: att.fileName,
          originalName: att.originalName,
          fileSize: att.fileSize,
          mimeType: att.mimeType,
          fileUrl: `/api/attachments/file/${att._id}`,
          uploadedAt: att.uploadedAt,
          uploadedBy: att.uploadedBy,
          description: att.description,
          tags: att.tags,
          category: att.category
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      logger.error('Error listing attachments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get single attachment details
  static async getAttachment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const attachment = await Attachment.findById(id)
        .populate('uploadedBy', 'firstName lastName consultantId');

      if (!attachment) {
        res.status(404).json({ error: 'Attachment not found' });
        return;
      }

      res.json({
        id: attachment._id,
        fileName: attachment.fileName,
        originalName: attachment.originalName,
        filePath: attachment.filePath,
        fileSize: attachment.fileSize,
        mimeType: attachment.mimeType,
        fileUrl: `/api/attachments/file/${attachment._id}`,
        uploadedAt: attachment.uploadedAt,
        uploadedBy: attachment.uploadedBy,
        description: attachment.description,
        tags: attachment.tags,
        category: attachment.category,
        recordId: attachment.recordId
      });
    } catch (error) {
      logger.error('Error getting attachment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Download/serve file
  static async downloadFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const attachment = await Attachment.findById(id);

      if (!attachment) {
        res.status(404).json({ error: 'Attachment not found' });
        return;
      }

      const filePath = path.join(process.cwd(), 'uploads', attachment.filePath);

      try {
        await fs.access(filePath);
      } catch {
        res.status(404).json({ error: 'File not found on disk' });
        return;
      }

      res.setHeader('Content-Type', attachment.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
      res.sendFile(filePath);
    } catch (error) {
      logger.error('Error downloading file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update attachment metadata
  static async updateAttachment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { description, tags } = req.body;
      const userId = req.user?.id;

      const attachment = await Attachment.findById(id);

      if (!attachment) {
        res.status(404).json({ error: 'Attachment not found' });
        return;
      }

      // Check if user can update (either owner or admin)
      if (attachment.uploadedBy.toString() !== userId && req.user?.role !== 'Admin') {
        res.status(403).json({ error: 'Not authorized to update this attachment' });
        return;
      }

      if (description !== undefined) attachment.description = description;
      if (tags !== undefined) attachment.tags = tags;

      await attachment.save();

      logger.info(`Attachment updated: ${id} by user ${userId}`);

      res.json({
        message: 'Attachment updated successfully',
        attachment: {
          id: attachment._id,
          description: attachment.description,
          tags: attachment.tags
        }
      });
    } catch (error) {
      logger.error('Error updating attachment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete attachment
  static async deleteAttachment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const attachment = await Attachment.findById(id);

      if (!attachment) {
        res.status(404).json({ error: 'Attachment not found' });
        return;
      }

      // Check if user can delete (either owner or admin)
      if (attachment.uploadedBy.toString() !== userId && req.user?.role !== 'Admin') {
        res.status(403).json({ error: 'Not authorized to delete this attachment' });
        return;
      }

      // Delete file from disk
      const filePath = path.join(process.cwd(), 'uploads', attachment.filePath);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        logger.warn(`Could not delete file from disk: ${filePath}`, error);
      }

      // Delete from database
      await Attachment.findByIdAndDelete(id);

      logger.info(`Attachment deleted: ${id} by user ${userId}`);

      res.json({ message: 'Attachment deleted successfully' });
    } catch (error) {
      logger.error('Error deleting attachment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get attachment statistics
  static async getAttachmentStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { recordId } = req.params;

      const stats = await Attachment.aggregate([
        { $match: { recordId } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalSize: { $sum: '$fileSize' }
          }
        }
      ]);

      const totalAttachments = await Attachment.countDocuments({ recordId });
      const totalSize = await Attachment.aggregate([
        { $match: { recordId } },
        { $group: { _id: null, total: { $sum: '$fileSize' } } }
      ]);

      res.json({
        recordId,
        totalAttachments,
        totalSize: totalSize[0]?.total || 0,
        byCategory: stats
      });
    } catch (error) {
      logger.error('Error getting attachment stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
