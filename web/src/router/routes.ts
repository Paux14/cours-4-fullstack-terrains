import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/pages/Home.vue'),
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('@/pages/Register.vue'),
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/pages/Login.vue'),
  },
]
