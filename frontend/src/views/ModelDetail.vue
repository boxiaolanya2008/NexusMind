<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <button
              @click="goBack"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-1 transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span>{{ t('modelDetail.back') }}</span>
            </button>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">模型详情</span>
          </div>
          <div class="flex items-center space-x-2">
            <span
              :class="model?.quality_level === 'high' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'"
              class="px-3 py-1 rounded-full text-xs font-medium"
            >
              {{ model?.quality_level === 'high' ? t('modelDetail.qualityHigh') : t('modelDetail.qualityMedium') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">{{ t('modelDetail.loading') }}</p>
      </div>
    </div>

    <div v-else-if="error" class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div class="text-center bg-red-50 dark:bg-red-900/20 p-8 rounded-xl border border-red-200 dark:border-red-700">
        <h3 class="text-lg font-semibold text-red-900 dark:text-red-100">{{ t('modelDetail.loadFailed') }}</h3>
        <p class="text-red-700 dark:text-red-300">{{ error }}</p>
        <button @click="fetchModelData" class="mt-2 text-red-600 dark:text-red-400 hover:underline transition-colors">{{ t('modelDetail.retry') }}</button>
      </div>
    </div>

    <div v-else-if="model" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 模型基本信息卡片 -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 animate-fade-in border border-gray-200/50 dark:border-gray-700/50">
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-6">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center shadow-lg">
              <img :src="`/logos/${getProviderLogo(model.provider)}`" :alt="model.provider" class="w-16 h-16 drop-shadow-lg" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ model.display_name }}</h1>
              <p class="text-gray-600 dark:text-gray-400 mb-3">{{ model.provider }}</p>
              <div class="flex items-center space-x-3">
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('modelDetail.modelId') }}:</span>
                <code class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-white font-mono">{{ model.name }}</code>
                <button
                  @click="copyModelName"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  :title="t('modelDetail.copy')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('modelDetail.intelligenceLevel') }}</span>
              <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ model.intelligence_level }}</span>
              <span class="text-sm text-gray-400">/100</span>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('modelDetail.apiFormat') }}: <span class="text-gray-900 dark:text-white font-medium">{{ model.api_format }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：价格和规格 -->
        <div class="space-y-6">
          <!-- 价格信息 -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fade-in border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ t('modelDetail.priceInfo') }}
            </h3>
            <div class="space-y-4">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('modelDetail.inputPrice') }}</div>
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">${{ model.input_price }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">每百万 tokens</div>
              </div>
              <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-xl border border-green-200 dark:border-green-700">
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ t('modelDetail.outputPrice') }}</div>
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">${{ model.output_price }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">每百万 tokens</div>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('modelDetail.priceRatio') }}</span>
                  <span class="text-gray-900 dark:text-white font-medium">{{ calculatePriceRatio() }}x</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 模型规格 -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
              </svg>
              {{ t('modelDetail.modelSpecs') }}
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400 text-sm">{{ t('modelDetail.provider') }}</span>
                <span class="text-gray-900 dark:text-white font-medium text-sm">{{ model.provider }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400 text-sm">{{ t('modelDetail.apiFormat') }}</span>
                <span class="text-gray-900 dark:text-white font-medium text-sm">{{ model.api_format }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400 text-sm">{{ t('modelDetail.qualityLevel') }}</span>
                <span class="text-gray-900 dark:text-white font-medium text-sm">{{ model.quality_level === 'high' ? t('modelDetail.qualityHigh') : t('modelDetail.qualityMedium') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400 text-sm">{{ t('modelDetail.intelligenceLevel') }}</span>
                <span class="text-gray-900 dark:text-white font-medium text-sm">{{ model.intelligence_level }}/100</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间：基准测试 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 基准测试表格 -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              {{ t('modelDetail.benchmarkScores') }}
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('modelDetail.testItem') }}</th>
                    <th class="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('modelDetail.score') }}</th>
                    <th class="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('modelDetail.rating') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="py-3 px-4">
                      <div class="text-gray-900 dark:text-white font-medium">SWE-bench</div>
                      <div class="text-gray-600 dark:text-gray-400 text-xs">软件工程基准测试</div>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span class="text-lg font-bold text-gray-900 dark:text-white">{{ model.benchmarks?.swe_bench || '-' }}%</span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span :class="getBenchmarkGrade(model.benchmarks?.swe_bench)">{{ getBenchmarkLabel(model.benchmarks?.swe_bench) }}</span>
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="py-3 px-4">
                      <div class="text-gray-900 dark:text-white font-medium">ARC-AGI</div>
                      <div class="text-gray-600 dark:text-gray-400 text-xs">{{ t('modelDetail.arcAgiDesc') }}</div>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span class="text-lg font-bold text-gray-900 dark:text-white">{{ model.benchmarks?.arc_agi || '-' }}%</span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span :class="getBenchmarkGrade(model.benchmarks?.arc_agi)">{{ getBenchmarkLabel(model.benchmarks?.arc_agi) }}</span>
                    </td>
                  </tr>
                  <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="py-3 px-4">
                      <div class="text-gray-900 dark:text-white font-medium">GPQA</div>
                      <div class="text-gray-600 dark:text-gray-400 text-xs">研究生级问答</div>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span class="text-lg font-bold text-gray-900 dark:text-white">{{ model.benchmarks?.gpqa || '-' }}%</span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span :class="getBenchmarkGrade(model.benchmarks?.gpqa)">{{ getBenchmarkLabel(model.benchmarks?.gpqa) }}</span>
                    </td>
                  </tr>
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td class="py-3 px-4">
                      <div class="text-gray-900 dark:text-white font-medium">MMLU</div>
                      <div class="text-gray-600 dark:text-gray-400 text-xs">多任务语言理解</div>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span class="text-lg font-bold text-gray-900 dark:text-white">{{ model.benchmarks?.mmlu || '-' }}%</span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span :class="getBenchmarkGrade(model.benchmarks?.mmlu)">{{ getBenchmarkLabel(model.benchmarks?.mmlu) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 能力雷达图 -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
              </svg>
              {{ t('modelDetail.capabilityRadar') }}
            </h3>
            <div ref="radarChart" class="h-80"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useModelsStore } from '../stores/models'
import { useI18nStore } from '../stores/i18n'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import zhCN from '../locales/zh-CN.js'
import enUS from '../locales/en-US.js'

const router = useRouter()
const route = useRoute()
const modelsStore = useModelsStore()
const i18nStore = useI18nStore()

const loading = ref(true)
const error = ref(null)
const radarChart = ref(null)

const messages = ref(zhCN)

const model = computed(() => {
  const modelName = route.params.name
  return modelsStore.models.find(m => m.name === modelName)
})

onMounted(async () => {
  updateMessages()
  await fetchModelData()
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

async function fetchModelData() {
  loading.value = true
  error.value = null
  try {
    await modelsStore.fetchModels()
    if (!model.value) {
      error.value = t('modelDetail.modelNotFound')
    }
    await nextTick()
    if (model.value && radarChart.value) {
      initRadarChart()
    }
  } catch (err) {
    error.value = err.message || t('modelDetail.loadFailed')
  } finally {
    loading.value = false
  }
}

function initRadarChart() {
  if (!radarChart.value || !model.value) return
  
  const chart = echarts.init(radarChart.value)
  
  const sweBench = parseFloat(model.value.benchmarks?.swe_bench) || 0
  const arcAgi = parseFloat(model.value.benchmarks?.arc_agi) || 0
  const gpqa = parseFloat(model.value.benchmarks?.gpqa) || 0
  const mmlu = parseFloat(model.value.benchmarks?.mmlu) || 0
  const intelligenceLevel = parseFloat(model.value.intelligence_level) || 0
  
  // 计算代码能力和推理能力（基于真实benchmark数据）
  const codingAbility = (sweBench * 0.6 + intelligenceLevel * 0.4)
  const reasoningAbility = (gpqa * 0.4 + arcAgi * 0.3 + mmlu * 0.3)
  
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ccc',
      textStyle: {
        color: '#333'
      }
    },
    radar: {
      indicator: [
        { name: t('modelDetail.sweBench'), max: 100 },
        { name: t('modelDetail.arcAgi'), max: 100 },
        { name: t('modelDetail.gpqa'), max: 100 },
        { name: t('modelDetail.mmlu'), max: 100 },
        { name: i18nStore.locale === 'zh-CN' ? '代码能力' : 'Coding Ability', max: 100 },
        { name: i18nStore.locale === 'zh-CN' ? '推理能力' : 'Reasoning Ability', max: 100 }
      ],
      splitArea: {
        areaStyle: {
          color: ['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(59, 130, 246, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(59, 130, 246, 0.3)'
        }
      }
    },
    series: [
      {
        name: i18nStore.locale === 'zh-CN' ? '模型能力' : 'Model Capability',
        type: 'radar',
        data: [
          {
            value: [
              sweBench,
              arcAgi,
              gpqa,
              mmlu,
              codingAbility,
              reasoningAbility
            ],
            name: model.value.display_name,
            areaStyle: {
              color: 'rgba(59, 130, 246, 0.3)'
            },
            lineStyle: {
              color: 'rgba(59, 130, 246, 1)',
              width: 2
            },
            itemStyle: {
              color: 'rgba(59, 130, 246, 1)'
            }
          }
        ]
      }
    ]
  }
  chart.setOption(option)
  
  window.addEventListener('resize', () => chart.resize())
}

function goBack() {
  router.back()
}

function copyModelName() {
  if (model.value) {
    navigator.clipboard.writeText(model.value.name)
    ElMessage.success(t('modelDetail.copied'))
  }
}

function calculatePriceRatio() {
  if (!model.value) return '0'
  const ratio = model.value.output_price / model.value.input_price
  return ratio.toFixed(1)
}

function getBenchmarkGrade(score) {
  if (!score) return 'text-gray-400'
  const numScore = parseFloat(score)
  if (numScore >= 90) return 'text-green-600 dark:text-green-400 font-bold'
  if (numScore >= 80) return 'text-blue-600 dark:text-blue-400 font-bold'
  if (numScore >= 70) return 'text-yellow-600 dark:text-yellow-400 font-bold'
  if (numScore >= 60) return 'text-orange-600 dark:text-orange-400 font-bold'
  return 'text-red-600 dark:text-red-400 font-bold'
}

function getBenchmarkLabel(score) {
  if (!score) return '-'
  const numScore = parseFloat(score)
  if (numScore >= 90) return 'S级'
  if (numScore >= 80) return 'A级'
  if (numScore >= 70) return 'B级'
  if (numScore >= 60) return 'C级'
  return 'D级'
}

function getProviderLogo(provider) {
  const logoMap = {
    'OpenAI': 'openai.svg',
    'Anthropic': 'anthropic.svg',
    'Google': 'google.svg',
    'Alibaba Qwen': 'qwen.svg',
    'Zhipu AI': 'zhipu.svg',
    'xAI': 'xai.svg',
    'Mistral AI': 'mistral.svg',
    'MiniMax': 'minimax.svg',
    'Meta': 'meta.svg'
  }
  return logoMap[provider] || 'openai.svg'
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
