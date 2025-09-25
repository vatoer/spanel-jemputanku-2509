import { withAuth } from '@/lib/server-auth'
import { NextRequest, NextResponse } from 'next/server'

// Example of a protected API route using the withAuth HOF
export const GET = withAuth(async (user, request: NextRequest) => {
  // User is guaranteed to be authenticated at this point
  return NextResponse.json({
    message: 'This is a protected endpoint',
    user: {
      uid: user.uid,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
    },
    timestamp: new Date().toISOString(),
  })
})

// You can also manually check authentication in API routes
export async function POST(request: NextRequest) {
  try {
    const { getServerUser } = await import('@/lib/server-auth')
    const user = await getServerUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Process the authenticated request
    return NextResponse.json({
      message: 'Data processed successfully',
      user: user.email,
      data: body,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}