import { createRouter, createWebHistory } from 'vue-router'

import { default as SearchPage } from '@/pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      component: SearchPage
    }
  ],
})

export default router
