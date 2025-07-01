import { Response } from 'express';
import PagePermission from '../models/PagePermission';
import { AuthRequest, UserRole } from '../types';
import logger from '../../utils/logger';

// Get all page permissions
export const getPagePermissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pagePermissions = await PagePermission.find({ isActive: true })
      .sort({ pageName: 1 });

    res.json({
      success: true,
      data: pagePermissions
    });
  } catch (error) {
    logger.error('Get page permissions error:', error);
    res.status(500).json({ error: 'Failed to get page permissions' });
  }
};

// Create or update page permission
export const createOrUpdatePagePermission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pageName, rolePermissions, description } = req.body;

    if (!pageName) {
      res.status(400).json({ error: 'Page name is required' });
      return;
    }

    // Check if the page permission already exists
    const existingPermission = await PagePermission.findOne({ pageName });
    
    if (existingPermission) {
      // Update existing
      if (rolePermissions) {
        // Update role permissions
        for (const [role, permission] of Object.entries(rolePermissions)) {
          (existingPermission.rolePermissions as any)[role] = permission as boolean;
        }
        existingPermission.markModified('rolePermissions');
      }
      
      if (description !== undefined) {
        existingPermission.description = description;
      }
      
      await existingPermission.save();
      
      logger.info(`Page permission updated: ${pageName} by ${req.user!.email}`);
      
      res.json({
        success: true,
        message: 'Page permission updated successfully',
        data: existingPermission
      });
    } else {
      // Create new
      const newPermission = await PagePermission.create({
        pageName,
        rolePermissions: rolePermissions || {},
        description
      });
      
      logger.info(`Page permission created: ${pageName} by ${req.user!.email}`);
      
      res.status(201).json({
        success: true,
        message: 'Page permission created successfully',
        data: newPermission
      });
    }
  } catch (error) {
    logger.error('Create/update page permission error:', error);
    res.status(500).json({ error: 'Failed to create/update page permission' });
  }
};

// Toggle role permission for a specific page
export const toggleRolePermission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pageName } = req.params;
    const { role } = req.body;

    if (!role) {
      res.status(400).json({ error: 'Role is required' });
      return;
    }

    // Validate role
    const validRoles = ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    let pagePermission = await PagePermission.findOne({ pageName });
    
    if (!pagePermission) {
      // Create new page permission if it doesn't exist
      const defaultPermissions = {
        'Admin': true,
        'Field Builder': false,
        'Field Trainer': false,
        'Senior BMA': false,
        'BMA': false,
        'IBA': false
      };
      
      pagePermission = await PagePermission.create({
        pageName,
        rolePermissions: defaultPermissions
      });
    }

    // Ensure rolePermissions is initialized
    if (!pagePermission.rolePermissions || typeof pagePermission.rolePermissions !== 'object') {
      pagePermission.rolePermissions = {
        'Admin': true,
        'Field Builder': false,
        'Field Trainer': false,
        'Senior BMA': false,
        'BMA': false,
        'IBA': false
      };
    }

    // Toggle the permission
    const currentPermission = (pagePermission.rolePermissions as any)[role];
    (pagePermission.rolePermissions as any)[role] = !currentPermission;
    
    // Mark as modified for Mongoose
    pagePermission.markModified('rolePermissions');
    await pagePermission.save();

    const newPermission = (pagePermission.rolePermissions as any)[role];
    
    logger.info(`Page permission toggled: ${pageName} - ${role} to ${newPermission} by ${req.user!.email}`);

    res.json({
      success: true,
      message: `${role} access to ${pageName} ${newPermission ? 'granted' : 'revoked'}`,
      data: {
        pageName,
        role,
        hasAccess: newPermission,
        allPermissions: pagePermission.rolePermissions
      }
    });
  } catch (error) {
    logger.error('Toggle role permission error:', error);
    res.status(500).json({ error: 'Failed to toggle role permission' });
  }
};

