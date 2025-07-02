import { Response } from 'express';
import Consultant from '../models/Consultant';
import { AuthRequest } from '../types';
import logger from '../../utils/logger';

/**
 * Service class for managing Consultants in Securia system
 */
export class SecuriaConsultantService {
  /**
   * Get all consultants with pagination and filtering
   */
  static async getConsultants(req: AuthRequest) {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search 
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { consultantId: searchRegex }
      ];
    }

    // Get consultants with pagination
    const consultants = await Consultant
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    const total = await Consultant.countDocuments(filter);

    return {
      success: true,
      data: consultants,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: consultants.length,
        totalItems: total
      }
    };
  }

  /**
   * Create a new consultant
   */
  static async createConsultant(consultantData: any, userId: string) {
    const consultant = new Consultant({
      ...consultantData,
      createdBy: userId,
      updatedBy: userId
    });

    const savedConsultant = await consultant.save();
    await savedConsultant.populate('createdBy', 'firstName lastName email');
    await savedConsultant.populate('updatedBy', 'firstName lastName email');

    logger.info(`Consultant created via Securia: ${savedConsultant._id} by user: ${userId}`);

    return {
      success: true,
      data: savedConsultant,
      message: 'Consultant created successfully'
    };
  }

  /**
   * Get consultant by ID
   */
  static async getConsultantById(consultantId: string) {
    const consultant = await Consultant
      .findById(consultantId)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!consultant) {
      throw new Error('Consultant not found');
    }

    return {
      success: true,
      data: consultant
    };
  }

  /**
   * Update consultant
   */
  static async updateConsultant(consultantId: string, updateData: any, userId: string) {
    const consultant = await Consultant.findById(consultantId);
    
    if (!consultant) {
      throw new Error('Consultant not found');
    }

    const updatedConsultant = await Consultant
      .findByIdAndUpdate(
        consultantId,
        { ...updateData, updatedBy: userId, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    logger.info(`Consultant updated via Securia: ${consultantId} by user: ${userId}`);

    return {
      success: true,
      data: updatedConsultant,
      message: 'Consultant updated successfully'
    };
  }

  /**
   * Delete consultant
   */
  static async deleteConsultant(consultantId: string, userId: string) {
    const consultant = await Consultant.findById(consultantId);
    
    if (!consultant) {
      throw new Error('Consultant not found');
    }

    await Consultant.findByIdAndDelete(consultantId);
    logger.info(`Consultant deleted via Securia: ${consultantId} by user: ${userId}`);

    return {
      success: true,
      message: 'Consultant deleted successfully'
    };
  }

  /**
   * Toggle consultant status
   */
  static async toggleConsultantStatus(consultantId: string, userId: string) {
    const consultant = await Consultant.findById(consultantId);
    
    if (!consultant) {
      throw new Error('Consultant not found');
    }

    const newStatus = consultant.status === 'Active' ? 'Inactive' : 'Active';
    
    const updatedConsultant = await Consultant
      .findByIdAndUpdate(
        consultantId,
        { status: newStatus, updatedBy: userId, updatedAt: new Date() },
        { new: true }
      )
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    logger.info(`Consultant status toggled via Securia: ${consultantId} to ${newStatus} by user: ${userId}`);

    return {
      success: true,
      data: updatedConsultant,
      message: `Consultant status updated to ${newStatus}`
    };
  }
}
