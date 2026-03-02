// Firebase Configuration and Initialization
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithCustomToken,
  updateCurrentUser,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvyTB636tDSYNK3sUYlWTnMrqsRjGhf_0",
  authDomain: "teamgle-9b1c5.firebaseapp.com",
  databaseURL:
    "https://teamgle-9b1c5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "teamgle-9b1c5",
  storageBucket: "teamgle-9b1c5.firebasestorage.app",
  messagingSenderId: "640402208616",
  appId: "1:640402208616:web:82592df2ff39c36b3408dd",
  measurementId: "G-3FEYQQ7GD6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

/**
 * יצירת משתמש חדש ב-Firebase Authentication מבלי לשנות את המשתמש המחובר הנוכחי
 * @param email - כתובת האימייל של המשתמש החדש
 * @param password - הסיסמה של המשתמש החדש
 * @returns ה-UID של המשתמש החדש
 */
export async function createFirebaseUser(
  email: string,
  password: string,
): Promise<string> {
  // שמירת המשתמש המקורי (המנהל)
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("No authenticated user found. Admin must be logged in.");
  }

  try {
    console.log("🔐 יוצר משתמש חדש ב-Firebase...");
    console.log("👤 משתמש נוכחי (מנהל):", currentUser.uid);

    // יצירת משתמש חדש - זה משנה את currentUser!
    const newUserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const newUserUID = newUserCredential.user.uid;
    console.log("✅ משתמש חדש נוצר בהצלחה:", newUserUID);

    // החזרת המשתמש המקורי (המנהל) להיות המשתמש המחובר
    await updateCurrentUser(auth, currentUser);
    console.log("🔄 המשתמש המקורי (מנהל) הוחזר:", currentUser.uid);

    return newUserUID;
  } catch (error: any) {
    console.error("❌ שגיאה ביצירת משתמש ב-Firebase:", error);

    // במקרה של שגיאה, ננסה להחזיר את המשתמש המקורי
    try {
      await updateCurrentUser(auth, currentUser);
    } catch (restoreError) {
      console.error("❌ שגיאה בהחזרת המשתמש המקורי:", restoreError);
    }

    throw new Error(error.message || "Failed to create Firebase user");
  }
}

export default app;
