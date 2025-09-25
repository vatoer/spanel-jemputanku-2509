// Firebase client configuration
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate that all required config values are present
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const
for (const key of requiredKeys) {
  if (!firebaseConfig[key]) {
    throw new Error(`Firebase config missing: NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`)
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// For development, connect to auth emulator if needed
if (process.env.NODE_ENV === 'development' && !auth.emulatorConfig) {
  // connectAuthEmulator(auth, 'http://localhost:9099')
}

export default app