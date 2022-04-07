import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/ListView.vue'

const routes = [
  {
    path: '/',
    name: 'ListView',
    component: Home
  },
  {
    path: '/item/:id',
    name: 'DetailsView',
    component: () => import('../views/DetailsView.vue')
  },
  {
    path: "/mycart",
    name: "mycart",
    component: () => import('../views/Mycart.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
