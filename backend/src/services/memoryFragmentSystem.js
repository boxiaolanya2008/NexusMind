import logger from '../utils/logger.js';
import { prepare } from '../config/database.js';
import { MemoryFragment } from './memoryFragment.js';

const MAX_FRAGMENTS_PER_USER = 1000;
const FRAGMENT_RETENTION_DAYS = 30;

class MemoryFragmentSystem {
  constructor() {
    this.userFragments = new Map();
    this.fragmentIndex = new Map();
    this.contentHashIndex = new Map();
  }

  createFragment(content, type = 'message', metadata = {}, userId) {
    const fragment = new MemoryFragment(content, type, metadata);

    if (!fragment.validateContent(content)) {
      logger.debug('Fragment content validation failed, skipping', { 
        contentLength: content?.length,
        type 
      });
      return null;
    }

    const hashKey = `${userId}_${fragment.contentHash}`;
    if (this.contentHashIndex.has(hashKey)) {
      logger.debug('Duplicate fragment detected, skipping', { 
        contentHash: fragment.contentHash,
        type 
      });
      const existingFragment = this.contentHashIndex.get(hashKey);
      existingFragment.updateImportanceWithSync(0.05, userId);
      return existingFragment;
    }

    if (!this.userFragments.has(userId)) {
      this.userFragments.set(userId, []);
    }

    const fragments = this.userFragments.get(userId);
    fragments.push(fragment);
    this.contentHashIndex.set(hashKey, fragment);

    if (fragments.length > MAX_FRAGMENTS_PER_USER) {
      this.evictLeastImportant(userId);
    }

    this.indexFragment(fragment, userId);
    this.saveFragmentToDatabase(fragment, userId);
    logger.debug(`Created fragment ${fragment.id} for user ${userId}`, { type, importance: fragment.importance });

    return fragment;
  }

