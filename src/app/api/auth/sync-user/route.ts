import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { uid, email, name, image, emailVerified } = await request.json()

    if (!uid || !email) {
      return NextResponse.json(
        { error: 'UID and email are required' },
        { status: 400 }
      )
    }

    // Verify the Firebase user exists
    try {
      await adminAuth.getUser(uid)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid Firebase user' },
        { status: 401 }
      )
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        UserRole: { include: { role: true } },
        UserTenant: { include: { tenant: true } }
      }
    })

    if (!user) {
      // First ensure the default role exists
      await prisma.role.upsert({
        where: { id: 'TENANT_USER' },
        update: {},
        create: {
          id: 'TENANT_USER',
          name: 'Tenant User',
          description: 'Default role for tenant users',
          createdBy: 'system'
        }
      })

      // Create new user with default role
      user = await prisma.user.create({
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
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { email },
        data: {
          name,
          image,
          emailVerified: emailVerified ? new Date() : user.emailVerified,
          firebaseUid: uid,
        },
        include: {
          UserRole: { include: { role: true } },
          UserTenant: { include: { tenant: true } }
        }
      })
    }

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}