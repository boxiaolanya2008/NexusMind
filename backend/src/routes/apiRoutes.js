import express from 'express';
import { getModels, getTools, getMemoryFragments, clearMemoryFragments, chatCompletion } from '../controllers/modelController.js';
import { authenticateApiKey } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/models', getModels);
router.get('/tools', getTools);
router.get('/memory/fragments', authenticateApiKey, getMemoryFragments);
router.delete('/memory/fragments', authenticateApiKey, clearMemoryFragments);
router.post('/chat/completions', authenticateApiKey, chatCompletion);
router.post('/messages', authenticateApiKey, chatCompletion);

export default router;
