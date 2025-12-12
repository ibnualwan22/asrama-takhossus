// src/components/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Users, GraduationCap, UserCheck, 
  Newspaper, Image as ImageIcon, LogOut, X 
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Manajemen User', href: '/dashboard/users', icon: UserCheck },
  { name: 'Data Santri', href: '/dashboard/students', icon: Users },
  { name: 'Data Alumni', href: '/dashboard/alumni', icon: GraduationCap },
  { name: 'Data Mutakhorijin ', href: '/dashboard/mutakhorijin', icon: GraduationCap },
  { name: 'Artikel & Konten', href: '/dashboard/posts', icon: Newspaper },
  { name: 'Galeri Kegiatan', href: '/dashboard/gallery', icon: ImageIcon },
  { name: 'Galeri Kegiatan', href: '/dashboard/achievements', icon: ImageIcon },
  { name: 'Galeri Kegiatan', href: '/dashboard/leaders', icon: ImageIcon },
  { name: 'Galeri Kegiatan', href: '/dashboard/organization', icon: ImageIcon },
  { name: 'Galeri Kegiatan', href: '/dashboard/roles', icon: ImageIcon },
  { name: 'Galeri Kegiatan', href: '/dashboard/schedules', icon: ImageIcon },
]

interface SidebarProps {
  userRole?: string
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

export default function Sidebar({ userRole, isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* 1. Backdrop Gelap (Hanya di Mobile) */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 2. Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out
        md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Header Sidebar */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
          <h1 className="text-xl font-extrabold tracking-wider text-yellow-500">
            TAKHOSSUS
          </h1>
          {/* Tombol Close di Mobile */}
          <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)} // Tutup sidebar saat klik menu di mobile
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg translate-x-1' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User & Logout Area */}
        <div className="border-t border-gray-800 p-4">
          <div className="mb-4 px-2">
            <p className="text-xs font-bold uppercase text-gray-500">Login sebagai</p>
            <p className="text-sm font-extrabold text-yellow-400">{userRole || 'Admin'}</p>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center justify-center rounded-lg bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 transition-colors hover:bg-red-500 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}