'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function AuthDebugPage() {
  const { user, userData, loading, getToken } = useAuth()
  const router = useRouter()

  const checkToken = async () => {
    const token = await getToken()
    console.log('Current token:', token ? `${token.substring(0, 50)}...` : 'null')
    
    if (token) {
      // Test token with verify endpoint
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })
        
        const result = await response.json()
        console.log('Token verification result:', result)
        alert(`Token verification: ${response.ok ? 'SUCCESS' : 'FAILED'}\n${JSON.stringify(result, null, 2)}`)
      } catch (error) {
        console.error('Token verification error:', error)
        alert('Token verification failed: ' + error)
      }
    }
  }

  const clearAuthState = async () => {
    try {
      await signOut(auth)
      // Clear cookie manually
      document.cookie = 'firebase-token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
      alert('Auth state cleared')
      router.refresh()
    } catch (error) {
      console.error('Error clearing auth:', error)
    }
  }

  const checkCookie = () => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    
    console.log('Current cookies:', cookies)
    alert('Firebase token cookie: ' + (cookies['firebase-token'] ? 'EXISTS' : 'MISSING'))
  }

  if (loading) {
    return <div className="p-8 text-center">Loading auth debug...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Firebase Auth State</CardTitle>
              <CardDescription>Current authentication status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>User:</strong> {user ? 'Authenticated' : 'Not authenticated'}
              </div>
              {user && (
                <>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Display Name:</strong> {user.displayName || 'null'}</div>
                  <div><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</div>
                  <div><strong>UID:</strong> {user.uid}</div>
                </>
              )}
              <div>
                <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Data</CardTitle>
              <CardDescription>Database sync status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>User Data:</strong> {userData ? 'Loaded' : 'Not loaded'}
              </div>
              {userData && (
                <>
                  <div><strong>ID:</strong> {userData.id}</div>
                  <div><strong>Email:</strong> {userData.email}</div>
                  <div><strong>Name:</strong> {userData.name || 'null'}</div>
                  <div><strong>Roles:</strong> {userData.roles?.join(', ') || 'none'}</div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Debug Actions</CardTitle>
              <CardDescription>Tools to debug authentication issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button onClick={checkToken} variant="outline">
                  Check Token
                </Button>
                <Button onClick={checkCookie} variant="outline">
                  Check Cookie
                </Button>
                <Button onClick={clearAuthState} variant="destructive">
                  Clear Auth State
                </Button>
                <Button onClick={() => router.push('/login')} variant="outline">
                  Go to Login
                </Button>
                <Button onClick={() => router.push('/dashboard')} variant="outline">
                  Go to Dashboard
                </Button>
                <Button onClick={() => router.push('/profile')} variant="outline">
                  Go to Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}