// Firebase Configuration and Initialization
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithCustomToken,
  updateCurrentUser,
  deleteUser,
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";

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

// Initialize Firebase Storage
export const storage = getStorage(app);

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

/**
 * העלאת קבצים של עובד ל-Firebase Storage
 * @param employeeUID - ה-UID של העובד
 * @param files - מערך של קבצים להעלאה
 * @returns מערך של URLs של הקבצים שהועלו
 */
export async function uploadEmployeeFiles(
  employeeUID: string,
  files: File[],
): Promise<string[]> {
  try {
    console.log(`📤 מעלה ${files.length} קבצים לעובד ${employeeUID}...`);

    const uploadPromises = files.map(async (file) => {
      // יצירת נתיב ייחודי לכל קבץ
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const fileRef = storageRef(
        storage,
        `employees/${employeeUID}/files/${fileName}`,
      );

      // העלאת הקבץ
      await uploadBytes(fileRef, file);

      // קבלת ה-URL להורדה
      const downloadURL = await getDownloadURL(fileRef);
      console.log(`✅ קבץ הועלה: ${file.name}`);

      return downloadURL;
    });

    const urls = await Promise.all(uploadPromises);
    console.log(`✅ כל הקבצים הועלו בהצלחה`);
    return urls;
  } catch (error: any) {
    console.error("❌ שגיאה בהעלאת קבצים:", error);
    throw new Error(error.message || "Failed to upload files");
  }
}

/**
 * קבלת כל הקבצים של עובד מ-Firebase Storage
 * @param employeeUID - ה-UID של העובד
 * @returns מערך של אובייקטים עם שם הקבץ וה-URL שלו
 */
export async function getEmployeeFiles(
  employeeUID: string,
): Promise<{ name: string; url: string; fullPath: string }[]> {
  try {
    console.log(`📥 מושך קבצים של עובד ${employeeUID}...`);

    const filesRef = storageRef(storage, `employees/${employeeUID}/files`);
    const filesList = await listAll(filesRef);

    const filesPromises = filesList.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return {
        name: itemRef.name,
        url: url,
        fullPath: itemRef.fullPath,
      };
    });

    const files = await Promise.all(filesPromises);
    console.log(`✅ נמצאו ${files.length} קבצים`);
    return files;
  } catch (error: any) {
    // אם התיקייה לא קיימת, זה לא שגיאה
    if (error.code === "storage/object-not-found") {
      console.log(`ℹ️ לא נמצאו קבצים לעובד ${employeeUID}`);
      return [];
    }
    console.error("❌ שגיאה בקבלת קבצים:", error);
    throw new Error(error.message || "Failed to get files");
  }
}

/**
 * מחיקת קבץ של עובד מ-Firebase Storage
 * @param filePath - הנתיב המלא של הקבץ
 */
export async function deleteEmployeeFile(filePath: string): Promise<void> {
  try {
    console.log(`🗑️ מוחק קבץ: ${filePath}...`);
    const fileRef = storageRef(storage, filePath);
    await deleteObject(fileRef);
    console.log(`✅ קבץ נמחק בהצלחה`);
  } catch (error: any) {
    console.error("❌ שגיאה במחיקת קבץ:", error);
    throw new Error(error.message || "Failed to delete file");
  }
}

/**
 * העלאת תמונת פרופיל של עובד ל-Firebase Storage
 * @param employeeUID - ה-UID של העובד
 * @param imageFile - קובץ התמונה
 * @returns URL של התמונה שהועלתה
 */
export async function uploadEmployeeProfilePicture(
  employeeUID: string,
  imageFile: File,
): Promise<string> {
  try {
    console.log(`📤 מעלה תמונת פרופיל לעובד ${employeeUID}...`);

    // יצירת נתיב לתמונת הפרופיל
    const fileExtension = imageFile.name.split(".").pop();
    const fileName = `profile.${fileExtension}`;
    const fileRef = storageRef(
      storage,
      `employees/${employeeUID}/profile/${fileName}`,
    );

    // העלאת התמונה
    await uploadBytes(fileRef, imageFile);

    // קבלת ה-URL להורדה
    const downloadURL = await getDownloadURL(fileRef);
    console.log(`✅ תמונת פרופיל הועלתה בהצלחה`);

    return downloadURL;
  } catch (error: any) {
    console.error("❌ שגיאה בהעלאת תמונת פרופיל:", error);
    throw new Error(error.message || "Failed to upload profile picture");
  }
}

