<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">管理后台</h1>
      
      <div class="mb-6">
        <button
          @click="activeTab = 'users'"
          :class="activeTab === 'users' ? 'bg-gray-900 dark:bg-gray-700 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'"
          class="px-4 py-2 mr-2 border border-gray-200 dark:border-gray-700"
        >
          用户管理
        </button>
        <button
          @click="activeTab = 'models'"
          :class="activeTab === 'models' ? 'bg-gray-900 dark:bg-gray-700 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'"
          class="px-4 py-2 mr-2 border border-gray-200 dark:border-gray-700"
        >
          模型管理
        </button>
        <button
          @click="activeTab = 'stats'"
          :class="activeTab === 'stats' ? 'bg-gray-900 dark:bg-gray-700 text-white' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'"
          class="px-4 py-2 border border-gray-200 dark:border-gray-700"
        >
          统计
        </button>
      </div>
      
      <div v-if="activeTab === 'users'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">用户管理</h3>
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">ID</th>
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">用户名</th>
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">邮箱</th>
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">余额</th>
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">角色</th>
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-gray-200 dark:border-gray-700">
              <td class="py-2 px-4 text-gray-900 dark:text-white">{{ user.id }}</td>
              <td class="py-2 px-4 text-gray-900 dark:text-white">{{ user.username }}</td>
              <td class="py-2 px-4 text-gray-900 dark:text-white">{{ user.email || '-' }}</td>
              <td class="py-2 px-4 text-gray-900 dark:text-white">${{ user.balance?.toFixed(2) || '0.00' }}</td>
              <td class="py-2 px-4 text-gray-900 dark:text-white">{{ user.role }}</td>
              <td class="py-2 px-4">
                <button @click="addBalance(user)" class="text-blue-600 dark:text-blue-400 mr-2">添加余额</button>
                <button @click="deleteUser(user)" class="text-red-600 dark:text-red-400">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="activeTab === 'models'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">模型管理</h3>
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">ID</th>
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">名称</th>
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">显示名称</th>
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">智商</th>
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">质量</th>
              <th class="text-left py-2 px-4 text-gray-900 dark:text-white">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="model in models" :key="model.id" class="border-b border-gray-200 dark:border-gray-700">
              <td class="py-2 px-4 text-gray-900 dark:text-white">{{ model.id }}</td>
              <td class="py-2 px-4 text-gray-900 dark:text-white">{{ model.name }}</td>
              <td class="py-2 px-4 text-gray-900 dark:text-white">{{ model.display_name }}</td>
              <td class="py-2 px-4 text-gray-900 dark:text-white">{{ model.intelligence_level }}</td>
              <td class="py-2 px-4 text-gray-900 dark:text-white">{{ model.quality_level }}</td>
              <td class="py-2 px-4">
                <button @click="editModelIntelligence(model)" class="text-blue-600 dark:text-blue-400">编辑智商</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="activeTab === 'stats'" class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">统计</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="border border-gray-200 dark:border-gray-700 p-6">
            <p class="text-gray-600 dark:text-gray-400">总用户数</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalUsers }}</p>
          </div>
          <div class="border border-gray-200 dark:border-gray-700 p-6">
            <p class="text-gray-600 dark:text-gray-400">总请求数</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalRequests }}</p>
          </div>
          <div class="border border-gray-200 dark:border-gray-700 p-6">
            <p class="text-gray-600 dark:text-gray-400">总收入</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">${{ stats.totalRevenue?.toFixed(2) }}</p>
          </div>
          <div class="border border-gray-200 dark:border-gray-700 p-6">
            <p class="text-gray-600 dark:text-gray-400">近期成本</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">${{ stats.recentCost?.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="balanceDialogVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 p-6 rounded w-96">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">添加余额</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">金额</label>
            <input v-model.number="balanceForm.amount" type="number" class="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">描述</label>
            <input v-model="balanceForm.description" class="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
        </div>
        <div class="flex justify-end mt-6 space-x-2">
          <button @click="balanceDialogVisible = false" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded">取消</button>
          <button @click="confirmAddBalance" class="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded">确认</button>
        </div>
      </div>
    </div>
    
    <div v-if="intelligenceDialogVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 p-6 rounded w-96">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">编辑模型智商</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">智商等级 (0-100)</label>
            <input v-model.number="intelligenceForm.intelligenceLevel" type="number" min="0" max="100" class="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">质量等级</label>
            <select v-model="intelligenceForm.qualityLevel" class="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end mt-6 space-x-2">
          <button @click="intelligenceDialogVisible = false" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded">取消</button>
          <button @click="confirmEditIntelligence" class="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useModelsStore } from '../stores/models'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const API_BASE = 'http://localhost:3000/api'

const router = useRouter()
const authStore = useAuthStore()
const modelsStore = useModelsStore()

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
    ElMessage.error('获取用户列表失败')
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
    ElMessage.error('获取统计数据失败')
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/')
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
    ElMessage.success('余额添加成功')
    balanceDialogVisible.value = false
    await fetchUsers()
  } catch (error) {
    ElMessage.error('添加余额失败')
  }
}

async function deleteUser(user) {
  try {
    await ElMessageBox.confirm('确定要删除此用户吗？', '警告', {
      type: 'warning'
    })
    const token = authStore.token
    await axios.delete(`${API_BASE}/admin/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    ElMessage.success('用户删除成功')
    await fetchUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除用户失败')
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
    ElMessage.success('模型智商更新成功')
    intelligenceDialogVisible.value = false
    await modelsStore.fetchModels()
  } catch (error) {
    ElMessage.error('更新模型智商失败')
  }
}
</script>
