import express from 'express';
import {  validateMinimumClientFields, validateClientUpdate } from '../middleware/clientValidation';
import { 
  validateMultiStageClient
} from '../middleware/multiStageClientValidation';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types/types';
import { Response, NextFunction } from 'express';
import {
  reauthSecuria,
  checkSecuriaSession,
  debugSecuriaSession,
  logoutSecuria,
  getConsultants,
  createConsultant,
  getConsultantById,
  updateConsultant,
  deleteConsultant,
  toggleConsultantStatus,
  getDashboardStats,
  getAuditLogs
} from '../controllers/securiaController';
import { requireSecuriaSession, validateAdminStatus } from '../middleware/enhancedAuth';

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
 *     Consultant:
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

// Apply authenticate and validateAdminStatus to all Securia routes
router.use(authenticate, validateAdminStatus);

// Auth endpoints (do NOT require Securia session)
router.post('/reauth', reauthSecuria);
router.get('/status', checkSecuriaSession);
router.post('/logout', logoutSecuria);

// All other Securia routes require Securia session
router.use(requireSecuriaSession);

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

// Import session checking function
import { hasValidSecuriaSession } from '../controllers/securiaController';

// Middleware to check Securia session for protected routes
const checkSecuriaSessionMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Skip session check for auth-related endpoints
  if (req.path === '/reauth' || req.path === '/status' || req.path === '/logout') {
    return next();
  }

  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  const hasSession = hasValidSecuriaSession(req.user._id.toString());
  
  if (!hasSession) {
    return res.status(403).json({ 
      success: false, 
      message: 'Securia session required. Please re-authenticate.',
      requiresReauth: true
    });
  }

  next();
};

// Apply session checking middleware to all routes except auth endpoints
router.use(checkSecuriaSessionMiddleware);

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
router.get('/status', checkSecuriaSession);

/**
 * @swagger
 * /api/securia/logout:
 *   post:
 *     summary: Logout from Securia (invalidate session)
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Securia session ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */
router.post('/logout', logoutSecuria);

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
 *                     $ref: '#/components/schemas/Consultant'
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
 *                   $ref: '#/components/schemas/Consultant'
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
 *                   $ref: '#/components/schemas/Consultant'
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
 *                   $ref: '#/components/schemas/Consultant'
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

/**
 * @swagger
 * /api/securia/clients/partial:
 *   post:
 *     summary: Create partial client (for multi-stage forms)
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
 *               - basicInfo
 *               - contactInfo
 *             properties:
 *               basicInfo:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: Jane
 *                   lastName:
 *                     type: string
 *                     example: Smith
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: jane.smith@example.com
 *                   homePhone:
 *                     type: string
 *                     example: +1-555-0456
 *     responses:
 *       201:
 *         description: Partial client created successfully
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
 *                     id:
 *                       type: string
 *                     clientId:
 *                       type: string
 *                     completionPercentage:
 *                       type: number
 *                     status:
 *                       type: string
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Failed to create partial client
 */


// Multi-Stage Client Form API Routes

/**
 * @swagger
 * /api/securia/clients/multistage:
 *   post:
 *     summary: Create a new client with multi-stage form support
 *     tags: [Securia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicant:
 *                 type: object
 *                 description: Primary applicant information
 *               coApplicant:
 *                 type: object
 *                 description: Co-applicant information
 *               liabilities:
 *                 type: array
 *                 description: Client liabilities
 *               mortgages:
 *                 type: array
 *                 description: Mortgage information
 *               underwriting:
 *                 type: object
 *                 description: Underwriting details
 *               loanStatus:
 *                 type: object
 *                 description: Loan status information
 *               drivers:
 *                 type: array
 *                 description: Driver information
 *               vehicleCoverage:
 *                 type: object
 *                 description: Vehicle coverage details
 *               homeowners:
 *                 type: object
 *                 description: Homeowners insurance
 *               renters:
 *                 type: object
 *                 description: Renters insurance
 *               incomeProtection:
 *                 type: object
 *                 description: Income protection details
 *               retirement:
 *                 type: object
 *                 description: Retirement planning
 *               lineage:
 *                 type: object
 *                 description: Referral and source tracking
 *     responses:
 *       201:
 *         description: Multi-stage client created successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Client already exists
 *       500:
 *         description: Failed to create client
 */
