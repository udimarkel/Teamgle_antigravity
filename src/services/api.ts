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

// ========================================
// API Functions - Employees (עובדים)
// ========================================

/**
 * DTO לרישום עובד חדש
 */
export interface RegisterEmployeeDto {
  firebaseUID: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string; // ISO date string
  phoneNum: string;
  picture_URL?: string;
  role: string;
  costPerHour: number;
  filesLink?: string;
  uid?: string;
}

/**
 * רישום עובד חדש
 */
export async function registerEmployee(dto: RegisterEmployeeDto): Promise<any> {
  const authStore = useAuthStore();

  if (!authStore.token) {
    console.error("❌ אין טוקן זמין");
    throw new Error("No authentication token available");
  }

  try {
    console.log("🚀 שולח בקשה לרישום עובד חדש...");

    const response = await fetch(`${API_BASE_URL}/api/Employees/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    console.log("📡 סטטוס תשובה:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ עובד נוסף בהצלחה:", data);
      return data;
    } else {
      const errorText = await response.text();
      console.error("❌ שגיאה מהשרת:", response.status, errorText);
      throw new Error(errorText || "Failed to register employee");
    }
  } catch (err: any) {
    console.error("❌ שגיאה בחיבור לשרת:", err);
    throw err;
  }
}

export default {
  testToken,
  registerEmployee,
};
