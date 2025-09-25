'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { AppHeader } from './AppHeader'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Pages that should show the authenticated header
  const authenticatedPages = [
    '/admin-dashboard',
    '/profile',
    '/settings',
    '/notifications',
    '/billing',
    '/help'
  ]

  // Pages that should not show any header (landing page, auth pages)
  const noHeaderPages = [
    '/',
    '/login',
    '/signup'
  ]

  // Determine if current page should show header
  const shouldShowHeader = !loading && user && authenticatedPages.some(page => 
    pathname.startsWith(page)
  )

  const shouldShowNoHeader = noHeaderPages.includes(pathname)

  return (
    <>
      {shouldShowHeader && <AppHeader />}
      {shouldShowNoHeader ? (
        children
      ) : (
        <main className={shouldShowHeader ? 'pt-16' : ''}>
          {children}
        </main>
      )}
    </>
  )
}