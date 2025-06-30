import express from 'express';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import {
  reauthSecuria,
  getConsultants,
  createConsultant,
  getConsultantById,
  updateConsultant,
  deleteConsultant,
  toggleConsultantStatus,
  getClients,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  toggleClientStatus,
  getDashboardStats,
  getChartData,
  getAuditLogs
} from '../controllers/securiaController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Securia
 *   description: Securia financial management system (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SecuriaConsultant:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - specialization
 *         - experience
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated consultant ID
 *         firstName:
 *           type: string
 *           maxLength: 50
 *         lastName:
 *           type: string
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *           description: Unique email address
 *         phone:
 *           type: string
 *           pattern: '^\\+?[\\d\\s\\-\\(\\)]+'
 *         specialization:
 *           type: string
 *           maxLength: 100
 *         experience:
 *           type: string
 *           maxLength: 500
 *         certifications:
 *           type: array
 *           items:
 *             type: string
 *             maxLength: 100
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           default: active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     SecuriaClient:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - address
 *         - dateOfBirth
 *         - ssn
 *         - consultantId
 *         - financialInfo
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated client ID
 *         firstName:
 *           type: string
 *           maxLength: 50
 *         lastName:
 *           type: string
 *           maxLength: 50
 *         email:
 *           type: string
 *           format: email
 *           description: Unique email address
 *         phone:
 *           type: string
 *           pattern: '^\\+?[\\d\\s\\-\\(\\)]+'
 *         address:
 *           type: object
 *           required:
 *             - street
 *             - city
 *             - state
 *             - zipCode
 *             - country
 *           properties:
 *             street:
 *               type: string
 *               maxLength: 200
 *             city:
 *               type: string
 *               maxLength: 100
 *             state:
 *               type: string
 *               maxLength: 50
 *             zipCode:
 *               type: string
 *               pattern: '^\\d{5}(-\\d{4})?$'
 *             country:
 *               type: string
 *               maxLength: 50
 *               default: USA
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         ssn:
 *           type: string
 *           description: Encrypted SSN (stored securely)
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           default: active
 *         consultantId:
 *           type: string
 *           description: Reference to assigned consultant
 *         financialInfo:
 *           type: object
 *           required:
 *             - annualIncome
 *             - netWorth
 *             - investmentGoals
 *             - riskTolerance
 *           properties:
 *             annualIncome:
 *               type: number
 *               minimum: 0
 *             netWorth:
 *               type: number
 *             investmentGoals:
 *               type: string
 *               maxLength: 1000
 *             riskTolerance:
 *               type: string
 *               enum: [low, medium, high]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     SecuriaAuditLog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         userEmail:
 *           type: string
 *         action:
 *           type: string
 *         resource:
 *           type: string
 *         resourceId:
 *           type: string
 *         ipAddress:
 *           type: string
 *         userAgent:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *         details:
 *           type: object
 *     
 *     SecuriaDashboardStats:
 *       type: object
 *       properties:
 *         totalConsultants:
 *           type: number
 *         activeConsultants:
 *           type: number
 *         totalClients:
 *           type: number
 *         activeClients:
 *           type: number
 *         totalRevenue:
 *           type: number
 *         monthlyGrowth:
 *           type: number
 *         recentActivity:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     
 *     SecuriaApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         error:
 *           type: string
 *     
 *     SecuriaPagination:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *         pages:
 *           type: number
 *         total:
 *           type: number
 *         hasNext:
 *           type: boolean
 *         hasPrev:
 *           type: boolean
 */

// Add authentication middleware for all Securia routes
router.use(authenticate);

// Middleware to check Admin role for all Securia routes
router.use((req: AuthRequest, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    res.status(403).json({ 
      success: false, 
      message: "Access denied - Only Admin users can access Securia",
      userRole: req.user?.role,
      requiredRoles: ['Admin']
    });
    return;
  }
  next();
});

// Authentication Endpoints

/**
 * @swagger
 * /api/securia/reauth:
 *   post:
 *     summary: Re-authenticate Admin user for Securia access
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@money1st.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Authentication successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *       403:
 *         description: Access denied - Admin role required
 *       500:
 *         description: Server error
 */
router.post('/reauth', reauthSecuria);

