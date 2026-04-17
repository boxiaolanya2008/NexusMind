import { prepare } from './database.js';
import logger from '../utils/logger.js';

export async function initializeModels() {
  const models = [
    {
      name: 'gpt-5.4',
      display_name: 'GPT-5.4',
      provider: 'OpenAI',
      input_price: 2.5,
      output_price: 15.0,
      api_format: 'openai',
      intelligence_level: 98,
      quality_level: 'high',
      logo_url: '/logos/openai.svg',
      benchmarks: {
        swe_bench: 57.7,
        arc_agi: 97.6,
        gpqa: 92.0,
        mmlu: 95.2
      }
    },
    {
      name: 'claude-4.6-opus',
      display_name: 'Claude 4.6 Opus',
      provider: 'Anthropic',
      input_price: 15.0,
      output_price: 75.0,
      api_format: 'anthropic',
      intelligence_level: 99,
      quality_level: 'high',
      logo_url: '/logos/anthropic.svg',
      benchmarks: {
        swe_bench: 80.8,
        arc_agi: 95.4,
        gpqa: 91.3,
        mmlu: 97.6
      }
    },
    {
      name: 'claude-4.6-sonnet',
      display_name: 'Claude 4.6 Sonnet',
      provider: 'Anthropic',
      input_price: 3.0,
      output_price: 15.0,
      api_format: 'anthropic',
      intelligence_level: 95,
      quality_level: 'high',
      logo_url: '/logos/anthropic.svg',
      benchmarks: {
        swe_bench: 79.6,
        arc_agi: 93.8,
        gpqa: 89.9,
        mmlu: 97.8
      }
    },
    {
      name: 'gemini-3.1-ultra',
      display_name: 'Gemini 3.1 Ultra',
      provider: 'Google',
      input_price: 2.0,
      output_price: 12.0,
      api_format: 'google',
      intelligence_level: 99,
      quality_level: 'high',
      logo_url: '/logos/google.svg',
      benchmarks: {
        swe_bench: 54.2,
        arc_agi: 77.1,
        gpqa: 94.3,
        mmlu: 96.8
      }
    },
    {
      name: 'gemini-3.1-pro',
      display_name: 'Gemini 3.1 Pro',
      provider: 'Google',
      input_price: 2.0,
      output_price: 12.0,
      api_format: 'google',
      intelligence_level: 96,
      quality_level: 'high',
      logo_url: '/logos/google.svg',
      benchmarks: {
        swe_bench: 63.8,
        arc_agi: 75.1,
        gpqa: 94.1,
        mmlu: 95.4
      }
    },
    {
      name: 'grok-4',
      display_name: 'Grok 4',
      provider: 'xAI',
      input_price: 2.0,
      output_price: 15.0,
      api_format: 'openai',
      intelligence_level: 96,
      quality_level: 'high',
      logo_url: '/logos/xai.svg',
      benchmarks: {
        swe_bench: 75.0,
        arc_agi: 92.3,
        gpqa: 88.0,
        mmlu: 94.5
      }
    },
    {
      name: 'glm-5.1',
      display_name: 'GLM-5.1',
      provider: 'Zhipu AI',
      input_price: 0.5,
      output_price: 2.0,
      api_format: 'openai',
      intelligence_level: 94,
      quality_level: 'high',
      logo_url: '/logos/zhipu.svg',
      benchmarks: {
        swe_bench: 58.4,
        arc_agi: 88.7,
        gpqa: 86.2,
        mmlu: 92.1
      }
    },
    {
      name: 'qwen-3.5',
      display_name: 'Qwen 3.5',
      provider: 'Alibaba Qwen',
      input_price: 0.8,
      output_price: 2.0,
      api_format: 'openai',
      intelligence_level: 92,
      quality_level: 'high',
      logo_url: '/logos/qwen.svg',
      benchmarks: {
        swe_bench: 56.2,
        arc_agi: 85.4,
        gpqa: 83.7,
        mmlu: 89.6
      }
    },
    {
      name: 'mistral-small-4',
      display_name: 'Mistral Small 4',
      provider: 'Mistral AI',
      input_price: 0.2,
      output_price: 0.6,
      api_format: 'openai',
      intelligence_level: 88,
      quality_level: 'high',
      logo_url: '/logos/mistral.svg',
      benchmarks: {
        swe_bench: 52.8,
        arc_agi: 82.1,
        gpqa: 78.4,
        mmlu: 85.7
      }
    },
    {
      name: 'llama-4',
      display_name: 'Llama 4',
      provider: 'Meta',
      input_price: 0.3,
      output_price: 0.9,
      api_format: 'openai',
      intelligence_level: 90,
      quality_level: 'high',
      logo_url: '/logos/meta.svg',
      benchmarks: {
        swe_bench: 54.6,
        arc_agi: 84.3,
        gpqa: 81.2,
        mmlu: 87.8
      }
    }
  ];

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

  logger.info(`Initialized ${models.length} models`);
}
