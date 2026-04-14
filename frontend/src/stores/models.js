import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_BASE = '/api'

export const useModelsStore = defineStore('models', () => {
  const models = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchModels() {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_BASE}/models`)
      models.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to fetch models'
    } finally {
      loading.value = false
    }
  }

  async function chatCompletion(model, messages, options = {}) {
    try {
      const authStore = useAuthStore()
      const response = await axios.post(`${API_BASE}/v1/chat/completions`, {
        model,
        messages,
        ...options
      }, {
        headers: { 'X-API-Key': authStore.apiKey }
      })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Chat completion failed' }
    }
  }

  return {
    models,
    loading,
    error,
    fetchModels,
    chatCompletion
  }
})
