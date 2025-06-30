import { Response } from 'express';
import { AuthRequest } from '../types';
import SecuriaConsultant from '../models/SecuriaConsultant';
import SecuriaClient from '../models/SecuriaClient';
import SecuriaAuditLog from '../models/SecuriaAuditLog';
import User from '../models/User';
import logger from '../../utils/logger';

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

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const sortOrder = order === 'asc' ? 1 : -1;

    let filter: any = {};
    
    if (status !== 'all') {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const consultants = await SecuriaConsultant.find(filter)
      .sort({ [sort as string]: sortOrder })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await SecuriaConsultant.countDocuments(filter);

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
    const consultant = await SecuriaConsultant.create(req.body);
    
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
    const consultant = await SecuriaConsultant.findById(req.params.id);
    
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
    const consultant = await SecuriaConsultant.findByIdAndUpdate(
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
    const consultant = await SecuriaConsultant.findByIdAndDelete(req.params.id);
    
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
    const consultant = await SecuriaConsultant.findById(req.params.id);
    
    if (!consultant) {
      res.status(404).json({ 
        success: false, 
        message: 'Consultant not found' 
      });
      return;
    }

    consultant.status = consultant.status === 'active' ? 'inactive' : 'active';
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

export const createClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Encrypt SSN before saving
    const clientData = { ...req.body };
    if (clientData.ssn) {
      const crypto = require('crypto');
      const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-encryption-key-here';
      const algorithm = 'aes-256-cbc';
      
      // Create a hash of the key to ensure it's 32 bytes
      const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
      const iv = crypto.randomBytes(16);
      
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(clientData.ssn, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Store IV with encrypted data
      clientData.ssn = iv.toString('hex') + ':' + encrypted;
    }
    
    const client = await SecuriaClient.create(clientData);
    
    await logAuditEvent(req, 'CLIENT_CREATED', 'client', client._id.toString(), { 
      clientName: `${client.firstName} ${client.lastName}`,
      email: client.email,
      consultantId: client.consultantId
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error: any) {
    logger.error('Create client error:', error);
    if (error.code === 11000) {
      res.status(409).json({ 
        success: false, 
        message: 'Client with this email already exists' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create client',
        error: error.message
      });
    }
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

export const updateClient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const client = await SecuriaClient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    await logAuditEvent(req, 'CLIENT_UPDATED', 'client', client._id.toString(), { 
      clientName: `${client.firstName} ${client.lastName}`,
      updatedFields: Object.keys(req.body)
    });

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    logger.error('Update client error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update client' 
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
    const totalConsultants = await SecuriaConsultant.countDocuments();
    const activeConsultants = await SecuriaConsultant.countDocuments({ status: 'active' });
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
    const consultantGrowth = await SecuriaConsultant.aggregate([
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
    const consultants = await SecuriaConsultant.find({ status: 'active' }).limit(10);
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
