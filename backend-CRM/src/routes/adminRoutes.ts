import { Router } from 'express';
import { 
  getDashboardStats, 
  bulkUpdateUsers, 
  createUser, 
  getAllUsers,
  toggleUserStatus,
  updateUserRole,
  deleteMultipleUsers,
  getUserActivity,
  resetUserPassword,
  getPermissions
} from '../controllers/adminController';
import {
  getPagePermissions,
  createOrUpdatePagePermission,
  toggleRolePermission,
  initializeDefaultPages,
  deletePagePermission,
  getUserPagePermissions,
  bulkInsertPermissions,
  resetAllPermissions,
  getAllPermissions,
  checkUserPageAccess
} from '../controllers/pagePermissionController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { validateRegistration, validateBulkUpdate } from '../middleware/validation';
import { validateObjectId, validateRequiredFields, validateQueryParams } from '../middleware/paramValidation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only operations for user management
 */

// All routes require Admin access
router.use(authenticate);
router.use(authorizeAdmin);

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   $ref: '#/components/schemas/DashboardStats'
 */
router.get('/dashboard/stats', getDashboardStats);

/**
 * @swagger
 * /api/admin/users/activity:
 *   get:
 *     summary: Get user activity statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: string
 *           default: "30"
 *         description: Number of days to look back for activity
 *     responses:
 *       200:
 *         description: User activity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     recentLogins:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     registrationStats:
 *                       type: array
 *                       items:
 *                         type: object
 *                     period:
 *                       type: string
 *                       example: "30 days"
 */
router.get('/users/activity', getUserActivity);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with pagination and filtering (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           default: "1"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           default: "10"
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [Admin, Field Builder, Field Trainer, Senior BMA, BMA, IBA]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, email, or consultant ID
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     pages:
 *                       type: number
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *   post:
 *     summary: Create new user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: User created successfully
 */
router.get('/users', getAllUsers);
router.post('/users', validateRegistration, createUser);

/**
 * @swagger
 * /api/admin/users/bulk:
 *   put:
 *     summary: Bulk update multiple users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkUpdateRequest'
 *     responses:
 *       200:
 *         description: Users updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *   delete:
 *     summary: Delete multiple users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userIds]
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60f1b2b5c8e4f123456789ab", "60f1b2b5c8e4f123456789ac"]
 *     responses:
 *       200:
 *         description: Users deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/users/bulk', validateBulkUpdate, bulkUpdateUsers);
router.delete('/users/bulk', deleteMultipleUsers);

/**
 * @swagger
 * /api/admin/users/{id}/toggle-status:
 *   patch:
 *     summary: Toggle user active status (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.patch('/users/:id/toggle-status', toggleUserStatus);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Update user role (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [Admin, Field Builder, Field Trainer, Senior BMA, BMA, IBA]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.patch('/users/:id/role', updateUserRole);

/**
 * @swagger
 * /api/admin/users/{id}/reset-password:
 *   patch:
 *     summary: Reset user password (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.patch('/users/:id/reset-password', resetUserPassword);

// ===== PAGE PERMISSIONS ROUTES =====

/**
 * @swagger
 * /api/admin/page-permissions:
 *   get:
 *     summary: Get all page permissions (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Page permissions retrieved successfully
 */
router.get('/page-permissions', getPagePermissions);

/**
 * @swagger
 * /api/admin/page-permissions:
 *   post:
 *     summary: Create or update page permission (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Page permission created/updated successfully
 */
router.post('/page-permissions', createOrUpdatePagePermission);

/**
 * @swagger
 * /api/admin/page-permissions/initialize:
 *   post:
 *     summary: Initialize default page permissions (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Default permissions initialized successfully
 */
router.post('/page-permissions/initialize', initializeDefaultPages);

/**
 * @swagger
 * /api/admin/page-permissions/{pageName}/toggle:
 *   patch:
 *     summary: Toggle role permission for a page (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission toggled successfully
 */
router.patch('/page-permissions/:pageName/toggle', toggleRolePermission);

/**
 * @swagger
 * /api/admin/page-permissions/{pageName}:
 *   delete:
 *     summary: Delete page permission (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page permission deleted successfully
 */
router.delete('/page-permissions/:pageName', deletePagePermission);

/**
 * @swagger
 * /api/admin/permissions:
 *   get:
 *     summary: Get user permissions (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions retrieved successfully
 */
router.get('/permissions', getAllPermissions);

/**
 * @swagger
 * /api/admin/permissions/check:
 *   get:
 *     summary: Check user access to a specific page (Admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *         description: User role to check
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: string
 *         description: Page name to check access for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access check completed successfully
 */
router.get('/permissions/check', checkUserPageAccess);

/**
 * @swagger
 * /api/admin/permissions/bulk:
 *   post:
 *     summary: Bulk insert page permissions (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions inserted successfully
 */
router.post('/permissions/bulk', bulkInsertPermissions);

/**
 * @swagger
 * /api/admin/permissions/reset:
 *   delete:
 *     summary: Reset all page permissions (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions reset successfully
 */
router.delete('/permissions/reset', resetAllPermissions);

export default router;
