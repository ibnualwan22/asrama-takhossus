// src/components/DashboardShell.tsx
'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu } from 'lucide-react'

interface DashboardShellProps {
  children: React.ReactNode
  userRole: string
  userName: string
}

export default function DashboardShell({ children, userRole, userName }: DashboardShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        userRole={userRole} 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* Main Content Wrapper */}
      {/* ml-0 di mobile, ml-64 di desktop */}
      <div className="flex flex-col min-h-screen transition-all duration-300 md:ml-64">
        
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 shadow-sm md:px-8 glass-effect">
          <div className="flex items-center gap-4">
            {/* Tombol Hamburger (Mobile Only) */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-extrabold text-gray-800 md:text-xl">
              Panel Admin
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-sm font-extrabold text-gray-900">{userName}</p>
              <p className="text-xs font-semibold text-gray-500">{userRole}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-md">
              {userName?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}