/**
 * @swagger
 * /api/securia/status:
 *   get:
 *     summary: Check Securia access status
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 hasAccess:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */
router.get('/status', async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const hasSecuriaAccess = req.user.role === 'Admin';
    
    return res.status(200).json({
      success: true,
      hasAccess: hasSecuriaAccess,
      user: {
        email: req.user.email,
        role: req.user.role
      },
      message: hasSecuriaAccess ? 'Securia access available' : 'Securia access denied'
    });
  } catch (err) {
    console.error("🔥 Securia status error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Consultant Management Endpoints

/**
 * @swagger
 * /api/securia/consultants:
 *   get:
 *     summary: Get all consultants with pagination and filtering
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or specialization
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *           default: all
 *         description: Filter by status
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Consultants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SecuriaConsultant'
 *                 pagination:
 *                   $ref: '#/components/schemas/SecuriaPagination'
 *       500:
 *         description: Failed to get consultants
 *   post:
 *     summary: Create new consultant
 *     tags: [Securia]
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
 *               - phone
 *               - specialization
 *               - experience
 *             properties:
 *               firstName:
 *                 type: string
 *                 maxLength: 50
 *                 example: John
 *               lastName:
 *                 type: string
 *                 maxLength: 50
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               phone:
 *                 type: string
 *                 example: +1-555-0123
 *               specialization:
 *                 type: string
 *                 example: Financial Planning
 *               experience:
 *                 type: string
 *                 example: 5 years in wealth management
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["CFP", "CFA"]
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *     responses:
 *       201:
 *         description: Consultant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SecuriaConsultant'
 *       409:
 *         description: Consultant with this email already exists
 *       500:
 *         description: Failed to create consultant
 */
router.get('/consultants', getConsultants);
router.post('/consultants', createConsultant);

/**
 * @swagger
 * /api/securia/consultants/{id}:
 *   get:
 *     summary: Get consultant by ID
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Consultant ID
 *     responses:
 *       200:
 *         description: Consultant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SecuriaConsultant'
 *       404:
 *         description: Consultant not found
 *       500:
 *         description: Failed to get consultant
 *   put:
 *     summary: Update consultant
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Consultant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: string
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Consultant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SecuriaConsultant'
 *       404:
 *         description: Consultant not found
 *       500:
 *         description: Failed to update consultant
 *   delete:
 *     summary: Delete consultant
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Consultant ID
 *     responses:
 *       200:
 *         description: Consultant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SecuriaApiResponse'
 *       404:
 *         description: Consultant not found
 *       500:
 *         description: Failed to delete consultant
 */
router.get('/consultants/:id', getConsultantById);
router.put('/consultants/:id', updateConsultant);
router.delete('/consultants/:id', deleteConsultant);

/**
 * @swagger
 * /api/securia/consultants/{id}/status:
 *   patch:
 *     summary: Toggle consultant status (active/inactive)
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Consultant ID
 *     responses:
 *       200:
 *         description: Consultant status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     status:
 *                       type: string
 *       404:
 *         description: Consultant not found
 *       500:
 *         description: Failed to update consultant status
 */
router.patch('/consultants/:id/status', toggleConsultantStatus);

// Client Management Endpoints

/**
 * @swagger
 * /api/securia/clients:
 *   get:
 *     summary: Get all clients with pagination and filtering
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *           default: all
 *         description: Filter by status
 *       - in: query
 *         name: consultantId
 *         schema:
 *           type: string
 *         description: Filter by assigned consultant
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Clients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SecuriaClient'
 *                 pagination:
 *                   $ref: '#/components/schemas/SecuriaPagination'
 *       500:
 *         description: Failed to get clients
 *   post:
 *     summary: Create new client
 *     tags: [Securia]
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
 *               - phone
 *               - address
 *               - dateOfBirth
 *               - ssn
 *               - consultantId
 *               - financialInfo
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Smith
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.smith@example.com
 *               phone:
 *                 type: string
 *                 example: +1-555-0456
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: 123 Main St
 *                   city:
 *                     type: string
 *                     example: Anytown
 *                   state:
 *                     type: string
 *                     example: CA
 *                   zipCode:
 *                     type: string
 *                     example: "12345"
 *                   country:
 *                     type: string
 *                     example: USA
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1985-06-15"
 *               ssn:
 *                 type: string
 *                 example: "123-45-6789"
 *                 description: Will be encrypted before storage
 *               consultantId:
 *                 type: string
 *                 example: "60f1b2b5c8e4f123456789ab"
 *               financialInfo:
 *                 type: object
 *                 properties:
 *                   annualIncome:
 *                     type: number
 *                     example: 100000
 *                   netWorth:
 *                     type: number
 *                     example: 500000
 *                   investmentGoals:
 *                     type: string
 *                     example: "Retirement planning and wealth preservation"
 *                   riskTolerance:
 *                     type: string
 *                     enum: [low, medium, high]
 *                     example: medium
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SecuriaClient'
 *       409:
 *         description: Client with this email already exists
 *       500:
 *         description: Failed to create client
 */
router.get('/clients', getClients);
router.post('/clients', createClient);

/**
 * @swagger
 * /api/securia/clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SecuriaClient'
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to get client
 *   put:
 *     summary: Update client
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SecuriaClient'
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/SecuriaClient'
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update client
 *   delete:
 *     summary: Delete client
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SecuriaApiResponse'
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to delete client
 */
router.get('/clients/:id', getClientById);
router.put('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);

/**
 * @swagger
 * /api/securia/clients/{id}/status:
 *   patch:
 *     summary: Toggle client status (active/inactive)
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     status:
 *                       type: string
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update client status
 */
router.patch('/clients/:id/status', toggleClientStatus);

// Dashboard & Analytics Endpoints

/**
 * @swagger
 * /api/securia/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Securia]
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
 *                 data:
 *                   $ref: '#/components/schemas/SecuriaDashboardStats'
 *       500:
 *         description: Failed to get dashboard stats
 */
router.get('/dashboard/stats', getDashboardStats);

/**
 * @swagger
 * /api/securia/dashboard/charts:
 *   get:
 *     summary: Get chart data for dashboard
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *           default: month
 *         description: Time period for chart data
 *     responses:
 *       200:
 *         description: Chart data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     consultantGrowth:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           period:
 *                             type: string
 *                           count:
 *                             type: number
 *                     clientGrowth:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           period:
 *                             type: string
 *                           count:
 *                             type: number
 *                     revenueByConsultant:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           consultantName:
 *                             type: string
 *                           revenue:
 *                             type: number
 *                     clientsByRiskTolerance:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           riskLevel:
 *                             type: string
 *                           count:
 *                             type: number
 *       500:
 *         description: Failed to get chart data
 */
router.get('/dashboard/charts', getChartData);

// Security & Audit Endpoints

/**
 * @swagger
 * /api/securia/audit/logs:
 *   get:
 *     summary: Get audit logs for security monitoring
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for filtering
 *     responses:
 *       200:
 *         description: Audit logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SecuriaAuditLog'
 *                 pagination:
 *                   $ref: '#/components/schemas/SecuriaPagination'
 *       500:
 *         description: Failed to get audit logs
 */
router.get('/audit/logs', getAuditLogs);

export default router;
