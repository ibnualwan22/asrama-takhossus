"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  UserCog,
  CalendarClock,
  Building2,
  LogOut,
  Trophy,
  Image as ImageIcon,
  UserCheck,
  Menu,
  X
} from "lucide-react"

// --- TIPE DATA ---
type SidebarProps = {
  user?: {
    name?: string | null
    email?: string | null
    role?: any // Object role dari database
  }
}

const MENU_GROUPS = [
  {
    title: "Menu Utama",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]
  },
  {
    title: "Kesantrian",
    items: [
      { label: "Data Santri", href: "/dashboard/students", icon: Users },
      { label: "Mutakhorijin", href: "/dashboard/mutakhorijin", icon: GraduationCap },
      { label: "Alumni", href: "/dashboard/alumni", icon: GraduationCap },
    ]
  },
  {
    title: "Keasramaan",
    items: [
      { label: "Struktur Pengurus", href: "/dashboard/struktur", icon: Users },
      { label: "Karya Tulis", href: "/dashboard/karya", icon: BookOpen },
      { label: "Organisasi", href: "/dashboard/organization", icon: Building2 },
      { label: "Jadwal Kegiatan", href: "/dashboard/schedules", icon: CalendarClock },
      { label: "Pimpinan", href: "/dashboard/leaders", icon: UserCheck }
    ]
  },
  {
    title: "Konten",
    items: [
      { label: "Prestasi", href: "/dashboard/achievements", icon: Trophy },
      { label: "Gallery", href: "/dashboard/gallery", icon: ImageIcon }
    ]
  },
  {
    title: "Sistem",
    items: [
      { label: "Manajemen User", href: "/dashboard/users", icon: UserCog },
      { label: "Role & Akses", href: "/dashboard/roles", icon: ShieldCheck }
    ]
  }
]

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false) // State untuk mobile toggle
  const [loadingSignOut, setLoadingSignOut] = useState(false)

  // 1. Ambil Nama Role (Safety Check)
  const roleName = user?.role?.name || "User"
  const isSuperAdmin = roleName === "Super Admin"

  return (
    <>
      {/* MOBILE TOGGLE BUTTON (Hanya muncul di HP) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-slate-900 text-white rounded-lg shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* OVERLAY GELAP (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 text-slate-300 border-r border-slate-800 
        transition-transform duration-300 ease-in-out flex flex-col shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        {/* HEADER */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 bg-slate-900">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/50">
            AT
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none tracking-tight">Takhossus</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Admin Panel</p>
          </div>
        </div>

        {/* MENU LIST */}
        <div className="flex-1 py-6 px-3 space-y-8 overflow-y-auto custom-scrollbar">
          {MENU_GROUPS.map((group, idx) => {
            // Sembunyikan menu Sistem jika bukan Super Admin
            if (group.title === "Sistem" && !isSuperAdmin) return null

            return (
              <div key={idx}>
                <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                          ${isActive 
                            ? "bg-blue-600 text-white shadow-md shadow-blue-900/30" 
                            : "hover:bg-slate-800 hover:text-white text-slate-400"
                          }`}
                      >
                        <Icon size={18} className={isActive ? "text-white" : "text-slate-500 group-hover:text-white transition-colors"} />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* FOOTER: PROFILE INFO */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600">
                {user?.name?.charAt(0) || "U"}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user?.name || "Memuat..."}</p>
                <p className="text-xs text-slate-500 truncate">{roleName}</p>
             </div>
          </div>

          <button
            onClick={() => {
              setLoadingSignOut(true)
              signOut({ callbackUrl: "/login" })
            }}
            disabled={loadingSignOut}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-all disabled:opacity-50"
          >
            <LogOut size={16} />
            {loadingSignOut ? "Keluar..." : "Logout"}
          </button>
        </div>

      </aside>
    </>
  )
}