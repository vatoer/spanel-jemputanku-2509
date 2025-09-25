// Firebase Admin SDK for server-side operations
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Initialize Firebase Admin with proper configuration
const initFirebaseAdmin = () => {
  if (getApps().length > 0) {
    return getApps()[0]
  }

  // For production with service account key (base64 encoded)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString()
      )
      
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
    } catch (error) {
      console.error('Error parsing service account key:', error)
    }
  }

  // For production with individual environment variables
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      // Handle different private key formats
      let privateKey = process.env.FIREBASE_PRIVATE_KEY
      
      // If it's a JSON string, parse it first
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = JSON.parse(privateKey)
      }
      
      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n')
      
      return initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        projectId: process.env.FIREBASE_PROJECT_ID,
      })
    } catch (error) {
      console.error('Firebase Admin initialization error:', error)
      throw new Error(`Failed to initialize Firebase Admin: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // For development or default application credentials
  return initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })
}

export const adminApp = initFirebaseAdmin()
export const adminAuth = getAuth(adminApp)

// Utility function to verify Firebase ID token
export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null,
      emailVerified: decodedToken.email_verified || false,
      decodedToken, // Include full token for additional claims
    }
  } catch (error) {
    console.error('Error verifying ID token:', error)
    return null
  }
}

// Utility function to get user by UID
export async function getUserByUid(uid: string) {
  try {
    const userRecord = await adminAuth.getUser(uid)
    return {
      uid: userRecord.uid,
      email: userRecord.email || null,
      displayName: userRecord.displayName || null,
      photoURL: userRecord.photoURL || null,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      metadata: {
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
        lastRefreshTime: userRecord.metadata.lastRefreshTime,
      },
      customClaims: userRecord.customClaims || {},
    }
  } catch (error) {
    console.error('Error getting user by UID:', error)
    return null
  }
}

// Utility function to create custom token (useful for server-side authentication)
export async function createCustomToken(uid: string, additionalClaims?: Record<string, any>) {
  try {
    const customToken = await adminAuth.createCustomToken(uid, additionalClaims)
    return customToken
  } catch (error) {
    console.error('Error creating custom token:', error)
    return null
  }
}

// Utility function to set custom user claims (for roles, permissions, etc.)
export async function setCustomUserClaims(uid: string, customClaims: Record<string, any>) {
  try {
    await adminAuth.setCustomUserClaims(uid, customClaims)
    return true
  } catch (error) {
    console.error('Error setting custom user claims:', error)
    return false
  }
}