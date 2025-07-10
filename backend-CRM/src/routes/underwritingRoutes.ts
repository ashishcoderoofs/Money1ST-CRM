import express from 'express';
import { 
  createUnderwriting, 
  getUnderwritings, 
  getUnderwritingById, 
  updateUnderwriting, 
  deleteUnderwriting 
} from '../controllers/underwritingController';

const router = express.Router();

// Create underwriting
router.post('/', createUnderwriting);

// Get all underwritings with pagination
router.get('/', getUnderwritings);

// Get underwriting by ID or client_id
router.get('/:id', getUnderwritingById);

// Update underwriting by ID or client_id
router.put('/:id', updateUnderwriting);

// Delete underwriting by ID
router.delete('/:id', deleteUnderwriting);

export default router; 