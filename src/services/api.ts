/**
 * API Service - שירות מרכזי לכל הבקשות לשרת
 *
 * קובץ זה מרכז את כל התקשורת עם ה-Backend.
 */

import { useAuthStore } from "../stores/auth";

// כתובת הבסיס של ה-Backend
const API_BASE_URL = "https://localhost:7219";

// ========================================
// API Functions - Auth (אימות)
// ========================================

/**
 * בדיקת תקינות טוקן מול השרת
 */
export async function testToken(): Promise<any> {
  const authStore = useAuthStore();

  if (!authStore.token) {
    console.error("❌ אין טוקן זמין");
    return null;
  }

  try {
    console.log("🚀 שולח בקשה לשרת עם הטוקן...");
    console.log("URL:", `${API_BASE_URL}/api/Auth/test-token`);

    const response = await fetch(`${API_BASE_URL}/api/Auth/test-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
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

export default {
  testToken,
};
