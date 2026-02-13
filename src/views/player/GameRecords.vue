<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '../../stores/playerStore.js'
import { FUNDING_TYPE_LABEL } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'
import AppTabs from '../../components/common/AppTabs.vue'
import AppPagination from '../../components/common/AppPagination.vue'

const store = usePlayerStore()

const activeTab = ref('all')
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'bonus', label: '獎勵金' },
  { key: 'cash', label: '現金' },
  { key: 'captured', label: '捕獲成功' },
]

const page = ref(1)
const pageSize = 10

const filtered = computed(() => {
  let list = store.playerGameRecords
  if (activeTab.value === 'bonus') list = list.filter(r => r.fundingType === 'BONUS')
  if (activeTab.value === 'cash') list = list.filter(r => r.fundingType === 'CASH')
  if (activeTab.value === 'captured') list = list.filter(r => r.captured)
  return list
})

const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

const totalProfit = computed(() =>
  store.playerGameRecords.reduce((s, r) => s + r.profit, 0)
)
</script>

<template>
  <div class="space-y-4">
    <AppCard title="🎮 遊戲戰績">
      <!-- 統計摘要 -->
      <div class="grid grid-cols-4 gap-3 mb-4">
        <div class="bg-blue-950/50 rounded-lg p-3 text-center">
          <div class="text-blue-400 text-xs">總場次</div>
          <div class="text-lg font-bold text-white">{{ store.playerGameRecords.length }}</div>
        </div>
        <div class="bg-blue-950/50 rounded-lg p-3 text-center">
          <div class="text-blue-400 text-xs">捕獲率</div>
          <div class="text-lg font-bold text-green-400">
            {{ store.playerGameRecords.length > 0
              ? Math.round(store.playerGameRecords.filter(r => r.captured).length / store.playerGameRecords.length * 100)
              : 0 }}%
          </div>
        </div>
        <div class="bg-blue-950/50 rounded-lg p-3 text-center">
          <div class="text-blue-400 text-xs">總投注</div>
          <div class="text-lg font-bold text-white">{{ store.playerGameRecords.reduce((s, r) => s + r.bulletCost, 0).toFixed(0) }}</div>
        </div>
        <div class="bg-blue-950/50 rounded-lg p-3 text-center">
          <div class="text-blue-400 text-xs">總盈虧</div>
          <div class="text-lg font-bold" :class="totalProfit >= 0 ? 'text-green-400' : 'text-red-400'">
            {{ totalProfit >= 0 ? '+' : '' }}{{ totalProfit.toFixed(2) }}
          </div>
        </div>
      </div>

      <AppTabs :tabs="tabs" v-model="activeTab" />

      <!-- 表格 -->
      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
              <th class="px-3 py-2 text-left">時間</th>
              <th class="px-3 py-2 text-left">子彈ID</th>
              <th class="px-3 py-2 text-center">魚種</th>
              <th class="px-3 py-2 text-right">子彈成本</th>
              <th class="px-3 py-2 text-center">倍率</th>
              <th class="px-3 py-2 text-center">結果</th>
              <th class="px-3 py-2 text-right">獲得</th>
              <th class="px-3 py-2 text-right">盈虧</th>
              <th class="px-3 py-2 text-center">資金</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in paged" :key="r.id"
              class="border-b border-blue-500/10 hover:bg-blue-800/20"
            >
              <td class="px-3 py-2 text-blue-300 text-xs">{{ r.createdAt }}</td>
              <td class="px-3 py-2 text-blue-200 text-xs font-mono">{{ r.bulletId }}</td>
              <td class="px-3 py-2 text-center">{{ r.fishType }}</td>
              <td class="px-3 py-2 text-right text-white">{{ r.bulletCost }}</td>
              <td class="px-3 py-2 text-center text-yellow-400">{{ r.fishMultiplier }}x</td>
              <td class="px-3 py-2 text-center">
                <span :class="r.captured ? 'text-green-400' : 'text-red-400'">
                  {{ r.captured ? '✅ 捕獲' : '❌ 未中' }}
                </span>
              </td>
              <td class="px-3 py-2 text-right text-green-400">{{ r.payout.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right" :class="r.profit >= 0 ? 'text-green-400' : 'text-red-400'">
                {{ r.profit >= 0 ? '+' : '' }}{{ r.profit.toFixed(2) }}
              </td>
              <td class="px-3 py-2 text-center">
                <span class="px-2 py-0.5 rounded text-xs"
                  :class="r.fundingType === 'BONUS' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'">
                  {{ FUNDING_TYPE_LABEL[r.fundingType] || r.fundingType }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppPagination :total="filtered.length" :page-size="pageSize" v-model="page" class="mt-4" />
    </AppCard>
  </div>
</template>
