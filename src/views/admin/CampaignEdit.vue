<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/adminStore.js'
import { SOURCE_TYPE, CONVERT_POLICY, UNLOCK_TYPE, LOCKED_DESTINATION, GRANT_METHOD, AMOUNT_RULE, SOURCE_TYPE_LABEL, CONVERT_POLICY_LABEL, UNLOCK_TYPE_LABEL, LOCKED_DESTINATION_LABEL, GRANT_METHOD_LABEL, AMOUNT_RULE_LABEL } from '../../mock/enums.js'
import AppCard from '../../components/common/AppCard.vue'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()

const isNew = computed(() => route.params.id === 'new')
const form = ref({
  name: '',
  description: '',
  sourceType: SOURCE_TYPE.CAMPAIGN,
  platform: 'HG',
  currency: 'CNY',
  startDate: '2026-03-01',
  endDate: '2026-03-31',
  grantMethod: GRANT_METHOD.AUTO,
  amountRule: AMOUNT_RULE.FIXED,
  fixedAmount: 100,
  percentage: 10,
  maxAmount: 5000,
  convertPolicy: CONVERT_POLICY.TRANSFER_PRINCIPAL,
  unlockType: UNLOCK_TYPE.WAGER_MULTIPLIER,
  wagerMultiplier: 3,
  lockedDestination: LOCKED_DESTINATION.LOCKED_BONUS,
  expiryDays: 14,
  maxGrants: 1000,
  totalBudget: 100000,
})

onMounted(() => {
  if (!isNew.value) {
    const campaign = admin.campaigns.find(c => c.id === route.params.id)
    if (campaign) {
      Object.assign(form.value, campaign)
    }
  }
})

function save() {
  if (isNew.value) {
    admin.createCampaign({ ...form.value })
  } else {
    admin.updateCampaign(route.params.id, { ...form.value })
  }
  router.push({ name: 'CampaignList' })
}

const inputClass = 'w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-400 focus:outline-none'
const labelClass = 'text-slate-300 text-sm block mb-1'
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-white">
        {{ isNew ? '新建活動' : '編輯活動' }}
      </h1>
      <button @click="router.back()" class="text-slate-400 hover:text-white text-sm">← 返回</button>
    </div>

    <AppCard title="基本資訊">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label :class="labelClass">活動名稱</label>
          <input v-model="form.name" :class="inputClass" placeholder="輸入活動名稱" />
        </div>
        <div>
          <label :class="labelClass">來源類型</label>
          <select v-model="form.sourceType" :class="inputClass">
            <option v-for="(label, key) in SOURCE_TYPE_LABEL" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label :class="labelClass">活動描述</label>
          <textarea v-model="form.description" :class="inputClass" rows="2" placeholder="描述活動內容"></textarea>
        </div>
        <div>
          <label :class="labelClass">開始日期</label>
          <input v-model="form.startDate" type="date" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">結束日期</label>
          <input v-model="form.endDate" type="date" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">平台</label>
          <select v-model="form.platform" :class="inputClass">
            <option value="HG">HG捕魚</option>
            <option value="AG">AG捕魚</option>
            <option value="BG">BG捕魚</option>
          </select>
        </div>
        <div>
          <label :class="labelClass">幣種</label>
          <select v-model="form.currency" :class="inputClass">
            <option value="CNY">CNY</option>
            <option value="USD">USD</option>
            <option value="THB">THB</option>
          </select>
        </div>
      </div>
    </AppCard>

    <AppCard title="發放規則">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label :class="labelClass">發放方式</label>
          <select v-model="form.grantMethod" :class="inputClass">
            <option v-for="(label, key) in GRANT_METHOD_LABEL" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label :class="labelClass">金額規則</label>
          <select v-model="form.amountRule" :class="inputClass">
            <option v-for="(label, key) in AMOUNT_RULE_LABEL" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label :class="labelClass">固定金額</label>
          <input v-model.number="form.fixedAmount" type="number" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">最大金額上限</label>
          <input v-model.number="form.maxAmount" type="number" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">最大發放次數</label>
          <input v-model.number="form.maxGrants" type="number" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">總預算</label>
          <input v-model.number="form.totalBudget" type="number" :class="inputClass" />
        </div>
      </div>
    </AppCard>

    <AppCard title="轉現 / 解鎖策略">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label :class="labelClass">轉現策略</label>
          <select v-model="form.convertPolicy" :class="inputClass">
            <option v-for="(label, key) in CONVERT_POLICY_LABEL" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label :class="labelClass">解鎖類型</label>
          <select v-model="form.unlockType" :class="inputClass">
            <option v-for="(label, key) in UNLOCK_TYPE_LABEL" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label :class="labelClass">流水倍數</label>
          <input v-model.number="form.wagerMultiplier" type="number" :class="inputClass" />
        </div>
        <div>
          <label :class="labelClass">鎖定盈利去向</label>
          <select v-model="form.lockedDestination" :class="inputClass">
            <option v-for="(label, key) in LOCKED_DESTINATION_LABEL" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div>
          <label :class="labelClass">桶有效天數</label>
          <input v-model.number="form.expiryDays" type="number" :class="inputClass" />
        </div>
      </div>
    </AppCard>

    <div class="flex gap-3">
      <button @click="save" class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
        {{ isNew ? '建立活動' : '保存修改' }}
      </button>
      <button @click="router.back()" class="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg">
        取消
      </button>
    </div>
  </div>
</template>
