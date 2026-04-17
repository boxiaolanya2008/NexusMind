<template>
  <div class="min-h-screen bg-main selection:bg-primary selection:text-white pb-24">
    <header class="sticky top-0 z-50 glass-panel border-b border-border py-4">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center depth-2">
            <Cog6ToothIcon class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tight leading-none mb-1">{{ $t('config.title') }}</h1>
            <p class="text-xs font-bold uppercase tracking-widest opacity-40">{{ $t('config.subtitle') }}</p>
          </div>
        </div>
        <button @click="router.push('/dashboard')" class="glass-panel px-6 py-2.5 rounded-xl font-bold text-sm interactive-scale border-border hover:bg-main/80">
          {{ $t('dashboard.console') }}
        </button>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-6 mt-12 space-y-8 animate-fade-in">
      <section class="glass-panel p-10 rounded-[40px] depth-2">
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3">
          <SwatchIcon class="w-6 h-6 text-primary" />
          {{ $t('config.appearance') }}
        </h2>
        
        <div class="flex items-center justify-between p-6 bg-main/50 border border-border rounded-3xl">
          <div>
            <h3 class="font-bold mb-1">{{ $t('config.themeMode') }}</h3>
            <p class="text-xs text-muted">{{ $t('config.themeDesc') }}</p>
          </div>
          <button @click="toggleTheme" 
            class="w-16 h-8 rounded-full border border-border bg-main relative transition-all duration-300">
            <div :class="['w-6 h-6 rounded-full bg-primary absolute top-1 transition-all duration-300', isDark ? 'left-9' : 'left-1']"></div>
          </button>
        </div>
      </section>

      <section class="glass-panel p-10 rounded-[40px] depth-2">
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3">
          <LanguageIcon class="w-6 h-6 text-primary" />
          {{ $t('config.localization') }}
        </h2>
        
        <div class="grid grid-cols-2 gap-4">
          <button @click="setLang('en-US')" 
            :class="['p-6 rounded-3xl border transition-all text-left group', currentLang === 'en-US' ? 'bg-primary/10 border-primary' : 'bg-main/50 border-border hover:border-primary/50']">
            <p class="font-bold mb-1 group-hover:text-primary transition-colors">English (US)</p>
            <p class="text-xs text-muted uppercase tracking-widest font-black">en-US</p>
          </button>
          <button @click="setLang('zh-CN')" 
            :class="['p-6 rounded-3xl border transition-all text-left group', currentLang === 'zh-CN' ? 'bg-primary/10 border-primary' : 'bg-main/50 border-border hover:border-primary/50']">
            <p class="font-bold mb-1 group-hover:text-primary transition-colors">简体中文</p>
            <p class="text-xs text-muted uppercase tracking-widest font-black">zh-CN</p>
          </button>
        </div>
      </section>

      <section class="glass-panel p-10 rounded-[40px] depth-2">
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3 text-emerald-500">
          <CodeBracketIcon class="w-6 h-6 text-emerald-500" />
          {{ $t('config.devQuickStart') }}
        </h2>

        <div class="space-y-6">
          <div class="flex items-center justify-between p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
            <div>
              <h3 class="font-bold text-emerald-500 mb-1">{{ $t('config.downloadOpenai') }}</h3>
              <p class="text-xs text-emerald-500/70">{{ $t('config.downloadOpenaiDesc') }}</p>
            </div>
            <button @click="downloadEnvFile('openai')" 
              class="px-6 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl interactive-scale shadow-lg shadow-emerald-500/20 hover:bg-emerald-600">
              {{ $t('config.downloadEnv') }}
            </button>
          </div>

          <div class="flex items-center justify-between p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl">
            <div>
              <h3 class="font-bold text-amber-500 mb-1">{{ $t('config.downloadAnthropic') }}</h3>
              <p class="text-xs text-amber-500/70">{{ $t('config.downloadAnthropicDesc') }}</p>
            </div>
            <button @click="downloadEnvFile('anthropic')" 
              class="px-6 py-3 bg-amber-500 text-white font-bold text-sm rounded-xl interactive-scale shadow-lg shadow-amber-500/20 hover:bg-amber-600">
              {{ $t('config.downloadEnv') }}
            </button>
          </div>
        </div>
      </section>

      <section class="glass-panel p-10 rounded-[40px] depth-2">
        <h2 class="text-2xl font-bold mb-8 flex items-center gap-3 text-rose-500">
          <PowerIcon class="w-6 h-6 text-rose-500" />
          {{ $t('config.dangerZone') }}
        </h2>
        
        <div class="flex items-center justify-between p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl">
          <div>
            <h3 class="font-bold text-rose-500 mb-1">{{ $t('config.signOut') }}</h3>
            <p class="text-xs text-rose-500/70">{{ $t('config.signOutDesc') }}</p>
          </div>
          <button @click="handleLogout" 
            class="px-6 py-3 bg-rose-500 text-white font-bold text-sm rounded-xl interactive-scale shadow-lg shadow-rose-500/20 hover:bg-rose-600">
            {{ $t('config.signOut') }}
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18nStore } from '../stores/i18n'
import { 
  Cog6ToothIcon, 
  SwatchIcon, 
  LanguageIcon, 
  PowerIcon,
  CodeBracketIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const i18nStore = useI18nStore()

const isDark = computed(() => document.documentElement.classList.contains('dark'))
const currentLang = computed(() => i18nStore.locale)
const apiKey = computed(() => authStore.apiKey || 'YOUR_API_KEY')
const apiEndpoint = computed(() => 'http://localhost:3000/api')

function toggleTheme() {
  document.documentElement.classList.toggle('dark')
  const isNowDark = document.documentElement.classList.contains('dark')
  localStorage.setItem('theme', isNowDark ? 'dark' : 'light')
}

function setLang(lang) {
  i18nStore.setLocale(lang)
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

function downloadEnvFile(type) {
  let content
  let filename
  
  if (type === 'anthropic') {
    content = `ANTHROPIC_API_KEY=${apiKey.value}\nANTHROPIC_BASE_URL=${apiEndpoint.value}`
    filename = '.env.anthropic'
  } else {
    content = `OPENAI_API_KEY=${apiKey.value}\nOPENAI_BASE_URL=${apiEndpoint.value}`
    filename = '.env.openai'
  }
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.5s ease-out; }
</style>
