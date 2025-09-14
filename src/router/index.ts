import { createRouter, createWebHistory } from 'vue-router'

import { default as SearchPage } from '~/pages'
import { default as LogPage } from '~/pages/log'
import { default as NotFoundPage } from '~/pages/404'

export const PAGES = {
  Search: 'Search',
  Log: 'Log',
  NotFound: 'NotFound',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name: PAGES.Search,
      component: SearchPage
    },
    {
      path:'/logs/:id',
      name: PAGES.Log,
      component: LogPage
    },
    {
			path: '/:pathMatch(.*)*',
      name: PAGES.NotFound,
      component: NotFoundPage
    }
  ],
})

export default router
