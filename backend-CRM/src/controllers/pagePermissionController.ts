import { Response } from 'express';
import PagePermission from '../models/PagePermission';
import { AuthRequest } from '../types';
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
export const createPagePermission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pageName, rolePermissions, description } = req.body;

    if (!pageName) {
      res.status(400).json({ error: 'Page name is required' });
      return;
    }

    const existingPermission = await PagePermission.findOne({ pageName });
    
    if (existingPermission) {
      // Update existing
      existingPermission.rolePermissions = { ...existingPermission.rolePermissions, ...rolePermissions };
      if (description !== undefined) existingPermission.description = description;
      
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
    const validRoles = ['Admin', 'Field Builder', 'Field Trainer', 'Sr. BMA', 'BMA', 'IBA'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    let pagePermission = await PagePermission.findOne({ pageName });
    
    if (!pagePermission) {
      // Create new page permission if it doesn't exist
      const defaultPermissions = {
        Admin: true,
        'Field Builder': false,
        'Field Trainer': false,
        'Sr. BMA': false,
        BMA: false,
        IBA: false
      };
      
      pagePermission = await PagePermission.create({
        pageName,
        rolePermissions: defaultPermissions
      });
    }

    // Toggle the permission
    const currentPermission = pagePermission.rolePermissions[role as keyof typeof pagePermission.rolePermissions];
    pagePermission.rolePermissions[role as keyof typeof pagePermission.rolePermissions] = !currentPermission;
    
    await pagePermission.save();

    const newPermission = pagePermission.rolePermissions[role as keyof typeof pagePermission.rolePermissions];
    
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
          Admin: true,
          'Field Builder': true,
          'Field Trainer': true,
          'Sr. BMA': true,
          BMA: true,
          IBA: true
        }
      },
      { 
        pageName: 'Contacts', 
        description: 'Contact management and client information',
        rolePermissions: {
          Admin: true,
          'Field Builder': true,
          'Field Trainer': true,
          'Sr. BMA': true,
          BMA: true,
          IBA: true
        }
      },
      { 
        pageName: 'Deals', 
        description: 'Deal management and sales tracking',
        rolePermissions: {
          Admin: true,
          'Field Builder': true,
          'Field Trainer': true,
          'Sr. BMA': true,
          BMA: true,
          IBA: true
        }
      },
      { 
        pageName: 'Tasks', 
        description: 'Task management and assignments',
        rolePermissions: {
          Admin: true,
          'Field Builder': true,
          'Field Trainer': true,
          'Sr. BMA': true,
          BMA: true,
          IBA: true
        }
      },
      { 
        pageName: 'Reports', 
        description: 'System reports and analytics',
        rolePermissions: {
          Admin: true,
          'Field Builder': true,
          'Field Trainer': true,
          'Sr. BMA': false,
          BMA: false,
          IBA: false
        }
      },
      { 
        pageName: 'User Management', 
        description: 'User administration and management',
        rolePermissions: {
          Admin: true,
          'Field Builder': false,
          'Field Trainer': false,
          'Sr. BMA': false,
          BMA: false,
          IBA: false
        }
      },
      { 
        pageName: 'Securia Access', 
        description: 'Securia system access and operations',
        rolePermissions: {
          Admin: true,
          'Field Builder': true,
          'Field Trainer': false,
          'Sr. BMA': false,
          BMA: false,
          IBA: false
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
        for (const role of Object.keys(pageData.rolePermissions)) {
          if (existingPage.rolePermissions[role as keyof typeof existingPage.rolePermissions] === undefined) {
            existingPage.rolePermissions[role as keyof typeof existingPage.rolePermissions] = 
              pageData.rolePermissions[role as keyof typeof pageData.rolePermissions];
            updated = true;
          }
        }
        
        if (updated) {
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
      acc[page.pageName] = page.rolePermissions[userRole as keyof typeof page.rolePermissions] || false;
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
