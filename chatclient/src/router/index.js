import Vue from 'vue'
import VueRouter from 'vue-router'
// import Chat from '../views/Chat.vue'
// import Login from '../views/Login.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '/login', component: () => import('../views/Login.vue'),
  },
  {
    path: '/',
    component: () => import('../components/SideBar.vue'),
    children: [
      { path: '/', component: () => import('../views/Chat.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/login"
      });
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router
