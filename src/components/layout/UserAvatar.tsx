'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import {
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  User
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface UserAvatarProps {
  className?: string
}

export function UserAvatar({ className = "" }: UserAvatarProps) {
  const { user, userData, signOut } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName = user.displayName || userData?.name || 'User'
  const displayEmail = user.email || 'No email'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors duration-200 ${className}`}
        >
          <Avatar className="h-10 w-10 border-2 border-gray-200 hover:border-blue-300 transition-colors duration-200">
            <AvatarImage 
              src={user.photoURL || undefined} 
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          
          {/* Online Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-0 shadow-2xl border border-gray-200" 
        align="end" 
        sideOffset={10}
      >
        {/* User Info Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarImage 
                src={user.photoURL || undefined} 
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DropdownMenuLabel className="p-0 font-semibold text-gray-900 truncate">
                {displayName}
              </DropdownMenuLabel>
              <p className="text-sm text-gray-600 truncate">{displayEmail}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-2">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">View Profile</div>
                <div className="text-sm text-gray-500">Manage your account</div>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                <Settings className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Settings</div>
                <div className="text-sm text-gray-500">Preferences & privacy</div>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/notifications" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
                <Bell className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Notifications</div>
                <div className="text-sm text-gray-500">Manage alerts</div>
              </div>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-2" />

        {/* Additional Options */}
        <div className="p-2">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/billing" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <CreditCard className="h-4 w-4 text-gray-600" />
              <span className="text-gray-900">Billing & Plans</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="text-gray-900">Admin Panel</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/help" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <HelpCircle className="h-4 w-4 text-gray-600" />
              <span className="text-gray-900">Help & Support</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-2" />

        {/* Sign Out */}
        <div className="p-2">
          <DropdownMenuItem 
            className="cursor-pointer focus:bg-red-50 focus:text-red-600"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg w-full">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                <LogOut className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-red-600">
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </div>
                <div className="text-sm text-red-500">End your session</div>
              </div>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}