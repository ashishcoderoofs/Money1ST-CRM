import { Router } from 'express';
import { createApplicant, getApplicants, getApplicantById, updateApplicant, deleteApplicant } from '../controllers/applicantController';

const router = Router();

// Create a new applicant
router.post('/', createApplicant);

// Get all applicants (with pagination/filter)
router.get('/', getApplicants);

// Get an applicant by ID
router.get('/:id', getApplicantById);

// Update an applicant
router.put('/:id', updateApplicant);

// Delete an applicant
router.delete('/:id', deleteApplicant);

export default router; 