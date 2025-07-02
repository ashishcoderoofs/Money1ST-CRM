import { Response } from 'express';
import { AuthRequest } from '../types';
import Consultant from '../models/Consultant';
import SecuriaClient from '../models/SecuriaClient';
import SecuriaAuditLog from '../models/SecuriaAuditLog';
import User from '../models/User';
import logger from '../../utils/logger';
import { SecuriaSessionService } from '../services/SecuriaSessionService';
import { SecuriaConsultantService } from '../services/SecuriaConsultantService';
import { SecuriaClientService } from '../services/SecuriaClientService';
import { SecuriaDashboardService } from '../services/SecuriaDashboardService';

// Re-export session functions for backward compatibility
export const hasValidSecuriaSession = (userId: string): boolean => {
  return SecuriaSessionService.hasValidSession(userId);
};

export const invalidateUserSecuriaSessions = (userId: string): void => {
  return SecuriaSessionService.invalidateUserSessions(userId);
};

// Helper function to calculate completion percentage
const calculateCompletionPercentage = (clientData: any): number => {
  const sections = [
    'basicInfo',
    'contactInfo',
    'contactAddress',
    'coApplicant',
    'liabilities',
    'mortgages',
    'underwriting',
    'loanStatus',
    'drivers',
    'vehicles',
    'homeowners',
    'renters',
    'incomeProtection',
    'retirement',
    'lineage'
  ];

  let completedSections = 0;
  
  sections.forEach(section => {
    if (clientData[section]) {
      if (section === 'basicInfo' && clientData.basicInfo.firstName && clientData.basicInfo.lastName) {
        completedSections++;
      } else if (section === 'contactInfo' && clientData.contactInfo.email && 
                 (clientData.contactInfo.homePhone || clientData.contactInfo.mobilePhone || clientData.contactInfo.otherPhone)) {
        completedSections++;
      } else if (section !== 'basicInfo' && section !== 'contactInfo' && 
                 Object.keys(clientData[section]).length > 0) {
        completedSections++;
      }
    }
  });

  return Math.round((completedSections / sections.length) * 100);
};

// Helper function to log audit events
const logAuditEvent = async (
  req: AuthRequest,
  action: string,
  resource: string,
  resourceId?: string,
  details?: any
) => {
  try {
    await SecuriaAuditLog.create({
      userId: req.user!._id,
      userEmail: req.user!.email,
      action,
      resource,
      resourceId,
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      details
    });
  } catch (error) {
    logger.error('Failed to log audit event:', error);
  }
};

// Authentication Endpoints
export const reauthSecuria = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
      return;
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      await logAuditEvent(req, 'SECURIA_REAUTH_FAILED', 'authentication', undefined, { email, reason: 'User not found' });
      res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      return;
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await logAuditEvent(req, 'SECURIA_REAUTH_FAILED', 'authentication', user._id.toString(), { email, reason: 'Invalid password' });
      res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      return;
    }

    // Check if user is Admin
    if (user.role !== 'Admin') {
      await logAuditEvent(req, 'SECURIA_REAUTH_DENIED', 'authentication', user._id.toString(), { email, role: user.role });
      res.status(403).json({ 
        success: false, 
        message: 'Access denied - Admin role required' 
      });
      return;
    }

    await logAuditEvent(req, 'SECURIA_REAUTH_SUCCESS', 'authentication', user._id.toString(), { email });
    
    // Create Securia session using service
    const sessionId = SecuriaSessionService.createSession(user._id.toString());
    
    res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Securia reauth error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Consultant Management Endpoints
export const getConsultants = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      search = '', 
      status = 'all', 
      sort = 'createdAt', 
      order = 'desc' 
    } = req.query;

    const result = await SecuriaConsultantService.getConsultants(req);

    await logAuditEvent(req, 'CONSULTANTS_VIEWED', 'consultant', undefined, { 
      page: parseInt(page as string), 
      limit: parseInt(limit as string), 
      search, 
      status 
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Get consultants error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get consultants' 
    });
  }
};

