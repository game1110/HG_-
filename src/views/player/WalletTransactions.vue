<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '../../stores/playerStore.js'
import { EVENT_TYPE_LABEL } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'
import AppTabs from '../../components/common/AppTabs.vue'
import AppPagination from '../../components/common/AppPagination.vue'

const store = usePlayerStore()

const activeTab = ref('all')
const tabs = [
  { key: 'all', label: '全部' },
  { key: 'grant', label: '發放' },
  { key: 'bet', label: '下注/結算' },
  { key: 'convert', label: '轉現' },
  { key: 'other', label: '其他' },
]

const page = ref(1)
const pageSize = 15

const filtered = computed(() => {
  let list = store.playerEvents
  switch (activeTab.value) {
    case 'grant': list = list.filter(e => e.type === 'BONUS_GRANT'); break
    case 'bet': list = list.filter(e => ['BONUS_BET', 'BONUS_SETTLE'].includes(e.type)); break
    case 'convert': list = list.filter(e => e.type === 'BONUS_CONVERT_TO_CASH'); break
    case 'other': list = list.filter(e => ['BONUS_EXPIRE', 'BONUS_REVOKE', 'BONUS_FREEZE', 'BONUS_UNFREEZE', 'BONUS_ADJUST'].includes(e.type)); break
  }
  return list
})

const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function typeColor(type) {
  const map = {
    BONUS_GRANT: 'text-green-400',
    BONUS_BET: 'text-yellow-400',
    BONUS_SETTLE: 'text-blue-400',
    BONUS_CONVERT_TO_CASH: 'text-purple-400',
    BONUS_EXPIRE: 'text-gray-400',
    BONUS_REVOKE: 'text-red-400',
    BONUS_FREEZE: 'text-cyan-400',
    BONUS_UNFREEZE: 'text-teal-400',
    BONUS_ADJUST: 'text-orange-400',
  }
  return map[type] || 'text-white'
}
</script>

<template>
  <div class="space-y-4">
    <AppCard title="💰 錢包交易記錄">
      <AppTabs :tabs="tabs" v-model="activeTab" />

      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
              <th class="px-3 py-2 text-left">時間</th>
              <th class="px-3 py-2 text-left">類型</th>
              <th class="px-3 py-2 text-left">桶ID</th>
              <th class="px-3 py-2 text-right">金額</th>
              <th class="px-3 py-2 text-right">餘額(前)</th>
              <th class="px-3 py-2 text-right">餘額(後)</th>
              <th class="px-3 py-2 text-left">備註</th>
              <th class="px-3 py-2 text-left">操作者</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="e in paged" :key="e.id"
              class="border-b border-blue-500/10 hover:bg-blue-800/20"
            >
              <td class="px-3 py-2 text-blue-300 text-xs">{{ e.createdAt }}</td>
              <td class="px-3 py-2" :class="typeColor(e.type)">
                {{ EVENT_TYPE_LABEL[e.type] || e.type }}
              </td>
              <td class="px-3 py-2 text-blue-200 text-xs font-mono">{{ e.bucketId || '-' }}</td>
              <td class="px-3 py-2 text-right font-bold"
                :class="(e.amount || 0) >= 0 ? 'text-green-400' : 'text-red-400'">
                {{ (e.amount || 0) >= 0 ? '+' : '' }}{{ (e.amount || 0).toFixed(2) }}
              </td>
              <td class="px-3 py-2 text-right text-blue-300">{{ (e.balanceBefore || 0).toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-blue-200">{{ (e.balanceAfter || 0).toFixed(2) }}</td>
              <td class="px-3 py-2 text-blue-300 text-xs max-w-48 truncate">{{ e.note || e.description || '-' }}</td>
              <td class="px-3 py-2 text-blue-400 text-xs">{{ e.operator || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppPagination :total="filtered.length" :page-size="pageSize" v-model="page" class="mt-4" />
    </AppCard>
  </div>
</template>
