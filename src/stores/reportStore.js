import { defineStore } from 'pinia'
import { computed } from 'vue'
import { usePlayerStore } from './playerStore.js'
import { useAdminStore } from './adminStore.js'
import { EVENT_TYPE } from '../mock/enums.js'

export const useReportStore = defineStore('report', () => {
  const playerStore = usePlayerStore()
  const adminStore = useAdminStore()

  // 錢包日報 - 按日期/玩家/幣種聚合
  const walletDailyReport = computed(() => {
    const map = {}
    playerStore.allEvents.forEach(e => {
      const date = e.createdAt.substring(0, 10)
      const key = `${date}|${e.playerId}|${e.currency || 'CNY'}`
      if (!map[key]) {
        map[key] = {
          date,
          playerId: e.playerId,
          currency: e.currency || 'CNY',
          grantTotal: 0,
          betTotal: 0,
          settleTotal: 0,
          convertTotal: 0,
          expireTotal: 0,
          revokeTotal: 0,
          netChange: 0,
          txCount: 0
        }
      }
      const r = map[key]
      r.txCount++
      const amt = Math.abs(e.amount || 0)
      switch (e.type) {
        case EVENT_TYPE.BONUS_GRANT: r.grantTotal += amt; r.netChange += amt; break
        case EVENT_TYPE.BONUS_BET: r.betTotal += amt; r.netChange -= amt; break
        case EVENT_TYPE.BONUS_SETTLE: r.settleTotal += (e.amount || 0); r.netChange += (e.amount || 0); break
        case EVENT_TYPE.BONUS_CONVERT_TO_CASH: r.convertTotal += amt; r.netChange -= amt; break
        case EVENT_TYPE.BONUS_EXPIRE: r.expireTotal += amt; r.netChange -= amt; break
        case EVENT_TYPE.BONUS_REVOKE: r.revokeTotal += amt; r.netChange -= amt; break
      }
    })
    return Object.values(map).sort((a, b) => b.date.localeCompare(a.date))
  })

  // 活動成效報表 - 按活動/幣種聚合
  const campaignEffectivenessReport = computed(() => {
    const map = {}
    playerStore.allEvents.forEach(e => {
      if (!e.campaignId) return
      const key = `${e.campaignId}|${e.currency || 'CNY'}`
      if (!map[key]) {
        const campaign = adminStore.campaigns.find(c => c.id === e.campaignId)
        map[key] = {
          campaignId: e.campaignId,
          campaignName: campaign?.name || e.campaignId,
          currency: e.currency || 'CNY',
          status: campaign?.status || '-',
          grantTotal: 0,
          grantCount: 0,
          betTotal: 0,
          settleTotal: 0,
          convertTotal: 0,
          expireTotal: 0,
          revokeTotal: 0,
          playerCount: new Set(),
          roi: 0
        }
      }
      const r = map[key]
      r.playerCount.add(e.playerId)
      const amt = Math.abs(e.amount || 0)
      switch (e.type) {
        case EVENT_TYPE.BONUS_GRANT: r.grantTotal += amt; r.grantCount++; break
        case EVENT_TYPE.BONUS_BET: r.betTotal += amt; break
        case EVENT_TYPE.BONUS_SETTLE: r.settleTotal += (e.amount || 0); break
        case EVENT_TYPE.BONUS_CONVERT_TO_CASH: r.convertTotal += amt; break
        case EVENT_TYPE.BONUS_EXPIRE: r.expireTotal += amt; break
        case EVENT_TYPE.BONUS_REVOKE: r.revokeTotal += amt; break
      }
    })

    return Object.values(map).map(r => ({
      ...r,
      playerCount: r.playerCount.size,
      roi: r.grantTotal > 0 ? ((r.betTotal - r.grantTotal) / r.grantTotal * 100).toFixed(1) : 0
    }))
  })

  // 財務對帳報表 - 按日期/活動聚合
  const financeReconciliationReport = computed(() => {
    const map = {}
    playerStore.allEvents.forEach(e => {
      const date = e.createdAt.substring(0, 10)
      const key = `${date}|${e.campaignId || 'NONE'}|${e.currency || 'CNY'}`
      if (!map[key]) {
        const campaign = e.campaignId ? adminStore.campaigns.find(c => c.id === e.campaignId) : null
        map[key] = {
          date,
          campaignId: e.campaignId || '-',
          campaignName: campaign?.name || '非活動',
          currency: e.currency || 'CNY',
          debit: 0,   // 支出 (發放/結算盈利)
          credit: 0,  // 回收 (過期/回收/轉現)
          net: 0
        }
      }
      const r = map[key]
      const amt = Math.abs(e.amount || 0)
      switch (e.type) {
        case EVENT_TYPE.BONUS_GRANT: r.debit += amt; break
        case EVENT_TYPE.BONUS_SETTLE:
          if (e.amount > 0) r.debit += e.amount
          break
        case EVENT_TYPE.BONUS_CONVERT_TO_CASH: r.credit += amt; break
        case EVENT_TYPE.BONUS_EXPIRE: r.credit += amt; break
        case EVENT_TYPE.BONUS_REVOKE: r.credit += amt; break
      }
      r.net = r.debit - r.credit
    })
    return Object.values(map).sort((a, b) => b.date.localeCompare(a.date))
  })

  // Summary stats
  const totalGranted = computed(() =>
    playerStore.allEvents
      .filter(e => e.type === EVENT_TYPE.BONUS_GRANT)
      .reduce((s, e) => s + Math.abs(e.amount || 0), 0)
  )

  const totalConverted = computed(() =>
    playerStore.allEvents
      .filter(e => e.type === EVENT_TYPE.BONUS_CONVERT_TO_CASH)
      .reduce((s, e) => s + Math.abs(e.amount || 0), 0)
  )

  const totalExpired = computed(() =>
    playerStore.allEvents
      .filter(e => e.type === EVENT_TYPE.BONUS_EXPIRE)
      .reduce((s, e) => s + Math.abs(e.amount || 0), 0)
  )

  return {
    walletDailyReport,
    campaignEffectivenessReport,
    financeReconciliationReport,
    totalGranted,
    totalConverted,
    totalExpired
  }
})
