「活动钱包 PRD v1.0」奖励钱包构建统一的「奖励 → 下注 → 结算 → 转现」闭环

## **1\. 文档信息（Document Info）**

* 版本（Version）：v1.0  
* 范围（Scope）：奖励钱包（Bonus Wallet）作为奖励载体 \+ 统一账务/事件/报表模板 \+ 后台可配置活动规则（Campaign Config）

## **2\. 背景与问题（Background & Problems）**

### **2.1 背景（Background）**

奖励来源多样：新手、进度条（Feature，永久机制）、循环活动（如：吉五福）、外部活动（如 BBIN）。若每档客制实现将导致：

* 落地成本高：每档需重复对齐规则/数据/报表  
* 账务/报表口径不一致（本金是否可转现、门槛未达如何处理）  
* 后台/报表难以模板化，运维成本攀升

### **2.2 要解决的核心问题（Key Problems）**

* 统一可配置的「奖励 → 下注 → 结算 → 转现」流程  
* 玩家端仅显示单一奖励余额（Bonus Balance）  
* 事件/报表需区分现金/奖励/免费下注（CASH/BONUS/FREESPIN）的输赢与转现  
* 「转本金/不转本金」「是否达成门槛」后台可配置  
* 财务成本认列在发放时点（BONUS\_GRANT）时点认列，字段可对账/分析

## **3\. 目标与非目标（Goals & Non-goals）**

### **3.1 产品目标（Goals）**

* 奖励钱包作为通用奖励载体，支持多来源（活动/机制/外部）  
* 固定模板：活动配置、账务事件、报表维度  
* 支持转现策略可配置：  
  * 转本金/不转本金（仅转盈利 Profit）  
  * 是否需要门槛（流水倍数 Wager Multiplier）  
  * 门槛未达时的盈利去向（锁定 LOCKED\_BONUS）  
* 统一事件规范支撑三张核心报表

### **3.2 非目标（v1 Non-goals）**

* 复杂任务型门槛（TASK/延迟/人工审核）列入 v1.1+  
* 全量 B2B 结算扣抵细则（另开结算 PRD）

## **4\. 名词定义与口径（Glossary & Definitions）**

### **4.1 名词**

* 现金钱包（Cash Wallet）：可转出/提领或用于现金结算的余额  
* 奖励钱包（Bonus Wallet）：玩家奖励余额（主界面单一展示）  
* 桶（Bucket）：奖励的可追溯单位；每次发放/领取生成一个 bucket，用于对账与追踪  
* 活动（Campaign）：档期型额外发奖；每档需与 AM 对齐范围与文档  
* 机制（Feature）：永久内显，游戏内长期机制

### **4.2 捕鱼结算口径**

* bet\_cost：本次射击成本  
* payout\_amount：派彩金额（含本金）  
* net\_win \= payout\_amount \- bet\_cost

示例：余额 100，射击 1 元，派彩 2（含本金）→ 100 \- 1 \+ 2 \= 101；净赢 net\_win \= 2 \- 1 \= \+1。

## **5\. 玩家端 UX**

### **5.1 主界面**

* 仅展示：**单一奖励可用余额（Bonus Available Balance）**  
* 文案建议：  
  * 「奖励仅供游戏使用，结算盈利将按规则转入现金钱包（Cash Wallet）。」

### **5.2 明细页**

以标签呈现（不拆分主余额）：

* **来源（Source）**：活动（Campaign）/进度条（Feature）/新手（Newbie）/外部（External）  
* **规则（Rules）**：  
  * 转现：转本金/不转本金（TRANSFER\_PRINCIPAL / PROFIT\_ONLY）  
  * 门槛：无/流水倍数（NONE / WAGER\_MULTIPLIER xN）  
  * 到期日（Expiry，若有）

### **5.3（可选）玩家端统计**

展示奖励下注输赢（Reward Net Win）按今日/本活动汇总，并可下钻按活动/按游戏。

## **6\. 核心设计：转现策略与解锁策略**

要点：奖励下注后盈利可转入现金钱包（Cash Wallet），但不包含本金；是否转现、是否需要门槛由后台策略决定。

### **6.1 转现策略**

每个活动/机制/桶（campaign/feature/bucket）挂一份策略。

**字段：**principal\_transfer\_mode**（转本金策略）**

* TRANSFER\_PRINCIPAL：转本金（派彩含本金可入 Cash）  
* PROFIT\_ONLY：不转本金（只转盈利 Profit）

### **6.2 解锁策略（Unlock Policy）**

**字段：**unlock\_type**（门槛类型）**

* NONE：无门槛  
* WAGER\_MULTIPLIER：流水倍数

**字段：**locked\_destination**（未达门槛去向）**

* LOCKED\_BONUS：锁定盈利  
* BONUS：回到可用奖励

## **7\. 下注资金来源与输赢统计**

### **7.1 下注资金来源（wager\_funding\_type）**

事件/报表必填：

* CASH：现金下注（Cash Wager）  
* BONUS：奖励下注（Bonus Wager）  
* FREESPIN：免费下注（Free Spin，通常 bet\_cost=0）

### **7.2 核心指标与计算（reward\_net\_win / cash\_credit\_from\_reward）**

前提：派彩含本金（payout includes principal）

* reward\_net\_win \= reward\_payout\_amount \- reward\_bet\_cost

**可转现金额（eligible\_cash\_credit）**

