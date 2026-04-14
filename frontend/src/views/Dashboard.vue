<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">NexusMind 控制台</h1>
            <span class="text-sm text-gray-500 dark:text-gray-400">|</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ user?.username }}</span>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-right">
              <div class="text-xs text-gray-500 dark:text-gray-400">账户余额</div>
              <div class="text-lg font-bold text-green-600 dark:text-green-400">${{ user?.balance?.toFixed(2) || '0.00' }}</div>
            </div>
            <button
              @click="showRechargeDialog = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
            >
              充值
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">总请求数</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalRequests || 0 }}</div>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">Token消耗</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalTokens) }}</div>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">总花费</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">${{ stats.totalCost?.toFixed(2) || '0.00' }}</div>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">近30天Token</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.last30DaysTokens) }}</div>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：API密钥和使用趋势 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- API密钥卡片 -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
              API密钥
            </h3>
            <div class="flex space-x-2">
              <input
                :value="apiKey"
                readonly
                class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                @click="copyApiKey"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                复制
              </button>
              <button
                @click="showApiKeyDialog = true"
                class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              >
                管理
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">
              请妥善保管您的API密钥，不要泄露给他人
            </p>
          </div>

          <!-- 使用趋势图表 -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
              </svg>
              使用趋势
            </h3>
            <div ref="trendChart" class="h-72"></div>
          </div>

          <!-- 模型消耗统计 -->
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              模型消耗统计
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200 dark:border-gray-700">
                    <th class="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">模型</th>
                    <th class="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Token消耗</th>
                    <th class="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">消费金额</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="model in stats.modelStats || []"
                    :key="model.model_name"
                    class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td class="py-3 px-4">
                      <div class="text-gray-900 dark:text-white font-medium">{{ model.model_name }}</div>
                      <div class="text-gray-600 dark:text-gray-400 text-sm">{{ model.provider }}</div>
                    </td>
                    <td class="py-3 px-4 text-right text-gray-900 dark:text-white">{{ formatNumber(model.total_tokens) }}</td>
                    <td class="py-3 px-4 text-right text-gray-900 dark:text-white">${{ (model.total_cost || 0).toFixed(4) }}</td>
                  </tr>
                  <tr v-if="!stats.modelStats || stats.modelStats.length === 0">
                    <td colspan="3" class="py-8 text-center text-gray-500 dark:text-gray-400">
                      暂无消耗数据
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 右侧：模型列表 -->
        <div class="space-y-6">
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                可用模型
              </h3>
              <span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">{{ models.length }} 个模型</span>
            </div>
            <div class="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              <div
                v-for="model in models"
                :key="model.id"
                class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                @click="selectModel(model)"
              >
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <img :src="`/logos/${getProviderLogo(model.provider)}`" :alt="model.provider" class="w-6 h-6" />
                  </div>
                  <div class="flex-1">
                    <div class="text-gray-900 dark:text-white font-semibold text-sm">{{ model.display_name }}</div>
                    <div class="text-gray-600 dark:text-gray-400 text-xs">{{ model.provider }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      <span class="text-blue-600 dark:text-blue-400 font-semibold">${{ model.input_price }}</span>
                      <span class="text-gray-400">/</span>
                      <span class="text-green-600 dark:text-green-400">${{ model.output_price }}</span>
                    </div>
                    <div class="text-xs text-gray-400">每百万tokens</div>
                  </div>
                </div>
                <div class="flex items-center space-x-2 mt-2">
                  <span
                    :class="model.quality_level === 'high' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'"
                    class="px-2 py-0.5 rounded text-xs"
                  >
                    {{ model.quality_level === 'high' ? '高质量' : '中等' }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    智能等级: {{ model.intelligence_level }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">快捷操作</h3>
            <div class="space-y-2">
              <button
                @click="showRechargeDialog = true"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>充值</span>
              </button>
              <button
                @click="goToAdmin"
                v-if="isAdmin"
                class="w-full bg-gray-700 hover:bg-gray-800 text-white px-4 py-3 rounded-lg text-sm flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>管理面板</span>
              </button>
              <button
                @click="router.push('/api-docs')"
                class="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg text-sm flex items-center justify-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>API文档</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 充值对话框 -->
    <el-dialog v-model="showRechargeDialog" title="账户充值" width="400px">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">充值金额</label>
          <input
            v-model="rechargeAmount"
            type="number"
            placeholder="请输入充值金额"
            class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">备注</label>
          <input
            v-model="rechargeNote"
            type="text"
            placeholder="可选备注信息"
            class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      <template #footer>
        <button
          @click="showRechargeDialog = false"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          取消
        </button>
        <button
          @click="recharge"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          确认充值
        </button>
      </template>
    </el-dialog>

    <!-- API密钥管理对话框 -->
    <el-dialog v-model="showApiKeyDialog" title="API密钥管理" width="500px">
      <div class="space-y-4">
        <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">当前API密钥</label>
          <div class="flex space-x-2">
            <input
              :value="apiKey"
              readonly
              class="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono"
            />
            <button
              @click="copyApiKey"
              class="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded text-sm"
            >
              复制
            </button>
          </div>
        </div>
        <div class="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 p-4 rounded">
          <div class="flex items-start space-x-2">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div class="text-sm text-yellow-800 dark:text-yellow-200">
              API密钥是您访问服务的唯一凭证，请妥善保管。如怀疑密钥泄露，请联系管理员重置。
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button
          @click="showApiKeyDialog = false"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
        >
          关闭
        </button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useModelsStore } from '../stores/models'
import { useThemeStore } from '../stores/theme'
import { useI18nStore } from '../stores/i18n'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import zhCN from '../locales/zh-CN.js'
import enUS from '../locales/en-US.js'

const router = useRouter()
const authStore = useAuthStore()
const modelsStore = useModelsStore()
const themeStore = useThemeStore()
const i18nStore = useI18nStore()

const user = computed(() => authStore.user)
const apiKey = computed(() => authStore.apiKey)
const models = computed(() => modelsStore.models)
const selectedModel = ref(null)
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

const trendChart = ref(null)
const modelChart = ref(null)

const messages = ref(zhCN)

onMounted(async () => {
  updateMessages()
  await authStore.fetchProfile()
  await modelsStore.fetchModels()
  await fetchStats()
  await nextTick()
  initCharts()
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

async function fetchStats() {
  try {
    const token = authStore.token
    const response = await fetch('http://localhost:3000/api/auth/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }
    
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
    stats.value = {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      last30DaysTokens: 0,
      dailyTokenData: new Array(30).fill(0),
      modelStats: []
    }
  }
}

async function initCharts() {
  if (trendChart.value) {
    const chart = echarts.init(trendChart.value)
    const option = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: Array.from({ length: 30 }, (_, i) => i + 1),
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280'
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280'
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      series: [
        {
          name: 'Token消耗',
          type: 'line',
          data: stats.value.dailyTokenData || new Array(30).fill(0),
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
              ]
            }
          },
          lineStyle: {
            color: '#3b82f6',
            width: 2
          },
          itemStyle: {
            color: '#3b82f6'
          }
        }
      ]
    }
    chart.setOption(option)
    window.addEventListener('resize', () => chart.resize())
  }

  if (modelChart.value) {
    const chart = echarts.init(modelChart.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        data: [
          { value: 1048, name: 'GPT-4' },
          { value: 735, name: 'Claude' },
          { value: 580, name: 'Gemini' },
          { value: 484, name: 'Others' }
        ]
      }]
    })
    window.addEventListener('resize', () => chart.resize())
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/')
}

