<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('config.title') }}</h1>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('config.quickAccess') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 animate-fade-in border border-gray-200/50 dark:border-gray-700/50">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
          </svg>
          {{ t('config.apiKey') }}
        </h2>
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('config.apiKey') }}</label>
              <div class="flex space-x-2">
                <input
                  type="text"
                  :value="apiKey"
                  readonly
                  class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  @click="copyToClipboard(apiKey)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  {{ t('config.copy') }}
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('config.apiEndpoint') }}</label>
              <div class="flex space-x-2">
                <input
                  type="text"
                  :value="apiEndpoint"
                  readonly
                  class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  @click="copyToClipboard(apiEndpoint)"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  {{ t('config.copy') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 animate-fade-in border border-gray-200/50 dark:border-gray-700/50">
        <div class="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            @click="activeTab = 'anthropic'"
            :class="activeTab === 'anthropic' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-400'"
            class="pb-2 px-4 text-sm font-medium transition-colors"
          >
            {{ t('config.anthropicClaude') }}
          </button>
          <button
            @click="activeTab = 'openai'"
            :class="activeTab === 'openai' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-400'"
            class="pb-2 px-4 text-sm font-medium transition-colors"
          >
            {{ t('config.openaiCompatible') }}
          </button>
          <button
            @click="activeTab = 'python'"
            :class="activeTab === 'python' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 dark:text-gray-400'"
            class="pb-2 px-4 text-sm font-medium transition-colors"
          >
            {{ t('config.pythonSdk') }}
          </button>
        </div>

        <div v-if="activeTab === 'anthropic'" class="space-y-4">
          <div>
            <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">{{ t('config.envVarConfig') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ t('config.createEnvFile') }}</p>
            <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
              <pre><code class="text-sm text-green-400">ANTHROPIC_API_KEY={{ apiKey }}
ANTHROPIC_BASE_URL={{ apiEndpoint }}</code></pre>
            </div>
          </div>

          <div>
            <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">{{ t('config.pythonCodeExample') }}</h3>
            <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
              <pre><code class="text-sm text-gray-100"><span class="text-purple-400">import</span> anthropic

client = anthropic.Anthropic(
    api_key=<span class="text-green-400">"{{ apiKey }}"</span>,
    base_url=<span class="text-green-400">"{{ apiEndpoint }}"</span>
)

message = client.messages.create(
    model=<span class="text-green-400">"claude-3-opus-20240229"</span>,
    max_tokens=<span class="text-blue-400">1024</span>,
    messages=[
        {<span class="text-green-400">"role"</span>: <span class="text-green-400">"user"</span>, <span class="text-green-400">"content"</span>: <span class="text-green-400">"Hello, world!"</span>}
    ]
)

print(message.content)</code></pre>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'openai'" class="space-y-4">
          <div>
            <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">{{ t('config.envVarConfig') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">{{ t('config.envVarConfigDesc') }}</p>
            <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
              <pre><code class="text-sm text-green-400">OPENAI_API_KEY={{ apiKey }}
OPENAI_BASE_URL={{ apiEndpoint }}/v1</code></pre>
            </div>
          </div>

          <div>
            <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">{{ t('config.curlExample') }}</h3>
            <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
              <pre><code class="text-sm text-gray-100">curl -X POST {{ apiEndpoint }}/v1/chat/completions \
  -H <span class="text-green-400">"Content-Type: application/json"</span> \
  -H <span class="text-green-400">"Authorization: Bearer {{ apiKey }}"</span> \
  -d <span class="text-green-400">'{
    "model": "gpt-4-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'</span></code></pre>
            </div>
          </div>

          <div>
            <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">{{ t('config.jsExample') }}</h3>
            <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
              <pre><code class="text-sm text-gray-100"><span class="text-purple-400">const</span> response = <span class="text-purple-400">await</span> fetch(<span class="text-green-400">'{{ apiEndpoint }}/v1/chat/completions'</span>, {
  method: <span class="text-green-400">'POST'</span>,
  headers: {
    <span class="text-green-400">'Content-Type'</span>: <span class="text-green-400">'application/json'</span>,
    <span class="text-green-400">'Authorization'</span>: <span class="text-green-400">`Bearer {{ apiKey }}`</span>
  },
  body: JSON.stringify({
    model: <span class="text-green-400">'gpt-4-turbo'</span>,
    messages: [{ role: <span class="text-green-400">'user'</span>, content: <span class="text-green-400">'Hello!'</span> }]
  })
});</code></pre>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'python'" class="space-y-4">
          <div>
            <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">{{ t('config.installOpenaiSdk') }}</h3>
            <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
              <pre><code class="text-sm text-gray-100">pip install openai</code></pre>
            </div>
          </div>

          <div>
            <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">{{ t('config.codeExample') }}</h3>
            <div class="bg-gray-900 dark:bg-gray-950 rounded-xl p-4 overflow-x-auto">
              <pre><code class="text-sm text-gray-100"><span class="text-purple-400">from</span> openai <span class="text-purple-400">import</span> OpenAI

client = OpenAI(
    api_key=<span class="text-green-400">"{{ apiKey }}"</span>,
    base_url=<span class="text-green-400">"{{ apiEndpoint }}/v1"</span>
)

response = client.chat.completions.create(
    model=<span class="text-green-400">"gpt-4-turbo"</span>,
    messages=[
        {<span class="text-green-400">"role"</span>: <span class="text-green-400">"user"</span>, <span class="text-green-400">"content"</span>: <span class="text-green-400">"Hello!"</span>}
    ]
)

print(response.choices[<span class="text-blue-400">0</span>].message.content)</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fade-in border border-gray-200/50 dark:border-gray-700/50">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg class="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          {{ t('config.quickDownload') }}
        </h2>
        <div class="flex space-x-4">
          <button
            @click="downloadEnvFile('anthropic')"
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>{{ t('config.downloadAnthropic') }}</span>
          </button>
          <button
            @click="downloadEnvFile('openai')"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>{{ t('config.downloadOpenai') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useModelsStore } from '../stores/models'
import { useI18nStore } from '../stores/i18n'
import { ElMessage } from 'element-plus'
import zhCN from '../locales/zh-CN.js'
import enUS from '../locales/en-US.js'

const authStore = useAuthStore()
const modelsStore = useModelsStore()
const i18nStore = useI18nStore()

const activeTab = ref('anthropic')
const apiEndpoint = ref('http://localhost:3000/api')
const apiKey = computed(() => authStore.apiKey || 'YOUR_API_KEY')
const selectedModel = ref('gpt-4-turbo')
const models = computed(() => modelsStore.models)

const messages = ref(zhCN)

onMounted(async () => {
  updateMessages()
  await modelsStore.fetchModels()
  await authStore.fetchProfile()
})

watch(() => i18nStore.locale, () => {
  updateMessages()
})

function updateMessages() {
  messages.value = i18nStore.locale === 'zh-CN' ? zhCN : enUS
}

function t(key) {
  const keys = key.split('.')
  let value = messages.value
  for (const k of keys) {
    value = value[k]
    if (value === undefined) return key
  }
  return value
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  ElMessage.success(t('config.copied'))
}

function downloadEnvFile(type) {
  let content
  let filename
  
  if (type === 'anthropic') {
    content = `ANTHROPIC_API_KEY=${apiKey.value}\nANTHROPIC_BASE_URL=${apiEndpoint.value}`
    filename = '.env.anthropic'
  } else {
    content = `OPENAI_API_KEY=${apiKey.value}\nOPENAI_BASE_URL=${apiEndpoint.value}/v1`
    filename = '.env.openai'
  }
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success(t('config.downloadSuccess'))
}
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
