import { Request } from 'express';
import mongoose, { Document } from 'mongoose';

export type UserRole = 'Admin' | 'Field Builder' | 'Field Trainer' | 'Sr. BMA' | 'BMA' | 'IBA';

export interface IUser extends Document {
  // Main Information
  consultantId: string;
  entryDate: Date;
  position?: string;
  status: 'Active' | 'Inactive';
  title?: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  suffix?: string;
  comment?: string;
  remarks?: string;
  
  // Contact Information
  email: string;
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  zipCode?: string;
  homePhone?: string;
  mobile?: string;
  workPhone?: string;
  otherPhone?: string;
  fax?: string;
  
  // CFS Information
  membershipType?: string;
  membershipAmount?: number;
  jointMemberName?: string;
  
  // Additional Fields
  maidenOrOtherName?: string;
  
  // System Fields
  password: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(requiredRole: UserRole): boolean;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  // Main Information
  consultantId: string;
  entryDate: Date;
  position?: string;
  title?: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  suffix?: string;
  comment?: string;
  remarks?: string;
  
  // Contact Information
  email: string;
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  zipCode?: string;
  homePhone?: string;
  mobile?: string;
  workPhone?: string;
  otherPhone?: string;
  fax?: string;
  
  // CFS Information
  membershipType?: string;
  membershipAmount?: number;
  jointMemberName?: string;
  
  // Additional Fields
  maidenOrOtherName?: string;
  
  // System Fields
  password: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  // Main Information
  consultantId?: string;
  entryDate?: Date;
  position?: string;
  status?: 'Active' | 'Inactive';
  title?: string;
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  suffix?: string;
  comment?: string;
  remarks?: string;
  
  // Contact Information
  email?: string;
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  zipCode?: string;
  homePhone?: string;
  mobile?: string;
  workPhone?: string;
  otherPhone?: string;
  fax?: string;
  
  // CFS Information
  membershipType?: string;
  membershipAmount?: number;
  jointMemberName?: string;
  
  // Additional Fields
  maidenOrOtherName?: string;
  
  // System Fields
  role?: UserRole;
  isActive?: boolean;
}

export interface BulkUpdateRequest {
  userIds: string[];
  updates: Partial<UpdateUserRequest>;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  recentUsers: number;
  roleDistribution: Array<{
    _id: UserRole;
    count: number;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  role?: UserRole;
  isActive?: string;
}

export interface PaginationResult<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export type RoleHierarchy = Record<UserRole, number>;