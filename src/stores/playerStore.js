import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { players } from '../mock/players.js'
import { buckets as mockBuckets } from '../mock/buckets.js'
import { events as mockEvents } from '../mock/events.js'
import { gameRecords as mockGameRecords } from '../mock/gameRecords.js'
import { BUCKET_STATUS, EVENT_TYPE, FUNDING_TYPE, CONVERT_POLICY, UNLOCK_TYPE, FISH_TYPES } from '../mock/enums.js'

export const usePlayerStore = defineStore('player', () => {
  // Current player (default P001)
  const currentPlayerId = ref('P001')
  const currentPlayer = computed(() => players.find(p => p.id === currentPlayerId.value))

  // Reactive data cloned from mock
  const allBuckets = ref(JSON.parse(JSON.stringify(mockBuckets)))
  const allEvents = ref([...mockEvents])
  const allGameRecords = ref([...mockGameRecords])

  // Player-specific data
  const playerBuckets = computed(() =>
    allBuckets.value.filter(b => b.playerId === currentPlayerId.value)
  )

  const activeBuckets = computed(() =>
    playerBuckets.value.filter(b => b.status === BUCKET_STATUS.ACTIVE)
  )

  const totalBonusBalance = computed(() =>
    activeBuckets.value.reduce((sum, b) => sum + b.currentBalance, 0)
  )

  const lockedProfitTotal = computed(() =>
    activeBuckets.value.reduce((sum, b) => sum + b.lockedProfit, 0)
  )

  const totalWagerRequired = computed(() =>
    activeBuckets.value.reduce((sum, b) => sum + b.wagerRequired, 0)
  )

  const totalWagerCompleted = computed(() =>
    activeBuckets.value.reduce((sum, b) => sum + b.wagerCompleted, 0)
  )

  const bucketsBySource = computed(() => {
    const map = {}
    playerBuckets.value.forEach(b => {
      if (!map[b.sourceType]) map[b.sourceType] = []
      map[b.sourceType].push(b)
    })
    return map
  })

  const playerEvents = computed(() =>
    allEvents.value
      .filter(e => e.playerId === currentPlayerId.value)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  )

  const playerGameRecords = computed(() =>
    allGameRecords.value
      .filter(r => r.playerId === currentPlayerId.value)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  )

  const cashBalance = computed(() => currentPlayer.value?.cashBalance ?? 0)

  // ID generators
  let bucketCounter = 100
  let eventCounter = 200
  let gameCounter = 200

  function nextBucketId() { return `B${++bucketCounter}` }
  function nextEventId() { return `E${++eventCounter}` }
  function nextGameId() { return `GR${++gameCounter}` }

  function now() {
    return new Date().toISOString().replace('T', ' ').substring(0, 19)
  }

  // Actions
  function switchPlayer(playerId) {
    currentPlayerId.value = playerId
  }

  function grantBonus(bucket) {
    const newBucket = {
      id: nextBucketId(),
      playerId: currentPlayerId.value,
      status: BUCKET_STATUS.ACTIVE,
      currentBalance: bucket.initialAmount,
      usedAmount: 0,
      lockedProfit: 0,
      wagerCompleted: 0,
      grantedAt: now(),
      updatedAt: now(),
      ...bucket
    }
    allBuckets.value.push(newBucket)

    addEvent({
      type: EVENT_TYPE.BONUS_GRANT,
      bucketId: newBucket.id,
      campaignId: newBucket.campaignId,
      amount: newBucket.initialAmount,
      note: `${newBucket.campaignName || '手動'} 發放`
    })

    return newBucket
  }

  function placeBet(amount, fundingType = FUNDING_TYPE.BONUS) {
    if (fundingType === FUNDING_TYPE.CASH) {
      // Cash bet - no bucket involved
      const gameId = nextGameId()
      const fish = randomFish()
      const captured = Math.random() > 0.35
      const payout = captured ? Math.round(amount * fish.multiplier * 100) / 100 : 0
      const profit = payout - amount

      const record = {
        id: gameId,
        playerId: currentPlayerId.value,
        platform: currentPlayer.value?.platform || 'HG',
        roomId: `R0${Math.ceil(Math.random() * 3)}`,
        bulletId: `BLT-SIM-${gameId}`,
        bulletCost: amount,
        fundingType: FUNDING_TYPE.CASH,
        bucketId: null,
        fishType: fish.name,
        fishMultiplier: fish.multiplier,
        payout,
        profit,
        captured,
        createdAt: now()
      }
      allGameRecords.value.unshift(record)

      if (currentPlayer.value) {
        currentPlayer.value.cashBalance -= amount
        if (captured) {
          currentPlayer.value.cashBalance += payout
        }
      }

      return { record, settled: true }
    }

    // Bonus bet - consume from buckets by expiry priority
    const sorted = [...activeBuckets.value].sort(
      (a, b) => new Date(a.expiresAt) - new Date(b.expiresAt)
    )

    let remaining = amount
    const consumedBuckets = []

    for (const bucket of sorted) {
      if (remaining <= 0) break
      const consume = Math.min(remaining, bucket.currentBalance)
      if (consume <= 0) continue

      bucket.currentBalance -= consume
      bucket.usedAmount += consume
      bucket.wagerCompleted += consume
      bucket.updatedAt = now()
      remaining -= consume
      consumedBuckets.push({ bucket, consume })

      if (bucket.currentBalance <= 0) {
        bucket.status = BUCKET_STATUS.CONSUMED
      }
    }

    if (remaining > 0) return null // Not enough balance

    const gameId = nextGameId()
    const primaryBucket = consumedBuckets[0]?.bucket

    // Create game record
    const fish = randomFish()
    const captured = Math.random() > 0.35
    const payout = captured ? Math.round(amount * fish.multiplier * 100) / 100 : 0
    const profit = payout - amount

    const record = {
      id: gameId,
      playerId: currentPlayerId.value,
      platform: currentPlayer.value?.platform || 'HG',
      roomId: `R0${Math.ceil(Math.random() * 3)}`,
      bulletId: `BLT-SIM-${gameId}`,
      bulletCost: amount,
      fundingType: FUNDING_TYPE.BONUS,
      bucketId: primaryBucket?.id,
      fishType: fish.name,
      fishMultiplier: fish.multiplier,
      payout,
      profit,
      captured,
      createdAt: now()
    }
    allGameRecords.value.unshift(record)

    // Add bet event
    consumedBuckets.forEach(({ bucket, consume }) => {
      addEvent({
        type: EVENT_TYPE.BONUS_BET,
        bucketId: bucket.id,
        campaignId: bucket.campaignId,
        amount: -consume,
        fundingType: FUNDING_TYPE.BONUS,
        gameRoundId: gameId,
        note: '捕魚下注'
      })
    })

    // Auto-settle
    if (captured && payout > 0) {
      settleBet(gameId, payout, primaryBucket)
    }

    return { record, settled: true }
  }

  function settleBet(gameId, payoutAmount, bucket) {
    if (!bucket) return

    // Determine where profit goes based on unlock status
    const isUnlocked = bucket.unlockType === UNLOCK_TYPE.NONE ||
      bucket.wagerCompleted >= bucket.wagerRequired

    if (isUnlocked) {
      // Unlocked: profit goes to bonus balance directly
      bucket.currentBalance += payoutAmount
      bucket.updatedAt = now()
    } else {
      // Locked: profit goes to lockedProfit
      bucket.lockedProfit += payoutAmount
      bucket.updatedAt = now()
    }

    addEvent({
      type: EVENT_TYPE.BONUS_SETTLE,
      bucketId: bucket.id,
      campaignId: bucket.campaignId,
      amount: payoutAmount,
      gameRoundId: gameId,
      note: `捕魚結算${isUnlocked ? '' : '-鎖定盈利'}`
    })

    // Check unlock threshold after settlement
    checkUnlockThreshold(bucket.id)
  }

  function checkUnlockThreshold(bucketId) {
    const bucket = allBuckets.value.find(b => b.id === bucketId)
    if (!bucket || bucket.status !== BUCKET_STATUS.ACTIVE) return false

    if (bucket.unlockType === UNLOCK_TYPE.NONE) return true

    if (bucket.wagerCompleted >= bucket.wagerRequired) {
      // Unlock! Move locked profit based on policy
      if (bucket.lockedProfit > 0) {
        const convertAmount = bucket.lockedProfit
        bucket.currentBalance += convertAmount
        bucket.lockedProfit = 0
        bucket.updatedAt = now()

        addEvent({
          type: EVENT_TYPE.BONUS_SETTLE,
          bucketId: bucket.id,
          campaignId: bucket.campaignId,
          amount: convertAmount,
          note: '流水達標-鎖定盈利解鎖'
        })
      }
      return true
    }
    return false
  }

  function convertToCash(amount, bucketId) {
    const bucket = allBuckets.value.find(b => b.id === bucketId)
    if (!bucket || bucket.status !== BUCKET_STATUS.ACTIVE) return false

    const isUnlocked = bucket.unlockType === UNLOCK_TYPE.NONE ||
      bucket.wagerCompleted >= bucket.wagerRequired
    if (!isUnlocked) return false

    let convertAmount = 0
    if (bucket.convertPolicy === CONVERT_POLICY.TRANSFER_PRINCIPAL) {
      convertAmount = Math.min(amount, bucket.currentBalance)
    } else {
      // PROFIT_ONLY: can only convert profit portion
      const profitPortion = Math.max(0, bucket.currentBalance - bucket.initialAmount)
      convertAmount = Math.min(amount, profitPortion)
    }

    if (convertAmount <= 0) return false

    bucket.currentBalance -= convertAmount
    bucket.updatedAt = now()

    if (currentPlayer.value) {
      currentPlayer.value.cashBalance += convertAmount
    }

    addEvent({
      type: EVENT_TYPE.BONUS_CONVERT_TO_CASH,
      bucketId: bucket.id,
      campaignId: bucket.campaignId,
      amount: -convertAmount,
      note: '獎勵轉現金'
    })

    if (bucket.currentBalance <= 0) {
      bucket.status = BUCKET_STATUS.CONSUMED
    }

    return true
  }

  function expireBucket(bucketId) {
    const bucket = allBuckets.value.find(b => b.id === bucketId)
    if (!bucket || bucket.status !== BUCKET_STATUS.ACTIVE) return false

    const expiredAmount = bucket.currentBalance
    bucket.status = BUCKET_STATUS.EXPIRED
    bucket.currentBalance = 0
    bucket.updatedAt = now()

    addEvent({
      type: EVENT_TYPE.BONUS_EXPIRE,
      bucketId: bucket.id,
      campaignId: bucket.campaignId,
      amount: -expiredAmount,
      note: '桶到期自動過期'
    })

    return true
  }

  function addEvent(data) {
    const balanceBefore = totalBonusBalance.value
    const event = {
      id: nextEventId(),
      playerId: currentPlayerId.value,
      currency: currentPlayer.value?.currency || 'CNY',
      operator: data.operator || 'system',
      createdAt: now(),
      balanceBefore,
      balanceAfter: balanceBefore + (data.amount || 0),
      ...data
    }
    allEvents.value.push(event)
    return event
  }

  function randomFish() {
    const idx = Math.floor(Math.random() * FISH_TYPES.length)
    const multipliers = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0, 8.0, 10.0]
    // Higher index fish tend to have higher multipliers
    const mIdx = Math.min(idx, multipliers.length - 1)
    return {
      name: FISH_TYPES[idx],
      multiplier: multipliers[Math.floor(Math.random() * Math.min(mIdx + 3, multipliers.length))]
    }
  }

  return {
    // State
    currentPlayerId,
    currentPlayer,
    allBuckets,
    allEvents,
    allGameRecords,
    // Getters
    playerBuckets,
    activeBuckets,
    totalBonusBalance,
    lockedProfitTotal,
    totalWagerRequired,
    totalWagerCompleted,
    bucketsBySource,
    playerEvents,
    playerGameRecords,
    cashBalance,
    // Actions
    switchPlayer,
    grantBonus,
    placeBet,
    settleBet,
    convertToCash,
    expireBucket,
    checkUnlockThreshold,
    addEvent
  }
})
