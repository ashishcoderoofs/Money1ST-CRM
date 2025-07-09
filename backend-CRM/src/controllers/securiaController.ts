import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Consultant from '../models/Consultant';
import SecuriaAuditLog from '../models/SecuriaAuditLog';
import { AuthRequest } from '../types/types';
import { Response } from 'express';
import logger from '../../utils/logger';

import { Applicant, Client } from '../models';

// In-memory store for Securia sessions (in production, use Redis or database)
const securiaSessionStore = new Map<string, { userId: string, timestamp: number }>();

// Helper function to generate session ID
const generateSessionId = (userId: string): string => {
  return `securia_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to check if user has valid Securia session
export const hasValidSecuriaSession = (userId: string, jwtIssuedAt?: number): boolean => {
  // Only check if a Securia session exists for this user and was created after the JWT was issued
  for (const [sessionId, session] of securiaSessionStore.entries()) {
    if (session.userId === userId) {
      if (jwtIssuedAt) {
        const jwtIssuedTimestamp = jwtIssuedAt * 1000; // Convert to milliseconds
        // Session is only valid if it was created after the current JWT token
        return session.timestamp > jwtIssuedTimestamp;
      }
      return true;
    }
  }
  return false;
};

// Helper function to create Securia session
const createSecuriaSession = (userId: string): string => {
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

// Helper function to get session info for a user
const getSessionInfo = (userId: string): { active: boolean; count: number; lastActivity?: number } => {
  let activeSessions = 0;
  let lastActivity: number | undefined;

  for (const [sessionId, session] of securiaSessionStore.entries()) {
    if (session.userId === userId) {
      activeSessions++;
      if (!lastActivity || session.timestamp > lastActivity) {
        lastActivity = session.timestamp;
      }
    }
  }

  return {
    active: activeSessions > 0,
    count: activeSessions,
    lastActivity
  };
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

    // Extract JWT token and get issued time
    let jwtIssuedAt: number | undefined;
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (token) {
        const decoded = jwt.decode(token) as any;
        jwtIssuedAt = decoded?.iat;
      }
    } catch (error) {
      logger.warn('Could not decode JWT for session validation:', error);
    }

    const hasSession = hasValidSecuriaSession(req.user._id.toString(), jwtIssuedAt);
    
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

// Dashboard & Analytics Endpoints
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalConsultants = await Consultant.countDocuments();
    const activeConsultants = await Consultant.countDocuments({ status: 'Active' });
    
    // Count clients from both models
    const clients = await Client.countDocuments();
    const applicant = await Applicant.countDocuments({ status: 'active'}); // Assuming Applicant clients are also SecuriaClients
    const totalClients = clients + applicant;
    
    const activeSecuriaClients = await Applicant.countDocuments({ status: 'active' });
    // All applicants are considered active by default
    const activeClients = activeSecuriaClients + applicant;

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

// Add debug endpoint to check session state
export const debugSecuriaSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }

    const userId = req.user._id.toString();
    const sessionInfo = getSessionInfo(userId);
    
    // Get all sessions for debugging
    const allSessions: any[] = [];
    
    for (const [sessionId, session] of securiaSessionStore.entries()) {
      allSessions.push({
        sessionId,
        userId: session.userId,
        timestamp: session.timestamp,
        age: Date.now() - session.timestamp,
        isExpired: false // No explicit expiration check here, rely on JWT validity
      });
    }
    
    res.json({
      success: true,
      debug: {
        currentUserId: userId,
        currentUserSessions: sessionInfo,
        allActiveSessions: allSessions,
        sessionTimeout: 0, // No explicit timeout in this version
        currentTime: Date.now()
      }
    });
  } catch (error) {
    logger.error('Debug Securia session error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
