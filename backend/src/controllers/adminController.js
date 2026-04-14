import { prepare } from '../config/database.js';
import logger from '../utils/logger.js';
import { addBalance } from '../services/billingService.js';
import { updateModelConfig, reloadAllConfigs } from '../services/hotReloadService.js';
import { reloadKnowledgeBase, getKnowledgeBaseStats } from '../services/knowledgeBaseService.js';

export async function getUsers(req, res) {
  try {
    const sql = 'SELECT id, username, email, balance, role, created_at FROM users';
    const stmt = prepare(sql);
    const users = stmt.all();
    
    res.json(users);
  } catch (error) {
    logger.error('Get users failed:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    
    const sql = `DELETE FROM users WHERE id = ${userId}`;
    const stmt = prepare(sql);
    stmt.run();
    
    logger.info(`User deleted: ${userId}`);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user failed:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

export async function addUserBalance(req, res) {
  try {
    const { userId, amount, description } = req.body;
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied' });
    }
    
    addBalance(userId, amount, description);
    
    res.json({ message: 'Balance added successfully' });
  } catch (error) {
    logger.error('Add balance failed:', error);
    res.status(500).json({ error: 'Failed to add balance' });
  }
}

export async function getRequests(req, res) {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const sql = `
      SELECT r.*, u.username, m.display_name as model_name
      FROM requests r
      JOIN users u ON r.user_id = u.id
      JOIN models m ON r.model_id = m.id
      ORDER BY r.created_at DESC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;
    const stmt = prepare(sql);
    const requests = stmt.all();
    
    res.json(requests);
  } catch (error) {
    logger.error('Get requests failed:', error);
    res.status(500).json({ error: 'Failed to get requests' });
  }
}

export async function getStats(req, res) {
  try {
    const userSql = 'SELECT COUNT(*) as count FROM users';
    const userStmt = prepare(userSql);
    const userCount = userStmt.get().count;
    
    const requestSql = 'SELECT COUNT(*) as count FROM requests';
    const requestStmt = prepare(requestSql);
    const requestCount = requestStmt.get().count;
    
    const revenueSql = 'SELECT SUM(amount) as total FROM transactions WHERE type = "consume"';
    const revenueStmt = prepare(revenueSql);
    const revenue = revenueStmt.get().total || 0;
    
    const costSql = `
      SELECT SUM(cost) as total 
      FROM requests 
      WHERE created_at >= datetime('now', '-30 days')
    `;
    const costStmt = prepare(costSql);
    const recentCost = costStmt.get().total || 0;
    
    res.json({
      total_users: userCount,
      total_requests: requestCount,
      total_revenue: Math.abs(revenue),
      recent_cost: recentCost
    });
  } catch (error) {
    logger.error('Get stats failed:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
}

export async function updateModelConfigHandler(req, res) {
  try {
    const { modelId, configKey, configValue } = req.body;
    
    updateModelConfig(modelId, configKey, configValue);
    
    res.json({ message: 'Model config updated successfully' });
  } catch (error) {
    logger.error('Update model config failed:', error);
    res.status(500).json({ error: 'Failed to update model config' });
  }
}

export async function reloadConfigs(req, res) {
  try {
    reloadAllConfigs();
    await reloadKnowledgeBase();

    res.json({ message: 'All configurations reloaded successfully' });
  } catch (error) {
    logger.error('Reload configs failed:', error);
    res.status(500).json({ error: 'Failed to reload configs' });
  }
}

export async function getKnowledgeBaseStatsHandler(req, res) {
  try {
    const stats = getKnowledgeBaseStats();
    
    res.json(stats);
  } catch (error) {
    logger.error('Get knowledge base stats failed:', error);
    res.status(500).json({ error: 'Failed to get knowledge base stats' });
  }
}

export async function updateModelIntelligence(req, res) {
  try {
    const { modelId, intelligenceLevel, qualityLevel, enabledDomains } = req.body;
    
    if (intelligenceLevel !== undefined) {
      updateModelConfig(modelId, 'intelligence_level', intelligenceLevel.toString());
      // 同时更新models表中的intelligence_level字段
      const updateSql = `UPDATE models SET intelligence_level = ${intelligenceLevel} WHERE id = ${modelId}`;
      const stmt = prepare(updateSql);
      stmt.run();
    }
    
    if (qualityLevel) {
      updateModelConfig(modelId, 'quality_level', qualityLevel);
      // 同时更新models表中的quality_level字段
      const updateSql = `UPDATE models SET quality_level = '${qualityLevel}' WHERE id = ${modelId}`;
      const stmt = prepare(updateSql);
      stmt.run();
    }
    
    if (enabledDomains) {
      updateModelConfig(modelId, 'enabled_domains', JSON.stringify(enabledDomains));
    }
    
    res.json({ message: 'Model intelligence updated successfully' });
  } catch (error) {
    logger.error('Update model intelligence failed:', error);
    res.status(500).json({ error: 'Failed to update model intelligence' });
  }
}