export const createConsultant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await SecuriaConsultantService.createConsultant(req.body, req.user!._id.toString());
    const consultant = result.data;
    
    await logAuditEvent(req, 'CONSULTANT_CREATED', 'consultant', consultant._id.toString(), { 
      consultantName: `${consultant.firstName} ${consultant.lastName}`,
      email: consultant.email 
    });

    res.status(201).json({
      success: true,
      message: 'Consultant created successfully',
      data: consultant
    });
  } catch (error: any) {
    logger.error('Create consultant error:', error);
    if (error.code === 11000) {
      res.status(409).json({ 
        success: false, 
        message: 'Consultant with this email already exists' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create consultant' 
      });
    }
  }
};

export const getConsultantById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await SecuriaConsultantService.getConsultantById(req.params.id);
    const consultant = result.data;
    
    if (!consultant) {
      res.status(404).json({ 
        success: false, 
        message: 'Consultant not found' 
      });
      return;
    }

    await logAuditEvent(req, 'CONSULTANT_VIEWED', 'consultant', consultant._id.toString());

    res.json({
      success: true,
      data: consultant
    });
  } catch (error) {
    logger.error('Get consultant error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get consultant' 
    });
  }
};

export const updateConsultant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await SecuriaConsultantService.updateConsultant(req.params.id, req.body, req.user!._id.toString());
    const consultant = result.data;
    
    if (consultant) {
      await logAuditEvent(req, 'CONSULTANT_UPDATED', 'consultant', consultant._id.toString(), { 
        consultantName: `${consultant.firstName} ${consultant.lastName}`,
        updatedFields: Object.keys(req.body)
      });
    }

    res.json({
      success: true,
      message: 'Consultant updated successfully',
      data: consultant
    });
  } catch (error: any) {
    logger.error('Update consultant error:', error);
    if (error.message === 'Consultant not found') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update consultant' 
      });
    }
  }
};

export const deleteConsultant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get consultant before deletion for audit log
    const consultantResult = await SecuriaConsultantService.getConsultantById(req.params.id);
    const consultant = consultantResult.data;
    
    // Delete consultant
    await SecuriaConsultantService.deleteConsultant(req.params.id, req.user!._id.toString());
    
    await logAuditEvent(req, 'CONSULTANT_DELETED', 'consultant', consultant._id.toString(), { 
      consultantName: `${consultant.firstName} ${consultant.lastName}`,
      email: consultant.email
    });

    res.json({
      success: true,
      message: 'Consultant deleted successfully'
    });
  } catch (error: any) {
    logger.error('Delete consultant error:', error);
    if (error.message === 'Consultant not found') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete consultant' 
      });
    }
  }
};

export const toggleConsultantStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await SecuriaConsultantService.toggleConsultantStatus(req.params.id, req.user!._id.toString());
    const consultant = result.data;

    if (consultant) {
      await logAuditEvent(req, 'CONSULTANT_STATUS_CHANGED', 'consultant', consultant._id.toString(), { 
        consultantName: `${consultant.firstName} ${consultant.lastName}`,
        newStatus: consultant.status
      });
    }

    res.json({
      success: true,
      message: 'Consultant status updated successfully',
      data: consultant ? {
        _id: consultant._id,
        status: consultant.status
      } : null
    });
  } catch (error: any) {
    logger.error('Toggle consultant status error:', error);
    if (error.message === 'Consultant not found') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update consultant status' 
      });
    }
  }
};

// Client Management Endpoints
export const getClients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      search = '', 
      status = 'all', 
      consultantId = '',
      sort = 'createdAt', 
      order = 'desc' 
    } = req.query;

    const result = await SecuriaClientService.getClients(req);

    await logAuditEvent(req, 'CLIENTS_VIEWED', 'client', undefined, { 
      page: parseInt(page as string), 
      limit: parseInt(limit as string), 
      search, 
      status, 
      consultantId 
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    logger.error('Get clients error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get clients' 
    });
  }
};

export const createClient = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    console.log('📝 Creating new client:', req.body);
    
    const result = await SecuriaClientService.createClient(req.body, req.user!._id.toString());
    const newClient = result.data;
    
    // Log audit trail
    await logAuditEvent(req, 'CLIENT_CREATED', 'client', newClient._id.toString(), {
      clientId: newClient.clientId,
      email: newClient.applicant?.email || newClient.email,
      completionPercentage: newClient.completionPercentage
    });

    console.log('✅ Client created successfully:', newClient.clientId);
    
    return res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: {
        id: newClient._id,
        clientId: newClient.clientId,
        ...newClient.toObject()
      }
    });

  } catch (error: any) {
    console.error('❌ Error creating client:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        error: `Client with this ${field} already exists`
      });
    }
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create client'
    });
  }
};


