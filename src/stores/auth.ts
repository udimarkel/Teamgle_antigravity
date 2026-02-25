import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { testToken as apiTestToken } from "../services/api";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const tokenRefreshInterval = ref<number | null>(null);
  const authInitialized = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const userEmail = computed(() => user.value?.email || "");
  const userId = computed(() => user.value?.uid || "");

  // Actions
  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      console.log("🔐 מתחבר ל-Firebase...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      user.value = userCredential.user;

      // Get the ID token
      console.log("🎫 מקבל טוקן...");
      token.value = await userCredential.user.getIdToken();

      console.log("✅ התחברות מוצלחת ל-Firebase!");
      console.log("User ID:", user.value.uid);
      console.log("Email:", user.value.email);
      console.log("Token:", token.value);

      return { success: true, user: user.value, token: token.value };
    } catch (err: any) {
      console.error("❌ שגיאת התחברות:", err);
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      // עצור את רענון הטוקן
      stopTokenRefresh();

      await signOut(auth);
      user.value = null;
      token.value = null;
      console.log("👋 התנתקת בהצלחה");
    } catch (err: any) {
      console.error("❌ שגיאה בהתנתקות:", err);
      error.value = err.message;
    }
  }

  // רענון טוקן אוטומטי כל 50 דקות (טוקן Firebase תקף לשעה)
  function startTokenRefresh() {
    // נקה interval קודם אם קיים
    stopTokenRefresh();

    // רענן טוקן כל 50 דקות (3000000 מילישניות)
    tokenRefreshInterval.value = window.setInterval(
      async () => {
        if (user.value) {
          try {
            console.log("🔄 מרענן טוקן...");
            const newToken = await user.value.getIdToken(true); // force refresh
            token.value = newToken;
            console.log("✅ טוקן רוענן בהצלחה");
          } catch (err) {
            console.error("❌ שגיאה ברענון טוקן:", err);
            // אם רענון נכשל, נתק את המשתמש
            await logout();
          }
        }
      },
      50 * 60 * 1000,
    ); // 50 דקות

    console.log("⏰ רענון טוקן אוטומטי הופעל (כל 50 דקות)");
  }

  function stopTokenRefresh() {
    if (tokenRefreshInterval.value) {
      clearInterval(tokenRefreshInterval.value);
      tokenRefreshInterval.value = null;
      console.log("⏰ רענון טוקן אוטומטי הופסק");
    }
  }

  async function testTokenWithAPI() {
    return apiTestToken();
  }

  // Initialize auth state listener
  function initAuthListener() {
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser;
          token.value = await firebaseUser.getIdToken();
          console.log("👤 משתמש מחובר:", firebaseUser.email);

          // התחל רענון טוקן אוטומטי
          startTokenRefresh();
        } else {
          user.value = null;
          token.value = null;
          console.log("👤 אין משתמש מחובר");

          // עצור רענון טוקן
          stopTokenRefresh();
        }

        // סמן שהאתחול הושלם
        if (!authInitialized.value) {
          authInitialized.value = true;
          resolve();
        }
      });
    });
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    authInitialized,
    // Getters
    isAuthenticated,
    userEmail,
    userId,
    // Actions
    login,
    logout,
    testTokenWithAPI,
    initAuthListener,
    startTokenRefresh,
    stopTokenRefresh,
  };
});
