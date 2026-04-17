<template>
  <div class="h-screen flex bg-main selection:bg-primary selection:text-white overflow-hidden">
    <!-- Sidebar: AI Ecosystem -->
    <aside class="w-80 glass-panel border-r border-border hidden lg:flex flex-col z-20">
      <div class="p-6 border-b border-border">
        <h2 class="text-xl font-black tracking-tight flex items-center gap-2">
          <CommandLineIcon class="w-6 h-6 text-primary" />
          {{ $t('chat.title') }}
        </h2>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <div v-for="model in models" :key="model.id" 
          @click="selectedModel = model"
          :class="[
            'p-4 rounded-2xl cursor-pointer transition-all interactive-scale depth-1',
            selectedModel?.id === model.id ? 'bg-primary text-white depth-2' : 'glass-panel hover:bg-main/50'
          ]">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-main flex items-center justify-center border border-border">
              <img :src="`/logos/${getProviderLogo(model.provider)}`" class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-sm truncate">{{ model.display_name }}</p>
              <p :class="['text-[10px] uppercase font-black tracking-widest', selectedModel?.id === model.id ? 'text-white/60' : 'opacity-40']">
                {{ model.provider }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-border space-y-2">
        <div class="p-4 glass-panel rounded-2xl">
          <p class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{{ $t('chat.currentBalance') }}</p>
          <p class="text-lg font-mono font-bold text-primary">${{ user?.balance?.toFixed(2) || '0.00' }}</p>
        </div>
        <button @click="router.push('/dashboard')" class="w-full py-3 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
          {{ $t('common.backToConsole') }}
        </button>
      </div>
    </aside>

    <!-- Main Chat Area -->
    <main class="flex-1 flex flex-col relative min-w-0">
      <!-- Chat Fluid Background -->
      <div class="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] animate-float"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 blur-[120px] animate-float" style="animation-delay: -3s"></div>
      </div>

      <!-- Header: Mobile & Selection info -->
      <header class="h-16 glass-panel border-b border-border px-6 flex items-center justify-between z-10 shrink-0">
        <div class="flex items-center gap-4 min-w-0">
          <button @click="router.push('/dashboard')" class="lg:hidden p-2 glass-panel rounded-xl">
            <ChevronLeftIcon class="w-5 h-5" />
          </button>
          <div v-if="selectedModel" class="flex flex-col">
            <p class="font-bold text-sm truncate">{{ selectedModel.display_name }}</p>
            <div class="flex items-center gap-2">
              <span class="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-[10px] font-black uppercase opacity-40 tracking-widest">{{ $t('chat.activeIntel') }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button @click="clearMessages" class="p-2 text-muted hover:text-rose-500 transition-colors">
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </header>

      <!-- Messages List -->
      <div class="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 z-10 scrollbar-hide" ref="messagesContainer">
        <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-center animate-fade-in">
          <div class="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 depth-1">
            <SparklesIcon class="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h2 class="text-3xl font-black mb-4">{{ $t('chat.nexusMindIntel') }}</h2>
          <p class="text-muted max-w-md mx-auto">{{ $t('chat.startDesc') }}</p>
        </div>

        <div v-for="(msg, i) in messages" :key="i" 
          :class="['flex gap-6 max-w-4xl mx-auto group', msg.role === 'user' ? 'flex-row-reverse' : '']">
          <div :class="['w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 depth-1 transition-all group-hover:depth-2', 
            msg.role === 'user' ? 'bg-primary' : 'glass-panel']">
            <UserIcon v-if="msg.role === 'user'" class="w-5 h-5 text-white" />
            <CpuChipIcon v-else class="w-5 h-5 text-primary" />
          </div>
          <div :class="['flex-1 space-y-2 min-w-0', msg.role === 'user' ? 'text-right' : '']">
            <p class="text-[10px] font-black uppercase tracking-widest opacity-40">
              {{ msg.role === 'user' ? $t('chat.human') : (selectedModel?.display_name || $t('chat.aiAssistant')) }}
            </p>
            <div :class="['p-6 rounded-[28px] text-lg leading-relaxed inline-block max-w-full text-left', 
              msg.role === 'user' ? 'bg-primary text-white depth-2 rounded-tr-none' : 'glass-panel depth-1 rounded-tl-none prose prose-slate dark:prose-invert max-w-none']">
              <div v-html="renderMarkdown(msg.content)"></div>
            </div>
          </div>
        </div>
        <div v-if="loading" class="flex gap-6 max-w-4xl mx-auto animate-fade-in">
          <div class="w-10 h-10 glass-panel rounded-2xl flex items-center justify-center depth-1">
            <CpuChipIcon class="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div class="flex-1 space-y-4">
            <div class="h-4 w-24 bg-border rounded-full animate-pulse"></div>
            <div class="h-20 glass-panel rounded-[28px] rounded-tl-none animate-pulse animate-bg-linear"></div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <footer class="p-6 md:p-12 z-10 shrink-0">
        <div class="max-w-4xl mx-auto relative">
          <div class="glass-panel p-2 rounded-[32px] depth-3 border-primary/20 flex flex-col gap-2 transition-all focus-within:depth-3 focus-within:border-primary/40">
            <textarea 
              v-model="input" 
              @keydown.enter.prevent="sendMessage"
              :placeholder="$t('chat.placeholder')"
              rows="1"
              class="w-full bg-transparent border-none resize-none px-6 py-4 focus:ring-0 text-lg max-h-64 scrollbar-hide text-main"
              @input="adjustHeight"
              ref="inputRef"
            ></textarea>
            <div class="flex items-center justify-between px-4 pb-2">
              <div class="flex gap-2">
                <button class="p-2 text-muted hover:text-primary transition-colors interactive-scale"><PaperClipIcon class="w-5 h-5" /></button>
                <button class="p-2 text-muted hover:text-primary transition-colors interactive-scale"><MicrophoneIcon class="w-5 h-5" /></button>
              </div>
              <button 
                @click="sendMessage"
                :disabled="loading || !input.trim() || !selectedModel"
                class="bg-primary text-white p-3 rounded-2xl depth-2 interactive-scale disabled:opacity-30 disabled:grayscale hover:bg-primary-hover shadow-blue-500/20 shadow-lg transition-all">
                <ArrowUpIcon class="w-6 h-6" />
              </button>
            </div>
          </div>
          <p class="text-[10px] text-center mt-6 uppercase font-black tracking-widest opacity-30">
            {{ $t('chat.disclaimer') }}
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useModelsStore } from '../stores/models'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