// Initialize default page permissions
export const initializeDefaultPages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const defaultPages = [
      { 
        pageName: 'Dashboard', 
        description: 'Main dashboard with system overview',
        rolePermissions: {
          'Admin': true,
          'Field Builder': true,
          'Field Trainer': true,
          'Senior BMA': true,
          'BMA': true,
          'IBA': true
        }
      },
      { 
        pageName: 'Contacts', 
        description: 'Contact management and client information',
        rolePermissions: {
          'Admin': true,
          'Field Builder': true,
          'Field Trainer': true,
          'Senior BMA': true,
          'BMA': true,
          'IBA': true
        }
      },
      { 
        pageName: 'Deals', 
        description: 'Deal management and sales tracking',
        rolePermissions: {
          'Admin': true,
          'Field Builder': true,
          'Field Trainer': true,
          'Senior BMA': true,
          'BMA': true,
          'IBA': true
        }
      },
      { 
        pageName: 'Tasks', 
        description: 'Task management and assignments',
        rolePermissions: {
          'Admin': true,
          'Field Builder': true,
          'Field Trainer': true,
          'Senior BMA': true,
          'BMA': true,
          'IBA': true
        }
      },
      { 
        pageName: 'Reports', 
        description: 'System reports and analytics',
        rolePermissions: {
          'Admin': true,
          'Field Builder': true,
          'Field Trainer': true,
          'Senior BMA': true,
          'BMA': false,
          'IBA': false
        }
      },
      { 
        pageName: 'User Management', 
        description: 'User administration and management',
        rolePermissions: {
          'Admin': true,
          'Field Builder': false,
          'Field Trainer': false,
          'Senior BMA': false,
          'BMA': false,
          'IBA': false
        }
      },
      { 
        pageName: 'Securia Access', 
        description: 'Securia system access and operations',
        rolePermissions: {
          'Admin': true,
          'Field Builder': false,
          'Field Trainer': false,
          'Senior BMA': false,
          'BMA': false,
          'IBA': false
        }
      }
    ];

    let createdCount = 0;
    let updatedCount = 0;

    for (const pageData of defaultPages) {
      const existingPage = await PagePermission.findOne({ pageName: pageData.pageName });
      
      if (!existingPage) {
        await PagePermission.create(pageData);
        createdCount++;
      } else {
        // Update existing page with any missing role permissions
        let updated = false;
        for (const [role, permission] of Object.entries(pageData.rolePermissions)) {
          if ((existingPage.rolePermissions as any)[role] === undefined) {
            (existingPage.rolePermissions as any)[role] = permission;
            updated = true;
          }
        }
        
        if (updated) {
          existingPage.markModified('rolePermissions');
          await existingPage.save();
          updatedCount++;
        }
      }
    }

    logger.info(`Default pages initialized: ${createdCount} created, ${updatedCount} updated by ${req.user!.email}`);

    res.json({
      success: true,
      message: `Default pages initialized: ${createdCount} created, ${updatedCount} updated`,
      data: {
        created: createdCount,
        updated: updatedCount,
        total: defaultPages.length
      }
    });
  } catch (error) {
    logger.error('Initialize default pages error:', error);
    res.status(500).json({ error: 'Failed to initialize default pages' });
  }
};

// Get user's page permissions
export const getUserPagePermissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role;
    const pagePermissions = await PagePermission.find({ isActive: true });

    const userPermissions = pagePermissions.reduce((acc, page) => {
      let hasPermission = false;
      
      if (page.rolePermissions && typeof page.rolePermissions === 'object' && page.rolePermissions !== null) {
        hasPermission = (page.rolePermissions as any)[userRole] || false;
      }
      
      acc[page.pageName] = hasPermission;
      return acc;
    }, {} as Record<string, boolean>);

    res.json({
      success: true,
      data: {
        role: userRole,
        permissions: userPermissions
      }
    });
  } catch (error) {
    logger.error('Get user page permissions error:', error);
    res.status(500).json({ error: 'Failed to get user page permissions' });
  }
};

// Delete page permission
export const deletePagePermission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pageName } = req.params;

    const pagePermission = await PagePermission.findOne({ pageName });
    if (!pagePermission) {
      res.status(404).json({ error: 'Page permission not found' });
      return;
    }

    await PagePermission.findByIdAndDelete(pagePermission._id);

    logger.info(`Page permission deleted: ${pageName} by ${req.user!.email}`);

    res.json({
      success: true,
      message: 'Page permission deleted successfully'
    });
  } catch (error) {
    logger.error('Delete page permission error:', error);
    res.status(500).json({ error: 'Failed to delete page permission' });
  }
};