// router.post('/clients/multistage', validateMultiStageClient, createMultiStageClient);

/**
 * @swagger
 * /api/securia/clients/{id}/section/{section}:
 *   put:
 *     summary: Update specific section of client form
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
 *       - in: path
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *           enum: [applicant, coApplicant, liabilities, mortgages, underwriting, loanStatus, drivers, vehicleCoverage, homeowners, renters, incomeProtection, retirement, lineage]
 *         description: Section name to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               section:
 *                 type: string
 *                 description: Section name
 *               data:
 *                 type: object
 *                 description: Section data to update
 *     responses:
 *       200:
 *         description: Client section updated successfully
 *       400:
 *         description: Invalid section or data
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update section
 *   get:
 *     summary: Get specific section data for a client
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
 *       - in: path
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *           enum: [applicant, coApplicant, liabilities, mortgages, underwriting, loanStatus, drivers, vehicleCoverage, homeowners, renters, incomeProtection, retirement, lineage]
 *         description: Section name to retrieve
 *     responses:
 *       200:
 *         description: Client section data retrieved successfully
 *       400:
 *         description: Invalid section
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to get section data
 */
// router.put('/clients/:id/section/:section', validateSectionUpdate, updateClientSection);
// Get client section route temporarily disabled - function not implemented
// router.get('/clients/:id/section/:section', getClientSection);

/**
 * @swagger
 * /api/securia/clients/{id}/progress:
 *   get:
 *     summary: Get client completion progress and status
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
 *         description: Client progress retrieved successfully
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
 *                     clientId:
 *                       type: string
 *                     completionPercentage:
 *                       type: number
 *                     status:
 *                       type: string
 *                     completedSections:
 *                       type: array
 *                       items:
 *                         type: string
 *                     sectionProgress:
 *                       type: object
 *                     totalSections:
 *                       type: number
 *                     completedCount:
 *                       type: number
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to get progress
 */
// Progress route temporarily disabled - function not implemented
// router.get('/clients/:id/progress', getClientProgress);

/**
 * @swagger
 * /api/securia/clients/{id}/bulk-update:
 *   put:
 *     summary: Bulk update multiple client sections at once
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
 *             type: object
 *             properties:
 *               sections:
 *                 type: object
 *                 description: Multiple sections to update with their data
 *                 example:
 *                   applicant: { firstName: "John", lastName: "Doe" }
 *                   underwriting: { creditScore: 750, annualIncome: 50000 }
 *     responses:
 *       200:
 *         description: Client sections updated successfully
 *       400:
 *         description: Invalid sections data
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update sections
 */
// Bulk update route temporarily disabled - function not implemented
// router.put('/clients/:id/bulk-update', validateBulkUpdate, bulkUpdateClientSections);

/**
 * @swagger
 * /api/securia/clients/{id}/applicant/basic-info:
 *   put:
 *     summary: Update applicant basic information
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 enum: [Mr., Mrs., Ms., Dr., Prof.]
 *               firstName:
 *                 type: string
 *               mi:
 *                 type: string
 *               lastName:
 *                 type: string
 *               suffix:
 *                 type: string
 *               maidenName:
 *                 type: string
 *               isConsultant:
 *                 type: boolean
 *               homePhone:
 *                 type: string
 *               workPhone:
 *                 type: string
 *               cellPhone:
 *                 type: string
 *               otherPhone:
 *                 type: string
 *               fax:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Applicant basic info updated successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update applicant basic info
 */
// router.put('/clients/:id/applicant/basic-info', validateRequiredApplicantBasicInfo, updateApplicantBasicInfo);

/**
 * @swagger
 * /api/securia/clients/{id}/applicant/address:
 *   put:
 *     summary: Update applicant address information
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
 *             type: object
 *             properties:
 *               currentAddress:
 *                 type: object
 *               previousAddress:
 *                 type: object
 *     responses:
 *       200:
 *         description: Applicant address updated successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update applicant address
 */
// router.put('/clients/:id/applicant/address', validateRequiredApplicantAddress, updateApplicantAddress);