// Icons
import { 
  CommandLineIcon, 
  UserIcon, 
  CpuChipIcon, 
  ArrowUpIcon, 
  TrashIcon, 
  SparklesIcon,
  ChevronLeftIcon,
  PaperClipIcon,
  MicrophoneIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const modelsStore = useModelsStore()
const { t } = useI18n()

const user = computed(() => authStore.user)
const models = computed(() => modelsStore.models)
const selectedModel = ref(null)
const input = ref('')
const loading = ref(false)
const messages = ref([])
const inputRef = ref(null)
const messagesContainer = ref(null)

onMounted(async () => {
  await authStore.fetchProfile()
  await modelsStore.fetchModels()
  if (models.value.length > 0) {
    selectedModel.value = models.value[0]
  }
})

function getProviderLogo(provider) {
  const logoMap = { 'OpenAI': 'openai.svg', 'Anthropic': 'anthropic.svg', 'Google': 'google.svg', 'xAI': 'xai.svg', 'Mistral AI': 'mistral.svg', 'MiniMax': 'minimax.svg', 'Alibaba Qwen': 'qwen.svg' }
  return logoMap[provider] || 'openai.svg'
}

function adjustHeight(e) {
  const target = e.target
  target.style.height = 'auto'
  target.style.height = target.scrollHeight + 'px'
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

async function sendMessage() {
  if (!input.value.trim() || loading.value || !selectedModel.value) return

  const userContent = input.value.trim()
  messages.value.push({ role: 'user', content: userContent })
  input.value = ''
  if (inputRef.value) inputRef.value.style.height = 'auto'
  
  loading.value = true
  scrollToBottom()

  try {
    const token = authStore.token
    const response = await fetch('http://localhost:3000/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: selectedModel.value.name,
        messages: messages.value.map(m => ({ role: m.role, content: m.content }))
      })
    })

    if (!response.ok) throw new Error(t('chat.apiError'))
    
    const data = await response.json()
    messages.value.push({
      role: 'assistant',
      content: data.choices[0].message.content
    })
    
    await authStore.fetchProfile()
  } catch (error) {
    ElMessage.error(t('chat.commFailed'))
    console.error(error)
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

function clearMessages() {
  messages.value = []
}

function renderMarkdown(content) {
  return content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<div class="bg-main/50 p-4 rounded-xl font-mono text-sm my-4 overflow-x-auto">$2</div>')
    .replace(/`([^`]+)`/g, '<code class="bg-primary/10 text-primary px-1 rounded">$1</code>')
    .replace(/\n/g, '<br>')
}

watch(messages, () => scrollToBottom(), { deep: true })
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

:deep(br) {
  content: "";
  display: block;
  margin-bottom: 0.5em;
}
</style>
