import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'

// Import Icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'

// Import Quasar css
import 'quasar/dist/quasar.css'

// Import Custom Styles
import './style.css'

import App from './App.vue'
import router from './router'
import store from './stores'

const myApp = createApp(App)

myApp.use(Quasar, {
    plugins: {
        Notify
    },
})

myApp.use(store)
myApp.use(router)

myApp.mount('#app')
