import { adminAuth } from '@/lib/firebase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const { uid } = await request.json()

    if (!uid) {
      return NextResponse.json(
        { error: 'UID is required' },
        { status: 400 }
      )
    }

    // Delete user from Firebase
    await adminAuth.deleteUser(uid)

    console.log('Successfully deleted Firebase user:', uid)

    return NextResponse.json({
      success: true,
      message: `User ${uid} deleted from Firebase`
    })

  } catch (error) {
    console.error('Error deleting Firebase user:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}