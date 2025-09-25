'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthContext"
import { Bell, Menu } from "lucide-react"
import Link from "next/link"
import { UserAvatar } from "./UserAvatar"

const publicNavLinks = [
  { label: "Features", href: "#features" },
  { label: "Products", href: "#products" },
  { label: "Resources", href: "#resources" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact Us", href: "#contact" },
]

const authenticatedNavLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Fleet", href: "/fleet" },
  { label: "Routes", href: "/routes" },
  { label: "Reports", href: "/reports" },
]

export function AppHeader() {
  const { user, loading } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
          <Link href="/" className="font-bold text-xl text-blue-700 tracking-tight">
            Jemputanku
          </Link>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  const navLinks = user ? authenticatedNavLinks : publicNavLinks

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0">
        {/* Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-2a2 2 0 00-2-2H8V7z" />
            </svg>
          </div>
          <span className="font-bold text-xl text-blue-700 tracking-tight">
            Jemputanku
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-700 hover:text-blue-700 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex gap-3 items-center">
          {user ? (
            // Authenticated user actions
            <>
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 transition-colors duration-200"
                asChild
              >
                <Link href="/notifications">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {/* Notification badge */}
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Link>
              </Button>

              {/* User Avatar */}
              <UserAvatar />
            </>
          ) : (
            // Unauthenticated user actions
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <>
              {/* Mobile Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-gray-100 transition-colors duration-200"
                asChild
              >
                <Link href="/notifications">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Link>
              </Button>

              {/* Mobile User Avatar */}
              <UserAvatar />
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-4 border-b bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-2a2 2 0 00-2-2H8V7z" />
                      </svg>
                    </div>
                    <span className="font-bold text-xl text-blue-700">Jemputanku</span>
                  </div>
                  {user && (
                    <div className="mt-3 text-sm text-gray-600">
                      Welcome back, {user.displayName?.split(' ')[0] || 'User'}!
                    </div>
                  )}
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-1 p-4 flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Footer Actions */}
                {!user && (
                  <div className="mt-auto p-4 flex flex-col gap-3 border-t">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full" asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}