<script setup>
import { useReportStore } from '../../stores/reportStore.js'
import { CAMPAIGN_STATUS_LABEL, CAMPAIGN_STATUS_COLOR } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'
import AppBadge from '../../components/common/AppBadge.vue'

const reportStore = useReportStore()
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-white">活動成效報表</h1>

    <AppCard>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
              <th class="px-3 py-2 text-left">活動ID</th>
              <th class="px-3 py-2 text-left">活動名稱</th>
              <th class="px-3 py-2 text-center">狀態</th>
              <th class="px-3 py-2 text-center">幣種</th>
              <th class="px-3 py-2 text-right">發放次數</th>
              <th class="px-3 py-2 text-right">發放總額</th>
              <th class="px-3 py-2 text-right">投注總額</th>
              <th class="px-3 py-2 text-right">結算總額</th>
              <th class="px-3 py-2 text-right">轉現總額</th>
              <th class="px-3 py-2 text-right">過期總額</th>
              <th class="px-3 py-2 text-center">參與人數</th>
              <th class="px-3 py-2 text-right">ROI</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in reportStore.campaignEffectivenessReport" :key="r.campaignId + r.currency"
              class="border-b border-blue-500/10 hover:bg-slate-800/50"
            >
              <td class="px-3 py-2 text-blue-300 font-mono text-xs">{{ r.campaignId }}</td>
              <td class="px-3 py-2 text-white">{{ r.campaignName }}</td>
              <td class="px-3 py-2 text-center">
                <AppBadge :text="CAMPAIGN_STATUS_LABEL[r.status] || r.status" :color="CAMPAIGN_STATUS_COLOR[r.status] || 'gray'" />
              </td>
              <td class="px-3 py-2 text-center text-slate-400">{{ r.currency }}</td>
              <td class="px-3 py-2 text-right text-white">{{ r.grantCount }}</td>
              <td class="px-3 py-2 text-right text-green-400">{{ r.grantTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-yellow-400">{{ r.betTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-blue-400">{{ r.settleTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-purple-400">{{ r.convertTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-right text-red-400">{{ r.expireTotal.toFixed(2) }}</td>
              <td class="px-3 py-2 text-center text-white">{{ r.playerCount }}</td>
              <td class="px-3 py-2 text-right" :class="Number(r.roi) >= 0 ? 'text-green-400' : 'text-red-400'">
                {{ r.roi }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>
