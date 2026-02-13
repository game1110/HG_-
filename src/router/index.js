import { createRouter, createWebHashHistory } from 'vue-router'
import PlayerLayout from '../layouts/PlayerLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
  {
    path: '/',
    component: PlayerLayout,
    children: [
      { path: '', name: 'WalletHome', component: () => import('../views/player/WalletHome.vue') },
      { path: 'betting', name: 'BettingSimulator', component: () => import('../views/player/BettingSimulator.vue') },
      { path: 'records', name: 'GameRecords', component: () => import('../views/player/GameRecords.vue') },
      { path: 'transactions', name: 'WalletTransactions', component: () => import('../views/player/WalletTransactions.vue') },
      { path: 'profile', name: 'Profile', component: () => import('../views/player/Profile.vue') },
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'campaigns', name: 'CampaignList', component: () => import('../views/admin/CampaignList.vue') },
      { path: 'campaigns/:id', name: 'CampaignEdit', component: () => import('../views/admin/CampaignEdit.vue') },
      { path: 'bonus', name: 'BonusManagement', component: () => import('../views/admin/BonusManagement.vue') },
      { path: 'buckets', name: 'BucketManagement', component: () => import('../views/admin/BucketManagement.vue') },
      { path: 'players', name: 'PlayerManagement', component: () => import('../views/admin/PlayerManagement.vue') },
      { path: 'audit', name: 'AuditLog', component: () => import('../views/admin/AuditLog.vue') },
    ]
  },
  {
    path: '/reports',
    component: AdminLayout,
    children: [
      { path: 'daily', name: 'DailyReport', component: () => import('../views/reports/DailyReport.vue') },
      { path: 'campaign', name: 'CampaignReport', component: () => import('../views/reports/CampaignReport.vue') },
      { path: 'finance', name: 'FinanceReport', component: () => import('../views/reports/FinanceReport.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
