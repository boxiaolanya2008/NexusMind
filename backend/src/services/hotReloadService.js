import { prepare } from '../config/database.js';
import logger from '../utils/logger.js';
import { getSystemPrompt } from '../utils/systemPrompts.js';

const modelConfigs = new Map();

export function loadModelConfigs() {
  const sql = 'SELECT model_id, config_key, config_value FROM model_configs';
  const stmt = prepare(sql);
  const configs = stmt.all();
  
  for (const config of configs) {
    const key = `${config.model_id}:${config.config_key}`;
    modelConfigs.set(key, config.config_value);
  }
  
  logger.info(`Loaded ${modelConfigs.size} model configurations`);
}

export function getModelConfig(modelId, configKey) {
  const key = `${modelId}:${configKey}`;
  return modelConfigs.get(key);
}

export function updateModelConfig(modelId, configKey, configValue) {
  const key = `${modelId}:${configKey}`;
  modelConfigs.set(key, configValue);
  
  const sql = `INSERT INTO model_configs (model_id, config_key, config_value, updated_at) VALUES (${modelId}, '${configKey}', '${configValue}', CURRENT_TIMESTAMP)`;
  const stmt = prepare(sql);
  stmt.run();
  
  logger.info(`Updated config ${configKey} for model ${modelId}`);
}

export function getModelSystemPrompt(modelId, modelName) {
  const intelligenceLevel = parseInt(getModelConfig(modelId, 'intelligence_level') || '100');
  const qualityLevel = getModelConfig(modelId, 'quality_level') || 'high';
  const enabledDomains = getModelConfig(modelId, 'enabled_domains');
  
  return getSystemPrompt(modelName, intelligenceLevel, qualityLevel, enabledDomains);
}

export function reloadAllConfigs() {
  loadModelConfigs();
  logger.info('Hot reload: All configurations reloaded');
}
