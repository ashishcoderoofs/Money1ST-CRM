import { Request } from 'express';
import mongoose, { Document } from 'mongoose';

export type UserRole = 'Admin' | 'Field Builder' | 'Field Trainer' | 'Senior BMA' | 'BMA' | 'IBA';

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
  isAdmin: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(requiredRole: UserRole): boolean;
  securiaAuthenticated?: boolean; // For JWT-based Securia session flag
}

export interface AuthRequest extends Request {
  user?: IUser;
  session?: any; // For session-based Securia session flag
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
  status?: 'Active' | 'Inactive';
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
  isAdmin: boolean;
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
  isAdmin?: boolean;
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

export interface PagePermissionRequest {
  pageName: string;
  rolePermissions?: Record<UserRole, boolean>;
  description?: string;
}

export interface ToggleRolePermissionRequest {
  role: UserRole;
}

export type RoleHierarchy = Record<UserRole, number>;

// Securia Types
export interface SecuriaConsultantRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  certifications: string[];
  status?: 'active' | 'inactive';
}

export interface SecuriaClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth: Date;
  ssn: string;
  consultantId: string;
  financialInfo: {
    annualIncome: number;
    netWorth: number;
    investmentGoals: string;
    riskTolerance: 'low' | 'medium' | 'high';
  };
  status?: 'active' | 'inactive';
}

export interface SecuriaReAuthRequest {
  email: string;
  password: string;
}

export interface SecuriaAuditLogQuery {
  page?: string;
  limit?: string;
  action?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface SecuriaChartQuery {
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
}

export interface SecuriaListQuery {
  page?: string;
  limit?: string;
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  sort?: string;
  order?: 'asc' | 'desc';
  consultantId?: string;
}