export const getClientById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await SecuriaClientService.getClientById(req.params.id);
    const client = result.data;
    
    await logAuditEvent(req, 'CLIENT_VIEWED', 'client', client._id.toString());

    res.json({
      success: true,
      data: client
    });
  } catch (error: any) {
    logger.error('Get client error:', error);
    if (error.message === 'Client not found') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to get client' 
      });
    }
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const clientId = req.params.id;
    const updateData = req.body;
    
    console.log('📝 Updating client:', clientId, updateData);
    
    const result = await SecuriaClientService.updateClient(clientId, updateData, req.user!._id.toString());
    const updatedClient = result.data;
    
    // Log audit trail
    await logAuditEvent(req, 'CLIENT_UPDATED', 'client', clientId, {
      clientId: updatedClient?.clientId,
      completionPercentage: updatedClient?.completionPercentage,
      status: updatedClient?.status
    });
    
    console.log('✅ Client updated successfully:', updatedClient?.clientId);
    
    return res.json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient
    });
    
  } catch (error: any) {
    console.error('❌ Error updating client:', error);
    
    if (error.message === 'Client not found') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update client'
    });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get client before deletion for audit log
    const clientResult = await SecuriaClientService.getClientById(req.params.id);
    const client = clientResult.data;
    
    // Delete client
    await SecuriaClientService.deleteClient(req.params.id, req.user!._id.toString());

    await logAuditEvent(req, 'CLIENT_DELETED', 'client', client._id.toString(), { 
      clientName: `${client.firstName} ${client.lastName}`,
      email: client.email
    });

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error: any) {
    logger.error('Delete client error:', error);
    if (error.message === 'Client not found') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete client' 
      });
    }
  }
};

export const toggleClientStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await SecuriaClientService.toggleClientStatus(req.params.id, req.user!._id.toString());
    const client = result.data;

    if (client) {
      await logAuditEvent(req, 'CLIENT_STATUS_CHANGED', 'client', client._id.toString(), { 
        clientName: `${client.firstName} ${client.lastName}`,
        newStatus: client.status
      });
    }

    res.json({
      success: true,
      message: 'Client status updated successfully',
      data: client ? {
        _id: client._id,
        status: client.status
      } : null
    });
  } catch (error: any) {
    logger.error('Toggle client status error:', error);
    if (error.message === 'Client not found') {
      res.status(404).json({ 
        success: false, 
        message: error.message 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update client status' 
      });
    }
  }
};

// Dashboard & Analytics Endpoints
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await SecuriaDashboardService.getDashboardStats();

    await logAuditEvent(req, 'DASHBOARD_VIEWED', 'dashboard');

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get dashboard stats' 
    });
  }
};

export const getChartData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { timeframe = 'month' } = req.query;
    
    const chartData = await SecuriaDashboardService.getChartData(timeframe as string);

    await logAuditEvent(req, 'CHART_DATA_VIEWED', 'dashboard', undefined, { timeframe });

    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    logger.error('Get chart data error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get chart data' 
    });
  }
};

// Security & Audit Endpoints
export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      page = '1', 
      limit = '50', 
      action = '', 
      userId = '', 
      startDate = '', 
      endDate = '' 
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    let filter: any = {};
    
    if (action) {
      filter.action = { $regex: action, $options: 'i' };
    }
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate as string);
      if (endDate) filter.timestamp.$lte = new Date(endDate as string);
    }

    const logs = await SecuriaAuditLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await SecuriaAuditLog.countDocuments(filter);

    await logAuditEvent(req, 'AUDIT_LOGS_VIEWED', 'audit', undefined, { page: pageNum, limit: limitNum, filters: filter });

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    logger.error('Get audit logs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get audit logs' 
    });
  }
};

// Enhanced Multi-Stage Client Form API Endpoints

/**
 * Create a new client with multi-stage form support
 */
