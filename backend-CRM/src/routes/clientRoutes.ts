import { Router } from 'express';
import { createClient, getClients, getClientById, updateClient, deleteClient, searchClients } from '../controllers/clientController';
// import { validateSecuriaClientCreation, validateClientUpdate } from '../middleware/clientValidation';

const router = Router();

// Create a new client
router.post('/', createClient);

// Get all clients (with pagination/filter)
router.get('/', getClients);

// Search clients (must be before :id route)
router.get('/search', searchClients);

// Get a client by ID
router.get('/:id', getClientById);

// Update a client
router.put('/:id', updateClient);

// Delete a client
router.delete('/:id', deleteClient);

export default router; 