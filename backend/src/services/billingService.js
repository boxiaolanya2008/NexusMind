import { prepare } from '../config/database.js';
import logger from '../utils/logger.js';

export function calculateCost(modelId, inputTokens, outputTokens) {
  const sql = `SELECT input_price, output_price FROM models WHERE id = ${modelId}`;
  const stmt = prepare(sql);
  const model = stmt.get();
  
  if (!model) {
    logger.error(`Model not found: ${modelId}`);
    return 0;
  }
  
  const inputCost = (inputTokens / 1000000) * model.input_price;
  const outputCost = (outputTokens / 1000000) * model.output_price;
  
  return inputCost + outputCost;
}

export function checkBalance(userId, estimatedCost) {
  const sql = `SELECT balance FROM users WHERE id = ${userId}`;
  const stmt = prepare(sql);
  const user = stmt.get();
  
  if (!user) {
    return { sufficient: false, balance: 0, message: 'User not found' };
  }
  
  if (user.balance < estimatedCost) {
    return { 
      sufficient: false, 
      balance: user.balance, 
      estimatedCost,
      message: '余额不足，请先充值' 
    };
  }
  
  return { sufficient: true, balance: user.balance, estimatedCost };
}

export function deductBalance(userId, amount, modelId, promptTokens, completionTokens) {
  logger.info(`DeductBalance called: userId=${userId}, amount=${amount}, modelId=${modelId}, promptTokens=${promptTokens}, completionTokens=${completionTokens}`);
  
  const sql = `UPDATE users SET balance = balance - ${amount} WHERE id = ${userId}`;
  const stmt = prepare(sql);
  stmt.run();
  
  const requestSql = `INSERT INTO requests (user_id, model_id, prompt_tokens, completion_tokens, input_tokens, output_tokens, cost) VALUES (${userId}, ${modelId}, ${promptTokens}, ${completionTokens}, ${promptTokens}, ${completionTokens}, ${amount})`;
  const requestStmt = prepare(requestSql);
  requestStmt.run();
  
  const transactionSql = `INSERT INTO transactions (user_id, amount, type, description) VALUES (${userId}, ${-amount}, 'consume', 'Model usage: ${promptTokens} prompt, ${completionTokens} completion tokens')`;
  const transactionStmt = prepare(transactionSql);
  transactionStmt.run();
  
  logger.info(`Deducted ${amount} from user ${userId}, tokens: ${promptTokens} prompt, ${completionTokens} completion`);
}

export function addBalance(userId, amount, description) {
  const sql = `UPDATE users SET balance = balance + ${amount} WHERE id = ${userId}`;
  const stmt = prepare(sql);
  stmt.run();
  
  const transactionSql = `INSERT INTO transactions (user_id, amount, type, description) VALUES (${userId}, ${amount}, 'deposit', '${description || 'Manual deposit'}')`;
  const transactionStmt = prepare(transactionSql);
  transactionStmt.run();
  
  logger.info(`Added ${amount} to user ${userId}`);
}

export function getUserBalance(userId) {
  const sql = `SELECT balance FROM users WHERE id = ${userId}`;
  const stmt = prepare(sql);
  const user = stmt.get();
  
  return user ? user.balance : 0;
}
