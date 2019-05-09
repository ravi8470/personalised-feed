import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from "./views/Register.vue"
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
Vue.use(Router)

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } 
  else {
    position.x = 0
    position.y = 0
  }
  return position
}

let router = new Router({
  mode: 'history',
  scrollBehavior,
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        guest: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('jwt') == null) {
          next({
              path: '/login',
              // params: { nextUrl: to.fullPath }
          })
      } else {
          next();
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('jwt') == null){
          next()
      }
      else{
          next({ name: 'dashboard'})
      }
  }else {
      next() 
  }
})
export default router;
