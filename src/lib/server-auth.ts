import { getUserByUid, verifyIdToken } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

/**
 * Server-side utility to get the current authenticated user from request
 * Can be used in API routes, server components, and middleware
 */
export async function getServerUser(request?: NextRequest) {
  try {
    let token: string | undefined

    if (request) {
      // Get token from request (useful in API routes)
      token = request.cookies.get('firebase-token')?.value ||
              request.headers.get('authorization')?.replace('Bearer ', '')
    } else {
      // Get token from cookies (useful in server components)
      const cookieStore = await cookies()
      token = cookieStore.get('firebase-token')?.value
    }

    if (!token) {
      return null
    }

    // Verify the token
    const decodedToken = await verifyIdToken(token)
    if (!decodedToken) {
      return null
    }

    // Get additional user data from Firebase Admin
    const userRecord = await getUserByUid(decodedToken.uid)
    if (!userRecord) {
      return null
    }

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || userRecord.displayName,
      picture: decodedToken.picture || userRecord.photoURL,
      emailVerified: decodedToken.emailVerified,
      customClaims: userRecord.customClaims || {},
      metadata: userRecord.metadata,
    }
  } catch (error) {
    console.error('Error getting server user:', error)
    return null
  }
}

/**
 * Server-side utility to require authentication
 * Throws an error if user is not authenticated
 */
export async function requireServerAuth(request?: NextRequest) {
  const user = await getServerUser(request)
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

/**
 * Server-side utility to check if user has specific role
 */
export async function hasRole(role: string, request?: NextRequest) {
  try {
    const user = await getServerUser(request)
    if (!user) return false

    const roles = user.customClaims?.roles as string[] | undefined
    return roles?.includes(role) || false
  } catch (error) {
    console.error('Error checking user role:', error)
    return false
  }
}

/**
 * Server-side utility to check if user has any of the specified roles
 */
export async function hasAnyRole(roles: string[], request?: NextRequest) {
  try {
    const user = await getServerUser(request)
    if (!user) return false

    const userRoles = user.customClaims?.roles as string[] | undefined
    if (!userRoles) return false

    return roles.some(role => userRoles.includes(role))
  } catch (error) {
    console.error('Error checking user roles:', error)
    return false
  }
}

/**
 * Higher-order function to protect API routes
 */
export function withAuth<T extends any[]>(
  handler: (user: NonNullable<Awaited<ReturnType<typeof getServerUser>>>, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const user = await requireServerAuth(request)
      return await handler(user, ...args)
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}

/**
 * Higher-order function to protect API routes with role checking
 */
export function withRole<T extends any[]>(
  requiredRole: string,
  handler: (user: NonNullable<Awaited<ReturnType<typeof getServerUser>>>, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const user = await requireServerAuth(request)
      
      if (!await hasRole(requiredRole, request)) {
        return new Response(
          JSON.stringify({ error: `Role '${requiredRole}' required` }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

      return await handler(user, ...args)
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}

/**
 * Get user data from Prisma database using server-side auth
 */
export async function getServerUserData(request?: NextRequest) {
  try {
    const user = await getServerUser(request)
    if (!user?.email) return null

    // This would integrate with your existing user sync API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/user/profile?email=${user.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      return await response.json()
    }

    return null
  } catch (error) {
    console.error('Error getting server user data:', error)
    return null
  }
}