  saveFragmentToDatabase(fragment, userId) {
    try {
      logger.debug('Saving fragment to database', { 
        fragmentId: fragment.id, 
        contentType: typeof fragment.content,
        contentLength: fragment.content?.length,
        contentValue: fragment.content
      });
      
      if (!fragment.content || fragment.content.trim().length === 0) {
        logger.warn('Skipping fragment with empty content', { fragmentId: fragment.id });
        return;
      }
      
      const contentStr = String(fragment.content);
      const tags = fragment.metadata.keywords.join(',') || '';
      const fragmentType = fragment.type || 'message';
      const importance = fragment.importance ?? 0.5;
      const accessCount = fragment.accessCount ?? 0;
      const lastAccessed = new Date(fragment.lastAccessed || Date.now()).toISOString();
      
      logger.debug('Executing database insert', { 
        userId, 
        fragmentId: fragment.id, 
        contentStr: contentStr.substring(0, 100),
        fragmentType,
        importance,
        tags
      });
      
      const stmt = prepare(`
        INSERT OR REPLACE INTO knowledge_base 
        (user_id, fragment_id, content, fragment_type, importance, tags, access_count, last_accessed, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      stmt.run(
        userId,
        fragment.id,
        contentStr,
        fragmentType,
        importance,
        tags,
        accessCount,
        lastAccessed
      );
    } catch (error) {
      logger.error('Failed to save fragment to database:', { 
        error: error.message,
        fragmentId: fragment.id,
        contentType: typeof fragment.content,
        content: fragment.content
      });
    }
  }

  loadFragmentsFromDatabase(userId) {
    try {
      const stmt = prepare(`
        SELECT fragment_id, content, fragment_type, importance, tags, access_count, last_accessed
        FROM knowledge_base
        WHERE user_id = ?
        ORDER BY importance DESC, last_accessed DESC
      `);
      const rows = stmt.all(userId);
      
      const fragments = rows.map(row => {
        const fragment = new MemoryFragment(row.content, row.fragment_type, {
          keywords: row.tags ? row.tags.split(',') : []
        });
        fragment.id = row.fragment_id;
        fragment.importance = row.importance;
        fragment.accessCount = row.access_count || 0;
        fragment.lastAccessed = row.last_accessed ? new Date(row.last_accessed).getTime() : Date.now();
        return fragment;
      });
      
      this.userFragments.set(userId, fragments);
      fragments.forEach(f => this.indexFragment(f, userId));
      
      logger.info(`Loaded ${fragments.length} fragments from database for user ${userId}`);
      return fragments;
    } catch (error) {
      logger.error('Failed to load fragments from database:', error);
      return [];
    }
  }

  indexFragment(fragment, userId) {
    const keywords = fragment.metadata.keywords;
    keywords.forEach(keyword => {
      if (!this.fragmentIndex.has(keyword)) {
        this.fragmentIndex.set(keyword, []);
      }
      this.fragmentIndex.get(keyword).push({ fragmentId: fragment.id, userId });
    });
  }

  evictLeastImportant(userId) {
    const fragments = this.userFragments.get(userId);
    if (!fragments || fragments.length === 0) return;
    
    fragments.sort((a, b) => {
      const scoreA = a.importance * (1 + a.accessCount * 0.01);
      const scoreB = b.importance * (1 + b.accessCount * 0.01);
      return scoreA - scoreB;
    });
    
    const evicted = fragments.shift();
    this.removeFragment(evicted.id, userId);
    logger.debug(`Evicted fragment ${evicted.id} due to capacity limit`);
  }

  removeFragment(fragmentId, userId) {
    const fragments = this.userFragments.get(userId);
    if (!fragments) return;

    const index = fragments.findIndex(f => f.id === fragmentId);
    if (index !== -1) {
      const fragment = fragments[index];
      
      const hashKey = `${userId}_${fragment.contentHash}`;
      this.contentHashIndex.delete(hashKey);
      
      fragment.metadata.keywords.forEach(keyword => {
        const indexed = this.fragmentIndex.get(keyword);
        if (indexed) {
          const idx = indexed.findIndex(i => i.fragmentId === fragmentId);
          if (idx !== -1) indexed.splice(idx, 1);
        }
      });
      fragments.splice(index, 1);
    }
  }

  searchFragments(query, userId, limit = 10) {
    const queryKeywords = query.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const fragments = this.userFragments.get(userId) || [];
    
    const scored = fragments.map(fragment => {
      let score = 0;
      
      queryKeywords.forEach(keyword => {
        if (fragment.content.toLowerCase().includes(keyword)) score += 1;
        if (fragment.metadata.keywords.includes(keyword)) score += 0.5;
      });
      
      const recencyBoost = Math.max(0, 1 - (Date.now() - fragment.timestamp) / (7 * 24 * 60 * 60 * 1000));
      score += fragment.importance * 2 + recencyBoost + fragment.accessCount * 0.01;
      
      return { fragment, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    
    return scored.slice(0, limit).map(s => s.fragment);
  }

  getRelevantFragments(userId, maxTokens = 30000) {
    const fragments = this.userFragments.get(userId) || [];

    if (fragments.length === 0) {
      this.loadFragmentsFromDatabase(userId);
    }

    this.applyTimeBasedDecay(userId);

    const sorted = [...fragments].sort((a, b) => {
      const scoreA = a.importance * (1 + a.accessCount * 0.01);
      const scoreB = b.importance * (1 + b.accessCount * 0.01);
      return scoreB - scoreA;
    });

    const selected = [];
    let totalTokens = 0;

    for (const fragment of sorted) {
      if (totalTokens + fragment.metadata.tokens > maxTokens) break;
      selected.push(fragment);
      totalTokens += fragment.metadata.tokens;
      fragment.updateImportanceWithSync(0.01, userId);
    }

    logger.debug(`Retrieved ${selected.length} fragments for user ${userId}`, { totalTokens });

    this.smartFragmentCleanup(userId);

    return selected;
  }

  applyTimeBasedDecay(userId) {
    const fragments = this.userFragments.get(userId);
    if (!fragments) return;
    
    fragments.forEach(fragment => fragment.decayImportance());
  }

  consolidateFragments(userId, threshold = 0.3) {
    const fragments = this.userFragments.get(userId);
    if (!fragments || fragments.length < 2) return;

    const lowImportance = fragments.filter(f => f.importance < threshold);

    if (lowImportance.length < 5) return;

    const summary = lowImportance.map(f => f.content.substring(0, 100)).join('; ');
    const summaryFragment = this.createFragment(
      `[SUMMARY OF ${lowImportance.length} LOW-IMPORTANCE FRAGMENTS] ${summary}`,
      'summary',
      { consolidatedCount: lowImportance.length },
      userId
    );

    lowImportance.forEach(f => this.removeFragment(f.id, userId));

    logger.info(`Consolidated ${lowImportance.length} fragments for user ${userId}`);
  }

  autoConsolidate(userId) {
    const fragments = this.userFragments.get(userId);
    if (!fragments) return 0;

    const originalCount = fragments.length;

    if (fragments.length > MAX_FRAGMENTS_PER_USER * 0.8) {
      this.consolidateFragments(userId, 0.4);
    } else if (fragments.length > MAX_FRAGMENTS_PER_USER * 0.6) {
      this.consolidateFragments(userId, 0.3);
    }

    const removedCount = originalCount - fragments.length;
    return removedCount;
  }

  cleanupExpiredFragments(userId) {
    const fragments = this.userFragments.get(userId);
    if (!fragments) return 0;

    const cutoffTime = Date.now() - (FRAGMENT_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const expired = fragments.filter(f => f.timestamp < cutoffTime && f.importance < 0.5);

    expired.forEach(f => this.removeFragment(f.id, userId));

    if (expired.length > 0) {
      logger.info(`Cleaned up ${expired.length} expired fragments for user ${userId}`);
    }

    return expired.length;
  }

  smartFragmentCleanup(userId) {
    let removed = 0;
    removed += this.cleanupExpiredFragments(userId);
    removed += this.autoConsolidate(userId);
    return removed;
  }

  getUserStats(userId) {
    const fragments = this.userFragments.get(userId) || [];
    
    const byType = fragments.reduce((acc, f) => {
      acc[f.type] = (acc[f.type] || 0) + 1;
      return acc;
    }, {});
    
    const totalTokens = fragments.reduce((sum, f) => sum + f.metadata.tokens, 0);
    const avgImportance = fragments.length > 0 
      ? fragments.reduce((sum, f) => sum + f.importance, 0) / fragments.length 
      : 0;
    
    return {
      totalFragments: fragments.length,
      byType,
      totalTokens,
      avgImportance,
      oldestTimestamp: fragments.length > 0 ? Math.min(...fragments.map(f => f.timestamp)) : null,
      newestTimestamp: fragments.length > 0 ? Math.max(...fragments.map(f => f.timestamp)) : null
    };
  }

  clearUserFragments(userId) {
    const fragments = this.userFragments.get(userId);
    if (fragments) {
      fragments.forEach(f => {
        const hashKey = `${userId}_${f.contentHash}`;
        this.contentHashIndex.delete(hashKey);

        f.metadata.keywords.forEach(keyword => {
          const indexed = this.fragmentIndex.get(keyword);
          if (indexed) {
            const idx = indexed.findIndex(i => i.fragmentId === f.id && i.userId === userId);
            if (idx !== -1) indexed.splice(idx, 1);
          }
        });
      });
    }
    this.userFragments.delete(userId);
    logger.info(`Cleared all fragments for user ${userId}`);
  }

  exportFragments(userId) {
    const fragments = this.userFragments.get(userId) || [];
    return fragments.map(f => f.toJSON());
  }

  importFragments(userId, fragmentData) {
    fragmentData.forEach(data => {
      const fragment = new MemoryFragment(data.content, data.type, data.metadata);
      fragment.id = data.id;
      fragment.importance = data.importance;
      fragment.timestamp = data.timestamp;
      fragment.accessCount = data.accessCount;
      fragment.lastAccessed = data.lastAccessed;
      
      if (!this.userFragments.has(userId)) {
        this.userFragments.set(userId, []);
      }
      
      this.userFragments.get(userId).push(fragment);
      this.indexFragment(fragment, userId);
    });
    
    logger.info(`Imported ${fragmentData.length} fragments for user ${userId}`);
  }
}

const fragmentSystem = new MemoryFragmentSystem();

export default fragmentSystem;
export { MemoryFragmentSystem, MAX_FRAGMENTS_PER_USER, FRAGMENT_RETENTION_DAYS };
export { MemoryFragment } from './memoryFragment.js';
