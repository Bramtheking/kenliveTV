importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyA2UlXwk73QKYjvNGK8UNzLG2n8PJhKn8Y",
  authDomain: "kenlive-58327.firebaseapp.com",
  projectId: "kenlive-58327",
  storageBucket: "kenlive-58327.firebasestorage.app",
  messagingSenderId: "329627457758",
  appId: "1:329627457758:web:21283c6371fd2f69bc0a4f",
  measurementId: "G-2DN81FPFWM"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title || 'New Update from KenLive';
  const notificationOptions = {
    body: payload.notification.body || 'Check out our latest content',
    icon: '/kenlive-logo.jpg',
    badge: '/kenlive-logo.jpg',
    vibrate: [200, 100, 200],
    tag: 'kenlive-notification',
    requireInteraction: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
