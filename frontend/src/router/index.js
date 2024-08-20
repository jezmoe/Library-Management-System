import { createRouter, createWebHistory } from 'vue-router'
import { useMainStore } from '@/stores/main';
import { storeToRefs } from 'pinia';
import Fines from '../views/Fines.vue'
import Library from '../views/Library.vue'
import UserInventory from '../views/UserInventory.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        loginNeeded: false
      }
    },
    {
      path: '/inventory',
      name: 'My Items',
      component: UserInventory,
      meta: {
        loginNeeded: true
      }
    },
    {
      path: '/fines',
      name: 'My Fines',
      component: Fines,
      meta: {
        loginNeeded: true
      }
    },
    {
      path: '/library',
      name: 'Library',
      component: Library,
      meta: {
        loginNeeded: false
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        loginNeeded: false
      }
    },
    {
      path: '/profile',
      name: 'My Profile',
      component: Profile,
      meta: {
        loginNeeded: true
      }
    }
  ]
})

router.beforeEach((to, from) => {
  const mainStore = useMainStore()
  const { isLoggedIn } = storeToRefs(mainStore)

  if (isLoggedIn.value !== true && to.meta.loginNeeded && to.name !== 'Login') {
    document.title = "Login"
    return '/login'
  }

  document.title = to.name || "Library"
})
export default router
