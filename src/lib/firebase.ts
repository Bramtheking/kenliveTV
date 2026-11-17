/**
 * KenLive TV - Firebase Realtime Database Configuration
 * =======================================================
 * Set up environment variables in your .env file:
 *
 * VITE_FIREBASE_API_KEY="AIzaSy..."
 * VITE_FIREBASE_AUTH_DOMAIN="kenlive-tv.firebaseapp.com"
 * VITE_FIREBASE_DATABASE_URL="https://kenlive-tv-default-rtdb.firebaseio.com"
 * VITE_FIREBASE_PROJECT_ID="kenlive-tv"
 * VITE_FIREBASE_STORAGE_BUCKET="kenlive-tv.appspot.com"
 * VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
 * VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
 */

export interface FirebaseEnvConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const getFirebaseConfig = (): FirebaseEnvConfig => {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
};

/**
 * Returns true if all required Firebase credentials are set.
 */
export const isFirebaseConfigured = (): boolean => {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.databaseURL && config.projectId);
};

export const FIREBASE_DB_PATH = '/chat/main/messages';

