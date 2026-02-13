// 桶狀態
export const BUCKET_STATUS = {
  ACTIVE: 'ACTIVE',
  CONSUMED: 'CONSUMED',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
  FROZEN: 'FROZEN'
}

export const BUCKET_STATUS_LABEL = {
  ACTIVE: '使用中',
  CONSUMED: '已消耗',
  EXPIRED: '已過期',
  REVOKED: '已回收',
  FROZEN: '已凍結'
}

export const BUCKET_STATUS_COLOR = {
  ACTIVE: 'green',
  CONSUMED: 'gray',
  EXPIRED: 'yellow',
  REVOKED: 'red',
  FROZEN: 'blue'
}

// 來源類型
export const SOURCE_TYPE = {
  CAMPAIGN: 'CAMPAIGN',
  FEATURE: 'FEATURE',
  NEWBIE: 'NEWBIE',
  EXTERNAL: 'EXTERNAL'
}

export const SOURCE_TYPE_LABEL = {
  CAMPAIGN: '活動獎勵',
  FEATURE: '功能獎勵',
  NEWBIE: '新手禮包',
  EXTERNAL: '外部匯入'
}

// 轉現策略
export const CONVERT_POLICY = {
  TRANSFER_PRINCIPAL: 'TRANSFER_PRINCIPAL',
  PROFIT_ONLY: 'PROFIT_ONLY'
}

export const CONVERT_POLICY_LABEL = {
  TRANSFER_PRINCIPAL: '本金可轉現',
  PROFIT_ONLY: '僅利潤可轉現'
}

// 解鎖類型
export const UNLOCK_TYPE = {
  NONE: 'NONE',
  WAGER_MULTIPLIER: 'WAGER_MULTIPLIER'
}

export const UNLOCK_TYPE_LABEL = {
  NONE: '無需解鎖',
  WAGER_MULTIPLIER: '流水倍數解鎖'
}

// 鎖定盈利去向
export const LOCKED_DESTINATION = {
  LOCKED_BONUS: 'LOCKED_BONUS',
  BONUS: 'BONUS'
}

export const LOCKED_DESTINATION_LABEL = {
  LOCKED_BONUS: '鎖定獎勵',
  BONUS: '獎勵餘額'
}

// 資金類型
export const FUNDING_TYPE = {
  CASH: 'CASH',
  BONUS: 'BONUS',
  FREESPIN: 'FREESPIN'
}

export const FUNDING_TYPE_LABEL = {
  CASH: '現金',
  BONUS: '獎勵',
  FREESPIN: '免費旋轉'
}

// 事件類型
export const EVENT_TYPE = {
  BONUS_GRANT: 'BONUS_GRANT',
  BONUS_BET: 'BONUS_BET',
  BONUS_SETTLE: 'BONUS_SETTLE',
  BONUS_CONVERT_TO_CASH: 'BONUS_CONVERT_TO_CASH',
  BONUS_EXPIRE: 'BONUS_EXPIRE',
  BONUS_REVOKE: 'BONUS_REVOKE',
  BONUS_FREEZE: 'BONUS_FREEZE',
  BONUS_UNFREEZE: 'BONUS_UNFREEZE',
  BONUS_ADJUST: 'BONUS_ADJUST'
}

export const EVENT_TYPE_LABEL = {
  BONUS_GRANT: '獎勵發放',
  BONUS_BET: '獎勵下注',
  BONUS_SETTLE: '獎勵結算',
  BONUS_CONVERT_TO_CASH: '轉現',
  BONUS_EXPIRE: '獎勵過期',
  BONUS_REVOKE: '獎勵回收',
  BONUS_FREEZE: '獎勵凍結',
  BONUS_UNFREEZE: '獎勵解凍',
  BONUS_ADJUST: '獎勵調整'
}

// 發放方式
export const GRANT_METHOD = {
  AUTO: 'AUTO',
  CLAIM: 'CLAIM',
  ACHIEVE: 'ACHIEVE',
  BATCH: 'BATCH'
}

export const GRANT_METHOD_LABEL = {
  AUTO: '自動發放',
  CLAIM: '手動領取',
  ACHIEVE: '達成條件',
  BATCH: '批量發放'
}

// 金額規則
export const AMOUNT_RULE = {
  FIXED: 'FIXED',
  PERCENTAGE: 'PERCENTAGE',
  LOTTERY: 'LOTTERY'
}

export const AMOUNT_RULE_LABEL = {
  FIXED: '固定金額',
  PERCENTAGE: '充值百分比',
  LOTTERY: '隨機抽獎'
}

// 活動狀態
export const CAMPAIGN_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  PAUSED: 'PAUSED',
  ENDED: 'ENDED'
}

export const CAMPAIGN_STATUS_LABEL = {
  DRAFT: '草稿',
  PUBLISHED: '已發布',
  PAUSED: '已暫停',
  ENDED: '已結束'
}

export const CAMPAIGN_STATUS_COLOR = {
  DRAFT: 'gray',
  PUBLISHED: 'green',
  PAUSED: 'yellow',
  ENDED: 'red'
}

// 幣種
export const CURRENCY = {
  CNY: 'CNY',
  USD: 'USD',
  THB: 'THB'
}

export const CURRENCY_LABEL = {
  CNY: '人民幣',
  USD: '美元',
  THB: '泰銖'
}

// 平台ID
export const PLATFORM = {
  HG: 'HG',
  AG: 'AG',
  BG: 'BG'
}

export const PLATFORM_LABEL = {
  HG: 'HG捕魚',
  AG: 'AG捕魚',
  BG: 'BG捕魚'
}

// 魚種
export const FISH_TYPES = [
  '小丑魚', '河豚', '章魚', '鯊魚', '金龍魚',
  '海龜', '燈籠魚', '劍魚', '魔鬼魚', '鯨魚',
  '美人魚', '金蟾蜍', '黃金蟹', '寶箱', '海龍王'
]
