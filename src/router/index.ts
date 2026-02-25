console.log("🛣️ router/index.ts נטען!");

// import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "../stores/auth";

console.log("📦 Router imports נטענו");

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
  history: createWebHashHistory(),
});

// Navigation Guard - הגנה על דפים שדורשים התחברות
Router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // המתן לאתחול Auth אם עדיין לא הושלם
  if (!authStore.authInitialized) {
    console.log("⏳ ממתין לאתחול Auth...");
    // המתן עד שהאתחול יושלם (מקסימום 2 שניות)
    let attempts = 0;
    while (!authStore.authInitialized && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }
  }

  // דפים ציבוריים שלא דורשים התחברות
  const publicPages = ["/login"];
  const authRequired = !publicPages.includes(to.path);

  console.log("🔍 Navigation Guard:", {
    to: to.path,
    authenticated: authStore.isAuthenticated,
    authRequired,
  });

  // אם הדף דורש התחברות והמשתמש לא מחובר
  if (authRequired && !authStore.isAuthenticated) {
    console.log("🚫 גישה נדחתה - משתמש לא מחובר, מפנה ל-login");
    return next("/login");
  }

  // אם המשתמש מחובר ומנסה להגיע לדף התחברות, הפנה לדף הבית
  if (to.path === "/login" && authStore.isAuthenticated) {
    console.log("✅ משתמש כבר מחובר, מפנה לדף הבית");
    return next("/");
  }

  next();
});

export default Router;
