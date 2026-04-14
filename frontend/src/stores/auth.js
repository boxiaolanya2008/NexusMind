import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000
})

api.interceptors.response.use(undefined, async (error) => {
  const config = error.config
  if (!config || !config.retry) return Promise.reject(error)

  config.__retryCount = config.__retryCount || 0
  if (config.__retryCount >= config.retry) return Promise.reject(error)

  config.__retryCount += 1
  await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000))
  return api(config)
})

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const apiKey = ref(localStorage.getItem('apiKey') || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function register(username, password, email) {
    try {
      const response = await api.post('/auth/register', {
        username,
        password,
        email
      }, { retry: 3, retryDelay: 1000 })
      apiKey.value = response.data.api_key
      localStorage.setItem('apiKey', response.data.api_key)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' }
    }
  }

  async function login(username, password) {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      }, { retry: 3, retryDelay: 1000 })
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('apiKey', response.data.user.api_key)
      apiKey.value = response.data.user.api_key
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    apiKey.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('apiKey')
  }

  async function fetchProfile() {
    try {
      const response = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token.value}` }
      }, { retry: 2, retryDelay: 1000 })
      user.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch profile' }
    }
  }

  return {
    user,
    token,
    apiKey,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
    fetchProfile
  }
})
