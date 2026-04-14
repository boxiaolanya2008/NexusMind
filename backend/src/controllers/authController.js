import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prepare } from '../config/database.js';
import logger from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'nexusmind-secret-key';

export async function register(req, res) {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const apiKey = uuidv4();
    const emailValue = email || 'NULL';
    
    const sql = `
      INSERT INTO users (username, password_hash, email, api_key, role)
      VALUES ('${username}', '${hashedPassword}', '${emailValue}', '${apiKey}', 'user')
    `;
    const stmt = prepare(sql);
    stmt.run();
    
    logger.info(`User registered: ${username}`);
    
    res.status(201).json({ 
      message: 'User registered successfully',
      api_key: apiKey
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint')) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    logger.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const sql = `SELECT * FROM users WHERE username = '${username}'`;
    const stmt = prepare(sql);
    const user = stmt.get();
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (!user.password_hash) {
      logger.error(`User ${username} has no password_hash in database`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    logger.info(`User logged in: ${username}`);
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        role: user.role,
        api_key: user.api_key
      }
    });
  } catch (error) {
    logger.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function getProfile(req, res) {
  try {
    const sql = `SELECT id, username, email, balance, api_key, role, created_at FROM users WHERE id = ${req.user.id}`;
    const stmt = prepare(sql);
    const user = stmt.get();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    logger.error('Get profile failed:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
}

export async function getUserStats(req, res) {
  try {
    const userId = req.user.id;
    
    const requestSql = `SELECT COUNT(*) as total_requests, SUM(prompt_tokens) as total_prompt_tokens, SUM(completion_tokens) as total_completion_tokens, SUM(cost) as total_cost FROM requests WHERE user_id = ${userId}`;
    const requestStmt = prepare(requestSql);
    const requestStats = requestStmt.get();
    
    const totalTokens = (requestStats.total_prompt_tokens || 0) + (requestStats.total_completion_tokens || 0);
    const totalCost = requestStats.total_cost || 0;
    
    const modelStatsSql = `
      SELECT 
        m.display_name as model_name,
        m.provider,
        SUM(r.prompt_tokens + r.completion_tokens) as total_tokens,
        SUM(r.cost) as total_cost,
        COUNT(*) as request_count
      FROM requests r
      JOIN models m ON r.model_id = m.id
      WHERE r.user_id = ${userId}
      GROUP BY r.model_id, m.display_name, m.provider
      ORDER BY total_cost DESC
    `;
    const modelStatsStmt = prepare(modelStatsSql);
    const modelStats = modelStatsStmt.all();
    
    const last30DaysSql = `
      SELECT 
        date(created_at) as day,
        SUM(prompt_tokens + completion_tokens) as daily_tokens,
        SUM(cost) as daily_cost,
        COUNT(*) as daily_requests
      FROM requests 
      WHERE user_id = ${userId} 
      AND created_at >= date('now', '-30 days')
      GROUP BY date(created_at)
      ORDER BY day
    `;
    const last30DaysStmt = prepare(last30DaysSql);
    const last30DaysData = last30DaysStmt.all();
    
    const last30DaysTokens = last30DaysData.reduce((sum, day) => sum + (day.daily_tokens || 0), 0);
    const last30DaysCost = last30DaysData.reduce((sum, day) => sum + (day.daily_cost || 0), 0);
    
    const dailyData = new Array(30).fill(0);
    const dailyCostData = new Array(30).fill(0);
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split('T')[0];
      const dayData = last30DaysData.find(d => d.day === dateStr);
      dailyData[i] = dayData ? (dayData.daily_tokens || 0) : 0;
      dailyCostData[i] = dayData ? (dayData.daily_cost || 0) : 0;
    }
    
    res.json({
      totalRequests: requestStats.total_requests || 0,
      totalTokens: totalTokens,
      totalCost: totalCost,
      last30DaysTokens: last30DaysTokens,
      last30DaysCost: last30DaysCost,
      dailyTokenData: dailyData,
      dailyCostData: dailyCostData,
      modelStats: modelStats
    });
  } catch (error) {
    logger.error('Get user stats failed:', error);
    res.status(500).json({ error: 'Failed to get user stats' });
  }
}
