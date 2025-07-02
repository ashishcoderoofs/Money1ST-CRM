import express from 'express';
import User from '../models/User';
import Consultant from '../models/Consultant';
import SecuriaClient from '../models/SecuriaClient';
import SecuriaAuditLog from '../models/SecuriaAuditLog';
import { AuthRequest } from '../types';
import { Response } from 'express';
import logger from '../../utils/logger';

// In-memory store for Securia sessions (in production, use Redis or database)
const securiaSessionStore = new Map<string, { userId: string, timestamp: number }>();

// Session timeout: 8 hours
const SECURIA_SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

// Helper function to clean expired sessions
const cleanExpiredSessions = () => {
  const now = Date.now();
  for (const [sessionId, session] of securiaSessionStore.entries()) {
    if (now - session.timestamp > SECURIA_SESSION_TIMEOUT) {
      securiaSessionStore.delete(sessionId);
    }
  }
};

// Helper function to generate session ID
const generateSessionId = (userId: string): string => {
  return `securia_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to check if user has valid Securia session
export const hasValidSecuriaSession = (userId: string): boolean => {
  cleanExpiredSessions();
  for (const [sessionId, session] of securiaSessionStore.entries()) {
    if (session.userId === userId && (Date.now() - session.timestamp) < SECURIA_SESSION_TIMEOUT) {
      return true;
    }
  }
  return false;
};

// Helper function to create Securia session
const createSecuriaSession = (userId: string): string => {
  cleanExpiredSessions();
  const sessionId = generateSessionId(userId);
  securiaSessionStore.set(sessionId, { userId, timestamp: Date.now() });
  return sessionId;
};

// Helper function to invalidate user's Securia sessions
export const invalidateUserSecuriaSessions = (userId: string): void => {
  for (const [sessionId, session] of securiaSessionStore.entries()) {
    if (session.userId === userId) {
      securiaSessionStore.delete(sessionId);
    }
  }
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
    
    // Create Securia session
    const sessionId = createSecuriaSession(user._id.toString());
    
    res.json({
      success: true,
      message: 'Authentication successful',
      sessionId,
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

// Add new endpoint to check Securia session status
export const checkSecuriaSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }

    const hasSession = hasValidSecuriaSession(req.user._id.toString());
    
    res.json({
      success: true,
      hasSecuriaAccess: hasSession,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    logger.error('Check Securia session error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Add endpoint to logout from Securia (invalidate session)
export const logoutSecuria = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }

    // Invalidate all Securia sessions for this user
    invalidateUserSecuriaSessions(req.user._id.toString());
    
    await logAuditEvent(req, 'SECURIA_LOGOUT', 'authentication', req.user._id.toString(), { 
      email: req.user.email 
    });
    
    res.json({
      success: true,
      message: 'Securia session ended successfully'
    });
  } catch (error) {
    logger.error('Securia logout error:', error);
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

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const sortOrder = order === 'asc' ? 1 : -1;

    let filter: any = {};
    
    if (status !== 'all') {
      // Convert lowercase status to our model's capitalized format
      const statusValue = status === 'active' ? 'Active' : status === 'inactive' ? 'Inactive' : status;
      filter.status = statusValue;
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { consultantId: { $regex: search, $options: 'i' } }
      ];
    }

    const consultants = await Consultant.find(filter)
      .sort({ [sort as string]: sortOrder })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Consultant.countDocuments(filter);

    await logAuditEvent(req, 'CONSULTANTS_VIEWED', 'consultant', undefined, { page: pageNum, limit: limitNum, search, status });

    res.json({
      success: true,
      data: consultants,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
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
    const consultant = await Consultant.create(req.body);
    
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
    const consultant = await Consultant.findById(req.params.id);
    
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
    const consultant = await Consultant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!consultant) {
      res.status(404).json({ 
        success: false, 
        message: 'Consultant not found' 
      });
      return;
    }

    await logAuditEvent(req, 'CONSULTANT_UPDATED', 'consultant', consultant._id.toString(), { 
      consultantName: `${consultant.firstName} ${consultant.lastName}`,
      updatedFields: Object.keys(req.body)
    });

    res.json({
      success: true,
      message: 'Consultant updated successfully',
      data: consultant
    });
  } catch (error) {
    logger.error('Update consultant error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update consultant' 
    });
  }
};

export const deleteConsultant = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const consultant = await Consultant.findByIdAndDelete(req.params.id);
    
    if (!consultant) {
      res.status(404).json({ 
        success: false, 
        message: 'Consultant not found' 
      });
      return;
    }

    await logAuditEvent(req, 'CONSULTANT_DELETED', 'consultant', consultant._id.toString(), { 
      consultantName: `${consultant.firstName} ${consultant.lastName}`,
      email: consultant.email
    });

    res.json({
      success: true,
      message: 'Consultant deleted successfully'
    });
  } catch (error) {
    logger.error('Delete consultant error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete consultant' 
    });
  }
};

export const toggleConsultantStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const consultant = await Consultant.findById(req.params.id);
    
    if (!consultant) {
      res.status(404).json({ 
        success: false, 
        message: 'Consultant not found' 
      });
      return;
    }

    consultant.status = consultant.status === 'Active' ? 'Inactive' : 'Active';
    await consultant.save();

    await logAuditEvent(req, 'CONSULTANT_STATUS_CHANGED', 'consultant', consultant._id.toString(), { 
      consultantName: `${consultant.firstName} ${consultant.lastName}`,
      newStatus: consultant.status
    });

    res.json({
      success: true,
      message: 'Consultant status updated successfully',
      data: {
        _id: consultant._id,
        status: consultant.status
      }
    });
  } catch (error) {
    logger.error('Toggle consultant status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update consultant status' 
    });
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

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const sortOrder = order === 'asc' ? 1 : -1;

    let filter: any = {};
    
    if (status !== 'all') {
      filter.status = status;
    }
    
    if (consultantId) {
      filter.consultantId = consultantId;
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await SecuriaClient.find(filter)
      .populate('consultantId', 'firstName lastName email')
      .sort({ [sort as string]: sortOrder })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await SecuriaClient.countDocuments(filter);

    await logAuditEvent(req, 'CLIENTS_VIEWED', 'client', undefined, { page: pageNum, limit: limitNum, search, status, consultantId });

    res.json({
      success: true,
      data: clients,
      pagination: {
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
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
    
    const clientData = req.body;
    
    // Note: Validation is handled by Joi middleware before reaching this controller

    // Generate client ID
    const clientCount = await SecuriaClient.countDocuments();
    const clientId = `CLI${String(clientCount + 1).padStart(6, '0')}`;
    
    // Calculate completion percentage
    const completionPercentage = calculateCompletionPercentage(clientData);
    
    // Determine status based on completion
    let status = 'draft';
    if (completionPercentage >= 80) {
      status = 'active';
    } else if (completionPercentage >= 30) {
      status = 'submitted';
    }

    // Prepare client document
    const newClient = new SecuriaClient({
      ...clientData,
      clientId,
      status,
      completionPercentage,
      createdBy: req.user?.id,
      lastModifiedBy: req.user?.id
    });

    await newClient.save();
    
    // Log audit trail
    await logAuditEvent(req, 'CLIENT_CREATED', 'client', newClient._id.toString(), {
      clientId: newClient.clientId,
      email: newClient.applicant?.email || newClient.email,
      completionPercentage
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
    const client = await SecuriaClient.findById(req.params.id)
      .populate('consultantId', 'firstName lastName email');
    
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    await logAuditEvent(req, 'CLIENT_VIEWED', 'client', client._id.toString());

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    logger.error('Get client error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get client' 
    });
  }
};

export const updateClient = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const clientId = req.params.id;
    const updateData = req.body;
    
    console.log('📝 Updating client:', clientId, updateData);
    
    // Calculate new completion percentage
    const existingClient = await SecuriaClient.findById(clientId);
    if (!existingClient) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    // Merge existing data with updates
    const mergedData = { ...existingClient.toObject(), ...updateData };
    const completionPercentage = calculateCompletionPercentage(mergedData);
    
    // Update status based on completion
    let status = updateData.status || existingClient.status;
    if (completionPercentage >= 80 && status === 'draft') {
      status = 'active';
    } else if (completionPercentage >= 30 && status === 'draft') {
      status = 'submitted';
    }
    
    // Set audit fields
    updateData.lastModifiedBy = req.user?.id;
    updateData.updatedAt = new Date();
    updateData.completionPercentage = completionPercentage;
    updateData.status = status;
    
    const updatedClient = await SecuriaClient.findByIdAndUpdate(
      clientId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    // Log audit trail
    await logAuditEvent(req, 'CLIENT_UPDATED', 'client', clientId, {
      clientId: updatedClient?.clientId,
      completionPercentage,
      status
    });
    
    console.log('✅ Client updated successfully:', updatedClient?.clientId);
    
    return res.json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient
    });
    
  } catch (error: any) {
    console.error('❌ Error updating client:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update client'
    });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await SecuriaClient.findByIdAndDelete(req.params.id);
    
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    await logAuditEvent(req, 'CLIENT_DELETED', 'client', client._id.toString(), { 
      clientName: `${client.firstName} ${client.lastName}`,
      email: client.email
    });

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    logger.error('Delete client error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete client' 
    });
  }
};

export const toggleClientStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await SecuriaClient.findById(req.params.id);
    
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    client.status = client.status === 'active' ? 'inactive' : 'active';
    await client.save();

    await logAuditEvent(req, 'CLIENT_STATUS_CHANGED', 'client', client._id.toString(), { 
      clientName: `${client.firstName} ${client.lastName}`,
      newStatus: client.status
    });

    res.json({
      success: true,
      message: 'Client status updated successfully',
      data: {
        _id: client._id,
        status: client.status
      }
    });
  } catch (error) {
    logger.error('Toggle client status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update client status' 
    });
  }
};

// Dashboard & Analytics Endpoints
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalConsultants = await Consultant.countDocuments();
    const activeConsultants = await Consultant.countDocuments({ status: 'Active' });
    const totalClients = await SecuriaClient.countDocuments();
    const activeClients = await SecuriaClient.countDocuments({ status: 'active' });

    // Calculate mock revenue (in a real app, this would come from a transactions collection)
    const totalRevenue = totalClients * 2500; // Mock calculation
    const monthlyGrowth = Math.round(Math.random() * 20 + 5); // Mock growth

    // Get recent activity from audit logs
    const recentActivity = await SecuriaAuditLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .select('action resource details timestamp');

    await logAuditEvent(req, 'DASHBOARD_VIEWED', 'dashboard');

    res.json({
      success: true,
      data: {
        totalConsultants,
        activeConsultants,
        totalClients,
        activeClients,
        totalRevenue,
        monthlyGrowth,
        recentActivity: recentActivity.map(log => ({
          id: log._id,
          type: log.action.toLowerCase(),
          description: `${log.action.replace(/_/g, ' ')} - ${log.resource}`,
          timestamp: log.timestamp
        }))
      }
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
    
    let dateRange = new Date();
    switch(timeframe) {
      case 'week':
        dateRange.setDate(dateRange.getDate() - 7);
        break;
      case 'quarter':
        dateRange.setMonth(dateRange.getMonth() - 3);
        break;
      case 'year':
        dateRange.setFullYear(dateRange.getFullYear() - 1);
        break;
      default:
        dateRange.setMonth(dateRange.getMonth() - 1);
    }

    // Consultant growth
    const consultantGrowth = await Consultant.aggregate([
      { $match: { createdAt: { $gte: dateRange } } },
      { 
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Client growth
    const clientGrowth = await SecuriaClient.aggregate([
      { $match: { createdAt: { $gte: dateRange } } },
      { 
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Revenue by consultant (mock data)
    const consultants = await Consultant.find({ status: 'Active' }).limit(10);
    const revenueByConsultant = consultants.map(consultant => ({
      consultantName: `${consultant.firstName} ${consultant.lastName}`,
      revenue: Math.round(Math.random() * 200000 + 50000)
    }));

    // Clients by risk tolerance
    const clientsByRiskTolerance = await SecuriaClient.aggregate([
      {
        $group: {
          _id: '$financialInfo.riskTolerance',
          count: { $sum: 1 }
        }
      }
    ]);

    await logAuditEvent(req, 'CHART_DATA_VIEWED', 'dashboard', undefined, { timeframe });

    res.json({
      success: true,
      data: {
        consultantGrowth: consultantGrowth.map(item => ({
          period: `${item._id.month}/${item._id.year}`,
          count: item.count
        })),
        clientGrowth: clientGrowth.map(item => ({
          period: `${item._id.month}/${item._id.year}`,
          count: item.count
        })),
        revenueByConsultant,
        clientsByRiskTolerance: clientsByRiskTolerance.map(item => ({
          riskLevel: item._id,
          count: item.count
        }))
      }
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
