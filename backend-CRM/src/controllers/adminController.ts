import { Response } from 'express';
import User from '../models/User';
import { AuthRequest, BulkUpdateRequest, RegisterRequest, DashboardStats } from '../types';
import logger from '../../utils/logger';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = totalUsers - activeUsers;

    // Role distribution
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const stats: DashboardStats = {
      totalUsers,
      activeUsers,
      inactiveUsers,
      recentUsers,
      roleDistribution: roleStats
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    logger.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

export const bulkUpdateUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userIds, updates }: BulkUpdateRequest = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({ error: 'User IDs array is required' });
      return;
    }

    // Prevent self-update in bulk operations
    if (userIds.includes(req.user!._id.toString())) {
      res.status(400).json({ error: 'Cannot bulk update your own account' });
      return;
    }

    // Check permissions for role updates
    if (updates.role) {
      const hierarchy = User.getRoleHierarchy();
      const currentUserLevel = hierarchy[req.user!.role];
      const targetRoleLevel = hierarchy[updates.role];
      
      // Special case: Only Admins can assign Admin role
      if (updates.role === 'Admin' && req.user!.role !== 'Admin') {
        res.status(403).json({ 
          error: 'Only Admin users can assign Admin role' 
        });
        return;
      }
      
      // For non-Admin roles, check hierarchy (cannot assign roles higher than your own)
      if (updates.role !== 'Admin' && targetRoleLevel > currentUserLevel) {
        res.status(403).json({ 
          error: 'Cannot assign role higher than your own' 
        });
        return;
      }
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      updates,
      { runValidators: true }
    );

    logger.info(`Bulk update performed on ${result.modifiedCount} users by ${req.user!.email}`);

    res.json({
      success: true,
      message: `${result.modifiedCount} users updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    logger.error('Bulk update error:', error);
    res.status(500).json({ error: 'Failed to perform bulk update' });
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
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

    // Check permission for role assignment
    if (role) {
      const hierarchy = User.getRoleHierarchy();
      const currentUserLevel = hierarchy[req.user!.role];
      const targetRoleLevel = hierarchy[role];
      
      // Special case: Only Admins can create other Admins
      if (role === 'Admin' && req.user!.role !== 'Admin') {
        res.status(403).json({ 
          error: 'Only Admin users can create other Admin users' 
        });
        return;
      }
      
      // For non-Admin roles, check hierarchy (cannot create roles higher than your own)
      if (role !== 'Admin' && targetRoleLevel > currentUserLevel) {
        res.status(403).json({ 
          error: 'Cannot create user with role higher than your own' 
        });
        return;
      }
    }

    const userData = {
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
      password,
      role: role || 'Field Builder',
      createdBy: req.user!._id
    };

    const user = await User.create(userData);
    
    const userResponse = await User.findById(user._id)
      .select('-password')
      .populate('createdBy', 'firstName lastName email role');

    logger.info(`New user created: ${email} (${consultantId}) by ${req.user!.email}`);

    res.status(201).json({
      success: true,
      user: userResponse,
      message: 'User created successfully'
    });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', role, isActive, search }: any = req.query;
    
    let filter: any = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { consultantId: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .populate('createdBy', 'firstName lastName email role')
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const toggleUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate user ID parameter
    if (!id || id === 'undefined' || id === 'null') {
      res.status(400).json({ error: 'Valid user ID is required' });
      return;
    }

    // Check if it's a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    if (id === req.user!._id.toString()) {
      res.status(400).json({ error: 'Cannot toggle your own account status' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    logger.info(`User status toggled: ${user.email} to ${user.isActive ? 'active' : 'inactive'} by ${req.user!.email}`);

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    logger.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let { role } = req.body;

    // Validate user ID parameter
    if (!id || id === 'undefined' || id === 'null') {
      res.status(400).json({ error: 'Valid user ID is required' });
      return;
    }

    // Check if it's a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    if (id === req.user!._id.toString()) {
      res.status(400).json({ error: 'Cannot change your own role' });
      return;
    }

    if (!role) {
      res.status(400).json({ error: 'Role is required' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check permission for role assignment
    const hierarchy = User.getRoleHierarchy();
    const currentUserLevel = hierarchy[req.user!.role];
    // Explicitly type role as keyof typeof hierarchy
    const targetRoleLevel = hierarchy[role as keyof typeof hierarchy];
    
    // Special case: Only Admins can assign Admin role
    if (role === 'Admin' && req.user!.role !== 'Admin') {
      res.status(403).json({ 
        error: 'Only Admin users can assign Admin role' 
      });
      return;
    }
    
    // For non-Admin roles, check hierarchy (cannot assign roles higher than your own)
    if (role !== 'Admin' && targetRoleLevel > currentUserLevel) {
      res.status(403).json({ 
        error: 'Cannot assign role higher than your own' 
      });
      return;
    }

    user.role = role;
    await user.save();

    logger.info(`User role updated: ${user.email} to ${role} by ${req.user!.email}`);

    res.json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const deleteMultipleUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({ error: 'User IDs array is required' });
      return;
    }

    // Prevent self-deletion
    if (userIds.includes(req.user!._id.toString())) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    const result = await User.deleteMany({ _id: { $in: userIds } });

    logger.info(`${result.deletedCount} users deleted by ${req.user!.email}`);

    res.json({
      success: true,
      message: `${result.deletedCount} users deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    logger.error('Delete multiple users error:', error);
    res.status(500).json({ error: 'Failed to delete users' });
  }
};

