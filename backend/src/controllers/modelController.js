import { prepare } from '../config/database.js';
import logger from '../utils/logger.js';
import { callGLM } from '../services/glmService.js';
import { convertToGLMFormat, convertFromGLMToOpenAI, convertFromGLMToAnthropic } from '../services/formatConverter.js';
import { getModelSystemPrompt } from '../services/hotReloadService.js';
import { searchKnowledgeBase } from '../services/knowledgeBaseService.js';
import { calculateCost, checkBalance, deductBalance } from '../services/billingService.js';
import { getCacheKey, get, set } from '../services/cacheService.js';
import { enqueue, SSEFlushStream, TokenBuffer } from '../services/requestQueue.js';
import { pipeline } from 'stream/promises';
import { executeTools, getAvailableTools, TOOLS } from '../services/toolService.js';
import memoryManager from '../services/memoryManager.js';
import fragmentSystem from '../services/memoryFragmentSystem.js';

function classifyMessageType(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('```') || /function|class|const|let|var|import|export/.test(content)) {
    return 'code';
  }
  if (lowerContent.includes('error') || lowerContent.includes('exception') || lowerContent.includes('failed')) {
    return 'error';
  }
  if (lowerContent.includes('?') || lowerContent.includes('how') || lowerContent.includes('what') || lowerContent.includes('why')) {
    return 'question';
  }
  if (lowerContent.includes('decide') || lowerContent.includes('choose') || lowerContent.includes('prefer')) {
    return 'decision';
  }
  if (content.length > 500) {
    return 'answer';
  }
  
  return 'message';
}

export async function getModels(req, res) {
  try {
    const sql = 'SELECT id, name, display_name, provider, input_price, output_price, api_format, intelligence_level, quality_level, logo_url, swe_bench, arc_agi, gpqa, mmlu FROM models';
    const stmt = prepare(sql);
    const models = stmt.all();
    
    res.json(models);
  } catch (error) {
    logger.error('Get models failed:', error);
    res.status(500).json({ error: 'Failed to get models' });
  }
}

export async function getTools(req, res) {
  try {
    res.json(getAvailableTools());
  } catch (error) {
    logger.error('Get tools failed:', error);
    res.status(500).json({ error: 'Failed to get tools' });
  }
}

export async function getMemoryFragments(req, res) {
  try {
    const userId = req.user.id;
    const stats = fragmentSystem.getUserStats(userId);
    res.json(stats);
  } catch (error) {
    logger.error('Get memory fragments failed:', error);
    res.status(500).json({ error: 'Failed to get memory fragments' });
  }
}

export async function clearMemoryFragments(req, res) {
  try {
    const userId = req.user.id;
    fragmentSystem.clearUserFragments(userId);
    res.json({ success: true, message: 'Memory fragments cleared' });
  } catch (error) {
    logger.error('Clear memory fragments failed:', error);
    res.status(500).json({ error: 'Failed to clear memory fragments' });
  }
}

