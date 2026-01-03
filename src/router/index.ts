// import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 */

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,

  // ⬇️ זה השינוי החשוב! ⬇️
  // אנחנו מכריחים אותו לעבוד במצב Hash (עם סולמית #)
  // ומוחקים את כל התנאים המורכבים.
  history: createWebHashHistory() 
})

export default Router