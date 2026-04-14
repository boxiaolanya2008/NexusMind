import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

export const apiLimiter = rateLimit({
  windowMs: windowMs,
  max: maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later'
    });
  }
});

const userLimits = new Map();

export function tokenRateLimit(req, res, next) {
  const userId = req.user.id;
  const maxTokens = parseInt(process.env.RATE_LIMIT_MAX_TOKENS || '10000000');
  
  if (!userLimits.has(userId)) {
    userLimits.set(userId, { tokens: 0, resetTime: Date.now() + windowMs });
  }
  
  const userLimit = userLimits.get(userId);
  
  if (Date.now() > userLimit.resetTime) {
    userLimits.set(userId, { tokens: 0, resetTime: Date.now() + windowMs });
  }
  
  const estimatedTokens = req.body.estimated_tokens || 1000;
  
  if (userLimit.tokens + estimatedTokens > maxTokens) {
    logger.warn(`Token rate limit exceeded for user ${userId}`);
    return res.status(429).json({
      error: 'Token rate limit exceeded, please try again later'
    });
  }
  
  userLimit.tokens += estimatedTokens;
  next();
}
