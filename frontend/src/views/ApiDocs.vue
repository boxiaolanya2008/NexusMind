<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">API 文档</h1>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">v1.0</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 快速开始 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          快速开始
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          NexusMind API 兼容 OpenAI API 格式，您可以轻松地将现有的 OpenAI 集成迁移到 NexusMind。
        </p>
        
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 mb-6">
          <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">API 基础信息</h3>
          <div class="space-y-2 text-sm">
            <div class="flex">
              <span class="text-gray-600 dark:text-gray-400 w-32">基础 URL:</span>
              <code class="text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-blue-300 dark:border-blue-600">http://localhost:3000/api</code>
            </div>
            <div class="flex">
              <span class="text-gray-600 dark:text-gray-400 w-32">认证方式:</span>
              <code class="text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-blue-300 dark:border-blue-600">X-API-Key</code>
            </div>
          </div>
        </div>
      </div>

      <!-- 认证 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          认证
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-4">所有 API 请求都需要在请求头中包含您的 API 密钥。</p>
        
        <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
          <pre><code class="text-sm text-gray-100">X-API-Key: your-api-key-here</code></pre>
        </div>
        
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
          您可以在控制台的仪表盘页面获取您的 API 密钥。
        </p>
      </div>

      <!-- 聊天完成 API -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          聊天完成 API
        </h2>
        
        <div class="mb-6">
          <div class="flex items-center space-x-2 mb-2">
            <span class="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
            <code class="text-gray-700 dark:text-gray-300 font-mono">/api/v1/chat/completions</code>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">创建聊天完成请求，这是最常用的 API 端点。</p>
        </div>

        <!-- 请求示例 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">请求示例</h3>
          <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
            <pre><code class="text-sm text-gray-100">{
  "model": "gpt-4-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}</code></pre>
          </div>
        </div>

        <!-- 响应示例 -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">响应示例</h3>
          <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
            <pre><code class="text-sm text-gray-100">{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "I'm doing well, thank you!"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 8,
    "total_tokens": 18
  }
}</code></pre>
          </div>
        </div>

        <!-- 参数说明 -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">请求参数</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">参数</th>
                  <th class="text-left py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">类型</th>
                  <th class="text-left py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">必填</th>
                  <th class="text-left py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">说明</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-2 px-4"><code class="text-sm text-blue-600 dark:text-blue-400">model</code></td>
                  <td class="py-2 px-4 text-gray-900 dark:text-white text-sm">string</td>
                  <td class="py-2 px-4 text-gray-900 dark:text-white text-sm">是</td>
                  <td class="py-2 px-4 text-gray-600 dark:text-gray-400 text-sm">要使用的模型 ID</td>
                </tr>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-2 px-4"><code class="text-sm text-blue-600 dark:text-blue-400">messages</code></td>
                  <td class="py-2 px-4 text-gray-900 dark:text-white text-sm">array</td>
                  <td class="py-2 px-4 text-gray-900 dark:text-white text-sm">是</td>
                  <td class="py-2 px-4 text-gray-600 dark:text-gray-400 text-sm">消息列表</td>
                </tr>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <td class="py-2 px-4"><code class="text-sm text-blue-600 dark:text-blue-400">temperature</code></td>
                  <td class="py-2 px-4 text-gray-900 dark:text-white text-sm">number</td>
                  <td class="py-2 px-4 text-gray-900 dark:text-white text-sm">否</td>
                  <td class="py-2 px-4 text-gray-600 dark:text-gray-400 text-sm">采样温度，0-2 之间</td>
                </tr>
                <tr>
                  <td class="py-2 px-4"><code class="text-sm text-blue-600 dark:text-blue-400">max_tokens</code></td>
                  <td class="py-2 px-4 text-gray-900 dark:text-white text-sm">integer</td>
                  <td class="py-2 px-4 text-gray-900 dark:text-white text-sm">否</td>
                  <td class="py-2 px-4 text-gray-600 dark:text-gray-400 text-sm">最大生成 token 数</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 代码示例 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
          </svg>
          代码示例
        </h2>
        
        <div class="space-y-6">
          <!-- Python -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Python</h3>
            <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
              <pre><code class="text-sm text-gray-100">import requests

response = requests.post(
    'http://localhost:3000/api/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'X-API-Key': 'your-api-key'
    },
    json={
        'model': 'gpt-4-turbo',
        'messages': [
            {'role': 'user', 'content': 'Hello!'}
        ]
    }
)

result = response.json()
print(result['choices'][0]['message']['content'])</code></pre>
            </div>
          </div>

          <!-- JavaScript -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">JavaScript</h3>
            <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
              <pre><code class="text-sm text-gray-100">const response = await fetch('http://localhost:3000/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key'
  },
  body: JSON.stringify({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);</code></pre>
            </div>
          </div>

          <!-- cURL -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">cURL</h3>
            <div class="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 overflow-x-auto">
              <pre><code class="text-sm text-gray-100">curl -X POST http://localhost:3000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "model": "gpt-4-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误处理 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fade-in">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-6 h-6 mr-2 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          错误处理
        </h2>
        
        <div class="space-y-4">
          <div class="border-l-4 border-red-500 pl-4 bg-red-50 dark:bg-red-900/20 py-3 rounded-r-lg">
            <h4 class="font-semibold text-red-900 dark:text-red-100">401 Unauthorized</h4>
            <p class="text-red-700 dark:text-red-300 text-sm">API 密钥无效或缺失</p>
          </div>
          <div class="border-l-4 border-yellow-500 pl-4 bg-yellow-50 dark:bg-yellow-900/20 py-3 rounded-r-lg">
            <h4 class="font-semibold text-yellow-900 dark:text-yellow-100">402 Payment Required</h4>
            <p class="text-yellow-700 dark:text-yellow-300 text-sm">账户余额不足以完成请求</p>
          </div>
          <div class="border-l-4 border-orange-500 pl-4 bg-orange-50 dark:bg-orange-900/20 py-3 rounded-r-lg">
            <h4 class="font-semibold text-orange-900 dark:text-orange-100">429 Too Many Requests</h4>
            <p class="text-orange-700 dark:text-orange-300 text-sm">请求速率超过限制</p>
          </div>
          <div class="border-l-4 border-red-500 pl-4 bg-red-50 dark:bg-red-900/20 py-3 rounded-r-lg">
            <h4 class="font-semibold text-red-900 dark:text-red-100">404 Not Found</h4>
            <p class="text-red-700 dark:text-red-300 text-sm">请求的模型不存在</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
