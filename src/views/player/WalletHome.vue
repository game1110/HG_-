<script setup>
import { computed } from 'vue'
import { usePlayerStore } from '../../stores/playerStore.js'
import { players } from '../../mock/players.js'
import { BUCKET_STATUS, BUCKET_STATUS_LABEL, BUCKET_STATUS_COLOR, SOURCE_TYPE_LABEL, CONVERT_POLICY_LABEL, UNLOCK_TYPE_LABEL } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'
import AppBadge from '../../components/common/AppBadge.vue'

const store = usePlayerStore()

const wagerProgress = computed(() => {
  if (store.totalWagerRequired === 0) return 100
  return Math.min(100, Math.round(store.totalWagerCompleted / store.totalWagerRequired * 100))
})
</script>

<template>
  <div class="space-y-6">
    <!-- 玩家切換 -->
    <div class="flex items-center gap-3">
      <span class="text-blue-300 text-sm">切換玩家:</span>
      <button
        v-for="p in players" :key="p.id"
        @click="store.switchPlayer(p.id)"
        class="px-3 py-1 rounded-lg text-sm transition-all"
        :class="store.currentPlayerId === p.id
          ? 'bg-yellow-500 text-black font-bold'
          : 'bg-blue-800/50 text-blue-200 hover:bg-blue-700/50'"
      >
        {{ p.avatar }} {{ p.username }}
      </button>
    </div>

    <!-- 餘額卡片區 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AppCard>
        <div class="text-center">
          <div class="text-blue-400 text-sm mb-1">獎勵餘額</div>
          <div class="text-3xl font-bold text-yellow-400">
            {{ store.totalBonusBalance.toFixed(2) }}
          </div>
          <div class="text-blue-400 text-xs mt-1">{{ store.currentPlayer?.currency }}</div>
        </div>
      </AppCard>

      <AppCard>
        <div class="text-center">
          <div class="text-blue-400 text-sm mb-1">現金餘額</div>
          <div class="text-3xl font-bold text-green-400">
            {{ store.cashBalance.toFixed(2) }}
          </div>
          <div class="text-blue-400 text-xs mt-1">{{ store.currentPlayer?.currency }}</div>
        </div>
      </AppCard>

      <AppCard>
        <div class="text-center">
          <div class="text-blue-400 text-sm mb-1">鎖定盈利</div>
          <div class="text-3xl font-bold text-purple-400">
            {{ store.lockedProfitTotal.toFixed(2) }}
          </div>
          <div class="text-blue-400 text-xs mt-1">待解鎖轉現</div>
        </div>
      </AppCard>
    </div>

    <!-- 流水進度 -->
    <AppCard title="流水進度">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <div class="h-3 bg-blue-950 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-yellow-400 rounded-full transition-all"
              :style="{ width: wagerProgress + '%' }"
            ></div>
          </div>
        </div>
        <div class="text-sm text-blue-200 whitespace-nowrap">
          {{ store.totalWagerCompleted.toFixed(0) }} / {{ store.totalWagerRequired.toFixed(0) }}
          <span class="text-yellow-400 ml-1">({{ wagerProgress }}%)</span>
        </div>
      </div>
    </AppCard>

    <!-- 桶明細 -->
    <AppCard title="獎勵桶明細">
      <div class="space-y-3">
        <div
          v-for="bucket in store.playerBuckets"
          :key="bucket.id"
          class="bg-blue-950/50 border border-blue-500/20 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-3"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-white">{{ bucket.campaignName }}</span>
              <AppBadge :text="BUCKET_STATUS_LABEL[bucket.status]" :color="BUCKET_STATUS_COLOR[bucket.status]" />
              <span class="text-xs text-blue-400">{{ bucket.id }}</span>
            </div>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-blue-300">
              <span>來源: {{ SOURCE_TYPE_LABEL[bucket.sourceType] }}</span>
              <span>轉現: {{ CONVERT_POLICY_LABEL[bucket.convertPolicy] }}</span>
              <span>解鎖: {{ UNLOCK_TYPE_LABEL[bucket.unlockType] }}</span>
              <span v-if="bucket.wagerMultiplier">倍數: {{ bucket.wagerMultiplier }}x</span>
            </div>
          </div>

          <div class="flex gap-4 text-sm">
            <div class="text-center">
              <div class="text-blue-400 text-xs">原始金額</div>
              <div class="text-white font-bold">{{ bucket.initialAmount }}</div>
            </div>
            <div class="text-center">
              <div class="text-blue-400 text-xs">當前餘額</div>
              <div class="text-yellow-400 font-bold">{{ bucket.currentBalance?.toFixed(2) ?? '0.00' }}</div>
            </div>
            <div class="text-center">
              <div class="text-blue-400 text-xs">鎖定盈利</div>
              <div class="text-purple-400 font-bold">{{ bucket.lockedProfit?.toFixed(2) ?? '0.00' }}</div>
            </div>
            <div class="text-center">
              <div class="text-blue-400 text-xs">流水進度</div>
              <div class="text-green-400 font-bold">
                {{ bucket.wagerRequired > 0
                  ? Math.round(bucket.wagerCompleted / bucket.wagerRequired * 100) + '%'
                  : '免流水' }}
              </div>
            </div>
          </div>

          <div class="text-xs text-blue-400">
            <div>發放: {{ bucket.grantedAt }}</div>
            <div>到期: {{ bucket.expiresAt }}</div>
          </div>
        </div>

        <div v-if="store.playerBuckets.length === 0" class="text-center text-blue-400 py-8">
          暫無獎勵桶
        </div>
      </div>
    </AppCard>
  </div>
</template>
