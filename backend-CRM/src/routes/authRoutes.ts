import { Router } from 'express';
import { register, login, getProfile, logout } from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRegistration, validateLogin } from '../middleware/validation';

const router = Router();
router.post('/login', validateLogin, login);
router.post('/register', authenticate, authorize('Admin'), validateRegistration, register);
router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);

export default router;
