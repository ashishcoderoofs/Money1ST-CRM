import { Router } from 'express';
import {
  getConsultants,
  getConsultantById,
  createConsultant,
  updateConsultant,
  deleteConsultant,
  toggleConsultantStatus,
  getConsultantStats,
  searchConsultants
} from '../controllers/consultantController';
import { authenticate, authorize } from '../middleware/auth';
import { authenticateWithRealtimeStatusCheck, logUserStatusAccess } from '../middleware/enhancedAuth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Consultants
 *   description: Consultant management operations
 */

// All routes require authentication with status logging
router.use(authenticate);
router.use(logUserStatusAccess);

/**
 * @swagger
 * /api/consultants:
 *   get:
 *     summary: Get all consultants with pagination and filtering
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultants retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authorize('Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA'), getConsultants);

/**
 * @swagger
 * /api/consultants/stats:
 *   get:
 *     summary: Get consultant statistics
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', authorize('Admin', 'Field Builder', 'Field Trainer', 'Senior BMA'), getConsultantStats);

/**
 * @swagger
 * /api/consultants/search:
 *   get:
 *     summary: Search consultants
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 */
router.get('/search', authorize('Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA'), searchConsultants);

/**
 * @swagger
 * /api/consultants/{id}:
 *   get:
 *     summary: Get consultant by ID
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultant retrieved successfully
 *       404:
 *         description: Consultant not found
 */
router.get('/:id', authorize('Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA'), getConsultantById);

/**
 * @swagger
 * /api/consultants:
 *   post:
 *     summary: Create a new consultant
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               consultantId:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Consultant created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', authorize('Admin', 'Field Builder', 'Field Trainer', 'Senior BMA'), authenticateWithRealtimeStatusCheck, createConsultant);

/**
 * @swagger
 * /api/consultants/{id}:
 *   put:
 *     summary: Update consultant
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultant updated successfully
 *       404:
 *         description: Consultant not found
 */
router.put('/:id', authorize('Admin', 'Field Builder', 'Field Trainer', 'Senior BMA'), authenticateWithRealtimeStatusCheck, updateConsultant);

/**
 * @swagger
 * /api/consultants/{id}/toggle-status:
 *   patch:
 *     summary: Toggle consultant status
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status toggled successfully
 */
router.patch('/:id/toggle-status', authorize('Admin', 'Field Builder', 'Field Trainer', 'Senior BMA'), authenticateWithRealtimeStatusCheck, toggleConsultantStatus);

/**
 * @swagger
 * /api/consultants/{id}:
 *   delete:
 *     summary: Delete consultant
 *     tags: [Consultants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultant deleted successfully
 *       404:
 *         description: Consultant not found
 */
router.delete('/:id', authorize('Admin', 'Field Builder'), authenticateWithRealtimeStatusCheck, deleteConsultant);

export default router;
