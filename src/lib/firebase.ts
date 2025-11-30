// src/lib/firebase.ts
import { browser } from '$app/environment';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF-icK7JJe4VJPgBNzmBK-FOQx_NgsuqY",
  authDomain: "gg-viva.firebaseapp.com",
  projectId: "gg-viva",
  storageBucket: "gg-viva.firebasestorage.app",
  messagingSenderId: "225273193272",
  appId: "1:225273193272:web:9274fded630321509c97cd"
};

// Ensure we don't re-initialize during HMR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore & Auth work on both client and server (though you’ll typically use them in the browser)
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics: browser-only, guarded so SSR doesn’t explode
let analytics: Analytics | null = null;
if (browser) {
	analytics = getAnalytics(app);
}

export { analytics };