/**
 * קבלת תמונת פרופיל של עובד מ-Firebase Storage
 * @param employeeUID - ה-UID של העובד
 * @returns URL של התמונה או null אם לא קיימת
 */
export async function getEmployeeProfilePicture(
  employeeUID: string,
): Promise<string | null> {
  try {
    const profileRef = storageRef(storage, `employees/${employeeUID}/profile`);
    const filesList = await listAll(profileRef);

    // אם יש קובץ profile, נחזיר את ה-URL שלו
    if (filesList.items.length > 0) {
      const profileFile = filesList.items[0]; // לוקחים את הקובץ הראשון
      const url = await getDownloadURL(profileFile);
      return url;
    }

    return null;
  } catch (error: any) {
    // אם התיקייה לא קיימת, זה לא שגיאה
    if (error.code === "storage/object-not-found") {
      return null;
    }
    console.error("❌ שגיאה בקבלת תמונת פרופיל:", error);
    return null;
  }
}

/**
 * מחיקת כל הקבצים של עובד מ-Firebase Storage
 * @param employeeUID - ה-UID של העובד ב-Firebase
 */
export async function deleteAllEmployeeFiles(
  employeeUID: string,
): Promise<void> {
  try {
    console.log(`🗑️ מוחק את כל הקבצים של העובד ${employeeUID}...`);

    // מחיקת קבצי העובד
    const filesRef = storageRef(storage, `employees/${employeeUID}/files`);
    try {
      const filesList = await listAll(filesRef);
      const deleteFilesPromises = filesList.items.map((itemRef) =>
        deleteObject(itemRef),
      );
      await Promise.all(deleteFilesPromises);
      console.log(`✅ נמחקו ${filesList.items.length} קבצים`);
    } catch (error: any) {
      if (error.code !== "storage/object-not-found") {
        console.error("⚠️ שגיאה במחיקת קבצים:", error);
      }
    }

    // מחיקת תמונת הפרופיל
    const profileRef = storageRef(storage, `employees/${employeeUID}/profile`);
    try {
      const profileList = await listAll(profileRef);
      const deleteProfilePromises = profileList.items.map((itemRef) =>
        deleteObject(itemRef),
      );
      await Promise.all(deleteProfilePromises);
      console.log(`✅ נמחקה תמונת הפרופיל`);
    } catch (error: any) {
      if (error.code !== "storage/object-not-found") {
        console.error("⚠️ שגיאה במחיקת תמונת פרופיל:", error);
      }
    }

    console.log(`✅ כל הקבצים של העובד ${employeeUID} נמחקו בהצלחה`);
  } catch (error: any) {
    console.error("❌ שגיאה במחיקת קבצי העובד:", error);
    throw error;
  }
}

/**
 * מחיקת משתמש מ-Firebase Authentication
 * הערה: פונקציה זו דורשת שהמשתמש יהיה מחובר כרגע
 * במקרה של מחיקת עובד, השרת צריך לטפל במחיקה דרך Firebase Admin SDK
 * @param employeeUID - ה-UID של העובד ב-Firebase
 */
export async function deleteFirebaseUser(employeeUID: string): Promise<void> {
  try {
    console.log(`🗑️ מוחק משתמש מ-Firebase Authentication: ${employeeUID}`);

    // הערה: מחיקת משתמש מ-Firebase Authentication דורשת Firebase Admin SDK בצד השרת
    // הקוד הזה לא יעבוד מהצד של הלקוח מסיבות אבטחה
    // השרת צריך לטפל במחיקה דרך Firebase Admin SDK

    console.log("⚠️ מחיקת משתמש מ-Firebase Authentication צריכה להתבצע בשרת");
    console.log("💡 השרת צריך להשתמש ב-Firebase Admin SDK למחיקת המשתמש");
  } catch (error: any) {
    console.error("❌ שגיאה במחיקת משתמש מ-Firebase:", error);
    throw error;
  }
}

export default app;
