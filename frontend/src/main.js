import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import './style.css'
import zhCN from './locales/zh-CN.js'
import enUS from './locales/en-US.js'
import { useI18nStore } from './stores/i18n'
import { FPSMonitor, PerformanceMetrics, rafThrottle, scheduleIdleCallback } from './utils/performance.js'

const pinia = createPinia()

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ElementPlus)

const i18nStore = useI18nStore()
i18n.global.locale.value = i18nStore.locale

watch(() => i18nStore.locale, (newLocale) => {
  i18n.global.locale.value = newLocale
})

const fpsMonitor = new FPSMonitor()
const performanceMetrics = new PerformanceMetrics()

if (import.meta.env.DEV) {
  fpsMonitor.start()
  fpsMonitor.onFPSChange((fps) => {
    if (fps < 30) {
      console.warn(`Low FPS detected: ${fps}`)
    }
  })
  
  performanceMetrics.observePaint()
  performanceMetrics.observeLayoutShift()
}

app.config.globalProperties.$fpsMonitor = fpsMonitor
app.config.globalProperties.$performanceMetrics = performanceMetrics
app.config.globalProperties.$rafThrottle = rafThrottle
app.config.globalProperties.$scheduleIdleCallback = scheduleIdleCallback

const handleScroll = rafThrottle(() => {})

window.addEventListener('scroll', handleScroll, { passive: true })

scheduleIdleCallback(() => {
  if ('serviceWorker' in navigator) {}
})

app.mount('#app')
