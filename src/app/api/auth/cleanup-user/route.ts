import { adminAuth } from '@/lib/firebase-admin'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Starting cleanup for user:', email)

    // Find user in database first to get Firebase UID
    const dbUser = await prisma.user.findUnique({
      where: { email },
      select: { 
        id: true, 
        email: true, 
        firebaseUid: true,
        UserRole: true,
        UserTenant: true
      }
    })

    let firebaseDeleted = false
    let databaseDeleted = false

    // Delete from Firebase if UID exists
    if (dbUser?.firebaseUid) {
      try {
        await adminAuth.deleteUser(dbUser.firebaseUid)
        firebaseDeleted = true
        console.log('Deleted from Firebase:', dbUser.firebaseUid)
      } catch (firebaseError) {
        console.log('Firebase user not found or already deleted')
      }
    }

    // Delete from database using transaction
    if (dbUser) {
      await prisma.$transaction(async (tx) => {
        // Delete user roles first
        await tx.userRole.deleteMany({
          where: { userId: dbUser.id }
        })

        // Delete user tenants
        await tx.userTenant.deleteMany({
          where: { userId: dbUser.id }
        })

        // Delete the user
        await tx.user.delete({
          where: { id: dbUser.id }
        })
      })
      databaseDeleted = true
      console.log('Deleted from database:', dbUser.id)
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup completed for ${email}`,
      details: {
        firebaseDeleted,
        databaseDeleted,
        firebaseUid: dbUser?.firebaseUid || 'not found',
        databaseId: dbUser?.id || 'not found'
      }
    })

  } catch (error) {
    console.error('Error during cleanup:', error)
    return NextResponse.json(
      { 
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}