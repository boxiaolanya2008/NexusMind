import { prepare } from './database.js';
import logger from '../utils/logger.js';
import { readFileSync, watchFile } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MODELS_CONFIG_PATH = join(__dirname, '../../config/models.json');

function loadModelsFromConfig() {
  try {
    const data = readFileSync(MODELS_CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Failed to load models config:', error);
    return [];
  }
}

export async function initializeModels() {
  const models = loadModelsFromConfig();

  for (const model of models) {
    const benchmarks = model.benchmarks || {};

    const existingStmt = prepare('SELECT id FROM models WHERE name = ?');
    const existing = existingStmt.get(model.name);

    if (existing && existing.id) {
      const updateStmt = prepare(`
        UPDATE models SET
          display_name = ?,
          provider = ?,
          input_price = ?,
          output_price = ?,
          api_format = ?,
          intelligence_level = ?,
          quality_level = ?,
          logo_url = ?,
          swe_bench = ?,
          arc_agi = ?,
          gpqa = ?,
          mmlu = ?
        WHERE name = ?
      `);
      updateStmt.run(
        model.display_name,
        model.provider,
        model.input_price,
        model.output_price,
        model.api_format,
        model.intelligence_level,
        model.quality_level,
        model.logo_url,
        benchmarks.swe_bench || 0,
        benchmarks.arc_agi || 0,
        benchmarks.gpqa || 0,
        benchmarks.mmlu || 0,
        model.name
      );
    } else {
      const insertStmt = prepare(`
        INSERT INTO models
        (name, display_name, provider, input_price, output_price, api_format, intelligence_level, quality_level, logo_url, swe_bench, arc_agi, gpqa, mmlu)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertStmt.run(
        model.name,
        model.display_name,
        model.provider,
        model.input_price,
        model.output_price,
        model.api_format,
        model.intelligence_level,
        model.quality_level,
        model.logo_url,
        benchmarks.swe_bench || 0,
        benchmarks.arc_agi || 0,
        benchmarks.gpqa || 0,
        benchmarks.mmlu || 0
      );
    }
  }

  logger.info(`Initialized ${models.length} models from config file`);
}

export function enableHotReload() {
  watchFile(MODELS_CONFIG_PATH, { interval: 1000 }, async () => {
    logger.info('Models config file changed, reloading...');
    try {
      await initializeModels();
      logger.info('Models config reloaded successfully');
    } catch (error) {
      logger.error('Failed to reload models config:', error);
    }
  });
  logger.info('Models config hot reload enabled');
}
