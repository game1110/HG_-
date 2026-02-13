<script setup>
import { ref } from 'vue'
import { useAdminStore } from '../../stores/adminStore.js'
import { usePlayerStore } from '../../stores/playerStore.js'
import { players } from '../../mock/players.js'
import { SOURCE_TYPE, CONVERT_POLICY, UNLOCK_TYPE, LOCKED_DESTINATION } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'

const admin = useAdminStore()
const playerStore = usePlayerStore()

const grantForm = ref({
  playerId: 'P001',
  campaignId: '',
  amount: 100,
  campaignName: '手動發放',
  currency: 'CNY',
  sourceType: SOURCE_TYPE.EXTERNAL,
  convertPolicy: CONVERT_POLICY.TRANSFER_PRINCIPAL,
  unlockType: UNLOCK_TYPE.WAGER_MULTIPLIER,
  wagerMultiplier: 1,
  lockedDestination: LOCKED_DESTINATION.LOCKED_BONUS,
})

const opForm = ref({
  bucketId: '',
  reason: '',
  adjustAmount: 0,
})

const message = ref('')

function doGrant() {
  admin.manualGrant(grantForm.value.playerId, { ...grantForm.value })
  message.value = `成功發放 ${grantForm.value.amount} 給 ${grantForm.value.playerId}`
  setTimeout(() => message.value = '', 3000)
}

function doRevoke() {
  const ok = admin.revokeBucket(opForm.value.bucketId, opForm.value.reason)
  message.value = ok ? `已回收桶 ${opForm.value.bucketId}` : '回收失敗'
  setTimeout(() => message.value = '', 3000)
}

function doFreeze() {
  const ok = admin.freezeBucket(opForm.value.bucketId, opForm.value.reason)
  message.value = ok ? `已凍結桶 ${opForm.value.bucketId}` : '凍結失敗'
  setTimeout(() => message.value = '', 3000)
}

function doUnfreeze() {
  const ok = admin.unfreezeBucket(opForm.value.bucketId)
  message.value = ok ? `已解凍桶 ${opForm.value.bucketId}` : '解凍失敗'
  setTimeout(() => message.value = '', 3000)
}

function doAdjust() {
  const ok = admin.adjustBucket(opForm.value.bucketId, opForm.value.adjustAmount, opForm.value.reason)
  message.value = ok ? `已調整桶 ${opForm.value.bucketId} 金額 ${opForm.value.adjustAmount}` : '調整失敗'
  setTimeout(() => message.value = '', 3000)
}

const inputClass = 'w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none'
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-xl font-bold text-white">獎勵管理</h1>

    <!-- 操作反饋 -->
    <div v-if="message" class="bg-green-900/50 border border-green-500/30 rounded-lg p-3 text-green-300 text-sm">
      {{ message }}
    </div>

    <!-- 手動發放 -->
    <AppCard title="手動發放獎勵">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="text-slate-300 text-sm block mb-1">選擇玩家</label>
          <select v-model="grantForm.playerId" :class="inputClass">
            <option v-for="p in players" :key="p.id" :value="p.id">{{ p.id }} - {{ p.username }}</option>
          </select>
        </div>
        <div>
          <label class="text-slate-300 text-sm block mb-1">關聯活動</label>
          <select v-model="grantForm.campaignId" :class="inputClass">
            <option value="">無 (手動發放)</option>
            <option v-for="c in admin.campaigns" :key="c.id" :value="c.id">{{ c.id }} - {{ c.name }}</option>
          </select>
        </div>
        <div>
          <label class="text-slate-300 text-sm block mb-1">發放金額</label>
          <input v-model.number="grantForm.amount" type="number" :class="inputClass" />
        </div>
        <div>
          <label class="text-slate-300 text-sm block mb-1">流水倍數</label>
          <input v-model.number="grantForm.wagerMultiplier" type="number" :class="inputClass" />
        </div>
        <div>
          <label class="text-slate-300 text-sm block mb-1">轉現策略</label>
          <select v-model="grantForm.convertPolicy" :class="inputClass">
            <option value="TRANSFER_PRINCIPAL">本金可轉現</option>
            <option value="PROFIT_ONLY">僅利潤可轉現</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="doGrant" class="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm">
            確認發放
          </button>
        </div>
      </div>
    </AppCard>

    <!-- 桶操作 -->
    <AppCard title="桶操作 (回收/凍結/解凍/調整)">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="text-slate-300 text-sm block mb-1">桶 ID</label>
          <input v-model="opForm.bucketId" :class="inputClass" placeholder="例: B001" />
        </div>
        <div>
          <label class="text-slate-300 text-sm block mb-1">原因</label>
          <input v-model="opForm.reason" :class="inputClass" placeholder="操作原因" />
        </div>
        <div>
          <label class="text-slate-300 text-sm block mb-1">調整金額 (調整用)</label>
          <input v-model.number="opForm.adjustAmount" type="number" :class="inputClass" />
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button @click="doRevoke" class="px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg text-sm">
          回收
        </button>
        <button @click="doFreeze" class="px-4 py-2 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-lg text-sm">
          凍結
        </button>
        <button @click="doUnfreeze" class="px-4 py-2 bg-teal-600/80 hover:bg-teal-500 text-white rounded-lg text-sm">
          解凍
        </button>
        <button @click="doAdjust" class="px-4 py-2 bg-orange-600/80 hover:bg-orange-500 text-white rounded-lg text-sm">
          調整
        </button>
      </div>
    </AppCard>
  </div>
</template>
