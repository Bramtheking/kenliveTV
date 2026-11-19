import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";

// Initialize Firebase Messaging
let messaging: any = null;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.error("Error initializing messaging:", error);
}

// Request notification permission and get FCM token
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (!messaging) {
      throw new Error("Firebase messaging not initialized");
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      throw new Error("Service workers are not supported");
    }

    // Request permission
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);
    
    if (permission !== "granted") {
      throw new Error("Notification permission denied");
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log("Service worker registered:", registration);

    // Wait for service worker to be active
    await navigator.serviceWorker.ready;

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_VAPID_KEY) ||
        "BKsdX5_Q89AZNuIDXVSbTbDUTBXtjpAG5hffQc15VettQttAaQNho2X6NYIv-6UT7Hp0BvCsMRJ9u_6AKN0tl-0",
      serviceWorkerRegistration: registration
    });

    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

// Listen for foreground messages
export function onMessageListener() {
  if (!messaging) return Promise.reject("Messaging not initialized");
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground message:", payload);
      resolve(payload);
    });
  });
}
