import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, RegisterRequest, LoginRequest, ApiResponse } from '../types/types';
import logger from '../../utils/logger';
// Import Securia session invalidation function
import { invalidateUserSecuriaSessions } from './securiaController';

const generateToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpire = process.env.JWT_EXPIRE || '7d';
  
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
      
      // Automatically set isAdmin = true if role is Admin
      if (role === 'Admin') {
        userData.isAdmin = true;
      } else {
        userData.isAdmin = false;
      }
    } else {
      // Default role assignment
      userData.isAdmin = false;
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
        role: user.role,
        isAdmin: user.isAdmin
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

    if (!user.isActive) {
      res.status(401).json({ error: 'Account is deactivated' });
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
        isAdmin: user.isAdmin,
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

// Logout endpoint that also clears Securia sessions
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user) {
      // Clear any Securia sessions for this user
      invalidateUserSecuriaSessions(req.user._id.toString());
      
      logger.info(`User logged out: ${req.user.email}`);
    }
    
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

