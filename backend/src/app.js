import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import { initializeDatabase } from './config/database.js';
import { initializeModels } from './config/models.js';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import logger from './utils/logger.js';
import { getQueueStats } from './services/requestQueue.js';
import { loadKnowledgeBase } from './services/knowledgeBaseService.js';

dotenv.config();

function validateEnv() {
  const required = ['JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please set these in your .env file');
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 16) {
    console.error('JWT_SECRET must be at least 16 characters long');
    process.exit(1);
  }
}

validateEnv();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024
}));

app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
});

app.set('trust proxy', true);
app.set('http/2', true);

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/v1', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'NexusMind AI Model Proxy API',
    version: '1.0.0',
    pid: process.pid
  });
});

app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    queue: getQueueStats(),
    pid: process.pid
  };
  res.json(health);
});

app.use((req, res) => {
  logger.warn(`404 - ${req.method} ${req.path} not found`, {
    ip: req.ip
  });
  res.status(404).json({ error: 'Not found', path: req.path });
});

app.use((err, req, res, next) => {
  logger.error(`Error on ${req.method} ${req.path}:`, err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    pid: process.pid
  });
});

async function startServer() {
  try {
    logger.info(`Server ${process.pid} initializing...`);

    logger.info('Initializing database...');
    await initializeDatabase();

    logger.info('Initializing models...');
    await initializeModels();

    logger.info('Loading knowledge base...');
    await loadKnowledgeBase();

    app.listen(PORT, () => {
      logger.info(`Server ${process.pid} listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Server ${process.pid} failed to start:`, error);
    process.exit(1);
  }
}

startServer();
