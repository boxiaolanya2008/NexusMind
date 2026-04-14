import logger from '../utils/logger.js';

const MAX_CONTEXT_TOKENS = 100000;
const SUMMARY_THRESHOLD = 80000;
const MIN_RECENT_MESSAGES = 10;

class MemoryManager {
  constructor() {
    this.conversationSummaries = new Map();
    this.messageTokenCache = new Map();
  }

  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }

  estimateMessageTokens(message) {
    const cacheKey = `${message.role}_${message.content?.substring(0, 100)}`;
    if (this.messageTokenCache.has(cacheKey)) {
      return this.messageTokenCache.get(cacheKey);
    }
    
    const tokens = this.estimateTokens(
      (message.role || '') + (message.content || '') + (message.tool_calls ? JSON.stringify(message.tool_calls) : '')
    );
    this.messageTokenCache.set(cacheKey, tokens);
    return tokens;
  }

  estimateConversationTokens(messages) {
    return messages.reduce((sum, msg) => sum + this.estimateMessageTokens(msg), 0);
  }

  async summarizeConversation(messages, userId) {
    const summary = {
      original_count: messages.length,
      summary: '',
      key_points: [],
      timestamp: Date.now()
    };

    const userMessages = messages.filter(m => m.role === 'user');
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    
    summary.key_points = userMessages.slice(0, 5).map(m => ({
      role: m.role,
      content: m.content?.substring(0, 200) || ''
    }));

    summary.summary = `Conversation had ${messages.length} messages (${userMessages.length} user, ${assistantMessages.length} assistant). ` +
      `Key topics discussed: ${summary.key_points.map(p => p.content.substring(0, 50)).join('; ')}. ` +
      `Summary created to manage context length.`;

    this.conversationSummaries.set(userId, summary);
    logger.info(`Conversation summarized for user ${userId}`, { 
      originalCount: messages.length,
      summaryLength: summary.summary.length 
    });
    
    return summary;
  }

  applySlidingWindow(messages, maxTokens = MAX_CONTEXT_TOKENS) {
    let currentTokens = this.estimateConversationTokens(messages);
    
    if (currentTokens <= maxTokens) {
      return messages;
    }

    logger.info(`Applying sliding window - current tokens: ${currentTokens}, max: ${maxTokens}`);

    const result = [...messages];
    let removedCount = 0;

    while (currentTokens > maxTokens && result.length > MIN_RECENT_MESSAGES) {
      const oldest = result.shift();
      currentTokens -= this.estimateMessageTokens(oldest);
      removedCount++;
    }

    logger.info(`Sliding window removed ${removedCount} old messages`, {
      remainingTokens: currentTokens,
      remainingMessages: result.length
    });

    return result;
  }

  async manageContext(messages, userId) {
    const currentTokens = this.estimateConversationTokens(messages);
    
    if (currentTokens <= SUMMARY_THRESHOLD) {
      return messages;
    }

    logger.info(`Context length ${currentTokens} exceeds threshold ${SUMMARY_THRESHOLD}, applying memory management`);

    const recentMessages = messages.slice(-MIN_RECENT_MESSAGES);
    const oldMessages = messages.slice(0, -MIN_RECENT_MESSAGES);
    
    const summary = await this.summarizeConversation(oldMessages, userId);
    
    const summaryMessage = {
      role: 'system',
      content: `[CONVERSATION SUMMARY]\n${summary.summary}\n\n[RECENT CONTEXT]\nThe following are the most recent messages:`
    };

    const managedMessages = [summaryMessage, ...recentMessages];
    
    const finalTokens = this.estimateConversationTokens(managedMessages);
    logger.info(`Memory management applied: ${messages.length} → ${managedMessages.length} messages, ${currentTokens} → ${finalTokens} tokens`);

    return managedMessages;
  }

  getContextStats(messages) {
    const tokens = this.estimateConversationTokens(messages);
    const byRole = messages.reduce((acc, msg) => {
      acc[msg.role] = (acc[msg.role] || 0) + 1;
      return acc;
    }, {});

    return {
      messageCount: messages.length,
      estimatedTokens: tokens,
      byRole,
      needsManagement: tokens > SUMMARY_THRESHOLD,
      needsSlidingWindow: tokens > MAX_CONTEXT_TOKENS
    };
  }

  clearConversationSummary(userId) {
    this.conversationSummaries.delete(userId);
    logger.info(`Cleared conversation summary for user ${userId}`);
  }
}

const memoryManager = new MemoryManager();

export default memoryManager;
export { MemoryManager, MAX_CONTEXT_TOKENS, SUMMARY_THRESHOLD, MIN_RECENT_MESSAGES };
