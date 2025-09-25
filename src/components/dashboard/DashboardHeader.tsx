"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export function DashboardHeader() {

    const { user, userData, loading } = useAuth()
    const router = useRouter()

  const currentTime = new Date().toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login')
      }
    }, [user, loading, router])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading profile...</p>
          </div>
        </div>
      )
    }

    
  if (!user) {
    return null // Will redirect to login
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">📊</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">{currentTime}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Pantau dan kelola operasional armada transportasi Anda secara real-time
            </p>
          </div>
          
          {/* Action Area */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <button className="px-3 py-2 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition">
                📊 Laporan Cepat
              </button>
              <button className="px-3 py-2 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-medium transition">
                ➕ Tambah Rute
              </button>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Admin</div>
                <div className="text-xs text-gray-500">Super Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
