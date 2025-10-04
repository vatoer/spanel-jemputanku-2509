import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { uid, email, name, image, emailVerified } = await request.json()

    console.log('Test sync user request:', { uid, email, name, emailVerified })

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'UID and email are required' },
        { status: 400 }
      )
    }

    // Skip Firebase validation for testing
    console.log('Skipping Firebase validation for test...')

    // Use a transaction to ensure atomic operations
    const user = await prisma.$transaction(async (tx) => {
      // First ensure the default role exists
      await tx.role.upsert({
        where: { id: 'TENANT_USER' },
        update: {},
        create: {
          id: 'TENANT_USER',
          name: 'Tenant User',
          description: 'Default role for tenant users',
          createdBy: 'system'
        }
      })

      // Check if user already exists
      const existingUser = await tx.user.findUnique({
        where: { email },
        include: {
          UserRole: { include: { role: true } },
          UserTenant: { include: { tenant: true } }
        }
      })

      if (existingUser) {
        console.log('Updating existing user:', email)
        // Update existing user
        return await tx.user.update({
          where: { email },
          data: {
            name,
            image,
            emailVerified: emailVerified ? new Date() : existingUser.emailVerified,
            firebaseUid: uid,
          },
          include: {
            UserRole: { include: { role: true } },
            UserTenant: { include: { tenant: true } }
          }
        })
      } else {
        console.log('Creating new user:', email)
        // Create new user with role
        return await tx.user.create({
          data: {
            email,
            name,
            image,
            emailVerified: emailVerified ? new Date() : null,
            firebaseUid: uid,
            UserRole: {
              create: {
                roleId: 'TENANT_USER'
              }
            }
          },
          include: {
            UserRole: { include: { role: true } },
            UserTenant: { include: { tenant: true } }
          }
        })
      }
    })

    console.log('User sync successful:', { id: user.id, email: user.email })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        roles: user.UserRole.map(ur => ur.role.name),
        tenants: user.UserTenant.map(ut => ({
          id: ut.tenant.id,
          name: ut.tenant.name
        }))
      }
    })

  } catch (error) {
    console.error('Error syncing user:', error)
    
    // Provide more specific error information in development
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: error && typeof error === 'object' && 'code' in error ? error.code : undefined
      },
      { status: 500 }
    )
  }
}