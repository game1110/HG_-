<script setup>
import { ref, computed } from 'vue'
import { useReportStore } from '../../stores/reportStore.js'
import AppCard from '../../components/common/AppCard.vue'
import AppPagination from '../../components/common/AppPagination.vue'

const reportStore = useReportStore()
const page = ref(1)
const pageSize = 15

const report = computed(() => reportStore.walletDailyReport)
const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return report.value.slice(start, start + pageSize)
})

const totals = computed(() => ({
  grant: report.value.reduce((s, r) => s + r.grantTotal, 0),
  bet: report.value.reduce((s, r) => s + r.betTotal, 0),
  settle: report.value.reduce((s, r) => s + r.settleTotal, 0),
  convert: report.value.reduce((s, r) => s + r.convertTotal, 0),
  expire: report.value.reduce((s, r) => s + r.expireTotal, 0),
}))
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-white">錢包日報</h1>

    <!-- 摘要 -->
    <div class="grid grid-cols-5 gap-3">
      <AppCard>
        <div class="text-center">
          <div class="text-slate-400 text-xs">總發放</div>
          <div class="text-lg font-bold text-green-400">{{ totals.grant.toFixed(0) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-slate-400 text-xs">總下注</div>
          <div class="text-lg font-bold text-yellow-400">{{ totals.bet.toFixed(0) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-slate-400 text-xs">總結算</div>
          <div class="text-lg font-bold text-blue-400">{{ totals.settle.toFixed(0) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-slate-400 text-xs">總轉現</div>
          <div class="text-lg font-bold text-purple-400">{{ totals.convert.toFixed(0) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-slate-400 text-xs">總過期</div>
          <div class="text-lg font-bold text-red-400">{{ totals.expire.toFixed(0) }}</div>
        </div>
      </AppCard>
    </div>

    <AppCard>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
              <th class="px-3 py-2 text-left">日期</th>
              <th class="px-3 py-2 text-left">玩家</th>
              <th class="px-3 py-2 text-center">幣種</th>
              <th class="px-3 py-2 text-right">發放</th>
              <th class="px-3 py-2 text-right">下注</th>
              <th class="px-3 py-2 text-right">結算</th>
              <th class="px-3 py-2 text-right">轉現</th>
              <th class="px-3 py-2 text-right">過期</th>
              <th class="px-3 py-2 text-right">回收</th>
              <th class="px-3 py-2 text-right">淨變動</th>
              <th class="px-3 py-2 text-right">筆數</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in paged" :key="`${r.date}${r.playerId}`"
              class="border-b border-blue-500/10 hover:bg-slate-800/50"
            >
              <td class="px-3 py-2 text-slate-300">{{ r.date }}</td>
              <td class="px-3 py-2 text-white">{{ r.playerId }}</td>
              <td class="px-3 py-2 text-center text-slate-400">{{ r.currency }}</td>
              <td class="px-3 py-2 text-right text-green-400">{{ r.grantTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-yellow-400">{{ r.betTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-blue-400">{{ r.settleTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-purple-400">{{ r.convertTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-gray-400">{{ r.expireTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-red-400">{{ r.revokeTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right font-bold"
                :class="r.netChange >= 0 ? 'text-green-400' : 'text-red-400'">
                {{ r.netChange >= 0 ? '+' : '' }}{{ r.netChange.toFixed(2) }}
              </td>
              <td class="px-3 py-2 text-right text-slate-400">{{ r.txCount }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppPagination :total="report.length" :page-size="pageSize" v-model="page" class="mt-4" />
    </AppCard>
  </div>
</template>
