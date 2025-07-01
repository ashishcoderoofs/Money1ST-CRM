import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, RegisterRequest, LoginRequest, ApiResponse } from '../types';
import { validateUserStatus } from '../utils/userStatusValidator';
import logger from '../../utils/logger';

const generateToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpire = process.env.JWT_EXPIRE || '10m'; // Set to 10 minutes for security
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpire } as jwt.SignOptions);
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      consultantId, entryDate, position, title, firstName, middleInitial, lastName, suffix,
      comment, remarks, email, address, city, county, state, zipCode, homePhone, mobile,
      workPhone, otherPhone, fax, membershipType, membershipAmount, jointMemberName,
      maidenOrOtherName, password, role 
    }: RegisterRequest = req.body;

    // Check if user already exists by email or consultant ID
    const existingUser = await User.findOne({ 
      $or: [{ email }, { consultantId }] 
    });
    if (existingUser) {
      if (existingUser.email === email) {
        res.status(400).json({ error: 'User already exists with this email' });
      } else {
        res.status(400).json({ error: 'User already exists with this consultant ID' });
      }
      return;
    }

    // Create user data object
    let userData: any = {
      consultantId,
      entryDate,
      position,
      title,
      firstName,
      middleInitial,
      lastName,
      suffix,
      comment,
      remarks,
      email,
      address,
      city,
      county,
      state,
      zipCode,
      homePhone,
      mobile,
      workPhone,
      otherPhone,
      fax,
      membershipType,
      membershipAmount,
      jointMemberName,
      maidenOrOtherName,
      password
    };
    
    // Only allow role assignment if user is Admin or higher
    if (role && req.user && req.user.hasPermission('Admin')) {
      userData.role = role;
      userData.createdBy = req.user._id;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id.toString());

    logger.info(`New user registered: ${email} (${consultantId})`);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        consultantId: user.consultantId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Comprehensive user status validation
    const statusCheck = validateUserStatus(user);
    if (!statusCheck.isValid) {
      logger.warn(`Login denied for user ${email}: ${statusCheck.reason}`);
      res.status(401).json({ error: statusCheck.reason });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id.toString());

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        consultantId: user.consultantId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id).populate('createdBy', 'name email role');
    res.json({ success: true, user });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

