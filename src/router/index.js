import Vue from 'vue'
import VueRouter from 'vue-router'
import v from '@/src/views/_index'

Vue.use(VueRouter)

const routes = [
  {
    name: 'user',
    path: '/user/:id?',
    alias: '/user',
    redirect: { name: 'search' },
    component: v.vUser,
    children: [
      { name: 'search', path: 'search', component: v.vSearch },
      { name: 'favorites', path: 'favorites', component: v.vFavorites },
    ],
  },
  { name: 'auth', path: '/', component: v.vAuthorization },
  { name: '404', path: '/*', component: v.vNotFound },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
