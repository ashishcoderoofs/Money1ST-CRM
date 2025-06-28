import express from 'express';
import { AttachmentController } from '../controllers/attachmentController';
import { authenticate, authorize } from '../middleware/auth';
import { upload, uploadMultiple } from '../middleware/upload';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Attachment:
 *       type: object
 *       required:
 *         - recordId
 *         - category
 *         - fileName
 *         - originalName
 *         - filePath
 *         - fileSize
 *         - mimeType
 *         - uploadedBy
 *       properties:
 *         id:
 *           type: string
 *           description: The attachment ID
 *         recordId:
 *           type: string
 *           description: The ID of the parent record
 *         category:
 *           type: string
 *           enum: [note, contact, deal, client, document, image, other]
 *           description: The category of the attachment
 *         fileName:
 *           type: string
 *           description: The file name on disk
 *         originalName:
 *           type: string
 *           description: The original file name
 *         filePath:
 *           type: string
 *           description: The relative path to the file
 *         fileSize:
 *           type: number
 *           description: The file size in bytes
 *         mimeType:
 *           type: string
 *           description: The MIME type of the file
 *         fileUrl:
 *           type: string
 *           description: The URL to access the file
 *         uploadedBy:
 *           type: string
 *           description: The ID of the user who uploaded the file
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           description: The upload timestamp
 *         description:
 *           type: string
 *           description: Optional description of the attachment
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Optional tags for the attachment
 */

/**
 * @swagger
 * /api/attachments/upload:
 *   post:
 *     summary: Upload a new attachment
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - recordId
 *               - category
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               recordId:
 *                 type: string
 *                 description: The ID of the parent record
 *               category:
 *                 type: string
 *                 enum: [note, contact, deal, client, document, image, other]
 *                 description: The category of the attachment
 *               description:
 *                 type: string
 *                 description: Optional description
 *               tags:
 *                 type: string
 *                 description: JSON string of tags array
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 attachment:
 *                   $ref: '#/components/schemas/Attachment'
 *       400:
 *         description: Bad request - missing file or required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/upload', authenticate, upload.single('file'), AttachmentController.uploadAttachment);

/**
 * @swagger
 * /api/attachments/{recordId}/{category}:
 *   get:
 *     summary: List attachments for a record
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The record ID
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category (or 'all' for all categories)
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
 *         description: Items per page
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by tags
 *     responses:
 *       200:
 *         description: List of attachments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attachments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attachment'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/:recordId/:category', authenticate, AttachmentController.listAttachments);

/**
 * @swagger
 * /api/attachments/details/{id}:
 *   get:
 *     summary: Get attachment details
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The attachment ID
 *     responses:
 *       200:
 *         description: Attachment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attachment'
 *       404:
 *         description: Attachment not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/details/:id', authenticate, AttachmentController.getAttachment);

/**
 * @swagger
 * /api/attachments/file/{id}:
 *   get:
 *     summary: Download attachment file
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The attachment ID
 *     responses:
 *       200:
 *         description: File download
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Attachment or file not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/file/:id', authenticate, AttachmentController.downloadFile);

/**
 * @swagger
 * /api/attachments/{id}:
 *   put:
 *     summary: Update attachment metadata
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The attachment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Updated description
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated tags
 *     responses:
 *       200:
 *         description: Attachment updated successfully
 *       404:
 *         description: Attachment not found
 *       403:
 *         description: Not authorized to update this attachment
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticate, AttachmentController.updateAttachment);

/**
 * @swagger
 * /api/attachments/{id}:
 *   delete:
 *     summary: Delete attachment
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The attachment ID
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *       404:
 *         description: Attachment not found
 *       403:
 *         description: Not authorized to delete this attachment
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, AttachmentController.deleteAttachment);

/**
 * @swagger
 * /api/attachments/stats/{recordId}:
 *   get:
 *     summary: Get attachment statistics for a record
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The record ID
 *     responses:
 *       200:
 *         description: Attachment statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recordId:
 *                   type: string
 *                 totalAttachments:
 *                   type: integer
 *                 totalSize:
 *                   type: integer
 *                 byCategory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       count:
 *                         type: integer
 *                       totalSize:
 *                         type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/stats/:recordId', authenticate, AttachmentController.getAttachmentStats);

export default router;
