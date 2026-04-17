import logger from '../utils/logger.js';
import { prepare } from '../config/database.js';
import crypto from 'crypto';

const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 10000;

export class MemoryFragment {
  constructor(content, type = 'message', metadata = {}) {
    this.id = this.generateId();
    this.content = content;
    this.type = type;
    this.importance = this.calculateInitialImportance(type, metadata);
    this.timestamp = Date.now();
    this.accessCount = 0;
    this.lastAccessed = Date.now();
    this.contentHash = this.generateContentHash(content);
    this.metadata = {
      ...metadata,
      tokens: this.estimateTokens(content),
      keywords: this.extractKeywords(content)
    };
    this.embeddings = null;
  }

  generateId() {
    return `frag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateContentHash(content) {
    return crypto.createHash('md5').update(content).digest('hex');
  }

  validateContent(content) {
    if (!content || typeof content !== 'string') return false;
    const trimmed = content.trim();
    if (trimmed.length < MIN_CONTENT_LENGTH) return false;
    if (trimmed.length > MAX_CONTENT_LENGTH) return false;
    if (trimmed.match(/^[\s\n\r]*$/)) return false;
    return true;
  }

  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }

  extractKeywords(text) {
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  calculateInitialImportance(type, metadata) {
    const baseImportance = {
      'system': 0.9,
      'tool_call': 0.8,
      'code': 0.85,
      'error': 0.75,
      'decision': 0.8,
      'question': 0.6,
      'answer': 0.7,
      'message': 0.5
    };

    let importance = baseImportance[type] || 0.5;

    if (metadata.isCritical) importance += 0.1;
    if (metadata.isRepeated) importance -= 0.1;
    if (metadata.userExplicit) importance += 0.15;

    return Math.min(1, Math.max(0, importance));
  }

  updateImportance(delta = 0) {
    this.importance = Math.min(1, Math.max(0, this.importance + delta));
    this.lastAccessed = Date.now();
    this.accessCount++;
  }

  updateImportanceWithSync(delta = 0, userId) {
    this.updateImportance(delta);
    this.saveToDatabase(userId);
  }

  decayImportance() {
    const hoursSinceAccess = (Date.now() - this.lastAccessed) / (1000 * 60 * 60);
    const decayRate = hoursSinceAccess / 24;
    this.importance = Math.max(0.1, this.importance * (1 - decayRate * 0.1));
  }

  saveToDatabase(userId) {
    try {
      const tags = this.metadata.keywords.join(',');
      const stmt = prepare(`
        UPDATE knowledge_base
        SET importance = ?, access_count = ?, last_accessed = ?, updated_at = CURRENT_TIMESTAMP
        WHERE fragment_id = ? AND user_id = ?
      `);
      stmt.run(
        this.importance,
        this.accessCount,
        new Date(this.lastAccessed).toISOString(),
        this.id,
        userId
      );
    } catch (error) {
      logger.error('Failed to update fragment in database:', error);
    }
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      type: this.type,
      importance: this.importance,
      timestamp: this.timestamp,
      accessCount: this.accessCount,
      lastAccessed: this.lastAccessed,
      metadata: this.metadata
    };
  }
}