function copyApiKey() {
  navigator.clipboard.writeText(apiKey.value)
  ElMessage.success('API密钥已复制')
}

function formatNumber(num) {
  if (!num) return '0'
  return num.toLocaleString()
}

function selectModel(model) {
  router.push({ name: 'ModelDetail', params: { name: model.name } })
}

function goToAdmin() {
  router.push('/admin')
}

async function recharge() {
  if (!rechargeAmount.value || isNaN(rechargeAmount.value)) {
    ElMessage.error('请输入有效的充值金额')
    return
  }
  
  try {
    const token = authStore.token
    const response = await fetch('http://localhost:3000/api/admin/add-balance', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.value.id,
        amount: parseFloat(rechargeAmount.value),
        description: rechargeNote.value || '用户充值'
      })
    })
    
    if (!response.ok) {
      throw new Error('充值失败')
    }
    
    ElMessage.success('充值成功')
    showRechargeDialog.value = false
    rechargeAmount.value = ''
    rechargeNote.value = ''
    await authStore.fetchProfile()
    await fetchStats()
  } catch (error) {
    console.error('充值失败:', error)
    ElMessage.error('充值失败')
  }
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
    'MiniMax': 'minimax.svg'
  }
  return logoMap[provider] || 'openai.svg'
}
</script>
