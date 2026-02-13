<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '../../stores/playerStore.js'
import { players } from '../../mock/players.js'
import { BUCKET_STATUS, BUCKET_STATUS_LABEL, BUCKET_STATUS_COLOR } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'
import AppBadge from '../../components/common/AppBadge.vue'

const playerStore = usePlayerStore()
const search = ref('')
const selectedPlayer = ref(null)

const filteredPlayers = computed(() => {
  if (!search.value) return players
  const q = search.value.toLowerCase()
  return players.filter(p =>
    p.id.toLowerCase().includes(q) ||
    p.username.toLowerCase().includes(q) ||
    p.nickname.toLowerCase().includes(q)
  )
})

function viewPlayer(player) {
  selectedPlayer.value = player
}

function getPlayerBuckets(playerId) {
  return playerStore.allBuckets.filter(b => b.playerId === playerId)
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-white">玩家管理</h1>

    <AppCard>
      <input
        v-model="search"
        class="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none w-64 mb-4"
        placeholder="搜尋玩家 ID / 帳號 / 暱稱..."
      />

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
              <th class="px-3 py-2 text-left">ID</th>
              <th class="px-3 py-2 text-left">帳號</th>
              <th class="px-3 py-2 text-left">暱稱</th>
              <th class="px-3 py-2 text-center">VIP</th>
              <th class="px-3 py-2 text-right">現金</th>
              <th class="px-3 py-2 text-right">獎勵</th>
              <th class="px-3 py-2 text-right">充值</th>
              <th class="px-3 py-2 text-center">桶數</th>
              <th class="px-3 py-2 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in filteredPlayers" :key="p.id"
              class="border-b border-blue-500/10 hover:bg-slate-800/50"
            >
              <td class="px-3 py-2 text-blue-300 font-mono">{{ p.id }}</td>
              <td class="px-3 py-2 text-white">{{ p.avatar }} {{ p.username }}</td>
              <td class="px-3 py-2 text-slate-300">{{ p.nickname }}</td>
              <td class="px-3 py-2 text-center">
                <span class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs">VIP{{ p.vipLevel }}</span>
              </td>
              <td class="px-3 py-2 text-right text-green-400">{{ p.cashBalance.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-yellow-400">{{ p.bonusBalance.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-white">{{ p.totalDeposit.toFixed(0) }}</td>
              <td class="px-3 py-2 text-center text-blue-300">{{ getPlayerBuckets(p.id).length }}</td>
              <td class="px-3 py-2 text-center">
                <button @click="viewPlayer(p)" class="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs hover:bg-blue-600/50">
                  查看詳情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>

    <!-- 玩家詳情 -->
    <AppCard v-if="selectedPlayer" :title="`玩家詳情: ${selectedPlayer.username}`">
      <div class="grid grid-cols-4 gap-4 mb-4">
        <div class="bg-slate-800 rounded-lg p-3 text-center">
          <div class="text-slate-400 text-xs">現金餘額</div>
          <div class="text-lg font-bold text-green-400">{{ selectedPlayer.cashBalance.toFixed(2) }}</div>
        </div>
        <div class="bg-slate-800 rounded-lg p-3 text-center">
          <div class="text-slate-400 text-xs">獎勵餘額</div>
          <div class="text-lg font-bold text-yellow-400">{{ selectedPlayer.bonusBalance.toFixed(2) }}</div>
        </div>
        <div class="bg-slate-800 rounded-lg p-3 text-center">
          <div class="text-slate-400 text-xs">累計充值</div>
          <div class="text-lg font-bold text-white">{{ selectedPlayer.totalDeposit.toFixed(2) }}</div>
        </div>
        <div class="bg-slate-800 rounded-lg p-3 text-center">
          <div class="text-slate-400 text-xs">累計提現</div>
          <div class="text-lg font-bold text-white">{{ selectedPlayer.totalWithdraw.toFixed(2) }}</div>
        </div>
      </div>

      <div class="text-slate-300 text-sm font-bold mb-2">獎勵桶列表</div>
      <div class="space-y-2">
        <div v-for="b in getPlayerBuckets(selectedPlayer.id)" :key="b.id"
          class="bg-slate-800 rounded-lg p-3 flex items-center gap-4 text-sm">
          <span class="text-blue-300 font-mono">{{ b.id }}</span>
          <AppBadge :text="BUCKET_STATUS_LABEL[b.status]" :color="BUCKET_STATUS_COLOR[b.status]" />
          <span class="text-slate-300">{{ b.campaignName }}</span>
          <span class="ml-auto text-yellow-400 font-bold">{{ b.currentBalance?.toFixed(2) }}</span>
        </div>
      </div>
    </AppCard>
  </div>
</template>
