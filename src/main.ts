import { createApp } from "vue";
import { Quasar, Notify, Loading } from "quasar";

// Import Icon libraries
import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/material-symbols-rounded/material-symbols-rounded.css";

// Import Quasar css
import "quasar/dist/quasar.css";

// Import Custom Styles
import "./style.css";

import App from "./App.vue";
import router from "./router";
import store from "./stores";
import { useAuthStore } from "./stores/auth";

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {
    Notify,
    Loading,
  },
});

myApp.use(store);
myApp.use(router);

myApp.mount("#app");

// Initialize Firebase Auth Listener
const authStore = useAuthStore();
authStore.initAuthListener();
