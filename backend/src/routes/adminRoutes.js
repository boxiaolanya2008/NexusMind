import express from 'express';
import { 
  getUsers, 
  deleteUser, 
  addUserBalance, 
  getRequests, 
  getStats,
  updateModelConfigHandler,
  reloadConfigs,
  getKnowledgeBaseStatsHandler,
  updateModelIntelligence
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', authenticateToken, getUsers);
router.delete('/users/:userId', authenticateToken, deleteUser);
router.post('/add-balance', authenticateToken, addUserBalance);
router.get('/requests', authenticateToken, getRequests);
router.get('/stats', authenticateToken, getStats);
router.post('/model-config', authenticateToken, updateModelConfigHandler);
router.post('/reload-configs', authenticateToken, reloadConfigs);
router.get('/knowledge-base-stats', authenticateToken, getKnowledgeBaseStatsHandler);
router.post('/model-intelligence', authenticateToken, updateModelIntelligence);

export default router;
