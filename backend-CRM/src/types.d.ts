import mongoose from 'mongoose';

export type UserRole = 'Admin' | 'Field Builder' | 'Field Trainer' | 'Senior BMA' | 'BMA' | 'IBA';

export interface IUser extends mongoose.Document {
  consultantId?: string;
  entryDate?: Date;
  position?: string;
  status?: string;
  title?: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  suffix?: string;
  comment?: string;
  remarks?: string;
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
  membershipType?: string;
  membershipAmount?: number;
  jointMemberName?: string;
  maidenOrOtherName?: string;
  password: string;
  role: UserRole;
  isAdmin: boolean;
  isActive?: boolean;
  lastLogin?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasPermission(requiredRole: UserRole): boolean;
}

export interface RoleHierarchy {
  [key: string]: number;
}
