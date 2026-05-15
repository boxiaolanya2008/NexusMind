<template>
  <nav v-if="!isAuthPage" class="glass-panel border-b border-border sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-8">
          <router-link to="/" class="text-xl font-black tracking-tight">
            {{ t('common.appName') }}
          </router-link>
          <div class="hidden md:flex space-x-6">
            <router-link to="/" class="text-muted hover:text-primary px-3 py-2 text-sm font-bold transition-colors interactive-scale">
              {{ t('common.home') }}
            </router-link>
            <router-link to="/api-docs" class="text-muted hover:text-primary px-3 py-2 text-sm font-bold transition-colors interactive-scale">
              {{ t('common.apiDocs') }}
            </router-link>
            <router-link to="/config" class="text-muted hover:text-primary px-3 py-2 text-sm font-bold transition-colors interactive-scale">
              {{ t('common.config') }}
            </router-link>
            <router-link to="/admin" class="text-muted hover:text-primary px-3 py-2 text-sm font-bold transition-colors interactive-scale">
              {{ t('common.admin') }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <button
            @click="themeStore.toggleTheme()"
            class="p-2 text-muted hover:text-primary transition-colors interactive-scale"
            :title="isDark ? t('common.light') : t('common.dark')"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>

          <button
            @click="i18nStore.toggleLocale()"
            class="p-2 text-muted hover:text-primary transition-colors interactive-scale text-sm font-bold"
            :title="t('common.language')"
          >
            {{ i18nStore.locale === 'zh-CN' ? 'EN' : '中文' }}
          </button>

          <template v-if="authStore.isAuthenticated">
            <router-link to="/dashboard" class="text-muted hover:text-primary px-3 py-2 text-sm font-bold transition-colors interactive-scale">
              {{ t('common.dashboard') }}
            </router-link>
            <button @click="handleLogout" class="text-muted hover:text-rose-500 px-3 py-2 text-sm font-bold transition-colors interactive-scale">
              {{ t('common.logout') }}
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-muted hover:text-primary px-3 py-2 text-sm font-bold transition-colors interactive-scale">
              {{ t('common.login') }}
            </router-link>
            <router-link to="/register" class="bg-primary text-white px-4 py-2 text-sm font-bold rounded-xl depth-2 interactive-scale hover:bg-primary-hover shadow-blue-500/20 shadow-lg transition-all">
              {{ t('common.register') }}
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { useI18nStore } from '../stores/i18n'
import { useAuthStore } from '../stores/auth'
import zhCN from '../locales/zh-CN.js'
import enUS from '../locales/en-US.js'

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const i18nStore = useI18nStore()
const authStore = useAuthStore()

const isDark = computed(() => themeStore.isDark)
const isAuthPage = computed(() => route.path === '/login' || route.path === '/register')

const messages = ref(zhCN)

onMounted(() => {
  updateMessages()
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

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>
