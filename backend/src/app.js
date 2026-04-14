import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import { initializeModels } from './config/models.js';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import logger from './utils/logger.js';
import { getQueueStats } from './services/requestQueue.js';
import { loadKnowledgeBase } from './services/knowledgeBaseService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging middleware (no response logging to avoid duplicates)
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/v1', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'NexusMind AI Model Proxy API', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    queue: getQueueStats()
  };
  res.json(health);
});

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - ${req.method} ${req.path} not found`, {
    ip: req.ip
  });
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Error on ${req.method} ${req.path}:`, err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

async function startServer() {
  try {
    logger.info('Initializing database...');
    await initializeDatabase();

    logger.info('Initializing models...');
    await initializeModels();

    logger.info('Loading knowledge base...');
    await loadKnowledgeBase();

    app.listen(PORT, () => {
      logger.info(`NexusMind API server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
