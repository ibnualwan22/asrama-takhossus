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
    <div className="min-h-screen bg-gray-50 flex">
      {/* 1. Sidebar Component (Controlled Component) */}
      <Sidebar 
        userRole={userRole} 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      {/* 2. Main Content Wrapper */}
      {/* Gunakan logic CSS: Jika desktop (md), margin kiri 64 (256px). Jika mobile, margin 0 */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-64">
        
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 shadow-sm md:px-8 glass-effect">
          <div className="flex items-center gap-4">
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
          {/* ... User Profile section (Sama seperti kode Anda) ... */}
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}