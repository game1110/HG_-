<script setup>
import { ref, computed } from 'vue'
import { useReportStore } from '../../stores/reportStore.js'
import AppCard from '../../components/common/AppCard.vue'
import AppPagination from '../../components/common/AppPagination.vue'

const reportStore = useReportStore()
const page = ref(1)
const pageSize = 15

const report = computed(() => reportStore.financeReconciliationReport)
const paged = computed(() => {
  const start = (page.value - 1) * pageSize
  return report.value.slice(start, start + pageSize)
})

const totalDebit = computed(() => report.value.reduce((s, r) => s + r.debit, 0))
const totalCredit = computed(() => report.value.reduce((s, r) => s + r.credit, 0))
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-white">財務對帳報表</h1>

    <!-- 摘要 -->
    <div class="grid grid-cols-3 gap-4">
      <AppCard>
        <div class="text-center">
          <div class="text-slate-400 text-xs">總支出 (發放+結算)</div>
          <div class="text-xl font-bold text-red-400">{{ totalDebit.toFixed(2) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-slate-400 text-xs">總回收 (轉現+過期+回收)</div>
          <div class="text-xl font-bold text-green-400">{{ totalCredit.toFixed(2) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-slate-400 text-xs">淨成本</div>
          <div class="text-xl font-bold" :class="totalDebit - totalCredit >= 0 ? 'text-red-400' : 'text-green-400'">
            {{ (totalDebit - totalCredit).toFixed(2) }}
          </div>
        </div>
      </AppCard>
    </div>

    <AppCard>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
              <th class="px-3 py-2 text-left">日期</th>
              <th class="px-3 py-2 text-left">活動</th>
              <th class="px-3 py-2 text-center">幣種</th>
              <th class="px-3 py-2 text-right">支出 (借)</th>
              <th class="px-3 py-2 text-right">回收 (貸)</th>
              <th class="px-3 py-2 text-right">淨額</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in paged" :key="`${r.date}${r.campaignId}`"
              class="border-b border-blue-500/10 hover:bg-slate-800/50"
            >
              <td class="px-3 py-2 text-slate-300">{{ r.date }}</td>
              <td class="px-3 py-2 text-white text-xs">{{ r.campaignName }}</td>
              <td class="px-3 py-2 text-center text-slate-400">{{ r.currency }}</td>
              <td class="px-3 py-2 text-right text-red-400">{{ r.debit.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-green-400">{{ r.credit.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right font-bold"
                :class="r.net >= 0 ? 'text-red-400' : 'text-green-400'">
                {{ r.net.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AppPagination :total="report.length" :page-size="pageSize" v-model="page" class="mt-4" />
    </AppCard>
  </div>
</template>
