<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <section class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-indigo-900 dark:to-blue-950 text-white py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center animate-fade-in-up">
          <div class="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span class="text-sm font-medium">🚀 {{ t('home.hero.badge') }}</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            {{ t('home.hero.title') }}
          </h1>
          <p class="text-2xl md:text-3xl mb-8 text-blue-100 font-light">
            {{ t('home.hero.subtitle') }}
          </p>
          <p class="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-blue-200 leading-relaxed">
            {{ t('home.hero.description') }}
            <br/>{{ t('home.hero.feature') }}
          </p>
          <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <router-link to="/register" class="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg">
              {{ t('home.hero.getStarted') }}
            </router-link>
            <router-link to="/api-docs" class="bg-blue-700/50 backdrop-blur-sm text-white px-10 py-4 rounded-xl font-semibold hover:bg-blue-600/50 transition-all duration-300 border border-blue-500/50 hover:-translate-y-1 text-lg">
              {{ t('home.hero.tryApi') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center animate-fade-in">
            <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10+</div>
            <div class="text-gray-600 dark:text-gray-400">{{ t('home.stats.models') }}</div>
          </div>
          <div class="text-center animate-fade-in" style="animation-delay: 0.1s">
            <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">99.9%</div>
            <div class="text-gray-600 dark:text-gray-400">{{ t('home.stats.availability') }}</div>
          </div>
          <div class="text-center animate-fade-in" style="animation-delay: 0.2s">
            <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">&lt;100ms</div>
            <div class="text-gray-600 dark:text-gray-400">{{ t('home.stats.latency') }}</div>
          </div>
          <div class="text-center animate-fade-in" style="animation-delay: 0.3s">
            <div class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">24/7</div>
            <div class="text-gray-600 dark:text-gray-400">{{ t('home.stats.support') }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">{{ t('home.features.title') }}</h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto text-lg">
          {{ t('home.features.description') }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">{{ t('home.features.domesticDirect') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.domesticDirectDesc') }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style="animation-delay: 0.1s">
            <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">{{ t('home.features.unifiedInterface') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.unifiedInterfaceDesc') }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style="animation-delay: 0.2s">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">{{ t('home.features.payAsYouGo') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.payAsYouGoDesc') }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style="animation-delay: 0.3s">
            <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">{{ t('home.features.loadBalancing') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.loadBalancingDesc') }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style="animation-delay: 0.4s">
            <div class="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">{{ t('home.features.realTimeMonitoring') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.realTimeMonitoringDesc') }}</p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style="animation-delay: 0.5s">
            <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">{{ t('home.features.security') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('home.features.securityDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">{{ t('home.models.title') }}</h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-16">{{ t('home.models.subtitle') }}</p>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-blue-200 dark:border-blue-700">
            <img src="/logos/openai.svg" alt="OpenAI" class="w-16 h-16 mx-auto mb-3 drop-shadow-lg"/>
            <p class="font-semibold text-gray-900 dark:text-white">OpenAI</p>
            <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">GPT-5.4</p>
          </div>
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-orange-200 dark:border-orange-700">
            <img src="/logos/anthropic.svg" alt="Anthropic" class="w-16 h-16 mx-auto mb-3 drop-shadow-lg"/>
            <p class="font-semibold text-gray-900 dark:text-white">Anthropic</p>
            <p class="text-sm text-orange-600 dark:text-orange-400 font-medium">Claude 4.6</p>
          </div>
          <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-green-200 dark:border-green-700">
            <img src="/logos/google.svg" alt="Google" class="w-16 h-16 mx-auto mb-3 drop-shadow-lg"/>
            <p class="font-semibold text-gray-900 dark:text-white">Google</p>
            <p class="text-sm text-green-600 dark:text-green-400 font-medium">Gemini 3.1</p>
          </div>
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-purple-200 dark:border-purple-700">
            <img src="/logos/xai.svg" alt="xAI" class="w-16 h-16 mx-auto mb-3 drop-shadow-lg"/>
            <p class="font-semibold text-gray-900 dark:text-white">xAI</p>
            <p class="text-sm text-purple-600 dark:text-purple-400 font-medium">Grok 4</p>
          </div>
          <div class="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-xl p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border border-pink-200 dark:border-pink-700">
            <img src="/logos/zhipu.svg" alt="Zhipu" class="w-16 h-16 mx-auto mb-3 drop-shadow-lg"/>
            <p class="font-semibold text-gray-900 dark:text-white">智谱AI</p>
            <p class="text-sm text-pink-600 dark:text-pink-400 font-medium">GLM-5.1</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">{{ t('home.benchmarks.title') }}</h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-16">{{ t('home.benchmarks.subtitle') }}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
              <img src="/logos/openai.svg" alt="OpenAI" class="w-10 h-10 mr-3"/>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">GPT-5.4</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">OpenAI</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">GPQA Diamond</span>
                <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">92.0%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 92%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">SWE-bench</span>
                <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">57.7%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 57.7%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">ARC-AGI-2</span>
                <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">97.6%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 97.6%"></div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
              <img src="/logos/anthropic.svg" alt="Anthropic" class="w-10 h-10 mr-3"/>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Claude 4.6</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Anthropic</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">GPQA Diamond</span>
                <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">91.3%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-orange-600 h-2 rounded-full" style="width: 91.3%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">SWE-bench</span>
                <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">80.8%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-orange-600 h-2 rounded-full" style="width: 80.8%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">MATH 500</span>
                <span class="text-sm font-semibold text-orange-600 dark:text-orange-400">97.6%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-orange-600 h-2 rounded-full" style="width: 97.6%"></div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
              <img src="/logos/google.svg" alt="Google" class="w-10 h-10 mr-3"/>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Gemini 3.1</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Google</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">GPQA Diamond</span>
                <span class="text-sm font-semibold text-green-600 dark:text-green-400">94.3%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" style="width: 94.3%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">ARC-AGI-2</span>
                <span class="text-sm font-semibold text-green-600 dark:text-green-400">77.1%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" style="width: 77.1%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">SWE-bench</span>
                <span class="text-sm font-semibold text-green-600 dark:text-green-400">54.2%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-green-600 h-2 rounded-full" style="width: 54.2%"></div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
              <img src="/logos/xai.svg" alt="xAI" class="w-10 h-10 mr-3"/>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Grok 4</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">xAI</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">GPQA</span>
                <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">88%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-purple-600 h-2 rounded-full" style="width: 88%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">SWE-bench</span>
                <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">75%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-purple-600 h-2 rounded-full" style="width: 75%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">AIME</span>
                <span class="text-sm font-semibold text-purple-600 dark:text-purple-400">100%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-purple-600 h-2 rounded-full" style="width: 100%"></div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div class="flex items-center mb-4">
              <img src="/logos/zhipu.svg" alt="Zhipu" class="w-10 h-10 mr-3"/>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">GLM-5.1</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">智谱AI</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">SWE-bench Pro</span>
                <span class="text-sm font-semibold text-pink-600 dark:text-pink-400">58.4%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-pink-600 h-2 rounded-full" style="width: 58.4%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Coding</span>
                <span class="text-sm font-semibold text-pink-600 dark:text-pink-400">45.3</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-pink-600 h-2 rounded-full" style="width: 94.6%"></div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">License</span>
                <span class="text-sm font-semibold text-pink-600 dark:text-pink-400">MIT</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div class="bg-pink-600 h-2 rounded-full" style="width: 100%"></div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center">
            <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('home.benchmarks.dataSource') }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {{ t('home.benchmarks.dataNote') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-900 dark:via-indigo-900 dark:to-blue-950 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 class="text-4xl font-bold mb-6">{{ t('home.cta.title') }}</h2>
        <p class="text-xl mb-10 text-blue-100 leading-relaxed">{{ t('home.cta.description') }}</p>
        <router-link to="/register" class="inline-block bg-white text-blue-600 px-12 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg">
          {{ t('home.cta.register') }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}
</style>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18nStore } from '../stores/i18n'
import zhCN from '../locales/zh-CN.js'
import enUS from '../locales/en-US.js'

const i18nStore = useI18nStore()
const messages = ref(zhCN)

onMounted(() => {
  updateMessages()
})

watch(() => i18nStore.locale, () => {
  updateMessages()
})

function updateMessages() {
  messages.value = i18nStore.locale === 'zh-CN' ? zhCN : enUS
}

function t(key) {
  const keys = key.split('.')
  let value = messages.value
  for (const k of keys) {
    value = value[k]
    if (value === undefined) return key
  }
  return value
}
</script>