export const getUserActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { days = '30' } = req.query;
    const daysNum = parseInt(days as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    // Recent logins
    const recentLogins = await User.find({
      lastLogin: { $gte: startDate }
    })
      .select('firstName lastName email lastLogin role')
      .sort({ lastLogin: -1 })
      .limit(20);

    // User registration trend
    const registrationStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        recentLogins,
        registrationStats,
        period: `${daysNum} days`
      }
    });
  } catch (error) {
    logger.error('Get user activity error:', error);
    res.status(500).json({ error: 'Failed to get user activity' });
  }
};

export const resetUserPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.password = newPassword;
    await user.save();

    logger.info(`Password reset for user: ${user.email} by ${req.user!.email}`);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

// Get system permissions and role hierarchy
export const getPermissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Define role hierarchy and permissions
    const roleHierarchy = {
      'Admin': 6,
      'Field Builder': 5,
      'Field Trainer': 4,
      'Senior BMA': 3,
      'BMA': 2,
      'IBA': 1
    };

    const permissions = {
      'Admin': [
        'user.create',
        'user.read',
        'user.update',
        'user.delete',
        'user.bulk_update',
        'user.reset_password',
        'user.toggle_status',
        'dashboard.view',
        'admin.access',
        'attachment.upload',
        'attachment.download',
        'attachment.delete',
        'attachment.update'
      ],
      'Field Builder': [
        'user.read',
        'user.update_self',
        'attachment.upload',
        'attachment.download',
        'attachment.delete_own',
        'attachment.update_own'
      ],
      'Field Trainer': [
        'user.read',
        'user.update_self',
        'attachment.upload',
        'attachment.download',
        'attachment.delete_own',
        'attachment.update_own'
      ],
      'Senior BMA': [
        'user.read',
        'user.update_self',
        'attachment.upload',
        'attachment.download',
        'attachment.delete_own',
        'attachment.update_own'
      ],
      'BMA': [
        'user.read',
        'user.update_self',
        'attachment.upload',
        'attachment.download',
        'attachment.delete_own',
        'attachment.update_own'
      ],
      'IBA': [
        'user.read',
        'user.update_self',
        'attachment.upload',
        'attachment.download',
        'attachment.delete_own',
        'attachment.update_own'
      ]
    };

    const currentUserRole = req.user?.role;
    const currentUserPermissions = permissions[currentUserRole as keyof typeof permissions] || [];

    res.json({
      success: true,
      data: {
        roleHierarchy,
        permissions,
        currentUser: {
          role: currentUserRole,
          permissions: currentUserPermissions,
          level: roleHierarchy[currentUserRole as keyof typeof roleHierarchy] || 0
        }
      }
    });

    logger.info(`Permissions retrieved by user: ${req.user?.email}`);
  } catch (error) {
    logger.error('Error getting permissions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};