import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { campaigns as mockCampaigns } from '../mock/campaigns.js'
import { players } from '../mock/players.js'
import { usePlayerStore } from './playerStore.js'
import { CAMPAIGN_STATUS, BUCKET_STATUS, EVENT_TYPE, SOURCE_TYPE, CONVERT_POLICY, UNLOCK_TYPE, LOCKED_DESTINATION } from '../mock/enums.js'

export const useAdminStore = defineStore('admin', () => {
  const campaigns = ref(JSON.parse(JSON.stringify(mockCampaigns)))
  const allPlayers = ref(JSON.parse(JSON.stringify(players)))
  const auditLogs = ref([])

  let campaignCounter = 10
  let auditCounter = 1

  function nextCampaignId() { return `C${String(++campaignCounter).padStart(3, '0')}` }
  function nextAuditId() { return `AUD${String(++auditCounter).padStart(4, '0')}` }

  function now() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19)
  }

  // Campaign CRUD
  function createCampaign(data) {
    const campaign = {
      id: nextCampaignId(),
      status: CAMPAIGN_STATUS.DRAFT,
      currentGrants: 0,
      usedBudget: 0,
      createdBy: 'admin01',
      createdAt: now(),
      updatedAt: now(),
      ...data
    }
    campaigns.value.push(campaign)
    addAuditLog('CREATE_CAMPAIGN', `建立活動: ${campaign.name}`, { campaignId: campaign.id })
    return campaign
  }

  function updateCampaign(id, data) {
    const idx = campaigns.value.findIndex(c => c.id === id)
    if (idx === -1) return null
    Object.assign(campaigns.value[idx], data, { updatedAt: now() })
    addAuditLog('UPDATE_CAMPAIGN', `更新活動: ${campaigns.value[idx].name}`, { campaignId: id })
    return campaigns.value[idx]
  }

  function publishCampaign(id) {
    const campaign = campaigns.value.find(c => c.id === id)
    if (!campaign) return false
    campaign.status = CAMPAIGN_STATUS.PUBLISHED
    campaign.updatedAt = now()
    addAuditLog('PUBLISH_CAMPAIGN', `發布活動: ${campaign.name}`, { campaignId: id })
    return true
  }

  function pauseCampaign(id) {
    const campaign = campaigns.value.find(c => c.id === id)
    if (!campaign) return false
    campaign.status = CAMPAIGN_STATUS.PAUSED
    campaign.updatedAt = now()
    addAuditLog('PAUSE_CAMPAIGN', `暫停活動: ${campaign.name}`, { campaignId: id })
    return true
  }

  function endCampaign(id) {
    const campaign = campaigns.value.find(c => c.id === id)
    if (!campaign) return false
    campaign.status = CAMPAIGN_STATUS.ENDED
    campaign.updatedAt = now()
    addAuditLog('END_CAMPAIGN', `結束活動: ${campaign.name}`, { campaignId: id })
    return true
  }

  // Bonus operations
  function manualGrant(playerId, data) {
    const playerStore = usePlayerStore()
    const prevPlayer = playerStore.currentPlayerId
    playerStore.switchPlayer(playerId)

    const bucket = playerStore.grantBonus({
      campaignId: data.campaignId || null,
      campaignName: data.campaignName || '手動發放',
      sourceType: data.sourceType || SOURCE_TYPE.EXTERNAL,
      currency: data.currency || 'CNY',
      initialAmount: data.amount,
      convertPolicy: data.convertPolicy || CONVERT_POLICY.TRANSFER_PRINCIPAL,
      unlockType: data.unlockType || UNLOCK_TYPE.WAGER_MULTIPLIER,
      wagerMultiplier: data.wagerMultiplier || 1,
      wagerRequired: data.amount * (data.wagerMultiplier || 1),
      lockedDestination: data.lockedDestination || LOCKED_DESTINATION.LOCKED_BONUS,
      expiresAt: data.expiresAt || new Date(Date.now() + 30 * 86400000).toISOString().replace('T', ' ').substring(0, 19)
    })

    playerStore.switchPlayer(prevPlayer)

    addAuditLog('MANUAL_GRANT', `手動發放 ${data.amount} 給玩家 ${playerId}`, {
      playerId,
      bucketId: bucket.id,
      amount: data.amount
    })

    return bucket
  }

  function revokeBucket(bucketId, reason) {
    const playerStore = usePlayerStore()
    const bucket = playerStore.allBuckets.find(b => b.id === bucketId)
    if (!bucket || bucket.status !== BUCKET_STATUS.ACTIVE) return false

    const amount = bucket.currentBalance
    bucket.status = BUCKET_STATUS.REVOKED
    bucket.currentBalance = 0
    bucket.revokedAt = now()
    bucket.revokedReason = reason
    bucket.updatedAt = now()

    const prevPlayer = playerStore.currentPlayerId
    playerStore.switchPlayer(bucket.playerId)

    playerStore.addEvent({
      type: EVENT_TYPE.BONUS_REVOKE,
      bucketId: bucket.id,
      campaignId: bucket.campaignId,
      amount: -amount,
      note: reason || '管理員回收',
      operator: 'admin01'
    })

    playerStore.switchPlayer(prevPlayer)

    addAuditLog('REVOKE_BUCKET', `回收桶 ${bucketId}, 金額: ${amount}, 原因: ${reason}`, {
      playerId: bucket.playerId,
      bucketId,
      amount
    })

    return true
  }

  function freezeBucket(bucketId, reason) {
    const playerStore = usePlayerStore()
    const bucket = playerStore.allBuckets.find(b => b.id === bucketId)
    if (!bucket || bucket.status !== BUCKET_STATUS.ACTIVE) return false

    bucket.status = BUCKET_STATUS.FROZEN
    bucket.frozenAt = now()
    bucket.frozenReason = reason
    bucket.updatedAt = now()

    const prevPlayer = playerStore.currentPlayerId
    playerStore.switchPlayer(bucket.playerId)

    playerStore.addEvent({
      type: EVENT_TYPE.BONUS_FREEZE,
      bucketId: bucket.id,
      campaignId: bucket.campaignId,
      amount: -bucket.currentBalance,
      note: reason || '管理員凍結',
      operator: 'admin01'
    })

    playerStore.switchPlayer(prevPlayer)

    addAuditLog('FREEZE_BUCKET', `凍結桶 ${bucketId}, 原因: ${reason}`, {
      playerId: bucket.playerId,
      bucketId
    })

    return true
  }

  function unfreezeBucket(bucketId) {
    const playerStore = usePlayerStore()
    const bucket = playerStore.allBuckets.find(b => b.id === bucketId)
    if (!bucket || bucket.status !== BUCKET_STATUS.FROZEN) return false

    bucket.status = BUCKET_STATUS.ACTIVE
    bucket.frozenAt = null
    bucket.frozenReason = null
    bucket.updatedAt = now()

    const prevPlayer = playerStore.currentPlayerId
    playerStore.switchPlayer(bucket.playerId)

    playerStore.addEvent({
      type: EVENT_TYPE.BONUS_UNFREEZE,
      bucketId: bucket.id,
      campaignId: bucket.campaignId,
      amount: bucket.currentBalance,
      note: '管理員解凍',
      operator: 'admin01'
    })

    playerStore.switchPlayer(prevPlayer)

    addAuditLog('UNFREEZE_BUCKET', `解凍桶 ${bucketId}`, {
      playerId: bucket.playerId,
      bucketId
    })

    return true
  }

  function adjustBucket(bucketId, adjustAmount, reason) {
    const playerStore = usePlayerStore()
    const bucket = playerStore.allBuckets.find(b => b.id === bucketId)
    if (!bucket || bucket.status !== BUCKET_STATUS.ACTIVE) return false

    bucket.currentBalance += adjustAmount
    bucket.updatedAt = now()

    const prevPlayer = playerStore.currentPlayerId
    playerStore.switchPlayer(bucket.playerId)

    playerStore.addEvent({
      type: EVENT_TYPE.BONUS_ADJUST,
      bucketId: bucket.id,
      campaignId: bucket.campaignId,
      amount: adjustAmount,
      note: reason || '管理員調整',
      operator: 'admin01'
    })

    playerStore.switchPlayer(prevPlayer)

    addAuditLog('ADJUST_BUCKET', `調整桶 ${bucketId}, 金額: ${adjustAmount > 0 ? '+' : ''}${adjustAmount}, 原因: ${reason}`, {
      playerId: bucket.playerId,
      bucketId,
      amount: adjustAmount
    })

    return true
  }

  // Audit log
  function addAuditLog(action, description, metadata = {}) {
    auditLogs.value.unshift({
      id: nextAuditId(),
      action,
      description,
      operator: 'admin01',
      createdAt: now(),
      ...metadata
    })
  }

  const sortedAuditLogs = computed(() =>
    [...auditLogs.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  )

  return {
    campaigns,
    allPlayers,
    auditLogs,
    sortedAuditLogs,
    createCampaign,
    updateCampaign,
    publishCampaign,
    pauseCampaign,
    endCampaign,
    manualGrant,
    revokeBucket,
    freezeBucket,
    unfreezeBucket,
    adjustBucket,
    addAuditLog
  }
})
