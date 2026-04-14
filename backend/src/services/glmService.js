import axios from 'axios';
import logger from '../utils/logger.js';

const API_URL = process.env.API || 'https://open.bigmodel.cn/api/coding/paas/v4';
const API_KEY = process.env.KEY || '55dbbb88991f41e99b34ca22d0a0490b.p7Lhg3du497aosPE';
const MODEL = process.env.MODEL || 'glm-5';
const TEMPERATURE = parseFloat(process.env.TEMPERATURE || '0.7');
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function callGLM(messages, options = {}) {
  let lastError = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const requestBody = {
        model: MODEL,
        messages: messages,
        temperature: options.temperature || TEMPERATURE,
        stream: options.stream || false
      };
      
      if (options.max_tokens) {
        requestBody.max_tokens = options.max_tokens;
      }
      
      if (options.tools) {
        requestBody.tools = options.tools;
      }
      
      if (options.tool_choice !== undefined) {
        requestBody.tool_choice = options.tool_choice;
      }

      const response = await axios.post(`${API_URL}/chat/completions`, requestBody, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: options.stream ? 'stream' : 'json',
        timeout: 60000
      });

      logger.info('GLM API call successful', {
        model: MODEL,
        stream: options.stream || false,
        tools: options.tools ? options.tools.length : 0,
        attempt: attempt + 1
      });

      if (options.stream) {
        return {
          success: true,
          stream: response.data
        };
      }

      return {
        success: true,
        data: response.data,
        usage: response.data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      };
    } catch (error) {
      lastError = error;
      const isRetryable = error.code === 'ECONNRESET' || 
                          error.code === 'ETIMEDOUT' ||
                          error.response?.status === 429 ||
                          error.response?.status === 503 ||
                          error.response?.status === 502;
      
      if (isRetryable && attempt < MAX_RETRIES - 1) {
        logger.warn(`GLM API call failed, retrying... (attempt ${attempt + 1}/${MAX_RETRIES})`, {
          error: error.response?.data || error.message,
          status: error.response?.status
        });
        await sleep(RETRY_DELAY * (attempt + 1));
        continue;
      }
      
      logger.error('GLM API call failed:', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        url: `${API_URL}/chat/completions`,
        model: MODEL,
        attempts: attempt + 1
      });
    }
  }
  
  return {
    success: false,
    error: lastError?.response?.data?.error?.message || lastError?.message || 'API call failed after retries'
  };
}
