import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgeBasePath = process.env.KNOWLEDGE_BASE_PATH || path.join(__dirname, '../../knowledge_base');
const knowledgeBase = new Map();
const MIN_RELEVANCE_SCORE = 1;

export async function loadKnowledgeBase() {
  try {
    if (!fs.existsSync(knowledgeBasePath)) {
      fs.mkdirSync(knowledgeBasePath, { recursive: true });
      logger.info(`Created knowledge base directory: ${knowledgeBasePath}`);
      return;
    }

    const files = await fs.promises.readdir(knowledgeBasePath);
    let totalEntries = 0;

    for (const file of files) {
      if (file.startsWith('RAG-') && file.endsWith('.json')) {
        const filePath = path.join(knowledgeBasePath, file);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);

        if (data.entries && Array.isArray(data.entries)) {
          for (const entry of data.entries) {
            const key = `${file}:${entry.id}`;
            knowledgeBase.set(key, {
              ...entry,
              source: file,
              name: data.name,
              version: data.version
            });
            totalEntries++;
          }
        }
      }
    }

    logger.info(`Loaded ${totalEntries} knowledge entries from ${files.length} files`);
  } catch (error) {
    logger.error('Failed to load knowledge base:', error);
  }
}

export function searchKnowledgeBase(query, limit = 5) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/\s+/).filter(t => t.length > 2);

  const scored = [...knowledgeBase].map(([key, entry]) => {
    const contentLower = entry.content.toLowerCase();
    const tagsLower = (entry.tags || []).join(' ').toLowerCase();

    let score = 0;
    queryTokens.forEach(token => {
      if (contentLower.includes(token)) score += 1;
      if (tagsLower.includes(token)) score += 0.5;
      if (contentLower.startsWith(token)) score += 1.5;
      if (contentLower.includes(token + ' ')) score += 0.3;
    });

    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const filtered = scored.filter(s => s.score >= MIN_RELEVANCE_SCORE);
  const limited = filtered.slice(0, limit);

  logger.debug(`RAG search: query="${query.substring(0, 50)}...", found=${limited.length}, scores=${limited.map(s => s.score).join(',')}`);

  return limited.map(s => s.entry);
}

export function getKnowledgeEntry(file, entryId) {
  const key = `${file}:${entryId}`;
  return knowledgeBase.get(key);
}

export async function reloadKnowledgeBase() {
  knowledgeBase.clear();
  await loadKnowledgeBase();
  logger.info('Hot reload: Knowledge base reloaded');
}

export function getKnowledgeBaseStats() {
  return {
    totalEntries: knowledgeBase.size,
    files: [...new Set([...knowledgeBase.values()].map(e => e.source))]
  };
}
