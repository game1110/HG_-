<template>
  <div class="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 min-h-screen">
    <!-- Top Navigation Bar -->
    <nav class="bg-blue-950/80 backdrop-blur border-b border-blue-500/30 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <span class="text-yellow-400 font-bold text-xl tracking-wide">
              🎣 活動錢包
            </span>
          </div>

          <!-- Navigation Links -->
          <div class="flex items-center space-x-1">
            <router-link
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-t transition-colors duration-200 relative',
                isActive(link.path)
                  ? 'text-white border-b-2 border-yellow-400'
                  : 'text-blue-300 hover:text-white'
              ]"
            >
              {{ link.label }}
            </router-link>
          </div>

          <!-- Admin Switch Link -->
          <div class="flex-shrink-0">
            <router-link
              to="/admin/campaigns"
              class="text-blue-400 hover:text-blue-200 text-xs transition-colors duration-200"
            >
              後台管理 →
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content Area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const navLinks = [
  { path: '/', label: '我的錢包' },
  { path: '/betting', label: '下注模擬' },
  { path: '/records', label: '遊戲戰績' },
  { path: '/transactions', label: '錢包交易' },
  { path: '/profile', label: '漁夫檔案' },
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>
