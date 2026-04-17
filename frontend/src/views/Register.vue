<template>
  <div class="min-h-screen flex items-center justify-center bg-main selection:bg-primary selection:text-white px-4 relative overflow-hidden">
    <div class="absolute inset-0 z-0 pointer-events-none opacity-30">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] animate-float"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] animate-float" style="animation-delay: -3s"></div>
    </div>

    <div class="max-w-md w-full glass-panel p-10 md:p-12 rounded-[40px] depth-3 relative z-10 animate-slide-in">
      <div class="text-center mb-10">
        <div class="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center mb-6 depth-2 shadow-blue-500/30 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h1 class="text-3xl font-black tracking-tight mb-2">{{ $t('auth.register') }}</h1>
        <p class="text-xs font-bold uppercase tracking-widest text-muted">{{ $t('auth.joinEcosystem') }}</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">{{ $t('auth.username') }}</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full bg-main/50 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all focus:ring-4 focus:ring-primary/10"
            :placeholder="$t('auth.usernameRequired')"
          />
        </div>
        
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">{{ $t('auth.email') }}</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full bg-main/50 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all focus:ring-4 focus:ring-primary/10"
            placeholder="example@mail.com"
          />
        </div>
        
        <div>
          <label class="block text-[10px] font-black uppercase tracking-widest text-muted mb-2">{{ $t('auth.password') }}</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full bg-main/50 border border-border rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all focus:ring-4 focus:ring-primary/10"
            :placeholder="$t('auth.passwordRequired')"
          />
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary text-white py-4 rounded-2xl font-bold interactive-scale depth-2 hover:bg-primary-hover shadow-blue-500/20 shadow-lg disabled:opacity-50 disabled:grayscale transition-all mt-4"
        >
          {{ loading ? $t('auth.creating') : $t('auth.register') }}
        </button>
      </form>
      
      <div class="text-center mt-8 pt-8 border-t border-border">
        <span class="text-sm text-muted">{{ $t('auth.hasAccount') }}</span>
        <router-link to="/login" class="text-sm font-bold text-primary ml-2 hover:underline">{{ $t('auth.login') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: ''
})

async function handleRegister() {
  if (!form.username || !form.password) {
    ElMessage.error(t('auth.usernameRequired'))
    return
  }
  
  loading.value = true
  const result = await authStore.register(form.username, form.password, form.email)
  loading.value = false
  
  if (result.success) {
    ElMessage.success(t('auth.registerSuccess'))
    router.push('/login')
  } else {
    ElMessage.error(result.error)
  }
}
</script>