export const createMultiStageClient = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    console.log('📝 Creating new multi-stage client:', req.body);
    
    const clientData = req.body;
    
    // Generate client ID
    const clientCount = await SecuriaClient.countDocuments();
    const clientId = `CLI${String(clientCount + 1).padStart(6, '0')}`;
    
    // Calculate completion percentage based on comprehensive form data
    const completionPercentage = calculateMultiStageCompletionPercentage(clientData);
    
    // Determine status based on completion
    let status = 'draft';
    if (completionPercentage >= 80) {
      status = 'active';
    } else if (completionPercentage >= 30) {
      status = 'submitted';
    }

    // Prepare client document with full multi-stage structure
    const newClient = new SecuriaClient({
      clientId,
      status,
      completionPercentage,
      createdBy: req.user?.id,
      lastModifiedBy: req.user?.id,
      
      // Map the multi-stage form data
      applicant: clientData.applicant,
      coApplicant: clientData.coApplicant,
      liabilities: clientData.liabilities,
      mortgages: clientData.mortgages,
      underwriting: clientData.underwriting,
      loanStatus: clientData.loanStatus,
      drivers: clientData.drivers,
      vehicleCoverage: clientData.vehicleCoverage,
      homeowners: clientData.homeowners,
      renters: clientData.renters,
      incomeProtection: clientData.incomeProtection,
      retirement: clientData.retirement,
      lineage: clientData.lineage,
      
      // Legacy fields for backward compatibility
      firstName: clientData.applicant?.firstName || clientData.firstName,
      lastName: clientData.applicant?.lastName || clientData.lastName,
      email: clientData.applicant?.email || clientData.email,
      phone: clientData.applicant?.homePhone || clientData.applicant?.mobilePhone || clientData.phone,
      dateOfBirth: clientData.applicant?.demographics?.dateOfBirth || clientData.dateOfBirth,
      ssn: clientData.applicant?.demographics?.ssn || clientData.ssn,
      address: clientData.applicant?.address || clientData.address,
      consultantId: clientData.lineage?.consultantAssigned || clientData.consultantId
    });

    await newClient.save();
    
    // Log audit trail
    await logAuditEvent(req, 'MULTISTAGE_CLIENT_CREATED', 'client', newClient._id.toString(), {
      clientId: newClient.clientId,
      email: newClient.applicant?.email || newClient.email,
      completionPercentage,
      sectionsCompleted: getCompletedSections(clientData)
    });

    console.log('✅ Multi-stage client created successfully:', newClient.clientId);
    
    return res.status(201).json({
      success: true,
      message: 'Multi-stage client created successfully',
      data: {
        id: newClient._id,
        clientId: newClient.clientId,
        completionPercentage: newClient.completionPercentage,
        status: newClient.status,
        ...newClient.toObject()
      }
    });

  } catch (error: any) {
    console.error('❌ Error creating multi-stage client:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        error: `Client with this ${field} already exists`
      });
    }
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create multi-stage client'
    });
  }
};

/**
 * Update specific section of multi-stage client form
 */
export const updateClientSection = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { section, data } = req.body;
    
    console.log(`📝 Updating client section '${section}' for client:`, id);
    
    if (!section || !data) {
      return res.status(400).json({
        success: false,
        error: 'Section name and data are required'
      });
    }

    const validSections = [
      'applicant', 'coApplicant', 'liabilities', 'mortgages', 'underwriting', 
      'loanStatus', 'drivers', 'vehicleCoverage', 'homeowners', 'renters', 
      'incomeProtection', 'retirement', 'lineage'
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        error: `Invalid section. Valid sections are: ${validSections.join(', ')}`
      });
    }

    const client = await SecuriaClient.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Update the specific section
    (client as any)[section] = data;
    client.lastModifiedBy = req.user?.id;
    
    // Recalculate completion percentage
    const completionPercentage = calculateMultiStageCompletionPercentage(client.toObject());
    client.completionPercentage = completionPercentage;
    
    // Update status based on completion
    if (completionPercentage >= 80) {
      client.status = 'active';
    } else if (completionPercentage >= 30) {
      client.status = 'submitted';
    }

    await client.save();
    
    // Log audit trail
    await logAuditEvent(req, 'CLIENT_SECTION_UPDATED', 'client', client._id.toString(), {
      clientId: client.clientId,
      section,
      completionPercentage,
      previousStatus: client.status
    });

    console.log(`✅ Client section '${section}' updated successfully for:`, client.clientId);
    
    return res.status(200).json({
      success: true,
      message: `Client ${section} section updated successfully`,
      data: {
        id: client._id,
        clientId: client.clientId,
        completionPercentage: client.completionPercentage,
        status: client.status,
        updatedSection: section,
        [section]: (client as any)[section]
      }
    });

  } catch (error: any) {
    console.error('❌ Error updating client section:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update client section'
    });
  }
};

