import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/']

  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/rute',
    '/lacak-armada',
    '/jadwal',
    '/profile', 
    '/settings',
    '/notifications',
    '/billing',
    '/help'
  ]

  // Define auth routes that should redirect authenticated users
  const authRoutes = ['/login', '/signup']

  // Check route types
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)

  // Get the authentication token from cookies or Authorization header
  const tokenFromCookie = request.cookies.get('firebase-token')?.value
  const tokenFromHeader = request.headers.get('authorization')?.replace('Bearer ', '')
  const token = tokenFromCookie || tokenFromHeader

  console.log('Middleware - Path:', pathname, 'Protected:', isProtectedRoute, 'Auth route:', isAuthRoute, 'Token exists:', !!token)
  if (token) {
    console.log('Token source:', tokenFromCookie ? 'cookie' : 'header', 'Length:', token.length)
  }

  // If accessing a protected route without a token, redirect to login
  if (isProtectedRoute && !token) {
    console.log('Redirecting to login - no token')
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing auth routes with a token, verify it and redirect if valid
  if (isAuthRoute && token) {
    try {
      const verifyResponse = await fetch(new URL('/api/auth/verify', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      })

      if (verifyResponse.ok) {
        // Token is valid, redirect to dashboard or specified redirect
        const redirectUrl = request.nextUrl.searchParams.get('redirect') || '/dashboard'
        console.log('Redirecting authenticated user to:', redirectUrl)
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      } else {
        // Token is invalid, clear it and continue to auth page
        console.log('Invalid token, clearing cookie')
        const response = NextResponse.next()
        response.cookies.delete('firebase-token')
        return response
      }
    } catch (error) {
      console.error('Token verification error:', error)
      // Verification failed, clear the cookie and continue to auth page
      const response = NextResponse.next()
      response.cookies.delete('firebase-token')
      return response
    }
  }

  // For protected routes with token, verify the token
  if (isProtectedRoute && token) {
    try {
      const verifyResponse = await fetch(new URL('/api/auth/verify', request.url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      })

      if (!verifyResponse.ok) {
        console.log('Token verification failed, redirecting to login')
        // Token is invalid, redirect to login
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('firebase-token')
        return response
      }
    } catch (error) {
      console.error('Token verification error:', error)
      // Verification failed, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('firebase-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}