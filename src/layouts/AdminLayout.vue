<template>
  <div class="flex min-h-screen">
    <!-- Left Sidebar -->
    <aside class="w-[240px] flex-shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col">
      <!-- Sidebar Header -->
      <div class="px-5 py-5 border-b border-slate-700">
        <span class="text-white font-bold text-lg tracking-wide">
          🛠️ 後台管理
        </span>
      </div>

      <!-- Navigation Groups -->
      <nav class="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <!-- 活動管理 -->
        <div>
          <h3 class="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            活動管理
          </h3>
          <ul class="space-y-1">
            <li v-for="item in campaignLinks" :key="item.path">
              <router-link
                :to="item.path"
                :class="[
                  'block px-3 py-2 text-sm rounded-r transition-colors duration-200',
                  isActive(item.path)
                    ? 'bg-blue-600/30 text-blue-400 border-l-2 border-blue-400'
                    : 'text-slate-300 hover:bg-slate-700'
                ]"
              >
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 資料管理 -->
        <div>
          <h3 class="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            資料管理
          </h3>
          <ul class="space-y-1">
            <li v-for="item in dataLinks" :key="item.path">
              <router-link
                :to="item.path"
                :class="[
                  'block px-3 py-2 text-sm rounded-r transition-colors duration-200',
                  isActive(item.path)
                    ? 'bg-blue-600/30 text-blue-400 border-l-2 border-blue-400'
                    : 'text-slate-300 hover:bg-slate-700'
                ]"
              >
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 報表中心 -->
        <div>
          <h3 class="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            報表中心
          </h3>
          <ul class="space-y-1">
            <li v-for="item in reportLinks" :key="item.path">
              <router-link
                :to="item.path"
                :class="[
                  'block px-3 py-2 text-sm rounded-r transition-colors duration-200',
                  isActive(item.path)
                    ? 'bg-blue-600/30 text-blue-400 border-l-2 border-blue-400'
                    : 'text-slate-300 hover:bg-slate-700'
                ]"
              >
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Back to Player Link -->
      <div class="px-5 py-4 border-t border-slate-700">
        <router-link
          to="/"
          class="text-slate-400 hover:text-white text-sm transition-colors duration-200"
        >
          ← 會員端
        </router-link>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 bg-slate-900 min-h-screen">
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const campaignLinks = [
  { path: '/admin/campaigns', label: '活動列表' },
  { path: '/admin/bonus', label: '獎勵管理' },
]

const dataLinks = [
  { path: '/admin/buckets', label: '桶管理' },
  { path: '/admin/players', label: '玩家管理' },
  { path: '/admin/audit', label: '審計日誌' },
]

const reportLinks = [
  { path: '/reports/daily', label: '錢包日報' },
  { path: '/reports/campaign', label: '活動成效' },
  { path: '/reports/finance', label: '財務對帳' },
]

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>
