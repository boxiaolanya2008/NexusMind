<template>
  <div class="min-h-screen bg-main selection:bg-primary selection:text-white">
    <!-- Header: Consistent with Dashboard -->
    <header class="sticky top-0 z-50 glass-panel border-b border-border py-4">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center depth-2">
            <ShieldCheckIcon class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tight leading-none mb-1">{{ $t('admin.title') }}</h1>
            <p class="text-xs font-bold uppercase tracking-widest opacity-40">{{ $t('admin.subtitle') }}</p>
          </div>
        </div>
        <button @click="goToDashboard" class="glass-panel px-6 py-2.5 rounded-xl font-bold text-sm interactive-scale border-border hover:bg-main/80">
          {{ $t('common.backToConsole') }}
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Tabs -->
      <div class="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button v-for="tab in ['users', 'models', 'stats']" :key="tab"
          @click="activeTab = tab"
          :class="['px-6 py-3 rounded-2xl font-bold text-sm capitalize tracking-wider transition-all interactive-scale',
            activeTab === tab ? 'bg-primary text-white depth-2 shadow-blue-500/20 shadow-lg' : 'glass-panel text-muted hover:bg-main/50'
          ]">
          {{ $t(`admin.${tab}Mgmt`) }}
        </button>
      </div>
      
      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="glass-panel p-10 rounded-[40px] depth-2 animate-fade-in">
        <h3 class="text-2xl font-bold mb-8 flex items-center gap-3">
          <UserGroupIcon class="w-6 h-6 text-primary" />
          {{ $t('admin.usersDirectory') }}
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="text-left border-b border-border pb-4">
                <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.id') }}</th>
                <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.username') }}</th>
                <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.email') }}</th>
                <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.balance') }}</th>
                <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.role') }}</th>
                <th class="pb-6 text-right text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="user in users" :key="user.id" class="group hover:bg-primary/[0.02] transition-colors">
                <td class="py-6 font-mono text-sm opacity-50">{{ user.id }}</td>
                <td class="py-6 font-bold">{{ user.username }}</td>
                <td class="py-6 text-sm text-muted">{{ user.email || '—' }}</td>
                <td class="py-6 font-mono font-bold text-emerald-500">${{ user.balance?.toFixed(2) || '0.00' }}</td>
                <td class="py-6">
                  <span :class="['px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest', user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-main border border-border text-muted']">
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-6 text-right space-x-3">
                  <button @click="addBalance(user)" class="text-xs font-bold text-primary hover:underline">{{ $t('admin.addBalance') }}</button>
                  <button @click="deleteUser(user)" class="text-xs font-bold text-rose-500 hover:underline">{{ $t('admin.delete') }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Models Tab -->
      <div v-if="activeTab === 'models'" class="glass-panel p-10 rounded-[40px] depth-2 animate-fade-in">
        <h3 class="text-2xl font-bold mb-8 flex items-center gap-3">
          <CpuChipIcon class="w-6 h-6 text-primary" />
          {{ $t('admin.modelEcosystem') }}
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="text-left border-b border-border pb-4">
                <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.id') }}</th>
                <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.apiName') }}</th>
                <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.displayName') }}</th>
                <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.intelligence') }}</th>
                <th class="pb-6 text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.quality') }}</th>
                <th class="pb-6 text-right text-[10px] font-black uppercase tracking-widest opacity-40">{{ $t('admin.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="model in models" :key="model.id" class="group hover:bg-primary/[0.02] transition-colors">
                <td class="py-6 font-mono text-sm opacity-50">{{ model.id }}</td>
                <td class="py-6 font-mono text-sm font-bold">{{ model.name }}</td>
                <td class="py-6 font-bold">{{ model.display_name }}</td>
                <td class="py-6">
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-2 bg-main border border-border rounded-full overflow-hidden">
                      <div class="h-full bg-primary" :style="{ width: `${model.intelligence_level}%` }"></div>
                    </div>
                    <span class="text-xs font-bold">{{ model.intelligence_level }}</span>
                  </div>
                </td>
                <td class="py-6">
                  <span class="px-3 py-1 bg-main border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-muted">
                    {{ model.quality_level }}
                  </span>
                </td>
                <td class="py-6 text-right">
                  <button @click="editModelIntelligence(model)" class="text-xs font-bold text-primary hover:underline">{{ $t('admin.editTuning') }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Stats Tab -->
      <div v-if="activeTab === 'stats'" class="animate-fade-in space-y-8">
        <h3 class="text-2xl font-bold mb-4 flex items-center gap-3">
          <ChartBarIcon class="w-6 h-6 text-primary" />
          {{ $t('admin.platformAnalytics') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass-panel p-8 rounded-[32px] depth-1 hover:depth-2 transition-all">
            <p class="text-xs font-black uppercase tracking-widest opacity-40 mb-4">{{ $t('admin.totalUsers') }}</p>
            <p class="text-4xl font-mono font-black text-primary">{{ stats.totalUsers }}</p>
          </div>
          <div class="glass-panel p-8 rounded-[32px] depth-1 hover:depth-2 transition-all">
            <p class="text-xs font-black uppercase tracking-widest opacity-40 mb-4">{{ $t('admin.totalRequests') }}</p>
            <p class="text-4xl font-mono font-black text-indigo-500">{{ stats.totalRequests }}</p>
          </div>
          <div class="glass-panel p-8 rounded-[32px] depth-1 hover:depth-2 transition-all">
            <p class="text-xs font-black uppercase tracking-widest opacity-40 mb-4">{{ $t('admin.totalRevenue') }}</p>
            <p class="text-4xl font-mono font-black text-emerald-500">${{ stats.totalRevenue?.toFixed(2) }}</p>
          </div>
          <div class="glass-panel p-8 rounded-[32px] depth-1 hover:depth-2 transition-all">
            <p class="text-xs font-black uppercase tracking-widest opacity-40 mb-4">{{ $t('admin.recentCost') }}</p>
            <p class="text-4xl font-mono font-black text-rose-500">${{ stats.recentCost?.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Balance Dialog -->
    <el-dialog v-model="balanceDialogVisible" width="400px" custom-class="glass-panel !rounded-[32px] !border-none !p-0" :show-close="false">
      <div class="p-8 pt-8 space-y-6">
        <h3 class="text-xl font-bold mb-4">{{ $t('admin.addBalance') }}</h3>
        <div>
          <label class="block text-xs font-black uppercase tracking-widest opacity-40 mb-3">{{ $t('admin.amountUsd') }}</label>
          <input v-model.number="balanceForm.amount" type="number"
            class="w-full bg-main border border-border rounded-2xl px-6 py-4 font-mono font-bold text-xl focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label class="block text-xs font-black uppercase tracking-widest opacity-40 mb-3">{{ $t('admin.description') }}</label>
          <input v-model="balanceForm.description" type="text"
            class="w-full bg-main border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary" />
        </div>
      </div>
      <template #footer>
        <div class="px-8 pb-8 flex gap-4">
          <button @click="balanceDialogVisible = false" class="flex-1 py-4 font-bold text-sm opacity-50 hover:opacity-100 transition-opacity">{{ $t('admin.cancel') }}</button>
          <button @click="confirmAddBalance" class="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold text-sm interactive-scale depth-2">{{ $t('admin.confirmAdd') }}</button>
        </div>
      </template>
    </el-dialog>
    
    <!-- Intelligence Dialog -->
    <el-dialog v-model="intelligenceDialogVisible" width="400px" custom-class="glass-panel !rounded-[32px] !border-none !p-0" :show-close="false">
      <div class="p-8 pt-8 space-y-6">
        <h3 class="text-xl font-bold mb-4">{{ $t('admin.editTuning') }}</h3>
        <div>
          <label class="block text-xs font-black uppercase tracking-widest opacity-40 mb-3">{{ $t('admin.intelLevel') }}</label>
          <input v-model.number="intelligenceForm.intelligenceLevel" type="number" min="0" max="100"
            class="w-full bg-main border border-border rounded-2xl px-6 py-4 font-mono font-bold text-xl focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label class="block text-xs font-black uppercase tracking-widest opacity-40 mb-3">{{ $t('admin.qualityLevel') }}</label>
          <select v-model="intelligenceForm.qualityLevel"
            class="w-full bg-main border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary appearance-none">
            <option value="low">{{ $t('admin.low') }}</option>
            <option value="medium">{{ $t('admin.medium') }}</option>
            <option value="high">{{ $t('admin.high') }}</option>
          </select>
        </div>
      </div>
      <template #footer>
        <div class="px-8 pb-8 flex gap-4">
          <button @click="intelligenceDialogVisible = false" class="flex-1 py-4 font-bold text-sm opacity-50 hover:opacity-100 transition-opacity">{{ $t('admin.cancel') }}</button>
          <button @click="confirmEditIntelligence" class="flex-[2] bg-primary text-white py-4 rounded-2xl font-bold text-sm interactive-scale depth-2">{{ $t('admin.saveTuning') }}</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useModelsStore } from '../stores/models'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

import { ShieldCheckIcon, UserGroupIcon, CpuChipIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

const API_BASE = 'http://localhost:3000/api'

const router = useRouter()
const authStore = useAuthStore()
const modelsStore = useModelsStore()
const { t } = useI18n()

const activeTab = ref('users')
const users = ref([])
const models = computed(() => modelsStore.models)
const stats = ref({ totalUsers: 0, totalRequests: 0, totalRevenue: 0, recentCost: 0 })

const balanceDialogVisible = ref(false)
const balanceForm = reactive({ userId: null, amount: 0, description: '' })
const selectedUser = ref(null)

const intelligenceDialogVisible = ref(false)
const intelligenceForm = reactive({ modelId: null, intelligenceLevel: 100, qualityLevel: 'high' })
const selectedModel = ref(null)

onMounted(async () => {
  await fetchUsers()
  await modelsStore.fetchModels()
  await fetchStats()
})

async function fetchUsers() {
  try {
    const token = authStore.token
    const response = await axios.get(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    users.value = response.data
  } catch (error) {
    ElMessage.error(t('admin.fetchUsersFailed'))
  }
}

async function fetchStats() {
  try {
    const token = authStore.token
    const response = await axios.get(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    stats.value = response.data
  } catch (error) {
    ElMessage.error(t('admin.fetchStatsFailed'))
  }
}

function goToDashboard() {
  router.push('/dashboard')
}

function addBalance(user) {
  selectedUser.value = user
  balanceForm.userId = user.id
  balanceForm.amount = 0
  balanceForm.description = ''
  balanceDialogVisible.value = true
}

async function confirmAddBalance() {
  try {
    const token = authStore.token
    await axios.post(`${API_BASE}/admin/add-balance`, {
      userId: balanceForm.userId,
      amount: balanceForm.amount,
      description: balanceForm.description
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    ElMessage.success(t('admin.balanceAdded'))
    balanceDialogVisible.value = false
    await fetchUsers()
  } catch (error) {
    ElMessage.error(t('admin.addBalanceFailed'))
  }
}

async function deleteUser(user) {
  try {
    await ElMessageBox.confirm(t('admin.deleteConfirm'), t('admin.warning'), {
      type: 'warning',
      customClass: 'glass-panel !rounded-[32px] !border-none'
    })
    const token = authStore.token
    await axios.delete(`${API_BASE}/admin/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    ElMessage.success(t('admin.userDeleted'))
    await fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('admin.deleteUserFailed'))
    }
  }
}

function editModelIntelligence(model) {
  selectedModel.value = model
  intelligenceForm.modelId = model.id
  intelligenceForm.intelligenceLevel = model.intelligence_level
  intelligenceForm.qualityLevel = model.quality_level
  intelligenceDialogVisible.value = true
}

async function confirmEditIntelligence() {
  try {
    const token = authStore.token
    await axios.post(`${API_BASE}/admin/model-intelligence`, {
      modelId: intelligenceForm.modelId,
      intelligenceLevel: intelligenceForm.intelligenceLevel,
      qualityLevel: intelligenceForm.qualityLevel
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    ElMessage.success(t('admin.tuningUpdated'))
    intelligenceDialogVisible.value = false
    await modelsStore.fetchModels()
  } catch (error) {
    ElMessage.error(t('admin.updateTuningFailed'))
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
</style>
