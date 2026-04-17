<template>
  <div class="min-h-screen bg-main selection:bg-primary selection:text-white pb-24">
    <!-- Header -->
    <header class="sticky top-0 z-50 glass-panel border-b border-border py-4">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center depth-2">
            <DocumentTextIcon class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tight leading-none mb-1">{{ $t('apiDocs.title') }}</h1>
            <p class="text-xs font-bold uppercase tracking-widest opacity-40">{{ $t('apiDocs.subtitle') }}</p>
          </div>
        </div>
        <button @click="router.push('/dashboard')" class="glass-panel px-6 py-2.5 rounded-xl font-bold text-sm interactive-scale border-border hover:bg-main/80">
          {{ $t('dashboard.console') }}
        </button>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 mt-12 space-y-12">
      <!-- Intro Section -->
      <section class="glass-panel p-10 rounded-[40px] depth-2 relative overflow-hidden">
        <div class="absolute top-[-10%] right-[-10%] w-[30%] h-[50%] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none animate-float"></div>
        <h2 class="text-3xl font-black mb-4 flex items-center gap-3">
          <RocketLaunchIcon class="w-8 h-8 text-primary" />
          {{ $t('apiDocs.quickstart') }}
        </h2>
        <p class="text-muted text-lg mb-8 max-w-2xl">
          {{ $t('apiDocs.quickstartDesc') }}
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-main/50 border border-border p-6 rounded-3xl animate-bg-linear hover:bg-primary/[0.02]">
            <p class="text-[10px] font-black uppercase tracking-widest text-muted mb-2">{{ $t('apiDocs.baseUrl') }}</p>
            <code class="font-mono font-bold text-primary">http://localhost:3000/api/v1</code>
          </div>
          <div class="bg-main/50 border border-border p-6 rounded-3xl hover:bg-primary/[0.02]">
            <p class="text-[10px] font-black uppercase tracking-widest text-muted mb-2">{{ $t('apiDocs.authentication') }}</p>
            <code class="font-mono font-bold text-primary">X-API-Key</code>
          </div>
        </div>
      </section>

      <!-- Endpoint Section -->
      <section class="glass-panel p-10 rounded-[40px] depth-2">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 class="text-3xl font-black flex items-center gap-3">
            <ChatBubbleBottomCenterTextIcon class="w-8 h-8 text-indigo-500" />
            {{ $t('apiDocs.chatCompletions') }}
          </h2>
          <div class="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
            <span class="text-[10px] font-black uppercase tracking-widest text-emerald-500">POST</span>
            <code class="font-mono text-sm font-bold text-emerald-500">/chat/completions</code>
          </div>
        </div>

        <div class="space-y-8">
          <div>
            <h3 class="text-sm font-black uppercase tracking-widest opacity-40 mb-4">{{ $t('apiDocs.requestExample') }}</h3>
            <div class="bg-gray-900 rounded-3xl p-6 overflow-x-auto relative group">
              <button class="absolute top-4 right-4 p-2 text-gray-400 hover:text-white glass-panel border-gray-700 opacity-0 group-hover:opacity-100 transition-all rounded-xl">
                <ClipboardIcon class="w-4 h-4" />
              </button>
              <pre><code class="text-sm font-mono text-gray-300">curl -X POST http://localhost:3000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $YOUR_API_KEY" \
  -d '{
    "model": "gpt-4-turbo",
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'</code></pre>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-black uppercase tracking-widest opacity-40 mb-4">{{ $t('apiDocs.parameters') }}</h3>
            <div class="bg-main/30 border border-border rounded-3xl overflow-hidden">
              <table class="w-full border-collapse">
                <tbody class="divide-y divide-border">
                  <tr class="group hover:bg-main/50 transition-colors">
                    <td class="p-6 align-top w-1/4">
                      <code class="font-mono font-bold text-primary">{{ $t('apiDocs.model') }}</code>
                      <span class="block text-[10px] font-black uppercase tracking-widest text-rose-500 mt-1">{{ $t('apiDocs.required') }}</span>
                    </td>
                    <td class="p-6">
                      <p class="text-sm text-muted">{{ $t('apiDocs.modelDesc') }}</p>
                    </td>
                  </tr>
                  <tr class="group hover:bg-main/50 transition-colors">
                    <td class="p-6 align-top w-1/4">
                      <code class="font-mono font-bold text-primary">{{ $t('apiDocs.messages') }}</code>
                      <span class="block text-[10px] font-black uppercase tracking-widest text-rose-500 mt-1">{{ $t('apiDocs.required') }}</span>
                    </td>
                    <td class="p-6">
                      <p class="text-sm text-muted">{{ $t('apiDocs.messagesDesc') }}</p>
                    </td>
                  </tr>
                  <tr class="group hover:bg-main/50 transition-colors">
                    <td class="p-6 align-top w-1/4">
                      <code class="font-mono font-bold text-primary">{{ $t('apiDocs.temperature') }}</code>
                    </td>
                    <td class="p-6">
                      <p class="text-sm text-muted">{{ $t('apiDocs.temperatureDesc') }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Error Codes -->
      <section class="glass-panel p-10 rounded-[40px] depth-2">
        <h2 class="text-3xl font-black mb-8 flex items-center gap-3">
          <ShieldExclamationIcon class="w-8 h-8 text-rose-500" />
          {{ $t('apiDocs.errorHandling') }}
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl interactive-scale hover:shadow-lg transition-all">
            <h4 class="font-mono font-bold text-rose-500 text-xl mb-2">{{ $t('apiDocs.err401') }}</h4>
            <p class="text-sm text-rose-500/80">{{ $t('apiDocs.err401Desc') }}</p>
          </div>
          <div class="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl interactive-scale hover:shadow-lg transition-all">
            <h4 class="font-mono font-bold text-amber-500 text-xl mb-2">{{ $t('apiDocs.err402') }}</h4>
            <p class="text-sm text-amber-500/80">{{ $t('apiDocs.err402Desc') }}</p>
          </div>
          <div class="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-3xl interactive-scale hover:shadow-lg transition-all">
            <h4 class="font-mono font-bold text-indigo-500 text-xl mb-2">{{ $t('apiDocs.err429') }}</h4>
            <p class="text-sm text-indigo-500/80">{{ $t('apiDocs.err429Desc') }}</p>
          </div>
          <div class="bg-slate-500/10 border border-slate-500/20 p-6 rounded-3xl interactive-scale hover:shadow-lg transition-all">
            <h4 class="font-mono font-bold text-slate-500 text-xl mb-2">{{ $t('apiDocs.err404') }}</h4>
            <p class="text-sm text-slate-500/80">{{ $t('apiDocs.err404Desc') }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  DocumentTextIcon, 
  RocketLaunchIcon, 
  ChatBubbleBottomCenterTextIcon,
  ShieldExclamationIcon,
  ClipboardIcon
} from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
</script>
