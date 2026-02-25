console.log("🚀 main.ts נטען!");

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
import { auth } from "./services/firebase";

console.log("📦 כל הייבואים נטענו בהצלחה");

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {
    Notify,
    Loading,
  },
});

myApp.use(store);
myApp.use(router);

// Initialize Firebase Auth Listener BEFORE mounting
// זה מבטיח שהמשתמש יזוהה לפני שהראוטר מתחיל לעבוד
const authStore = useAuthStore();

// המתן לאתחול מצב ההתחברות מ-Firebase לפני הרכבת האפליקציה
(async () => {
  console.log("⏳ ממתין לאתחול Firebase Auth...");

  // המתן לאתחול עם timeout של שנייה
  const initPromise = authStore.initAuthListener();
  const timeoutPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log("⚠️ Firebase Auth timeout - ממשיך בכל מקרה");
      resolve();
    }, 1000);
  });

  await Promise.race([initPromise, timeoutPromise]);

  console.log(
    "🚀 מרכיב אפליקציה - מצב התחברות:",
    authStore.isAuthenticated ? "מחובר" : "לא מחובר",
  );
  myApp.mount("#app");
})();