/**
 * Get specific section data for a client
 */
export const getClientSection = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { id, section } = req.params;
    
    const validSections = [
      'applicant', 'coApplicant', 'liabilities', 'mortgages', 'underwriting', 
      'loanStatus', 'drivers', 'vehicleCoverage', 'homeowners', 'renters', 
      'incomeProtection', 'retirement', 'lineage'
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        error: `Invalid section. Valid sections are: ${validSections.join(', ')}`
      });
    }

    const client = await SecuriaClient.findById(id).select(`${section} clientId completionPercentage status`);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        clientId: client.clientId,
        section,
        data: (client as any)[section] || {},
        completionPercentage: client.completionPercentage,
        status: client.status
      }
    });

  } catch (error: any) {
    console.error('❌ Error getting client section:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get client section'
    });
  }
};

/**
 * Get client completion status and progress
 */
export const getClientProgress = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    const client = await SecuriaClient.findById(id).select('clientId completionPercentage status applicant coApplicant liabilities mortgages underwriting loanStatus drivers vehicleCoverage homeowners renters incomeProtection retirement lineage');
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    const clientData = client.toObject();
    const completedSections = getCompletedSections(clientData);
    const sectionProgress = getSectionProgress(clientData);

    return res.status(200).json({
      success: true,
      data: {
        clientId: client.clientId,
        completionPercentage: client.completionPercentage,
        status: client.status,
        completedSections,
        sectionProgress,
        totalSections: Object.keys(sectionProgress).length,
        completedCount: completedSections.length
      }
    });

  } catch (error: any) {
    console.error('❌ Error getting client progress:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get client progress'
    });
  }
};

/**
 * Bulk update multiple sections at once
 */