export async function chatCompletion(req, res) {
  try {
    const { model, messages, system, temperature, max_tokens, stream, tools, tool_choice } = req.body;
    const userId = req.user.id;
    
    const sql = `SELECT id, name, api_format, input_price, output_price FROM models WHERE name = '${model}'`;
    const stmt = prepare(sql);
    const modelData = stmt.get();
    
    if (!modelData) {
      return res.status(404).json({ error: 'Model not found' });
    }
    
    const modelSystemPrompt = getModelSystemPrompt(modelData.id, modelData.name);
    
    const knowledgeResults = searchKnowledgeBase(messages[messages.length - 1]?.content || '', 3);
    let enhancedSystem = modelSystemPrompt;
    
    if (knowledgeResults.length > 0) {
      enhancedSystem += '\n\n[RELEVANT KNOWLEDGE]\n';
      for (const kb of knowledgeResults) {
        enhancedSystem += `- ${kb.content}\n`;
      }
    }
    
    const contextStats = memoryManager.getContextStats(messages);
    logger.info('Context stats', contextStats);
    
    const managedMessages = await memoryManager.manageContext(messages, userId);
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage && lastUserMessage.content && lastUserMessage.content.trim().length > 0) {
      const messageType = classifyMessageType(lastUserMessage.content);
      fragmentSystem.createFragment(lastUserMessage.content, messageType, { isUser: true }, userId);
    }
    
    const relevantFragments = fragmentSystem.getRelevantFragments(userId, 15000);
    
    if (relevantFragments.length > 0) {
      enhancedSystem += '\n\n[HISTORICAL CONTEXT FROM MEMORY FRAGMENTS]\n';
      enhancedSystem += `You have access to ${relevantFragments.length} relevant memory fragments from previous conversations. Use this context to provide better responses.\n\n`;
      
      const byType = {};
      relevantFragments.forEach(frag => {
        if (!byType[frag.type]) byType[frag.type] = [];
        byType[frag.type].push(frag);
      });
      
      Object.entries(byType).forEach(([type, frags]) => {
        enhancedSystem += `[${type.toUpperCase()} FRAGMENTS]\n`;
        frags.slice(0, 3).forEach(frag => {
          enhancedSystem += `- ${frag.content.substring(0, 150)}...\n`;
        });
        enhancedSystem += '\n';
      });
    }
    
    const glmRequest = convertToGLMFormat({
      messages: managedMessages,
      system: null,
      temperature,
      max_tokens,
      stream,
      tools,
      tool_choice
    }, enhancedSystem);
    
    const cacheKey = getCacheKey(model, messages, enhancedSystem);
    
    if (!stream && !tools) {
      const cached = get(cacheKey);
      if (cached) {
        logger.info('Cache hit for request');
        const actualCost = calculateCost(
          modelData.id, 
          cached.usage.prompt_tokens, 
          cached.usage.completion_tokens
        );
        deductBalance(
          userId, 
          actualCost, 
          modelData.id, 
          cached.usage.prompt_tokens, 
          cached.usage.completion_tokens
        );
        
        if (modelData.api_format === 'anthropic') {
          return res.json(convertFromGLMToAnthropic({ success: true, data: cached, usage: cached.usage }));
        } else {
          return res.json(convertFromGLMToOpenAI({ success: true, data: cached, usage: cached.usage }));
        }
      }
    }
    
    const estimatedInputTokens = (messages.reduce((sum, m) => sum + (m.content?.length || 0) / 4, 0) + enhancedSystem.length / 4);
    const estimatedCost = calculateCost(modelData.id, estimatedInputTokens, 1000);
    
    const balanceCheck = checkBalance(userId, estimatedCost * 2);
    if (!balanceCheck.sufficient) {
      return res.status(402).json({ 
        error: balanceCheck.message,
        balance: balanceCheck.balance,
        estimated_cost: balanceCheck.estimatedCost
      });
    }
    
    const result = await enqueue(userId, () => callGLM(glmRequest.messages, {
      temperature: glmRequest.temperature,
      max_tokens: glmRequest.max_tokens,
      stream: glmRequest.stream,
      tools: tools,
      tool_choice: tool_choice
    }));
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }
    
    if (tools && result.data?.choices?.[0]?.message?.tool_calls) {
      const toolCalls = result.data.choices[0].message.tool_calls;
      logger.info(`Executing ${toolCalls.length} tool calls`);

      toolCalls.forEach(call => {
        const toolContent = `Tool call: ${call.function.name} - ${call.function.arguments}`;
        fragmentSystem.createFragment(toolContent, 'tool_call', { isTool: true }, userId);
      });

      const toolResults = await executeTools(toolCalls);
      
      const followUpMessages = [
        ...messages,
        result.data.choices[0].message,
        ...toolResults
      ];
      
      const followUpResult = await enqueue(userId, () => callGLM(followUpMessages, {
        temperature: glmRequest.temperature,
        max_tokens: glmRequest.max_tokens,
        stream: false,
        tools: null
      }));
      
      if (!followUpResult.success) {
        return res.status(500).json({ error: followUpResult.error });
      }
      
      const actualCost = calculateCost(
        modelData.id, 
        result.usage.prompt_tokens + followUpResult.usage.prompt_tokens, 
        result.usage.completion_tokens + followUpResult.usage.completion_tokens
      );
      
      deductBalance(
        userId,
        actualCost,
        modelData.id,
        result.usage.prompt_tokens + followUpResult.usage.prompt_tokens,
        result.usage.completion_tokens + followUpResult.usage.completion_tokens
      );

      const followUpContent = followUpResult.data?.choices?.[0]?.message?.content || '';
      if (followUpContent && followUpContent.length > 50 && followUpContent.trim().length > 0) {
        const answerType = classifyMessageType(followUpContent);
        fragmentSystem.createFragment(followUpContent, answerType, { isAssistant: true }, userId);
      }

      if (modelData.api_format === 'anthropic') {
        return res.json(convertFromGLMToAnthropic(followUpResult));
      } else {
        return res.json(convertFromGLMToOpenAI(followUpResult));
      }
    }
    
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders();
      
      let totalTokens = 0;
      let promptTokens = 0;
      let completionTokens = 0;
      let collectedContent = '';
      
      const tokenBuffer = new TokenBuffer(res, 5);
      
      pipeline(result.stream, tokenBuffer).catch(err => {
        logger.error('Stream pipeline error:', err);
        res.end();
      });
      
      result.stream.on('data', (chunk) => {
        const chunkStr = chunk.toString();
        const lines = chunkStr.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.usage) {
                promptTokens = parsed.usage.prompt_tokens || 0;
                completionTokens = parsed.usage.completion_tokens || 0;
                totalTokens = parsed.usage.total_tokens || 0;
              }
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) collectedContent += delta;
            } catch (e) {}
          }
        }
      }).on('end', () => {
        if (promptTokens === 0 && completionTokens === 0) {
          const inputEst = messages.reduce((sum, m) => sum + (m.content?.length || 0), 0) / 4;
          const outputEst = collectedContent.length / 4;
          promptTokens = Math.ceil(inputEst);
          completionTokens = Math.ceil(outputEst);
        }
        
        const actualCost = calculateCost(modelData.id, promptTokens, completionTokens);
        deductBalance(userId, actualCost, modelData.id, promptTokens, completionTokens);
        
        if (collectedContent.length > 50 && collectedContent.trim().length > 0) {
          const answerType = classifyMessageType(collectedContent);
          fragmentSystem.createFragment(collectedContent, answerType, { isAssistant: true }, userId);
        }
        
        res.end();
      }).on('error', (error) => {
        logger.error('Stream error:', error);
        res.end();
      });
      
      return;
    }
    
    const actualCost = calculateCost(
      modelData.id, 
      result.usage.prompt_tokens, 
      result.usage.completion_tokens
    );
    
    deductBalance(
      userId, 
      actualCost, 
      modelData.id, 
      result.usage.prompt_tokens || 0, 
      result.usage.completion_tokens || 0
    );
    
    if (!stream && !tools) {
      set(cacheKey, result.data);
    }

    const responseContent = result.data?.choices?.[0]?.message?.content || '';
    if (responseContent && responseContent.length > 50 && responseContent.trim().length > 0) {
      const answerType = classifyMessageType(responseContent);
      fragmentSystem.createFragment(responseContent, answerType, { isAssistant: true }, userId);
    }

    if (modelData.api_format === 'anthropic') {
      res.json(convertFromGLMToAnthropic(result));
    } else {
      res.json(convertFromGLMToOpenAI(result));
    }
  } catch (error) {
    logger.error('Chat completion failed:', error);
    res.status(500).json({ error: 'Chat completion failed' });
  }
}
