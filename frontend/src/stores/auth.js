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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    apiKey: localStorage.getItem('apiKey') || null,
    loading: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  
  actions: {
    async register(username, password, email) {
      this.loading = true;
      try {
        const response = await api.post('/auth/register', {
          username,
          password,
          email
        }, { retry: 3, retryDelay: 1000 })
        const data = response.data
        this.apiKey = data.api_key
        localStorage.setItem('apiKey', data.api_key)
        return { success: true, data }
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Registration failed' }
      } finally {
        this.loading = false;
      }
    },
    
    async login(username, password) {
      this.loading = true;
      try {
        const response = await api.post('/auth/login', {
          username,
          password
        }, { retry: 3, retryDelay: 1000 })
        const data = response.data
        this.token = data.token
        this.user = data.user
        this.apiKey = data.user.api_key
        localStorage.setItem('token', data.token)
        localStorage.setItem('apiKey', data.user.api_key)
        return { success: true, data }
      } catch (error) {
        return { success: false, error: error.response?.data?.error || 'Login failed' }
      } finally {
        this.loading = false;
      }
    },
    
    async fetchProfile() {
      if (!this.token) return { success: false, error: 'No token' };
      
      try {
        const response = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${this.token}` }
        }, { retry: 2, retryDelay: 1000 })
        
        const data = response.data
        this.user = data
        this.apiKey = data.api_key || data.apiKey
        return { success: true, data }
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          this.logout()
        }
        return { success: false, error: error.response?.data?.error || 'Failed to fetch profile' }
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      this.apiKey = null;
      localStorage.removeItem('token');
      localStorage.removeItem('apiKey');
      // 可以考虑如果使用 vue-router 则使用 router.push('/login')，
      // 但这里为了纯粹的状态管理，由视图层调用后自行路由跳转。
    }
  }
})
