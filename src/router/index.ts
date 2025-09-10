import { createRouter, createWebHistory } from 'vue-router'

import { default as SearchPage } from '@/pages'
import { default as LogPage } from '@/pages/log'
import { default as NotFoundPage } from '@/pages/404'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      component: SearchPage
    },
    {
      path:'/logs/:id',
      component: LogPage
    },
    {
			path: '/:pathMatch(.*)*',
      component: NotFoundPage
    }
  ],
})

export default router
