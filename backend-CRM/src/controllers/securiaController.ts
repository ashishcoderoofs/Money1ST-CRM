import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Consultant from '../models/Consultant';
import SecuriaClient from '../models/SecuriaClient';
import { Applicant } from '../models/Applicant';
import { CoApplicant } from '../models/CoApplicant';
import SecuriaAuditLog from '../models/SecuriaAuditLog';
import { AuthRequest } from '../types/types';
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
export const hasValidSecuriaSession = (userId: string, jwtIssuedAt?: number): boolean => {
  cleanExpiredSessions();
  for (const [sessionId, session] of securiaSessionStore.entries()) {
    if (session.userId === userId && (Date.now() - session.timestamp) < SECURIA_SESSION_TIMEOUT) {
      // If JWT issued time is provided, check if Securia session was created after JWT
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

// Helper function to get session info for a user
const getSessionInfo = (userId: string): { active: boolean; count: number; lastActivity?: number } => {
  cleanExpiredSessions();
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

    // Query both SecuriaClient (old structure) and Applicant (new structure) collections
    const [securiaClients, applicants] = await Promise.all([
      SecuriaClient.find(filter)
        .populate('consultantId', 'firstName lastName email')
        .sort({ [sort as string]: sortOrder })
        .lean(),
      Applicant.find(filter)
        .sort({ [sort as string]: sortOrder })
        .lean()
    ]);

    // Transform Applicant data to match SecuriaClient format
    const transformedApplicants = applicants.map(applicant => ({
      _id: applicant._id,
      clientId: applicant.clientId,
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.email,
      phone: applicant.cellPhone || applicant.homePhone || '',
      status: 'active', // Default status for applicants
      consultantId: null, // Applicants don't have consultant assignments yet
      address: {
        street: applicant.currentAddress?.street || '',
        city: applicant.currentAddress?.city || '',
        state: applicant.currentAddress?.state || '',
        zipCode: applicant.currentAddress?.zipCode || '',
        country: 'US'
      },
      createdAt: applicant.createdAt,
      updatedAt: applicant.updatedAt
    }));

    // Combine and sort all clients
    const allClients = [...securiaClients, ...transformedApplicants];
    allClients.sort((a, b) => {
      const aValue = a[sort as keyof typeof a];
      const bValue = b[sort as keyof typeof b];
      
      if (aValue < bValue) return sortOrder === 1 ? -1 : 1;
      if (aValue > bValue) return sortOrder === 1 ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedClients = allClients.slice(startIndex, endIndex);

    const total = allClients.length;

    await logAuditEvent(req, 'CLIENTS_VIEWED', 'client', undefined, { page: pageNum, limit: limitNum, search, status, consultantId });

    res.json({
      success: true,
      data: paginatedClients,
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
    console.log('📝 Creating new client with applicant and co-applicant:', JSON.stringify(req.body, null, 2));
    console.log('📝 Request body keys:', Object.keys(req.body));
    
    const clientData = req.body;
    
    // Helper function to convert empty strings to undefined for optional enum fields
    const cleanEnumField = (value: any): any => {
      return (value === "" || value === null) ? undefined : value;
    };
    
    // Generate a unique clientId for the case
    const clientId = `CL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Extract applicant data (flatten the structure from form)
    const applicantData = {
      clientId,
      firstName: clientData.applicant_first_name,
      lastName: clientData.applicant_last_name,
      title: cleanEnumField(clientData.applicant_title),
      mi: clientData.applicant_mi,
      suffix: cleanEnumField(clientData.applicant_suffix),
      maidenName: clientData.applicant_maiden_name,
      isConsultant: clientData.applicant_is_consultant,
      
      // Contact Info
      homePhone: clientData.applicant_home_phone,
      workPhone: clientData.applicant_other_phone,
      cellPhone: clientData.applicant_cell_phone,
      fax: clientData.applicant_fax,
      email: clientData.applicant_email,
      
      // Current Address
      currentAddress: {
        street: clientData.applicant_address,
        city: clientData.applicant_city,
        state: clientData.applicant_state,
        zipCode: clientData.applicant_zip_code,
        county: clientData.applicant_county,
      },
      
      // Previous Address
      previousAddress: clientData.applicant_previous_address ? {
        street: clientData.applicant_previous_address,
      } : undefined,
      
      // Employment Info
      employment: clientData.applicant_employment_status ? {
        status: clientData.applicant_employment_status,
        isBusinessOwner: clientData.applicant_business_owner,
        employerName: clientData.applicant_employer_name,
        employerAddress: clientData.applicant_employer_address,
        employerCity: clientData.applicant_employer_city,
        employerState: clientData.applicant_employer_state,
        employerZip: clientData.applicant_employer_zip,
        occupation: clientData.applicant_occupation,
        monthlySalary: clientData.applicant_monthly_salary,
        employerPhone: clientData.applicant_employer_phone,
        startDate: clientData.applicant_start_date,
        endDate: clientData.applicant_end_date,
        additionalIncome: clientData.applicant_additional_income,
        additionalIncomeSource: clientData.applicant_additional_income_source,
      } : undefined,
      
      // Demographics
      demographics: {
        dateOfBirth: clientData.applicant_dob,
        ssn: clientData.applicant_ssn,
        birthPlace: clientData.applicant_birth_place,
        race: cleanEnumField(clientData.applicant_race),
        maritalStatus: cleanEnumField(clientData.applicant_marital_status),
        anniversary: clientData.applicant_anniversary,
        spouseName: clientData.applicant_spouse_name,
        spouseOccupation: clientData.applicant_spouse_occupation,
        numberOfDependents: clientData.applicant_dependents_count,
      },
      
      createdBy: req.user?.id,
      lastModifiedBy: req.user?.id,
    };

    // Create the applicant
    const newApplicant = new Applicant(applicantData);
    await newApplicant.save();

    console.log('✅ Applicant created successfully:', newApplicant._id);

    let newCoApplicant = null;

    // Check if co-applicant data is provided
    const hasCoApplicantData = clientData.coapplicant_first_name || 
                               clientData.coapplicant_last_name || 
                               clientData.coapplicant_email ||
                               clientData.coapplicant_cell_phone;

    if (hasCoApplicantData) {
      console.log('📝 Creating co-applicant data...');
      
      // Extract co-applicant data
      const coApplicantData = {
        clientId,
        applicantId: newApplicant._id, // Foreign key to applicant
        firstName: clientData.coapplicant_first_name,
        lastName: clientData.coapplicant_last_name,
        title: cleanEnumField(clientData.coapplicant_title),
        mi: clientData.coapplicant_mi,
        suffix: cleanEnumField(clientData.coapplicant_suffix),
        maidenName: clientData.coapplicant_maiden_name,
        isConsultant: clientData.coapplicant_is_consultant,
        
        // Contact Info
        homePhone: clientData.coapplicant_home_phone,
        workPhone: clientData.coapplicant_other_phone,
        cellPhone: clientData.coapplicant_cell_phone,
        fax: clientData.coapplicant_fax,
        email: clientData.coapplicant_email,
        
        // Current Address
        currentAddress: clientData.coapplicant_address ? {
          street: clientData.coapplicant_address,
          city: clientData.coapplicant_city,
          state: clientData.coapplicant_state,
          zipCode: clientData.coapplicant_zip_code,
          county: clientData.coapplicant_county,
        } : undefined,
        
        // Previous Address
        previousAddress: clientData.coapplicant_previous_address ? {
          street: clientData.coapplicant_previous_address,
        } : undefined,
        
        // Employment Info
        employment: clientData.coapplicant_employment_status ? {
          status: clientData.coapplicant_employment_status,
          isBusinessOwner: clientData.coapplicant_business_owner,
          employerName: clientData.coapplicant_employer_name,
          employerAddress: clientData.coapplicant_employer_address,
          employerCity: clientData.coapplicant_employer_city,
          employerState: clientData.coapplicant_employer_state,
          employerZip: clientData.coapplicant_employer_zip,
          occupation: clientData.coapplicant_occupation,
          monthlySalary: clientData.coapplicant_monthly_salary,
          employerPhone: clientData.coapplicant_employer_phone,
          startDate: clientData.coapplicant_start_date,
          endDate: clientData.coapplicant_end_date,
          additionalIncome: clientData.coapplicant_additional_income,
          additionalIncomeSource: clientData.coapplicant_additional_income_source,
        } : undefined,
        
        // Demographics
        demographics: {
          dateOfBirth: clientData.coapplicant_dob,
          ssn: clientData.coapplicant_ssn,
          birthPlace: clientData.coapplicant_birth_place,
          race: cleanEnumField(clientData.coapplicant_race),
          maritalStatus: cleanEnumField(clientData.coapplicant_marital_status),
          anniversary: clientData.coapplicant_anniversary,
          spouseName: clientData.coapplicant_spouse_name,
          spouseOccupation: clientData.coapplicant_spouse_occupation,
          numberOfDependents: clientData.coapplicant_dependents_count,
        },
        
        createdBy: req.user?.id,
        lastModifiedBy: req.user?.id,
      };

      // Create the co-applicant
      newCoApplicant = new CoApplicant(coApplicantData);
      await newCoApplicant.save();

      console.log('✅ Co-applicant created successfully:', newCoApplicant._id);
    }
    
    // TODO: Add SecuriaClient creation for backward compatibility later
    // For now, just return the Applicant ID as the main ID
    
    // Log audit trail
    await logAuditEvent(req, 'CLIENT_CREATED', 'applicant', newApplicant._id.toString(), {
      clientId: clientId,
      applicantEmail: newApplicant.email,
      hasCoApplicant: !!newCoApplicant,
      coApplicantEmail: newCoApplicant?.email
    });

    console.log('✅ Client case created successfully:', clientId);
    
    return res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: {
        id: newApplicant._id, // For frontend navigation - use Applicant ID for now
        clientId: clientId,
        applicant: {
          id: newApplicant._id,
          firstName: newApplicant.firstName,
          lastName: newApplicant.lastName,
          email: newApplicant.email,
        },
        coApplicant: newCoApplicant ? {
          id: newCoApplicant._id,
          firstName: newCoApplicant.firstName,
          lastName: newCoApplicant.lastName,
          email: newCoApplicant.email,
        } : null,
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
    const id = req.params.id;
    
    // First, try to find an Applicant record (new structure)
    
    const applicant = await Applicant.findById(id);
    
    if (applicant) {
      console.log('📋 Found Applicant record, converting to client format...');
      
      // Find associated co-applicant if exists
      const coApplicant = await CoApplicant.findOne({ applicantId: applicant._id });
      
      // Transform Applicant data to SecuriaClient format for frontend compatibility
      const clientData = {
        _id: applicant._id,
        clientId: applicant.clientId,
        client_number: applicant.clientId || `CLI${applicant._id.toString().slice(-6).toUpperCase()}`,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        email: applicant.email,
        phone: applicant.cellPhone || applicant.homePhone,
        status: 'active',
        address: applicant.currentAddress ? {
          street: applicant.currentAddress.street,
          city: applicant.currentAddress.city,
          state: applicant.currentAddress.state,
          zipCode: applicant.currentAddress.zipCode,
          country: 'US'
        } : undefined,
        financialInfo: {
          annualIncome: applicant.employment?.monthlySalary ? (applicant.employment.monthlySalary * 12) : 0,
          netWorth: 0,
          investmentGoals: '',
          riskTolerance: 'medium'
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        },
        createdAt: applicant.createdAt,
        updatedAt: applicant.updatedAt,
        
        // Include original applicant structure for compatibility
        applicant: {
          firstName: applicant.firstName,
          lastName: applicant.lastName,
          title: applicant.title,
          mi: applicant.mi,
          suffix: applicant.suffix,
          maidenName: applicant.maidenName,
          isConsultant: applicant.isConsultant,
          homePhone: applicant.homePhone,
          cellPhone: applicant.cellPhone,
          email: applicant.email,
          currentAddress: applicant.currentAddress,
          previousAddress: applicant.previousAddress,
          employment: applicant.employment,
          demographics: applicant.demographics
        },
        
        // Include co-applicant if exists
        ...(coApplicant && {
          coApplicant: {
            firstName: coApplicant.firstName,
            lastName: coApplicant.lastName,
            title: coApplicant.title,
            mi: coApplicant.mi,
            suffix: coApplicant.suffix,
            maidenName: coApplicant.maidenName,
            isConsultant: coApplicant.isConsultant,
            homePhone: coApplicant.homePhone,
            cellPhone: coApplicant.cellPhone,
            email: coApplicant.email,
            currentAddress: coApplicant.currentAddress,
            previousAddress: coApplicant.previousAddress,
            employment: coApplicant.employment,
            demographics: coApplicant.demographics
          }
        })
      };

      await logAuditEvent(req, 'CLIENT_VIEWED', 'applicant', applicant._id.toString());

      res.json({
        success: true,
        data: clientData
      });
      return;
    }
    
    // Fallback: try to find SecuriaClient record (old structure)
    const client = await SecuriaClient.findById(id)
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
    
    console.log('📝 Updating client:', clientId, 'Keys:', Object.keys(updateData));
    
    // First, try to find an Applicant record (new structure)
    
    const applicant = await Applicant.findById(clientId);
    
    if (applicant) {
      console.log('🔄 Updating Applicant record with new structure...');
      
      // Helper function to convert empty strings to undefined for optional enum fields
      const cleanEnumField = (value: any): any => {
        return (value === "" || value === null) ? undefined : value;
      };
      
      // Extract applicant data from flat form structure
      const applicantUpdateData = {
        firstName: updateData.applicant_first_name || applicant.firstName,
        lastName: updateData.applicant_last_name || applicant.lastName,
        title: cleanEnumField(updateData.applicant_title) || applicant.title,
        mi: updateData.applicant_mi || applicant.mi,
        suffix: cleanEnumField(updateData.applicant_suffix) || applicant.suffix,
        maidenName: updateData.applicant_maiden_name || applicant.maidenName,
        isConsultant: updateData.applicant_is_consultant ?? applicant.isConsultant,
        
        // Contact Info
        homePhone: updateData.applicant_home_phone || applicant.homePhone,
        workPhone: updateData.applicant_other_phone || applicant.workPhone,
        cellPhone: updateData.applicant_cell_phone || applicant.cellPhone,
        fax: updateData.applicant_fax || applicant.fax,
        email: updateData.applicant_email || applicant.email,
        
        // Current Address
        currentAddress: {
          street: updateData.applicant_address || applicant.currentAddress?.street,
          city: updateData.applicant_city || applicant.currentAddress?.city,
          state: updateData.applicant_state || applicant.currentAddress?.state,
          zipCode: updateData.applicant_zip_code || applicant.currentAddress?.zipCode,
          county: updateData.applicant_county || applicant.currentAddress?.county,
        },
        
        // Previous Address
        previousAddress: updateData.applicant_previous_address ? {
          street: updateData.applicant_previous_address,
        } : applicant.previousAddress,
        
        // Employment Info
        employment: updateData.applicant_employment_status ? {
          status: updateData.applicant_employment_status,
          isBusinessOwner: updateData.applicant_business_owner,
          employerName: updateData.applicant_employer_name,
          employerAddress: updateData.applicant_employer_address,
          employerCity: updateData.applicant_employer_city,
          employerState: updateData.applicant_employer_state,
          employerZip: updateData.applicant_employer_zip,
          occupation: updateData.applicant_occupation,
          monthlySalary: updateData.applicant_monthly_salary,
          employerPhone: updateData.applicant_employer_phone,
          startDate: updateData.applicant_start_date,
          endDate: updateData.applicant_end_date,
          additionalIncome: updateData.applicant_additional_income,
          additionalIncomeSource: updateData.applicant_additional_income_source,
        } : applicant.employment,
        
        // Demographics
        demographics: {
          ...applicant.demographics,
          dateOfBirth: updateData.applicant_dob || applicant.demographics?.dateOfBirth,
          ssn: updateData.applicant_ssn || applicant.demographics?.ssn,
          birthPlace: updateData.applicant_birth_place || applicant.demographics?.birthPlace,
          race: cleanEnumField(updateData.applicant_race) || applicant.demographics?.race,
          maritalStatus: cleanEnumField(updateData.applicant_marital_status) || applicant.demographics?.maritalStatus,
          anniversary: updateData.applicant_anniversary || applicant.demographics?.anniversary,
          spouseName: updateData.applicant_spouse_name || applicant.demographics?.spouseName,
          spouseOccupation: updateData.applicant_spouse_occupation || applicant.demographics?.spouseOccupation,
          numberOfDependents: updateData.applicant_dependents_count || applicant.demographics?.numberOfDependents,
        },
        
        lastModifiedBy: req.user?.id,
        updatedAt: new Date(),
      };

      // Update the applicant
      const updatedApplicant = await Applicant.findByIdAndUpdate(
        clientId,
        { $set: applicantUpdateData },
        { new: true, runValidators: true }
      );

      console.log('✅ Applicant updated successfully');

      // Handle co-applicant updates
      let updatedCoApplicant = null;
      const hasCoApplicantData = updateData.coapplicant_first_name || 
                                 updateData.coapplicant_last_name || 
                                 updateData.coapplicant_email ||
                                 updateData.coapplicant_cell_phone;

      if (hasCoApplicantData) {
        console.log('🔄 Updating or creating co-applicant...');
        
        const coApplicantUpdateData = {
          applicantId: applicant._id,
          firstName: updateData.coapplicant_first_name,
          lastName: updateData.coapplicant_last_name,
          title: cleanEnumField(updateData.coapplicant_title),
          mi: updateData.coapplicant_mi,
          suffix: cleanEnumField(updateData.coapplicant_suffix),
          maidenName: updateData.coapplicant_maiden_name,
          isConsultant: updateData.coapplicant_is_consultant,
          
          // Contact Info
          homePhone: updateData.coapplicant_home_phone,
          workPhone: updateData.coapplicant_other_phone,
          cellPhone: updateData.coapplicant_cell_phone,
          fax: updateData.coapplicant_fax,
          email: updateData.coapplicant_email,
          
          // Current Address
          currentAddress: updateData.coapplicant_address ? {
            street: updateData.coapplicant_address,
            city: updateData.coapplicant_city,
            state: updateData.coapplicant_state,
            zipCode: updateData.coapplicant_zip_code,
            county: updateData.coapplicant_county,
          } : undefined,
          
          // Previous Address
          previousAddress: updateData.coapplicant_previous_address ? {
            street: updateData.coapplicant_previous_address,
          } : undefined,
          
          // Employment Info
          employment: updateData.coapplicant_employment_status ? {
            status: updateData.coapplicant_employment_status,
            isBusinessOwner: updateData.coapplicant_business_owner,
            employerName: updateData.coapplicant_employer_name,
            employerAddress: updateData.coapplicant_employer_address,
            employerCity: updateData.coapplicant_employer_city,
            employerState: updateData.coapplicant_employer_state,
            employerZip: updateData.coapplicant_employer_zip,
            occupation: updateData.coapplicant_occupation,
            monthlySalary: updateData.coapplicant_monthly_salary,
            employerPhone: updateData.coapplicant_employer_phone,
            startDate: updateData.coapplicant_start_date,
            endDate: updateData.coapplicant_end_date,
            additionalIncome: updateData.coapplicant_additional_income,
            additionalIncomeSource: updateData.coapplicant_additional_income_source,
          } : undefined,
          
          // Demographics
          demographics: {
            dateOfBirth: updateData.coapplicant_dob,
            ssn: updateData.coapplicant_ssn,
            birthPlace: updateData.coapplicant_birth_place,
            race: cleanEnumField(updateData.coapplicant_race),
            maritalStatus: cleanEnumField(updateData.coapplicant_marital_status),
            anniversary: updateData.coapplicant_anniversary,
            spouseName: updateData.coapplicant_spouse_name,
            spouseOccupation: updateData.coapplicant_spouse_occupation,
            numberOfDependents: updateData.coapplicant_dependents_count,
          },
          
          lastModifiedBy: req.user?.id,
          updatedAt: new Date(),
        };

        // Find existing co-applicant or create new one
        const existingCoApplicant = await CoApplicant.findOne({ applicantId: applicant._id });
        
        if (existingCoApplicant) {
          updatedCoApplicant = await CoApplicant.findByIdAndUpdate(
            existingCoApplicant._id,
            { $set: coApplicantUpdateData },
            { new: true, runValidators: true }
          );
        } else {
          updatedCoApplicant = new CoApplicant(coApplicantUpdateData);
          await updatedCoApplicant.save();
        }

        console.log('✅ Co-applicant updated/created successfully');
      }

      // Log audit trail
      await logAuditEvent(req, 'CLIENT_UPDATED', 'applicant', applicant._id.toString(), {
        clientId: applicant.clientId,
        hasCoApplicant: !!updatedCoApplicant,
      });

      console.log('✅ Client (Applicant/CoApplicant) updated successfully:', applicant.clientId);

      return res.json({
        success: true,
        message: 'Client updated successfully',
        data: {
          id: updatedApplicant?._id,
          clientId: updatedApplicant?.clientId,
          applicant: updatedApplicant,
          coApplicant: updatedCoApplicant,
        }
      });
    }
    
    // Fallback: try to update SecuriaClient record (old structure)
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
    
    console.log('✅ Client (SecuriaClient) updated successfully:', updatedClient?.clientId);
    
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
    const clientId = req.params.id;
    
    // First, try to find and delete an Applicant record (new structure)
    const applicant = await Applicant.findById(clientId);
    
    if (applicant) {
      // Delete associated co-applicant if exists
      await CoApplicant.deleteOne({ applicantId: applicant._id });
      
      // Delete the applicant
      await Applicant.findByIdAndDelete(clientId);
      
      await logAuditEvent(req, 'CLIENT_DELETED', 'client', applicant._id.toString(), { 
        clientName: `${applicant.firstName} ${applicant.lastName}`,
        email: applicant.email,
        type: 'Applicant'
      });

      res.json({
        success: true,
        message: 'Client deleted successfully'
      });
      return;
    }
    
    // If not found in Applicant, try SecuriaClient (old structure)
    const client = await SecuriaClient.findByIdAndDelete(clientId);
    
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    await logAuditEvent(req, 'CLIENT_DELETED', 'client', client._id.toString(), { 
      clientName: `${client.firstName} ${client.lastName}`,
      email: client.email,
      type: 'SecuriaClient'
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
    
    // clientId will be auto-generated by the model pre-save hook
    // Calculate completion percentage based on comprehensive form data
    const completionPercentage = calculateCompletionPercentage(clientData);
    
    // Determine status based on completion
    let status = 'draft';
    if (completionPercentage >= 80) {
      status = 'active';
    } else if (completionPercentage >= 30) {
      status = 'submitted';
    }

    // Prepare client document with full multi-stage structure
    const newClient = new SecuriaClient({
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
      sectionsCompleted: Object.keys(clientData).length // Simple section count
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
    const { clientId } = req.params;
    const { section, data } = req.body;
    
    const client = await SecuriaClient.findById(clientId);
    if (!client) {
      return res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
    }

    // Handle different sections
    switch (section) {
      case 'applicant':
        if (!client.applicant) client.applicant = {};
        Object.assign(client.applicant, data);
        break;
      case 'coApplicant':
        if (!client.coApplicant) client.coApplicant = {};
        Object.assign(client.coApplicant, data);
        break;
      case 'liabilities':
        client.liabilities = data;
        break;
      case 'mortgages':
        client.mortgages = data;
        break;
      case 'underwriting':
        client.underwriting = data;
        break;
      case 'loanStatus':
        client.loanStatus = data;
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid section specified' 
        });
    }

    client.lastModifiedBy = req.user!._id.toString();
    client.completionPercentage = calculateCompletionPercentage(client);
    
    await client.save();

    await logAuditEvent(req, 'CLIENT_SECTION_UPDATED', 'client', clientId, { section });

    return res.json({
      success: true,
      message: `${section} section updated successfully`,
      data: client[section as keyof typeof client]
    });
  } catch (error) {
    logger.error('Update client section error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to update client section' 
    });
  }
};

// Enhanced Client Management Functions for Structured Data

export const updateApplicantBasicInfo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const updateData = req.body;
    
    const client = await SecuriaClient.findById(clientId);
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    // Update applicant basic info
    if (!client.applicant) {
      client.applicant = {};
    }
    
    Object.assign(client.applicant, {
      title: updateData.title,
      firstName: updateData.firstName,
      mi: updateData.mi,
      lastName: updateData.lastName,
      suffix: updateData.suffix,
      maidenName: updateData.maidenName,
      isConsultant: updateData.isConsultant
    });

    client.lastModifiedBy = req.user!._id.toString();
    client.completionPercentage = calculateCompletionPercentage(client);
    
    await client.save();

    await logAuditEvent(req, 'APPLICANT_BASIC_INFO_UPDATED', 'client', clientId, {
      name: `${updateData.firstName} ${updateData.lastName}`
    });

    res.json({
      success: true,
      message: 'Applicant basic information updated successfully',
      data: client.applicant
    });
  } catch (error) {
    logger.error('Update applicant basic info error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update applicant basic information' 
    });
  }
};

export const updateApplicantAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const { currentAddress, previousAddress } = req.body;
    
    const client = await SecuriaClient.findById(clientId);
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    if (!client.applicant) {
      client.applicant = {};
    }
    
    if (currentAddress) {
      client.applicant.currentAddress = currentAddress;
    }
    
    if (previousAddress) {
      client.applicant.previousAddress = previousAddress;
    }

    client.lastModifiedBy = req.user!._id.toString();
    client.completionPercentage = calculateCompletionPercentage(client);
    
    await client.save();

    await logAuditEvent(req, 'APPLICANT_ADDRESS_UPDATED', 'client', clientId);

    res.json({
      success: true,
      message: 'Applicant address information updated successfully',
      data: {
        currentAddress: client.applicant.currentAddress,
        previousAddress: client.applicant.previousAddress
      }
    });
  } catch (error) {
    logger.error('Update applicant address error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update applicant address information' 
    });
  }
};

export const updateApplicantEmployment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const { employment, previousEmployment } = req.body;
    
    const client = await SecuriaClient.findById(clientId);
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    if (!client.applicant) {
      client.applicant = {};
    }
    
    if (employment) {
      client.applicant.employment = employment;
    }
    
    if (previousEmployment) {
      client.applicant.previousEmployment = previousEmployment;
    }

    client.lastModifiedBy = req.user!._id.toString();
    client.completionPercentage = calculateCompletionPercentage(client);
    
    await client.save();

    await logAuditEvent(req, 'APPLICANT_EMPLOYMENT_UPDATED', 'client', clientId);

    res.json({
      success: true,
      message: 'Applicant employment information updated successfully',
      data: {
        employment: client.applicant.employment,
        previousEmployment: client.applicant.previousEmployment
      }
    });
  } catch (error) {
    logger.error('Update applicant employment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update applicant employment information' 
    });
  }
};

export const updateApplicantDemographics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const demographicsData = req.body;
    
    const client = await SecuriaClient.findById(clientId);
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    if (!client.applicant) {
      client.applicant = {};
    }
    
    client.applicant.demographics = demographicsData;

    client.lastModifiedBy = req.user!._id.toString();
    client.completionPercentage = calculateCompletionPercentage(client);
    
    await client.save();

    await logAuditEvent(req, 'APPLICANT_DEMOGRAPHICS_UPDATED', 'client', clientId);

    res.json({
      success: true,
      message: 'Applicant demographics updated successfully',
      data: client.applicant.demographics
    });
  } catch (error) {
    logger.error('Update applicant demographics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update applicant demographics' 
    });
  }
};

// Co-Applicant Functions

export const updateCoApplicantBasicInfo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const updateData = req.body;
    
    const client = await SecuriaClient.findById(clientId);
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    if (!client.coApplicant) {
      client.coApplicant = {};
    }
    
    Object.assign(client.coApplicant, {
      includeCoApplicant: updateData.includeCoApplicant,
      title: updateData.title,
      firstName: updateData.firstName,
      mi: updateData.mi,
      lastName: updateData.lastName,
      suffix: updateData.suffix,
      maidenName: updateData.maidenName,
      isConsultant: updateData.isConsultant
    });

    client.lastModifiedBy = req.user!._id.toString();
    client.completionPercentage = calculateCompletionPercentage(client);
    
    await client.save();

    await logAuditEvent(req, 'COAPPLICANT_BASIC_INFO_UPDATED', 'client', clientId, {
      name: `${updateData.firstName} ${updateData.lastName}`
    });

    res.json({
      success: true,
      message: 'Co-applicant basic information updated successfully',
      data: client.coApplicant
    });
  } catch (error) {
    logger.error('Update co-applicant basic info error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update co-applicant basic information' 
    });
  }
};

export const updateCoApplicantAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const { currentAddress, previousAddress } = req.body;
    
    const client = await SecuriaClient.findById(clientId);
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    if (!client.coApplicant) {
      client.coApplicant = {};
    }
    
    if (currentAddress) {
      client.coApplicant.currentAddress = currentAddress;
    }
    
    if (previousAddress) {
      client.coApplicant.previousAddress = previousAddress;
    }

    client.lastModifiedBy = req.user!._id.toString();
    client.completionPercentage = calculateCompletionPercentage(client);
    
    await client.save();

    await logAuditEvent(req, 'COAPPLICANT_ADDRESS_UPDATED', 'client', clientId);

    res.json({
      success: true,
      message: 'Co-applicant address information updated successfully',
      data: {
        currentAddress: client.coApplicant.currentAddress,
        previousAddress: client.coApplicant.previousAddress
      }
    });
  } catch (error) {
    logger.error('Update co-applicant address error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update co-applicant address information' 
    });
  }
};

export const updateCoApplicantEmployment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const { employment, previousEmployment } = req.body;
    
    const client = await SecuriaClient.findById(clientId);
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    if (!client.coApplicant) {
      client.coApplicant = {};
    }
    
    if (employment) {
      client.coApplicant.employment = employment;
    }
    
    if (previousEmployment) {
      client.coApplicant.previousEmployment = previousEmployment;
    }

    client.lastModifiedBy = req.user!._id.toString();
    client.completionPercentage = calculateCompletionPercentage(client);
    
    await client.save();

    await logAuditEvent(req, 'COAPPLICANT_EMPLOYMENT_UPDATED', 'client', clientId);

    res.json({
      success: true,
      message: 'Co-applicant employment information updated successfully',
      data: {
        employment: client.coApplicant.employment,
        previousEmployment: client.coApplicant.previousEmployment
      }
    });
  } catch (error) {
    logger.error('Update co-applicant employment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update co-applicant employment information' 
    });
  }
};

export const updateCoApplicantDemographics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;
    const demographicsData = req.body;
    
    const client = await SecuriaClient.findById(clientId);
    if (!client) {
      res.status(404).json({ 
        success: false, 
        message: 'Client not found' 
      });
      return;
    }

    if (!client.coApplicant) {
      client.coApplicant = {};
    }
    
    client.coApplicant.demographics = demographicsData;

    client.lastModifiedBy = req.user!._id.toString();
    client.completionPercentage = calculateCompletionPercentage(client);
    
    await client.save();

    await logAuditEvent(req, 'COAPPLICANT_DEMOGRAPHICS_UPDATED', 'client', clientId);

    res.json({
      success: true,
      message: 'Co-applicant demographics updated successfully',
      data: client.coApplicant.demographics
    });
  } catch (error) {
    logger.error('Update co-applicant demographics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update co-applicant demographics' 
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
    cleanExpiredSessions();
    
    for (const [sessionId, session] of securiaSessionStore.entries()) {
      allSessions.push({
        sessionId,
        userId: session.userId,
        timestamp: session.timestamp,
        age: Date.now() - session.timestamp,
        isExpired: (Date.now() - session.timestamp) > SECURIA_SESSION_TIMEOUT
      });
    }
    
    res.json({
      success: true,
      debug: {
        currentUserId: userId,
        currentUserSessions: sessionInfo,
        allActiveSessions: allSessions,
        sessionTimeout: SECURIA_SESSION_TIMEOUT,
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