* 若 TRANSFER\_PRINCIPAL：eligible \= max(0, reward\_payout\_amount)  
* 若 PROFIT\_ONLY：eligible \= max(0, reward\_payout\_amount \- reward\_bet\_cost) \= max(0, reward\_net\_win)

**是否转现（Convert Decision）**

* unlock\_met \= true → 立即转现：cash\_credit\_from\_reward \= eligible  
* unlock\_met \= false → 不转现：cash\_credit\_from\_reward \= 0，且 eligible 进入 locked\_destination（默认 LOCKED\_BONUS）

## **8\. Bucket 规则**

* 一次发放/领取（grant/claim）→ 一个桶（Bucket）  
* 基本字段：bucket\_id, source\_type, source\_id, currency, grant\_amount, expiry\_time, convert\_policy\_id, unlock\_policy\_id  
* 消耗顺序（Consumption Priority）：  
  * 有到期：先到期先消（Earliest Expiry First）  
  * 无到期：先进先出（FIFO）或等价视为到期=∞  
* 状态（Status）：ACTIVE / CONSUMED / EXPIRED / REVOKED / FROZEN

## **9\. 活动配置模板（Campaign Config Template）**

* campaign\_id / version / name  
* 时间窗（start/end）  
* 覆盖范围（Scope）：PID、币种、渠道  
* 参与资格（Eligibility）：新手/回流/VIP/黑白名单  
* 发放方式（Granting）：自动/领取（claim）/达成后发放/批次补发  
* 金额规则（Amount Rule）：固定/比例/抽奖  
* 上限与预算（Caps & Budget）：单人每日/总量  
* 转现策略（Convert Policy）：转本金（TRANSFER\_PRINCIPAL）/仅转盈利（PROFIT\_ONLY）  
* 解锁策略（Unlock）：无（NONE）/流水倍数（WAGER\_MULTIPLIER xN）  
* 活动文档与说明页（Campaign Doc URL）：https://example.com/campaign-doc

## **10\. 账务与成本认列**

### **10.1 成本认列（Cost Recognition）**

成本在奖励发放（BONUS\_GRANT）时点认列：

* recognized\_cost\_amount \= granted\_amount

### **10.2 必备追踪值（Must-track Values）**

* granted\_amount / consumed\_amount / expired\_amount / revoked\_amount  
* locked\_profit\_amount（门槛未达锁定盈利）  
* cash\_credit\_from\_reward\_amount（奖励转现入 Cash）  
* begin\_balance / end\_balance（期初/期末）

## **11\. 事件规范（Events Spec，v1 最小集）**

### **11.1 事件清单（Event List）**

BONUS\_GRANT（发放） / BONUS\_BET（下注消耗） / BONUS\_SETTLE（结算） / BONUS\_CONVERT\_TO\_CASH（转现） / BONUS\_EXPIRE（到期） / BONUS\_REVOKE（回收） / BONUS\_LOCK\_PROFIT（锁定盈利） / BONUS\_BALANCE\_SNAPSHOT（日终快照）

### **11.2 Schema 必填字段**

* 通用（Common）：event\_id, event\_time, event\_type, schema\_version, idempotency\_key  
* 维度与归因（Dimensions）：user\_id, pid, currency, source\_type, source\_id, bucket\_id（适用时必填）  
* 下注/结算（Wager/Settle）：wager\_funding\_type, reward\_bet\_cost, reward\_payout\_amount, reward\_net\_win  
* 策略与转现（Policy/Convert）：principal\_transfer\_mode, unlock\_type, unlock\_multiplier, unlock\_met\_flag, cash\_credit\_from\_reward, locked\_profit\_delta（若有）

## **12\. 报表**

### **12.1 钱包日报**

* 维度：日期（Date）/ PID / 币种（Currency）（可选：source\_type/source\_id）  
* 指标：grant / consume / reward\_net\_win / convert / expire / revoke / locked\_profit / begin / end

### **12.2 活动/机制成效表**

* 维度：活动/机制（campaign/feature）、PID、币种、渠道（Channel）  
* 指标：参与/领取/使用/转现人数；发放/消耗/奖励下注输赢/转现/到期回收/锁定盈利

### **12.3 财务对账表**

* 维度：日期、PID、币种、活动（Campaign）  
* 指标：recognized\_cost, end\_balance, convert, expire/revoke, 差异定位（Diff）

## **13\. 权限与风控**

### **13.1 后台权限（Admin Permissions）**

* 建立/上架/下架活动  
* 手动补发、撤销回收、冻结/解冻、人工调整  
* 审计（Audit）：操作者、时间、原因、前后值

### **13.2 风控（Risk Controls）**

* 沿用既有 IP/设备限制（活动层可配置黑白名单）  
* 异常处理：冻结 bucket、回收未使用部分

## **14\. 待确认（TB**

* 混用资金（Cash+Bonus 同局）事件拆分：建议按 funding\_type 各送一笔，或同事件严格分摊并标记  
* 外部发放（External Grant）纳入模板时需定义接口与事件映射规则

## **实施与风险控制建议（Implementation & Risk Notes）**

* 配置冻结（Policy Freeze）：bucket 记录策略快照，避免历史回算争议；策略变更仅影响新 bucket  
* 一致性与去重（Idempotency）：所有可重试接口提供 idempotency\_key；DWH/报表端保留去重视图与重放能力  
* 风控：支持回收/冻结/调整并完整审计；LOCKED\_BONUS 不可提领或转现；是否可下注需结合作弊路径评估

