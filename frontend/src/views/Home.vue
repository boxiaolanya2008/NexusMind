<template>
  <div class="min-h-screen bg-main selection:bg-primary selection:text-white">
    <!-- Hero Section: Modern Fluid Aesthetic -->
    <section class="relative min-h-[90vh] flex items-center overflow-hidden section-gap">
      <div class="absolute inset-0 z-0">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-float"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] animate-float" style="animation-delay: -3s"></div>
      </div>

      <div class="container mx-auto relative z-10">
        <div class="max-w-4xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel depth-1 mb-8 animate-fade-in">
            <span class="flex h-2 w-2 rounded-full bg-primary"></span>
            <span class="text-sm font-semibold tracking-wide uppercase opacity-80">{{ t('home.hero.badge') }}</span>
          </div>
          
          <h1 class="mb-8 animate-slide-in">
            {{ t('home.hero.title') }}
          </h1>
          
          <p class="text-xl md:text-2xl mb-12 text-muted leading-relaxed max-w-2xl animate-fade-in">
            {{ t('home.hero.description') }}
          </p>

          <div class="flex flex-wrap gap-6 animate-fade-in" style="animation-delay: 0.2s">
            <router-link to="/register" 
              class="px-10 py-4 bg-primary text-white rounded-2xl font-bold depth-2 interactive-scale hover:bg-primary-hover shadow-blue-500/25 shadow-lg">
              {{ t('home.hero.getStarted') }}
            </router-link>
            <router-link to="/api-docs" 
              class="px-10 py-4 glass-panel rounded-2xl font-bold depth-1 interactive-scale">
              {{ t('home.hero.tryApi') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats: Minimalist Mathematics -->
    <section class="section-gap border-y border-border glass-panel">
      <div class="container mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div v-for="(val, label, i) in stats" :key="label" class="animate-fade-in" :style="{animationDelay: i*0.1+'s'}">
            <div class="text-5xl font-black mb-2 bg-gradient-to-br from-primary to-indigo-500 bg-clip-text text-transparent">
              {{ val }}
            </div>
            <div class="text-sm font-bold uppercase tracking-widest opacity-50">{{ t(`home.stats.${label}`) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features: Atomic Grid -->
    <section class="section-gap bg-main">
      <div class="container mx-auto">
        <div class="text-center max-w-2xl mx-auto mb-20">
          <h2 class="mb-4">{{ t('home.features.title') }}</h2>
          <p class="mx-auto">{{ t('home.features.description') }}</p>
        </div>

        <div class="card-grid">
          <div v-for="(feature, i) in features" :key="i" 
            class="glass-panel p-10 rounded-[32px] depth-2 hover:depth-3 transition-all interactive-scale group">
            <div :class="`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner ${feature.color}`">
              <component :is="feature.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold mb-4">{{ t(`home.features.${feature.key}`) }}</h3>
            <p class="text-muted leading-relaxed">{{ t(`home.features.${feature.key}Desc`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Models: Semantic Ecosystem -->
    <section class="section-gap bg-main">
      <div class="container mx-auto">
        <div class="glass-panel rounded-[48px] p-12 md:p-20 overflow-hidden relative">
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full"></div>
          
          <div class="flex flex-col lg:flex-row gap-16 items-center">
            <div class="lg:w-1/3">
              <h2 class="mb-6">{{ t('home.models.title') }}</h2>
              <p>{{ t('home.models.subtitle') }}</p>
            </div>
            <div class="lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div v-for="model in modelLogos" :key="model.name" 
                class="glass-panel p-8 rounded-3xl depth-1 hover:depth-2 transition-all flex flex-col items-center group cursor-pointer">
                <img :src="model.logo" :alt="model.name" class="w-16 h-16 mb-4 filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                <span class="font-bold text-sm tracking-widest uppercase opacity-60 group-hover:opacity-100">{{ model.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA: Final Push -->
    <section class="section-gap">
      <div class="container mx-auto">
        <div class="bg-primary rounded-[48px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
          <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div class="relative z-10 max-w-2xl mx-auto">
            <h2 class="text-white mb-6 text-4xl md:text-6xl">{{ t('home.cta.title') }}</h2>
            <p class="text-white/80 text-xl mb-12 max-w-none">{{ t('home.cta.description') }}</p>
            <router-link to="/register" 
              class="inline-block bg-white text-primary px-16 py-6 rounded-3xl font-black text-xl depth-2 interactive-scale hover:bg-white/95 transition-all">
              {{ t('home.cta.register') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, markRaw } from 'vue'
import { useI18nStore } from '../stores/i18n'
import zhCN from '../locales/zh-CN.js'
import enUS from '../locales/en-US.js'

// Hero Icons
import { 
  GlobeAltIcon, 
  CommandLineIcon, 
  CurrencyDollarIcon, 
  BoltIcon, 
  ChartBarIcon, 
  ShieldCheckIcon 
} from '@heroicons/vue/24/outline'

const i18nStore = useI18nStore()
const messages = ref(zhCN)

const stats = {
  models: '10+',
  availability: '99.9%',
  latency: '<100ms',
  support: '24/7'
}

const features = [
  { key: 'domesticDirect', color: 'bg-blue-500', icon: markRaw(GlobeAltIcon) },
  { key: 'unifiedInterface', color: 'bg-indigo-500', icon: markRaw(CommandLineIcon) },
  { key: 'payAsYouGo', color: 'bg-emerald-500', icon: markRaw(CurrencyDollarIcon) },
  { key: 'loadBalancing', color: 'bg-amber-500', icon: markRaw(BoltIcon) },
  { key: 'realTimeMonitoring', color: 'bg-rose-500', icon: markRaw(ChartBarIcon) },
  { key: 'security', color: 'bg-cyan-500', icon: markRaw(ShieldCheckIcon) }
]

const modelLogos = [
  { name: 'OpenAI', logo: '/logos/openai.svg' },
  { name: 'Anthropic', logo: '/logos/anthropic.svg' },
  { name: 'Google', logo: '/logos/google.svg' },
  { name: 'xAI', logo: '/logos/xai.svg' },
  { name: 'Mistral AI', logo: '/logos/mistral.svg' }
]

onMounted(() => updateMessages())
watch(() => i18nStore.locale, () => updateMessages())

function updateMessages() {
  messages.value = i18nStore.locale === 'zh-CN' ? zhCN : enUS
}

function t(key) {
  return key.split('.').reduce((obj, k) => obj?.[k], messages.value) || key
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in { animation: fade-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
.animate-slide-in { animation: slide-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}
</style>
