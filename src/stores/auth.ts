import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../services/firebase";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

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
      await signOut(auth);
      user.value = null;
      token.value = null;
      console.log("👋 התנתקת בהצלחה");
    } catch (err: any) {
      console.error("❌ שגיאה בהתנתקות:", err);
      error.value = err.message;
    }
  }

  async function testTokenWithAPI(
    apiBaseUrl: string = "https://localhost:7219",
  ) {
    if (!token.value || !user.value) {
      console.error("❌ אין טוקן או משתמש");
      return null;
    }

    try {
      console.log("🚀 שולח בקשה לשרת עם הטוקן...");
      console.log("URL:", `${apiBaseUrl}/api/Auth/test-token`);

      const response = await fetch(`${apiBaseUrl}/api/Auth/test-token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 סטטוס תשובה:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ תשובה מהשרת:", data);
        return data;
      } else {
        const errorText = await response.text();
        console.error("❌ שגיאה מהשרת:", response.status, errorText);
        return null;
      }
    } catch (err: any) {
      console.error("❌ שגיאה בחיבור לשרת:", err);
      return null;
    }
  }

  // Initialize auth state listener
  function initAuthListener() {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser;
        token.value = await firebaseUser.getIdToken();
        console.log("👤 משתמש מחובר:", firebaseUser.email);
      } else {
        user.value = null;
        token.value = null;
        console.log("👤 אין משתמש מחובר");
      }
    });
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    userEmail,
    userId,
    // Actions
    login,
    logout,
    testTokenWithAPI,
    initAuthListener,
  };
});
