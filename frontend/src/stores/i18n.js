import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref(localStorage.getItem('locale') || 'zh-CN')

  function setLocale(lang) {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  function toggleLocale() {
    locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
    localStorage.setItem('locale', locale.value)
  }

  return {
    locale,
    setLocale,
    toggleLocale
  }
})
