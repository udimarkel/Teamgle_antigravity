import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 */

export default store((/* { ssrContext } */) => {
    const pinia = createPinia()
    // You can add Pinia plugins here
    return pinia
})
