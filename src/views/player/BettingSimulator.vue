<script setup>
import { ref, computed } from 'vue'
import { usePlayerStore } from '../../stores/playerStore.js'
import { FUNDING_TYPE, FUNDING_TYPE_LABEL } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'

const store = usePlayerStore()

const betAmount = ref(10)
const fundingType = ref(FUNDING_TYPE.BONUS)
const results = ref([])
const isSpinning = ref(false)

const canBet = computed(() => {
  if (fundingType.value === FUNDING_TYPE.CASH) {
    return store.cashBalance >= betAmount.value
  }
  return store.totalBonusBalance >= betAmount.value
})

async function fire() {
  if (!canBet.value || isSpinning.value) return
  isSpinning.value = true

  // Simulate delay
  await new Promise(r => setTimeout(r, 800))

  const result = store.placeBet(betAmount.value, fundingType.value)

  if (result) {
    results.value.unshift({
      ...result.record,
      timestamp: new Date().toLocaleTimeString()
    })
    if (results.value.length > 20) results.value.pop()
  }

  isSpinning.value = false
}

function quickBet(amount) {
  betAmount.value = amount
}
</script>

<template>
  <div class="space-y-6">
    <AppCard title="🎯 捕魚下注模擬器">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 左: 控制面板 -->
        <div class="space-y-4">
          <!-- 資金類型 -->
          <div>
            <label class="text-blue-300 text-sm block mb-2">資金類型</label>
            <div class="flex gap-2">
              <button
                v-for="(label, key) in { BONUS: '獎勵金', CASH: '現金' }" :key="key"
                @click="fundingType = key"
                class="px-4 py-2 rounded-lg text-sm transition-all"
                :class="fundingType === key
                  ? 'bg-yellow-500 text-black font-bold'
                  : 'bg-blue-800/50 text-blue-200 hover:bg-blue-700/50'"
              >
                {{ label }}
              </button>
            </div>
          </div>

          <!-- 可用餘額 -->
          <div class="bg-blue-950/50 rounded-lg p-3">
            <div class="text-blue-400 text-xs">可用餘額</div>
            <div class="text-2xl font-bold" :class="fundingType === 'CASH' ? 'text-green-400' : 'text-yellow-400'">
              {{ fundingType === 'CASH' ? store.cashBalance.toFixed(2) : store.totalBonusBalance.toFixed(2) }}
            </div>
          </div>

          <!-- 子彈成本 -->
          <div>
            <label class="text-blue-300 text-sm block mb-2">子彈成本</label>
            <input
              v-model.number="betAmount"
              type="number"
              min="1"
              class="w-full bg-blue-950 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:border-blue-400 focus:outline-none"
            />
            <div class="flex gap-2 mt-2">
              <button v-for="a in [5, 10, 25, 50, 100]" :key="a"
                @click="quickBet(a)"
                class="px-3 py-1 rounded bg-blue-800/50 text-blue-200 text-xs hover:bg-blue-700/50"
              >
                {{ a }}
              </button>
            </div>
          </div>

          <!-- 發射按鈕 -->
          <button
            @click="fire"
            :disabled="!canBet || isSpinning"
            class="w-full py-4 rounded-xl text-lg font-bold transition-all"
            :class="canBet && !isSpinning
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400 shadow-lg shadow-yellow-500/25'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'"
          >
            <span v-if="isSpinning" class="animate-pulse">🎯 射擊中...</span>
            <span v-else>🔫 發射子彈！</span>
          </button>
        </div>

        <!-- 右: 即時結果 -->
        <div>
          <div class="text-blue-300 text-sm mb-2">射擊記錄 (最近 20 發)</div>
          <div class="space-y-2 max-h-96 overflow-y-auto pr-2">
            <div
              v-for="(r, i) in results" :key="i"
              class="flex items-center gap-3 p-2 rounded-lg text-sm"
              :class="r.captured ? 'bg-green-900/30 border border-green-500/20' : 'bg-red-900/20 border border-red-500/10'"
            >
              <span class="text-xs text-blue-400 w-16">{{ r.timestamp }}</span>
              <span class="w-16">🐟 {{ r.fishType }}</span>
              <span class="w-12 text-center">
                {{ r.captured ? '✅' : '❌' }}
              </span>
              <span class="w-12 text-right text-xs">
                -{{ r.bulletCost }}
              </span>
              <span v-if="r.captured" class="w-16 text-right text-green-400">
                +{{ r.payout.toFixed(1) }}
              </span>
              <span v-else class="w-16 text-right text-red-400">
                0
              </span>
              <span class="text-xs" :class="r.profit >= 0 ? 'text-green-400' : 'text-red-400'">
                {{ r.profit >= 0 ? '+' : '' }}{{ r.profit.toFixed(1) }}
              </span>
            </div>

            <div v-if="results.length === 0" class="text-center text-blue-400 py-8">
              點擊「發射子彈」開始模擬捕魚
            </div>
          </div>
        </div>
      </div>
    </AppCard>

    <!-- 餘額即時顯示 -->
    <div class="grid grid-cols-3 gap-4">
      <AppCard>
        <div class="text-center">
          <div class="text-blue-400 text-xs">獎勵餘額</div>
          <div class="text-xl font-bold text-yellow-400">{{ store.totalBonusBalance.toFixed(2) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-blue-400 text-xs">現金餘額</div>
          <div class="text-xl font-bold text-green-400">{{ store.cashBalance.toFixed(2) }}</div>
        </div>
      </AppCard>
      <AppCard>
        <div class="text-center">
          <div class="text-blue-400 text-xs">鎖定盈利</div>
          <div class="text-xl font-bold text-purple-400">{{ store.lockedProfitTotal.toFixed(2) }}</div>
        </div>
      </AppCard>
    </div>
  </div>
</template>
