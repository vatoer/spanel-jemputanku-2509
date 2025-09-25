"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  isMobile: boolean;
}

export function AuthLayout({ children, title, subtitle, isMobile }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex min-h-screen">
        {/* Left Side - Branding (Desktop Only) */}
        {!isMobile && (
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-blue-800/10">
              <div className="absolute inset-0 opacity-10">
                {/* Simple pattern overlay */}
                <div className="w-full h-full bg-white/5"></div>
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col justify-center px-12 text-white">
              {/* Logo & Brand */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🚌</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Jemputanku</h1>
                    <p className="text-blue-200 text-sm">Smart Transportation</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Real-time Fleet Tracking</h3>
                    <p className="text-blue-200 text-sm">Monitor all your vehicles live with precise location tracking</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">🗺️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Smart Route Planning</h3>
                    <p className="text-blue-200 text-sm">Optimize routes and reduce travel time with intelligent planning</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">👥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Passenger Management</h3>
                    <p className="text-blue-200 text-sm">Manage passengers, bookings, and transportation efficiently</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Side - Form */}
        <div className={`flex flex-col justify-center ${isMobile ? 'w-full px-6' : 'lg:w-1/2 px-12'} py-8`}>
          <div className={`w-full max-w-md ${isMobile ? 'mx-auto' : 'mx-auto lg:mx-0'}`}>
            {/* Mobile Header */}
            {isMobile && (
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🚌</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Jemputanku</h1>
                <p className="text-gray-600 text-sm">Smart Transportation Management</p>
              </div>
            )}

            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
            </div>

            {/* Form Content */}
            {children}

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Mobile Footer */}
            {isMobile && (
              <div className="mt-8 text-center text-xs text-gray-500">
                <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}