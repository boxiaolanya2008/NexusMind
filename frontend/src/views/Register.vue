<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">NexusMind</h1>
        <p class="text-gray-600 dark:text-gray-400">AI模型代理平台</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">用户名</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="请输入用户名"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">邮箱（可选）</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="请输入邮箱"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">密码</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="请输入密码"
          />
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gray-900 dark:bg-gray-700 text-white py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <div class="text-center mt-6">
        <span class="text-gray-600 dark:text-gray-400">已有账号？</span>
        <router-link to="/login" class="text-gray-900 dark:text-white font-medium ml-2">登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: ''
})

async function handleRegister() {
  if (!form.username || !form.password) {
    ElMessage.error('请输入用户名和密码')
    return
  }
  
  loading.value = true
  const result = await authStore.register(form.username, form.password, form.email)
  loading.value = false
  
  if (result.success) {
    ElMessage.success('注册成功')
    router.push('/login')
  } else {
    ElMessage.error(result.error)
  }
}
</script>
