import logger from '../utils/logger.js';

export function convertToOpenAIFormat(request, modelName) {
  const messages = [];
  
  if (request.system) {
    messages.push({ role: 'system', content: request.system });
  }
  
  if (request.messages) {
    messages.push(...request.messages);
  } else if (request.prompt) {
    messages.push({ role: 'user', content: request.prompt });
  }
  
  const result = {
    model: modelName,
    messages: messages,
    temperature: request.temperature || 0.7,
    stream: request.stream || false
  };
  
  if (request.max_tokens) {
    result.max_tokens = request.max_tokens;
  }
  
  return result;
}

export function convertToAnthropicFormat(request, modelName) {
  const messages = [];
  
  if (request.messages) {
    messages.push(...request.messages);
  } else if (request.prompt) {
    messages.push({ role: 'user', content: request.prompt });
  }
  
  const result = {
    model: modelName,
    messages: messages,
    system: request.system || '',
    stream: request.stream || false
  };
  
  if (request.max_tokens) {
    result.max_tokens = request.max_tokens;
  }
  
  return result;
}

export function convertToGoogleFormat(request, modelName) {
  const contents = [];
  
  if (request.messages) {
    for (const msg of request.messages) {
      if (msg.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: msg.content }] });
      } else if (msg.role === 'assistant') {
        contents.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    }
  } else if (request.prompt) {
    contents.push({ role: 'user', parts: [{ text: request.prompt }] });
  }
  
  const result = {
    model: modelName,
    contents: contents,
    generationConfig: {
      temperature: request.temperature || 0.7
    }
  };
  
  if (request.max_tokens) {
    result.generationConfig.maxOutputTokens = request.max_tokens;
  }
  
  return result;
}

export function convertToGLMFormat(request, systemPrompt) {
  const messages = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  
  if (request.messages) {
    messages.push(...request.messages);
  } else if (request.prompt) {
    messages.push({ role: 'user', content: request.prompt });
  }
  
  const result = {
    messages: messages,
    temperature: request.temperature || 0.7,
    stream: request.stream || false
  };
  
  if (request.max_tokens) {
    result.max_tokens = request.max_tokens;
  }
  
  return result;
}

export function convertFromGLMToOpenAI(glmResponse) {
  if (!glmResponse.success) {
    return {
      error: {
        message: glmResponse.error,
        type: 'api_error',
        code: null
      }
    };
  }
  
  const data = glmResponse.data;
  const choice = data.choices?.[0];
  
  return {
    id: data.id || 'chatcmpl-' + Date.now(),
    object: 'chat.completion',
    created: data.created || Math.floor(Date.now() / 1000),
    model: data.model || 'glm-5',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: choice?.message?.content || ''
        },
        finish_reason: choice?.finish_reason || 'stop'
      }
    ],
    usage: {
      prompt_tokens: glmResponse.usage?.prompt_tokens || 0,
      completion_tokens: glmResponse.usage?.completion_tokens || 0,
      total_tokens: glmResponse.usage?.total_tokens || 0
    }
  };
}

export function convertFromGLMToAnthropic(glmResponse) {
  if (!glmResponse.success) {
    return {
      type: 'error',
      error: {
        type: 'api_error',
        message: glmResponse.error
      }
    };
  }
  
  const data = glmResponse.data;
  const choice = data.choices?.[0];
  
  return {
    id: data.id || 'msg-' + Date.now(),
    type: 'message',
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: choice?.message?.content || ''
      }
    ],
    model: data.model || 'glm-5',
    stop_reason: choice?.finish_reason || 'stop',
    usage: {
      input_tokens: glmResponse.usage?.prompt_tokens || 0,
      output_tokens: glmResponse.usage?.completion_tokens || 0
    }
  };
}

export function convertGLMStreamChunkToOpenAI(chunk, modelName) {
  const chunkStr = chunk.toString();
  logger.debug('GLM Stream chunk received', { 
    chunkLength: chunkStr.length, 
    preview: chunkStr.substring(0, 200) 
  });
  
  const lines = chunkStr.split('\n');
  const output = [];
  
  for (const line of lines) {
    if (!line.trim() || line.startsWith(':')) continue;
    
    if (line.startsWith('data: ')) {
      const data = line.slice(6).trim();
      if (data === '[DONE]') {
        output.push('data: [DONE]\n\n');
        logger.debug('Stream DONE marker received');
        continue;
      }
      
      try {
        const parsed = JSON.parse(data);
        const openaiChunk = {
          id: parsed.id || 'chatcmpl-' + Date.now(),
          object: 'chat.completion.chunk',
          created: parsed.created || Math.floor(Date.now() / 1000),
          model: modelName,
          choices: [
            {
              index: 0,
              delta: {
                content: parsed.choices?.[0]?.delta?.content || '',
                role: parsed.choices?.[0]?.delta?.role || 'assistant'
              },
              finish_reason: parsed.choices?.[0]?.finish_reason || null
            }
          ]
        };
        
        if (parsed.usage) {
          openaiChunk.usage = {
            prompt_tokens: parsed.usage.prompt_tokens || 0,
            completion_tokens: parsed.usage.completion_tokens || 0,
            total_tokens: parsed.usage.total_tokens || 0
          };
        }
        
        const outputLine = 'data: ' + JSON.stringify(openaiChunk) + '\n\n';
        output.push(outputLine);
        logger.debug('Converted chunk', { 
          hasContent: !!openaiChunk.choices[0].delta.content,
          contentLength: openaiChunk.choices[0].delta.content?.length || 0 
        });
      } catch (e) {
        logger.error('Failed to parse stream chunk', { error: e.message, line });
        output.push(line + '\n');
      }
    } else {
      output.push(line + '\n');
    }
  }
  
  const result = output.join('');
  logger.debug('Stream conversion result', { 
    outputLength: result.length,
    linesCount: output.length 
  });
  
  return result;
}
