<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '../../stores/playerStore.js'
import { useAdminStore } from '../../stores/adminStore.js'
import { BUCKET_STATUS_LABEL, BUCKET_STATUS_COLOR, SOURCE_TYPE_LABEL, CONVERT_POLICY_LABEL, UNLOCK_TYPE_LABEL } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'
import AppBadge from '../../components/common/AppBadge.vue'
import AppPagination from '../../components/common/AppPagination.vue'

const playerStore = usePlayerStore()
const admin = useAdminStore()

const searchPlayerId = ref('')
const searchStatus = ref('')
const page = ref(1)
const pageSize = 10

const filtered = computed(() => {
  let list = playerStore.allBuckets
  if (searchPlayerId.value) {
    list = list.filter(b => b.playerId.includes(searchPlayerId.value))
  }
  if (searchStatus.value) {
    list = list.filter(b => b.status === searchStatus.value)
  }
  return list
})

const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-white">桶管理</h1>

    <AppCard>
      <div class="flex gap-4 mb-4">
        <input
          v-model="searchPlayerId"
          class="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none w-48"
          placeholder="搜尋玩家ID..."
        />
        <select
          v-model="searchStatus"
          class="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none"
        >
          <option value="">全部狀態</option>
          <option v-for="(label, key) in BUCKET_STATUS_LABEL" :key="key" :value="key">{{ label }}</option>
        </select>
        <div class="text-slate-400 text-sm flex items-center">共 {{ filtered.length }} 筆</div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
              <th class="px-2 py-2 text-left">ID</th>
              <th class="px-2 py-2 text-left">玩家</th>
              <th class="px-2 py-2 text-left">活動</th>
              <th class="px-2 py-2 text-center">狀態</th>
              <th class="px-2 py-2 text-right">原始</th>
              <th class="px-2 py-2 text-right">餘額</th>
              <th class="px-2 py-2 text-right">鎖定盈利</th>
              <th class="px-2 py-2 text-center">流水進度</th>
              <th class="px-2 py-2 text-left">轉現策略</th>
              <th class="px-2 py-2 text-left">到期時間</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="b in paged" :key="b.id"
              class="border-b border-blue-500/10 hover:bg-slate-800/50"
            >
              <td class="px-2 py-2 text-blue-300 font-mono text-xs">{{ b.id }}</td>
              <td class="px-2 py-2 text-white text-xs">{{ b.playerId }}</td>
              <td class="px-2 py-2 text-slate-300 text-xs truncate max-w-32">{{ b.campaignName }}</td>
              <td class="px-2 py-2 text-center">
                <AppBadge :text="BUCKET_STATUS_LABEL[b.status]" :color="BUCKET_STATUS_COLOR[b.status]" />
              </td>
              <td class="px-2 py-2 text-right text-white">{{ b.initialAmount }}</td>
              <td class="px-2 py-2 text-right text-yellow-400">{{ b.currentBalance?.toFixed(2) }}</td>
              <td class="px-2 py-2 text-right text-purple-400">{{ b.lockedProfit?.toFixed(2) }}</td>
              <td class="px-2 py-2 text-center text-xs">
                <span v-if="b.wagerRequired > 0" class="text-green-400">
                  {{ b.wagerCompleted }}/{{ b.wagerRequired }}
                  ({{ Math.round(b.wagerCompleted / b.wagerRequired * 100) }}%)
                </span>
                <span v-else class="text-slate-400">免流水</span>
              </td>
              <td class="px-2 py-2 text-xs text-slate-300">{{ CONVERT_POLICY_LABEL[b.convertPolicy] }}</td>
              <td class="px-2 py-2 text-xs text-slate-400">{{ b.expiresAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppPagination :total="filtered.length" :page-size="pageSize" v-model="page" class="mt-4" />
    </AppCard>
  </div>
</template>
