import { Response } from 'express';
import SecuriaClient from '../models/SecuriaClient';
import { AuthRequest } from '../types';
import logger from '../../utils/logger';

/**
 * Service class for managing Clients in Securia system
 */
export class SecuriaClientService {
  /**
   * Get all clients with pagination and filtering
   */
  static async getClients(req: AuthRequest) {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search,
      consultant,
      dateFrom,
      dateTo
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }

    if (consultant) {
      filter.consultantId = consultant;
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filter.$or = [
        { 'applicant': searchRegex },
        { 'co_applicant': searchRegex },
        { 'applicant_email': searchRegex },
        { 'client_number': searchRegex }
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
    }

    // Get clients with pagination
    const clients = await SecuriaClient
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('consultant', 'firstName lastName email')
      .populate('processor', 'firstName lastName email');

    const total = await SecuriaClient.countDocuments(filter);

    return {
      success: true,
      data: clients,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: clients.length,
        totalItems: total
      }
    };
  }

  /**
   * Create a new client
   */
  static async createClient(clientData: any, userId: string) {
    // Generate client ID if not provided
    if (!clientData.clientId) {
      const lastClient = await SecuriaClient.findOne().sort({ clientId: -1 });
      const lastNumber = lastClient?.clientId ? parseInt(lastClient.clientId) : 1000000;
      clientData.clientId = (lastNumber + 1).toString();
    }

    const client = new SecuriaClient({
      ...clientData,
      createdBy: userId,
      updatedBy: userId
    });

    const savedClient = await client.save();
    await savedClient.populate('consultant', 'firstName lastName email');
    await savedClient.populate('processor', 'firstName lastName email');

    logger.info(`Client created via Securia: ${savedClient._id} by user: ${userId}`);

    return {
      success: true,
      data: savedClient,
      message: 'Client created successfully'
    };
  }

  /**
   * Get client by ID
   */
  static async getClientById(clientId: string) {
    const client = await SecuriaClient
      .findById(clientId)
      .populate('consultant', 'firstName lastName email')
      .populate('processor', 'firstName lastName email');

    if (!client) {
      throw new Error('Client not found');
    }

    return {
      success: true,
      data: client
    };
  }

  /**
   * Update client
   */
  static async updateClient(clientId: string, updateData: any, userId: string) {
    const client = await SecuriaClient.findById(clientId);
    
    if (!client) {
      throw new Error('Client not found');
    }

    const updatedClient = await SecuriaClient
      .findByIdAndUpdate(
        clientId,
        { ...updateData, updatedBy: userId, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .populate('consultant', 'firstName lastName email')
      .populate('processor', 'firstName lastName email');

    logger.info(`Client updated via Securia: ${clientId} by user: ${userId}`);

    return {
      success: true,
      data: updatedClient,
      message: 'Client updated successfully'
    };
  }

  /**
   * Delete client
   */
  static async deleteClient(clientId: string, userId: string) {
    const client = await SecuriaClient.findById(clientId);
    
    if (!client) {
      throw new Error('Client not found');
    }

    await SecuriaClient.findByIdAndDelete(clientId);
    logger.info(`Client deleted via Securia: ${clientId} by user: ${userId}`);

    return {
      success: true,
      message: 'Client deleted successfully'
    };
  }

  /**
   * Toggle client status
   */
  static async toggleClientStatus(clientId: string, userId: string) {
    const client = await SecuriaClient.findById(clientId);
    
    if (!client) {
      throw new Error('Client not found');
    }

    const newStatus = client.status === 'active' ? 'inactive' : 'active';
    
    const updatedClient = await SecuriaClient
      .findByIdAndUpdate(
        clientId,
        { status: newStatus, updatedBy: userId, updatedAt: new Date() },
        { new: true }
      )
      .populate('consultant', 'firstName lastName email')
      .populate('processor', 'firstName lastName email');

    logger.info(`Client status toggled via Securia: ${clientId} to ${newStatus} by user: ${userId}`);

    return {
      success: true,
      data: updatedClient,
      message: `Client status updated to ${newStatus}`
    };
  }

  /**
   * Update client section (multi-stage form)
   */
  static async updateClientSection(clientId: string, section: string, sectionData: any, userId: string) {
    const client = await SecuriaClient.findById(clientId);
    
    if (!client) {
      throw new Error('Client not found');
    }

    // Update the specific section
    const updateData = {
      [section]: sectionData,
      updatedBy: userId,
      updatedAt: new Date()
    };

    const updatedClient = await SecuriaClient
      .findByIdAndUpdate(clientId, updateData, { new: true, runValidators: true })
      .populate('consultant', 'firstName lastName email')
      .populate('processor', 'firstName lastName email');

    logger.info(`Client section ${section} updated via Securia: ${clientId} by user: ${userId}`);

    return {
      success: true,
      data: updatedClient,
      message: `Client ${section} section updated successfully`
    };
  }

  /**
   * Get client section data
   */
  static async getClientSection(clientId: string, section: string) {
    const client = await SecuriaClient.findById(clientId);
    
    if (!client) {
      throw new Error('Client not found');
    }

    const sectionData = (client as any)[section];

    return {
      success: true,
      data: sectionData || {},
      section
    };
  }

  /**
   * Get client completion progress
   */
  static async getClientProgress(clientId: string) {
    const client = await SecuriaClient.findById(clientId);
    
    if (!client) {
      throw new Error('Client not found');
    }

    // Calculate completion percentage based on filled sections
    const requiredSections = ['basicInfo', 'applicantDemographics', 'applicantEmployment', 'applicantHouseholdMembers'];
    let completedSections = 0;

    requiredSections.forEach(section => {
      if ((client as any)[section] && Object.keys((client as any)[section]).length > 0) {
        completedSections++;
      }
    });

    const completionPercentage = Math.round((completedSections / requiredSections.length) * 100);

    return {
      success: true,
      data: {
        clientId,
        completionPercentage,
        completedSections,
        totalSections: requiredSections.length,
        sectionsStatus: requiredSections.map(section => ({
          section,
          completed: (client as any)[section] && Object.keys((client as any)[section]).length > 0
        }))
      }
    };
  }
}
