import { Router } from 'express';
import { createClient, getClients, getClientById, updateClient, deleteClient } from '../controllers/clientController';
import { validateSecuriaClientCreation, validateClientUpdate } from '../middleware/clientValidation';

const router = Router();

// Create a new client
router.post('/', validateSecuriaClientCreation, createClient);

// Get all clients (with pagination/filter)
router.get('/', getClients);

// Get a client by ID
router.get('/:id', getClientById);

// Update a client
router.put('/:id', validateClientUpdate, updateClient);

// Delete a client
router.delete('/:id', deleteClient);

export default router; 