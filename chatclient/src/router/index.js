import Vue from 'vue'
import VueRouter from 'vue-router'
// import Chat from '../views/Chat.vue'
// import Login from '../views/Login.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '/login', component: () => import('../views/Login.vue') ,
  },
  {
    // path: '/chat',
    // name: 'chat',
    // component: Chat
    path: '/',
    component: () => import('../components/SideBar.vue'),
    children: [
      { path: '/chat', component: () => import('../views/Chat.vue') }
    ],
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
