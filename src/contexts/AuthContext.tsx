"use client"

import { auth } from '@/lib/firebase'
import { User, onAuthStateChanged, signOut } from 'firebase/auth'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

interface UserData {
  id: string
  email: string
  name?: string | null
  image?: string | null
  roles: string[]
  tenants: { id: string; name: string }[]
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signOut: () => Promise<void>
  syncUserData: () => Promise<void>
  getToken: () => Promise<string | null>
}

// Utility function to set cookie
const setCookie = (name: string, value: string, hours: number = 24) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

// Utility function to delete cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const syncUserData = async () => {
    if (!user?.email) {
      console.log('syncUserData: No user email, clearing userData')
      setUserData(null)
      return
    }

    try {
      console.log('syncUserData: Fetching profile for', user.email)
      // Fetch user data from your Prisma database
      const response = await fetch(`/api/user/profile?email=${user.email}`)
      console.log('syncUserData: Profile response status', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('syncUserData: Profile data loaded', data)
        setUserData(data)
      } else {
        const errorText = await response.text()
        console.error('syncUserData: Profile fetch failed', response.status, errorText)
        setUserData(null)
      }
    } catch (error) {
      console.error('Error syncing user data:', error)
      setUserData(null)
    }
  }

  const getToken = async (): Promise<string | null> => {
    if (!user) return null
    try {
      const token = await user.getIdToken()
      return token
    } catch (error) {
      console.error('Error getting ID token:', error)
      return null
    }
  }

  const handleSignOut = async () => {
    try {
      // Clear the Firebase token cookie
      deleteCookie('firebase-token')
      
      await signOut(auth)
      setUser(null)
      setUserData(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? firebaseUser.email : 'null')
      setUser(firebaseUser)
      setLoading(false)

      if (firebaseUser) {
        try {
          // Get and store the Firebase ID token
          const token = await firebaseUser.getIdToken()
          console.log('Got token, length:', token.length)
          setCookie('firebase-token', token, 1) // Store for 1 hour
          
          // Verify token was set by reading it back
          const cookieCheck = document.cookie.includes('firebase-token')
          console.log('Token cookie set successfully:', cookieCheck)
          
          // Sync or create user in your database
          console.log('Syncing user to database:', firebaseUser.email)
          const response = await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              image: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
            }),
          })

          console.log('Sync user response status:', response.status)
          if (response.ok) {
            console.log('User sync successful, fetching profile data')
            await syncUserData()
          } else {
            const errorText = await response.text()
            console.error('Failed to sync user, status:', response.status, 'error:', errorText)
          }
        } catch (error) {
          console.error('Error syncing user:', error)
          // If token generation fails, sign out the user
          await signOut(auth)
        }
      } else {
        // Clear token cookie when user signs out
        console.log('Clearing token cookie')
        deleteCookie('firebase-token')
        setUserData(null)
      }
    })

    return () => unsubscribe()
  }, [user?.email])

  // Token refresh effect - refresh token every 50 minutes
  useEffect(() => {
    if (!user) return

    const tokenRefreshInterval = setInterval(async () => {
      try {
        const token = await user.getIdToken(true) // Force refresh
        setCookie('firebase-token', token, 1)
        console.log('Token refreshed successfully')
      } catch (error) {
        console.error('Error refreshing token:', error)
        // If token refresh fails, sign out the user
        handleSignOut()
      }
    }, 50 * 60 * 1000) // 50 minutes

    return () => clearInterval(tokenRefreshInterval)
  }, [user])

  const value = {
    user,
    userData,
    loading,
    signOut: handleSignOut,
    syncUserData,
    getToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Custom hook for authentication check
export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login'
    }
  }, [user, loading])

  return { user, loading }
}