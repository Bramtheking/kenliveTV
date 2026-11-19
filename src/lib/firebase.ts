import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA2UlXwk73QKYjvNGK8UNzLG2n8PJhKn8Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kenlive-58327.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kenlive-58327",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kenlive-58327.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "329627457758",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:329627457758:web:21283c6371fd2f69bc0a4f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2DN81FPFWM",
};

// Avoid re-initialising if hot-reload already created the app
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Firestore — wrapped so a missing/disabled service doesn't crash the whole page
export let db: ReturnType<typeof getFirestore>;
try {
  db = getFirestore(app);
} catch (err) {
  console.warn("Firestore could not be initialised:", err);
  // Cast to satisfy TypeScript; individual calls will fail gracefully via their own try/catch
  db = null as unknown as ReturnType<typeof getFirestore>;
}
