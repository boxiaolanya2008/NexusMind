import express from 'express';
import { register, login, getProfile, getUserStats } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.get('/stats', authenticateToken, getUserStats);

export default router;
