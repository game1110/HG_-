<script setup>
import { useAdminStore } from '../../stores/adminStore.js'
import { useRouter } from 'vue-router'
import { CAMPAIGN_STATUS_LABEL, CAMPAIGN_STATUS_COLOR, SOURCE_TYPE_LABEL, GRANT_METHOD_LABEL } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'
import AppBadge from '../../components/common/AppBadge.vue'

const admin = useAdminStore()
const router = useRouter()

function editCampaign(id) {
  router.push({ name: 'CampaignEdit', params: { id } })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-white">活動列表</h1>
      <button
        @click="router.push({ name: 'CampaignEdit', params: { id: 'new' } })"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm"
      >
        + 新建活動
      </button>
    </div>

    <AppCard>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
              <th class="px-3 py-2 text-left">ID</th>
              <th class="px-3 py-2 text-left">活動名稱</th>
              <th class="px-3 py-2 text-center">狀態</th>
              <th class="px-3 py-2 text-center">來源</th>
              <th class="px-3 py-2 text-center">發放方式</th>
              <th class="px-3 py-2 text-left">期間</th>
              <th class="px-3 py-2 text-right">已發放</th>
              <th class="px-3 py-2 text-right">已用預算</th>
              <th class="px-3 py-2 text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in admin.campaigns" :key="c.id"
              class="border-b border-blue-500/10 hover:bg-slate-800/50"
            >
              <td class="px-3 py-2 text-blue-300 font-mono text-xs">{{ c.id }}</td>
              <td class="px-3 py-2">
                <div class="text-white font-medium">{{ c.name }}</div>
                <div class="text-slate-400 text-xs truncate max-w-48">{{ c.description }}</div>
              </td>
              <td class="px-3 py-2 text-center">
                <AppBadge :text="CAMPAIGN_STATUS_LABEL[c.status]" :color="CAMPAIGN_STATUS_COLOR[c.status]" />
              </td>
              <td class="px-3 py-2 text-center text-slate-300 text-xs">{{ SOURCE_TYPE_LABEL[c.sourceType] }}</td>
              <td class="px-3 py-2 text-center text-slate-300 text-xs">{{ GRANT_METHOD_LABEL[c.grantMethod] }}</td>
              <td class="px-3 py-2 text-slate-300 text-xs">
                {{ c.startDate }} ~ {{ c.endDate }}
              </td>
              <td class="px-3 py-2 text-right text-white">{{ c.currentGrants }}</td>
              <td class="px-3 py-2 text-right text-yellow-400">{{ c.usedBudget?.toLocaleString() }}</td>
              <td class="px-3 py-2 text-center">
                <div class="flex gap-1 justify-center">
                  <button @click="editCampaign(c.id)" class="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs hover:bg-blue-600/50">
                    編輯
                  </button>
                  <button
                    v-if="c.status === 'DRAFT'"
                    @click="admin.publishCampaign(c.id)"
                    class="px-2 py-1 bg-green-600/30 text-green-300 rounded text-xs hover:bg-green-600/50"
                  >
                    發布
                  </button>
                  <button
                    v-if="c.status === 'PUBLISHED'"
                    @click="admin.pauseCampaign(c.id)"
                    class="px-2 py-1 bg-yellow-600/30 text-yellow-300 rounded text-xs hover:bg-yellow-600/50"
                  >
                    暫停
                  </button>
                  <button
                    v-if="c.status === 'PAUSED'"
                    @click="admin.publishCampaign(c.id)"
                    class="px-2 py-1 bg-green-600/30 text-green-300 rounded text-xs hover:bg-green-600/50"
                  >
                    恢復
                  </button>
                  <button
                    v-if="c.status !== 'ENDED'"
                    @click="admin.endCampaign(c.id)"
                    class="px-2 py-1 bg-red-600/30 text-red-300 rounded text-xs hover:bg-red-600/50"
                  >
                    結束
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>
