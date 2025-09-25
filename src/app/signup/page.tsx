import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2393c5fd' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Brand Header */}
          <div className="text-center">
            {/* Logo/Brand Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              <span className="text-blue-600">Jemputanku</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Shuttle Management System
            </p>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Create Account
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Join our shuttle management platform
              </p>
            </div>
          </div>

          {/* Signup Form */}
          <SignupForm />
          
          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2025 Jemputanku. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}