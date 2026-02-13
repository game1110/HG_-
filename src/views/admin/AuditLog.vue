<script setup>
import { useAdminStore } from '../../stores/adminStore.js'
import AppCard from '../../components/common/AppCard.vue'

const admin = useAdminStore()
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-white">審計日誌</h1>

    <AppCard>
      <div v-if="admin.sortedAuditLogs.length === 0" class="text-center text-slate-400 py-8">
        暫無操作日誌。在後台進行操作後，日誌會自動記錄於此。
      </div>

      <div class="overflow-x-auto" v-else>
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
              <th class="px-3 py-2 text-left">ID</th>
              <th class="px-3 py-2 text-left">時間</th>
              <th class="px-3 py-2 text-left">操作類型</th>
              <th class="px-3 py-2 text-left">描述</th>
              <th class="px-3 py-2 text-left">操作者</th>
              <th class="px-3 py-2 text-left">相關ID</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in admin.sortedAuditLogs" :key="log.id"
              class="border-b border-blue-500/10 hover:bg-slate-800/50"
            >
              <td class="px-3 py-2 text-blue-300 font-mono text-xs">{{ log.id }}</td>
              <td class="px-3 py-2 text-slate-300 text-xs">{{ log.createdAt }}</td>
              <td class="px-3 py-2">
                <span class="px-2 py-0.5 rounded text-xs"
                  :class="{
                    'bg-green-500/20 text-green-400': log.action.includes('CREATE') || log.action.includes('GRANT') || log.action.includes('PUBLISH'),
                    'bg-yellow-500/20 text-yellow-400': log.action.includes('UPDATE') || log.action.includes('PAUSE') || log.action.includes('ADJUST'),
                    'bg-red-500/20 text-red-400': log.action.includes('REVOKE') || log.action.includes('END'),
                    'bg-cyan-500/20 text-cyan-400': log.action.includes('FREEZE'),
                    'bg-teal-500/20 text-teal-400': log.action.includes('UNFREEZE'),
                  }"
                >
                  {{ log.action }}
                </span>
              </td>
              <td class="px-3 py-2 text-slate-300 text-xs max-w-64 truncate">{{ log.description }}</td>
              <td class="px-3 py-2 text-slate-400 text-xs">{{ log.operator }}</td>
              <td class="px-3 py-2 text-blue-300 text-xs font-mono">
                {{ log.playerId || log.campaignId || log.bucketId || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>
