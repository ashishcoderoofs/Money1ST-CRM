import { Response } from 'express';
import User from '../models/User';
import { AuthRequest, PaginationQuery, UpdateUserRequest } from '../types';
import logger from '../../utils/logger';

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', role, isActive }: PaginationQuery = req.query;
    
    // Build filter based on user's role
    let filter: any = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Users can only see users with equal or lower hierarchy
    const hierarchy = User.getRoleHierarchy();
    const userRoleLevel = hierarchy[req.user!.role];
    
    const allowedRoles = Object.keys(hierarchy).filter(
      role => hierarchy[role as keyof typeof hierarchy] <= userRoleLevel
    );
    
    if (req.user!.role !== 'Admin') {
      filter.role = { $in: allowedRoles };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .populate('createdBy', 'name email role')
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
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .select('-password')
      .populate('createdBy', 'name email role');
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if user has permission to view this user
    if (req.user!.role !== 'Admin' && !req.user!.hasPermission(user.role)) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    logger.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: UpdateUserRequest = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check permissions for role updates
    if (updates.role && req.user!.role !== 'Admin') {
      const hierarchy = User.getRoleHierarchy();
      const currentUserLevel = hierarchy[req.user!.role];
      const targetRoleLevel = hierarchy[updates.role];
      
      if (targetRoleLevel >= currentUserLevel) {
        res.status(403).json({ 
          error: 'Cannot assign role equal or higher than your own' 
        });
        return;
      }
    }

    // Users cannot update themselves to a higher role
    if (id === req.user!._id.toString() && updates.role) {
      const hierarchy = User.getRoleHierarchy();
      const currentLevel = hierarchy[req.user!.role];
      const newLevel = hierarchy[updates.role];
      
      if (newLevel > currentLevel) {
        res.status(403).json({ 
          error: 'Cannot promote yourself to a higher role' 
        });
        return;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    logger.info(`User updated: ${updatedUser?.email} by ${req.user!.email}`);

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (id === req.user!._id.toString()) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if user has permission to delete this user
    if (req.user!.role !== 'Admin' && !req.user!.hasPermission(user.role)) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await User.findByIdAndDelete(id);
    
    logger.info(`User deleted: ${user.email} by ${req.user!.email}`);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};