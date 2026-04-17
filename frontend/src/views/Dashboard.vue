<template>
  <div class="min-h-screen bg-main selection:bg-primary selection:text-white">
    <!-- Header: Refined Elevation -->
    <header class="sticky top-0 z-50 glass-panel border-b border-border py-4">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center depth-2">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tight leading-none mb-1">{{ $t('dashboard.title') }}</h1>
            <p class="text-xs font-bold uppercase tracking-widest opacity-40">{{ user?.username }} / {{ $t('dashboard.console') }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-8">
          <div class="hidden md:block text-right">
            <p class="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{{ $t('dashboard.totalBalance') }}</p>
            <p class="text-xl font-mono font-bold text-primary">${{ user?.balance?.toFixed(2) || '0.00' }}</p>
          </div>
          <button @click="showRechargeDialog = true" 
            class="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm interactive-scale depth-2 hover:bg-primary-hover shadow-blue-500/20 shadow-lg">
            {{ $t('dashboard.recharge') }}
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Top Stats: Precision Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div v-for="(stat, i) in statCards" :key="i" 
          class="glass-panel p-8 rounded-[32px] depth-1 hover:depth-2 transition-all group animate-bg-linear">
          <div class="flex justify-between items-start mb-4">
            <p class="text-xs font-black uppercase tracking-widest opacity-40">{{ stat.label }}</p>
            <div :class="`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} shadow-lg text-white`">
              <component :is="stat.icon" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-3xl font-mono font-black">{{ stat.value }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Main Content Area (8 cols) -->
        <div class="lg:col-span-8 space-y-12">
          <!-- API Key Area: Interactive Depth -->
          <section class="glass-panel p-10 rounded-[40px] depth-2 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
            <h2 class="text-2xl font-bold mb-8 flex items-center gap-3">
              <KeyIcon class="w-6 h-6 text-primary" />
              {{ $t('dashboard.apiKeyMgmt') }}
            </h2>
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1 relative">
                <input :value="apiKey" readonly
                  class="w-full bg-main/50 border border-border rounded-2xl px-6 py-4 font-mono text-sm focus:outline-none focus:border-primary transition-all pr-12" />
                <button @click="copyApiKey" class="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors">
                  <ClipboardIcon class="w-5 h-5" />
                </button>
              </div>
              <button @click="showApiKeyDialog = true" 
                class="glass-panel px-8 py-4 rounded-2xl font-bold text-sm interactive-scale border-border hover:bg-main/80">
                {{ $t('dashboard.regenerateKey') }}
              </button>
            </div>
            <p class="text-xs text-muted mt-6 flex items-center gap-2">
              <ShieldCheckIcon class="w-4 h-4 text-emerald-500" />
              {{ $t('dashboard.apiKeyWarning') }}
            </p>
          </section>

          <!-- Usage Chart: Swiss Style Charting -->
          <section class="glass-panel p-10 rounded-[40px] depth-2">
            <div class="flex items-center justify-between mb-10">
              <h2 class="text-2xl font-bold flex items-center gap-3">
                <ChartBarIcon class="w-6 h-6 text-primary" />
                {{ $t('dashboard.usageTrend') }}
              </h2>
              <div class="flex gap-2">
                <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">{{ $t('dashboard.thirtyDays') }}</span>
              </div>
            </div>
            <div ref="trendChart" class="h-80 w-full"></div>
          </section>

          <!-- Model Table: Minimalist Data -->
          <section class="glass-panel p-10 rounded-[40px] depth-2 overflow-hidden">
            <h2 class="text-2xl font-bold mb-8">{{ $t('dashboard.modelConsumption') }}</h2>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="text-left border-b border-border pb-4">
                    <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('dashboard.model') }}</th>
                    <th class="pb-6 text-right text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('dashboard.tokens') }}</th>
                    <th class="pb-6 text-right text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('dashboard.cost') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  <tr v-for="model in stats.modelStats" :key="model.model_name" class="group hover:bg-primary/[0.02] transition-colors">
                    <td class="py-6">
                      <p class="font-bold text-lg mb-1">{{ model.model_name }}</p>
                      <p class="text-xs opacity-50 uppercase font-black tracking-tighter">{{ model.provider }}</p>
                    </td>
                    <td class="py-6 text-right font-mono font-bold">{{ formatNumber(model.total_tokens) }}</td>
                    <td class="py-6 text-right font-mono font-bold text-primary">${{ (model.total_cost || 0).toFixed(4) }}</td>
                  </tr>
                  <tr v-if="!stats.modelStats?.length">
                    <td colspan="3" class="py-12 text-center opacity-30 italic font-medium">{{ $t('dashboard.noData') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- Sidebar Area (4 cols) -->
        <aside class="lg:col-span-4 space-y-8">
          <!-- Available Models Card -->
          <section class="glass-panel p-8 rounded-[40px] depth-2 sticky top-28">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xl font-bold m-0">{{ $t('dashboard.ecosystem') }}</h2>
              <span class="px-3 py-1 bg-main border border-border rounded-full text-[10px] font-bold uppercase">{{ models.length }} {{ $t('dashboard.active') }}</span>
            </div>
            <div class="space-y-4 max-h-[70vh] overflow-y-auto pr-4 scrollbar-hide">
              <div v-for="model in models" :key="model.id" @click="selectModel(model)"
                class="glass-panel p-6 rounded-3xl depth-1 border-transparent hover:border-primary/30 transition-all cursor-pointer group interactive-scale">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 bg-main rounded-2xl flex items-center justify-center border border-border group-hover:bg-primary/5 transition-colors">
                    <img :src="`/logos/${getProviderLogo(model.provider)}`" class="w-6 h-6 filter grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold truncate">{{ model.display_name }}</p>
                    <p class="text-[10px] font-black uppercase opacity-40">{{ model.provider }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-2">
                    <div class="flex -space-x-1">
                      <div v-for="n in 3" :key="n" 
                        class="w-1.5 h-1.5 rounded-full"
                        :class="model.intelligence_level >= n*30 ? 'bg-primary' : 'bg-border'"></div>
                    </div>
                    <span class="text-[10px] font-black uppercase opacity-60">Lv. {{ model.intelligence_level }}</span>
                  </div>
                  <p class="text-xs font-mono font-bold text-primary">${{ model.input_price }} / M</p>
                </div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="mt-8 pt-8 border-t border-border grid grid-cols-2 gap-4">
              <button @click="goToAdmin" v-if="isAdmin" 
                class="bg-main border border-border px-4 py-4 rounded-2xl font-bold text-xs interactive-scale uppercase tracking-widest opacity-80 hover:opacity-100">
                {{ $t('dashboard.admin') }}
              </button>
              <button @click="router.push('/api-docs')" 
                class="bg-main border border-border px-4 py-4 rounded-2xl font-bold text-xs interactive-scale uppercase tracking-widest opacity-80 hover:opacity-100">
                {{ $t('dashboard.apiDocs') }}
              </button>
            </div>
          </section>
        </aside>
      </div>
    </main>

    <!-- Dialogs: Redesigned with Higher Contrast -->
    <el-dialog v-model="showRechargeDialog" width="400px" custom-class="glass-panel !rounded-[32px] !border-none !p-0" :show-close="false">
      <div class="p-8 pt-8 space-y-6">
        <h3 class="text-xl font-bold mb-4">{{ $t('dashboard.rechargeDialog') }}</h3>
        <div>
          <label class="block text-xs font-black uppercase tracking-widest opacity-40 mb-3">{{ $t('dashboard.rechargeAmount') }}</label>
          <input v-model="rechargeAmount" type="number"
            class="w-full bg-main border border-border rounded-2xl px-6 py-4 font-mono font-bold text-xl focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label class="block text-xs font-black uppercase tracking-widest opacity-40 mb-3">{{ $t('dashboard.rechargeNote') }}</label>
          <input v-model="rechargeNote" type="text"
            class="w-full bg-main border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary" />
        </div>
      </div>
      <template #footer>
        <div class="px-8 pb-8 flex gap-4">
          <button @click="showRechargeDialog = false" class="flex-1 py-4 font-bold text-sm opacity-50 hover:opacity-100 transition-opacity">{{ $t('dashboard.cancel') }}</button>
          <button @click="recharge" class="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold text-sm interactive-scale depth-2">{{ $t('dashboard.confirmPayment') }}</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useModelsStore } from '../stores/models'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

// Hero Icons
import { 
  KeyIcon, 
  ClipboardIcon, 
  ChartBarIcon, 
  ShieldCheckIcon,
  BoltIcon,
  CircleStackIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const modelsStore = useModelsStore()
const { t } = useI18n()

const user = computed(() => authStore.user)
const apiKey = computed(() => authStore.apiKey)
const models = computed(() => modelsStore.models)
const showRechargeDialog = ref(false)
const showApiKeyDialog = ref(false)
const rechargeAmount = ref(10)
const rechargeNote = ref('')
const isAdmin = computed(() => authStore.isAdmin)

const stats = ref({
  totalRequests: 0,
  totalTokens: 0,
  totalCost: 0,
  last30DaysTokens: 0,
  dailyTokenData: [],
  modelStats: []
})

const statCards = computed(() => [
  { label: t('dashboard.totalRequests'), value: stats.value.totalRequests || 0, icon: markRaw(BoltIcon), color: 'bg-blue-500' },
  { label: t('dashboard.totalTokens'), value: formatNumber(stats.value.totalTokens), icon: markRaw(CircleStackIcon), color: 'bg-emerald-500' },
  { label: t('dashboard.totalCost'), value: `$${stats.value.totalCost?.toFixed(2) || '0.00'}`, icon: markRaw(CurrencyDollarIcon), color: 'bg-indigo-500' },
  { label: t('dashboard.last30DaysTokens'), value: formatNumber(stats.value.last30DaysTokens), icon: markRaw(CalendarDaysIcon), color: 'bg-amber-500' }
])

const trendChart = ref(null)

onMounted(async () => {
  const profileRes = await authStore.fetchProfile()
  if (!profileRes?.success) {
    ElMessage.error(t('dashboard.sessionExpired'))
    authStore.logout()
    router.push('/login')
    return
  }
  
  await modelsStore.fetchModels()
  await fetchStats()
  await nextTick()
  initCharts()
})

async function fetchStats() {
  try {
    const token = authStore.token
    const response = await fetch('http://localhost:3000/api/auth/stats', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!response.ok) throw new Error('Failed to fetch stats')
    
    const data = await response.json()
    stats.value = {
      totalRequests: data.totalRequests || 0,
      totalTokens: data.totalTokens || 0,
      totalCost: data.totalCost || 0,
      last30DaysTokens: data.last30DaysTokens || 0,
      dailyTokenData: data.dailyTokenData || new Array(30).fill(0),
      modelStats: data.modelStats || []
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

async function initCharts() {
  if (!trendChart.value) return
  
  const chart = echarts.init(trendChart.value)
  const isDark = document.documentElement.classList.contains('dark')
  
  const option = {
    grid: { left: '3%', right: '3%', bottom: '3%', top: '5%', containLabel: true },
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#111827', fontWeight: 'bold' }
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 30 }, (_, i) => i + 1),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9ca3af', fontWeight: 'bold' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: isDark ? '#374151' : '#f3f4f6' } },
      axisLabel: { color: '#9ca3af', fontWeight: 'bold' }
    },
    series: [{
      name: t('dashboard.tokens'),
      type: 'line',
      data: stats.value.dailyTokenData || new Array(30).fill(0),
      smooth: 0.4,
      symbol: 'none',
      lineStyle: { width: 4, color: '#3b82f6' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
          { offset: 1, color: 'rgba(59, 130, 246, 0)' }
        ])
      }
    }]
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

function copyApiKey() {
  navigator.clipboard.writeText(apiKey.value)
  ElMessage({ message: t('dashboard.copied'), type: 'success', customClass: 'depth-3 !rounded-2xl' })
}

function formatNumber(num) {
  if (!num) return '0'
  return num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : num.toLocaleString()
}

function selectModel(model) {
  router.push({ name: 'ModelDetail', params: { name: model.name } })
}

function goToAdmin() { router.push('/admin') }

async function recharge() {
  if (!rechargeAmount.value || isNaN(rechargeAmount.value)) {
    ElMessage.error(t('dashboard.invalidAmount'))
    return
  }
  try {
    const token = authStore.token
    const response = await fetch('http://localhost:3000/api/admin/add-balance', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.value.id,
        amount: parseFloat(rechargeAmount.value),
        description: rechargeNote.value || 'User Recharge'
      })
    })
    if (!response.ok) throw new Error('Recharge failed')
    ElMessage.success(t('dashboard.rechargeSuccess'))
    showRechargeDialog.value = false
    await authStore.fetchProfile()
    await fetchStats()
  } catch (error) {
    ElMessage.error(t('dashboard.processFailed'))
  }
}

function getProviderLogo(provider) {
  const logoMap = { 'OpenAI': 'openai.svg', 'Anthropic': 'anthropic.svg', 'Google': 'google.svg', 'xAI': 'xai.svg', 'Mistral AI': 'mistral.svg', 'MiniMax': 'minimax.svg', 'Alibaba Qwen': 'qwen.svg' }
  return logoMap[provider] || 'openai.svg'
}
</script>

<style>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Element Plus Override for Premium Look */
.el-dialog {
  background: var(--bg-card) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25) !important;
}
.el-dialog__header { display: none !important; }
</style>