/**
 * @swagger
 * /api/securia/clients/{id}/applicant/employment:
 *   put:
 *     summary: Update applicant employment information
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
 *             type: object
 *             properties:
 *               employment:
 *                 type: object
 *               previousEmployment:
 *                 type: object
 *     responses:
 *       200:
 *         description: Applicant employment updated successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update applicant employment
 */
// router.put('/clients/:id/applicant/employment', validateOptionalApplicantEmployment, updateApplicantEmployment);

/**
 * @swagger
 * /api/securia/clients/{id}/applicant/demographics:
 *   put:
 *     summary: Update applicant demographics information
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
 *             type: object
 *             properties:
 *               birthPlace:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               ssn:
 *                 type: string
 *               race:
 *                 type: string
 *               maritalStatus:
 *                 type: string
 *               anniversary:
 *                 type: string
 *                 format: date
 *               spouseName:
 *                 type: string
 *               spouseOccupation:
 *                 type: string
 *               numberOfDependents:
 *                 type: number
 *     responses:
 *       200:
 *         description: Applicant demographics updated successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update applicant demographics
 */
// router.put('/clients/:id/applicant/demographics', validateOptionalApplicantDemographics, updateApplicantDemographics);

/**
 * @swagger
 * /api/securia/clients/{id}/co-applicant/basic-info:
 *   put:
 *     summary: Update co-applicant basic information
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
 *             type: object
 *             properties:
 *               includeCoApplicant:
 *                 type: boolean
 *               title:
 *                 type: string
 *                 enum: [Mr., Mrs., Ms., Dr., Prof.]
 *               firstName:
 *                 type: string
 *               mi:
 *                 type: string
 *               lastName:
 *                 type: string
 *               suffix:
 *                 type: string
 *               maidenName:
 *                 type: string
 *               isConsultant:
 *                 type: boolean
 *               homePhone:
 *                 type: string
 *               workPhone:
 *                 type: string
 *               cellPhone:
 *                 type: string
 *               otherPhone:
 *                 type: string
 *               fax:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Co-applicant basic info updated successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update co-applicant basic info
 */
// router.put('/clients/:id/co-applicant/basic-info', validateRequiredCoApplicantBasicInfo, updateCoApplicantBasicInfo);

/**
 * @swagger
 * /api/securia/clients/{id}/co-applicant/address:
 *   put:
 *     summary: Update co-applicant address information
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
 *             type: object
 *             properties:
 *               currentAddress:
 *                 type: object
 *               previousAddress:
 *                 type: object
 *     responses:
 *       200:
 *         description: Co-applicant address updated successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update co-applicant address
 */
// router.put('/clients/:id/co-applicant/address', validateRequiredCoApplicantAddress, updateCoApplicantAddress);

/**
 * @swagger
 * /api/securia/clients/{id}/co-applicant/employment:
 *   put:
 *     summary: Update co-applicant employment information
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
 *             type: object
 *             properties:
 *               employment:
 *                 type: object
 *               previousEmployment:
 *                 type: object
 *     responses:
 *       200:
 *         description: Co-applicant employment updated successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update co-applicant employment
 */
// router.put('/clients/:id/co-applicant/employment', validateOptionalCoApplicantEmployment, updateCoApplicantEmployment);

/**
 * @swagger
 * /api/securia/clients/{id}/co-applicant/demographics:
 *   put:
 *     summary: Update co-applicant demographics information
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
 *             type: object
 *             properties:
 *               birthPlace:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               race:
 *                 type: string
 *               maritalStatus:
 *                 type: string
 *               anniversary:
 *                 type: string
 *                 format: date
 *               spouseName:
 *                 type: string
 *               spouseOccupation:
 *                 type: string
 *               numberOfDependents:
 *                 type: number
 *     responses:
 *       200:
 *         description: Co-applicant demographics updated successfully
 *       404:
 *         description: Client not found
 *       500:
 *         description: Failed to update co-applicant demographics
 */
// router.put('/clients/:id/co-applicant/demographics', validateOptionalCoApplicantDemographics, updateCoApplicantDemographics);

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

// Add debug endpoint (remove in production)
router.get('/debug-session', debugSecuriaSession);

export default router;
