<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '../../stores/playerStore.js'
import { PLATFORM_LABEL, CURRENCY_LABEL } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'

const store = usePlayerStore()
const p = computed(() => store.currentPlayer)

const stats = computed(() => {
  const records = store.playerGameRecords
  const total = records.length
  const captured = records.filter(r => r.captured).length
  const totalBet = records.reduce((s, r) => s + r.bulletCost, 0)
  const totalWin = records.reduce((s, r) => s + r.payout, 0)
  return {
    total,
    captured,
    captureRate: total > 0 ? Math.round(captured / total * 100) : 0,
    totalBet: totalBet.toFixed(2),
    totalWin: totalWin.toFixed(2),
    profit: (totalWin - totalBet).toFixed(2),
    profitPositive: totalWin - totalBet >= 0,
    favFish: findFavFish(records),
    biggestWin: records.length > 0 ? Math.max(...records.map(r => r.profit)).toFixed(2) : '0.00',
  }
})

function findFavFish(records) {
  const counts = {}
  records.forEach(r => {
    if (r.captured) counts[r.fishType] = (counts[r.fishType] || 0) + 1
  })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return sorted[0] ? sorted[0][0] : '-'
}
</script>

<template>
  <div class="space-y-6" v-if="p">
    <!-- 漁夫卡片 -->
    <AppCard>
      <div class="flex items-center gap-6">
        <div class="text-6xl">{{ p.avatar }}</div>
        <div class="flex-1">
          <div class="text-2xl font-bold text-white mb-1">{{ p.nickname }}</div>
          <div class="text-blue-300 text-sm">@{{ p.username }}</div>
          <div class="flex gap-3 mt-2 text-xs text-blue-400">
            <span class="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">VIP {{ p.vipLevel }}</span>
            <span>{{ PLATFORM_LABEL[p.platform] || p.platform }}</span>
            <span>{{ CURRENCY_LABEL[p.currency] || p.currency }}</span>
            <span>註冊: {{ p.registerDate }}</span>
            <span>最後登入: {{ p.lastLoginDate }}</span>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- 資產概覽 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <AppCard>
        <div class="text-center">
          <div class="text-blue-400 text-xs">現金餘額</div>
          <div class="text-xl font-bold text-green-400">{{ p.cashBalance.toFixed(2) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-blue-400 text-xs">獎勵餘額</div>
          <div class="text-xl font-bold text-yellow-400">{{ store.totalBonusBalance.toFixed(2) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-blue-400 text-xs">累計充值</div>
          <div class="text-xl font-bold text-white">{{ p.totalDeposit.toFixed(2) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-blue-400 text-xs">累計提現</div>
          <div class="text-xl font-bold text-white">{{ p.totalWithdraw.toFixed(2) }}</div>
        </div>
      </AppCard>
    </div>

    <!-- 捕魚戰績 -->
    <AppCard title="🏆 捕魚戰績">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-blue-950/50 rounded-lg p-4 text-center">
          <div class="text-blue-400 text-xs">總場次</div>
          <div class="text-2xl font-bold text-white">{{ stats.total }}</div>
        </div>
        <div class="bg-blue-950/50 rounded-lg p-4 text-center">
          <div class="text-blue-400 text-xs">捕獲率</div>
          <div class="text-2xl font-bold text-green-400">{{ stats.captureRate }}%</div>
        </div>
        <div class="bg-blue-950/50 rounded-lg p-4 text-center">
          <div class="text-blue-400 text-xs">總盈虧</div>
          <div class="text-2xl font-bold" :class="stats.profitPositive ? 'text-green-400' : 'text-red-400'">
            {{ stats.profitPositive ? '+' : '' }}{{ stats.profit }}
          </div>
        </div>
        <div class="bg-blue-950/50 rounded-lg p-4 text-center">
          <div class="text-blue-400 text-xs">最大獲利</div>
          <div class="text-2xl font-bold text-yellow-400">{{ stats.biggestWin }}</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mt-4">
        <div class="bg-blue-950/50 rounded-lg p-4 text-center">
          <div class="text-blue-400 text-xs">總投注</div>
          <div class="text-lg font-bold text-white">{{ stats.totalBet }}</div>
        </div>
        <div class="bg-blue-950/50 rounded-lg p-4 text-center">
          <div class="text-blue-400 text-xs">總派彩</div>
          <div class="text-lg font-bold text-white">{{ stats.totalWin }}</div>
        </div>
        <div class="bg-blue-950/50 rounded-lg p-4 text-center">
          <div class="text-blue-400 text-xs">最常捕獲</div>
          <div class="text-lg font-bold text-yellow-400">{{ stats.favFish }}</div>
        </div>
      </div>
    </AppCard>

    <!-- 活躍桶 -->
    <AppCard title="活躍獎勵桶">
      <div class="text-sm text-blue-300">
        共 {{ store.activeBuckets.length }} 個活躍桶，
        總餘額 {{ store.totalBonusBalance.toFixed(2) }}，
        鎖定盈利 {{ store.lockedProfitTotal.toFixed(2) }}
      </div>
    </AppCard>
  </div>
</template>