export const bulkUpdateClientSections = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { sections } = req.body;
    
    if (!sections || typeof sections !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Sections object is required'
      });
    }

    const client = await SecuriaClient.findById(id);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    const validSections = [
      'applicant', 'coApplicant', 'liabilities', 'mortgages', 'underwriting', 
      'loanStatus', 'drivers', 'vehicleCoverage', 'homeowners', 'renters', 
      'incomeProtection', 'retirement', 'lineage'
    ];

    const invalidSections = Object.keys(sections).filter(section => !validSections.includes(section));
    if (invalidSections.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid sections: ${invalidSections.join(', ')}. Valid sections are: ${validSections.join(', ')}`
      });
    }

    // Update all provided sections
    Object.keys(sections).forEach(section => {
      (client as any)[section] = sections[section];
    });

    client.lastModifiedBy = req.user?.id;
    
    // Recalculate completion percentage
    const completionPercentage = calculateMultiStageCompletionPercentage(client.toObject());
    client.completionPercentage = completionPercentage;
    
    // Update status based on completion
    if (completionPercentage >= 80) {
      client.status = 'active';
    } else if (completionPercentage >= 30) {
      client.status = 'submitted';
    }

    await client.save();
    
    // Log audit trail
    await logAuditEvent(req, 'CLIENT_BULK_UPDATE', 'client', client._id.toString(), {
      clientId: client.clientId,
      sectionsUpdated: Object.keys(sections),
      completionPercentage
    });

    console.log(`✅ Client bulk update completed for:`, client.clientId);
    
    return res.status(200).json({
      success: true,
      message: 'Client sections updated successfully',
      data: {
        id: client._id,
        clientId: client.clientId,
        completionPercentage: client.completionPercentage,
        status: client.status,
        updatedSections: Object.keys(sections)
      }
    });

  } catch (error: any) {
    console.error('❌ Error bulk updating client sections:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to bulk update client sections'
    });
  }
};

// Helper functions for multi-stage form completion calculation

const calculateMultiStageCompletionPercentage = (clientData: any): number => {
  const sections: Record<string, any> = {
    applicant: clientData.applicant,
    coApplicant: clientData.coApplicant,
    liabilities: clientData.liabilities,
    mortgages: clientData.mortgages,
    underwriting: clientData.underwriting,
    loanStatus: clientData.loanStatus,
    drivers: clientData.drivers,
    vehicleCoverage: clientData.vehicleCoverage,
    homeowners: clientData.homeowners,
    renters: clientData.renters,
    incomeProtection: clientData.incomeProtection,
    retirement: clientData.retirement,
    lineage: clientData.lineage
  };

  const sectionWeights = {
    applicant: 20, // Most important - basic client info
    coApplicant: 10,
    liabilities: 10,
    mortgages: 10,
    underwriting: 15, // Important for loan processing
    loanStatus: 15, // Important for tracking
    drivers: 5,
    vehicleCoverage: 5,
    homeowners: 5,
    renters: 3,
    incomeProtection: 7,
    retirement: 10,
    lineage: 5
  };

  let totalWeight = 0;
  let completedWeight = 0;

  Object.keys(sections).forEach(sectionName => {
    const section = sections[sectionName];
    const weight = sectionWeights[sectionName as keyof typeof sectionWeights];
    totalWeight += weight;

    if (isSectionCompleted(sectionName, section)) {
      completedWeight += weight;
    }
  });

  return Math.round((completedWeight / totalWeight) * 100);
};

const isSectionCompleted = (sectionName: string, sectionData: any): boolean => {
  if (!sectionData) return false;

  switch (sectionName) {
    case 'applicant':
      return !!(sectionData.firstName && sectionData.lastName && sectionData.email);
    
    case 'coApplicant':
      return sectionData.hasCoApplicant === false || 
             (sectionData.hasCoApplicant && sectionData.firstName && sectionData.lastName);
    
    case 'underwriting':
      return !!(sectionData.creditScore && sectionData.annualIncome);
    
    case 'loanStatus':
      return !!(sectionData.status && sectionData.loanType);
    
    case 'vehicleCoverage':
      return sectionData.hasVehicles === false || 
             (sectionData.hasVehicles && sectionData.vehicles && sectionData.vehicles.length > 0);
    
    case 'homeowners':
      return sectionData.hasHomeInsurance === false || 
             (sectionData.hasHomeInsurance && sectionData.provider);
    
    case 'renters':
      return sectionData.hasRentersInsurance === false || 
             (sectionData.hasRentersInsurance && sectionData.provider);
    
    case 'incomeProtection':
      return sectionData.hasIncomeProtection === false || 
             (sectionData.hasIncomeProtection && (sectionData.shortTermDisability || sectionData.longTermDisability || sectionData.lifeInsurance));
    
    case 'retirement':
      return sectionData.hasRetirementAccounts === false || 
             (sectionData.hasRetirementAccounts && sectionData.currentAge);
    
    case 'lineage':
      return !!(sectionData.referralSource);
    
    case 'liabilities':
    case 'mortgages':
    case 'drivers':
      return Array.isArray(sectionData) ? sectionData.length > 0 : false;
    
    default:
      return Object.keys(sectionData).length > 0;
  }
};

const getCompletedSections = (clientData: any): string[] => {
  const sections = ['applicant', 'coApplicant', 'liabilities', 'mortgages', 'underwriting', 'loanStatus', 'drivers', 'vehicleCoverage', 'homeowners', 'renters', 'incomeProtection', 'retirement', 'lineage'];
  
  return sections.filter(sectionName => {
    const sectionData = clientData[sectionName];
    return isSectionCompleted(sectionName, sectionData);
  });
};

const getSectionProgress = (clientData: any): Record<string, { completed: boolean; completionPercentage: number }> => {
  const sections = ['applicant', 'coApplicant', 'liabilities', 'mortgages', 'underwriting', 'loanStatus', 'drivers', 'vehicleCoverage', 'homeowners', 'renters', 'incomeProtection', 'retirement', 'lineage'];
  
  const progress: Record<string, { completed: boolean; completionPercentage: number }> = {};
  
  sections.forEach(sectionName => {
    const sectionData = clientData[sectionName];
    const completed = isSectionCompleted(sectionName, sectionData);
    
    // Calculate individual section completion percentage
    let completionPercentage = 0;
    if (sectionData) {
      const fields = Object.keys(sectionData);
      const filledFields = fields.filter(key => {
        const value = sectionData[key];
        return value !== null && value !== undefined && value !== '';
      });
      completionPercentage = fields.length > 0 ? Math.round((filledFields.length / fields.length) * 100) : 0;
    }
    
    progress[sectionName] = {
      completed,
      completionPercentage
    };
  });
  
  return progress;
};
