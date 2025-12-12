// src/components/Sidebar.tsx
"use client"

import React, { Dispatch, SetStateAction, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  User,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  UserCog,
  CalendarClock,
  Building2,
  LogOut,
  Trophy,
  Image as ImageIcon,
  UserCheck
} from "lucide-react"

/**
 * NOTE:
 * lucide-react icon components accept props like:
 *  React.SVGProps<SVGSVGElement> & { size?: string | number; strokeWidth?: number }
 * So we type the icon accordingly to avoid TS incompatibility.
 */

type IconComponentProps = React.ComponentType<
  React.SVGProps<SVGSVGElement> & { size?: string | number; className?: string }
>

type SidebarItem = {
  label: string
  href: string
  icon: IconComponentProps
}

type SidebarGroup = {
  title: string
  items: SidebarItem[]
}

const MENU_GROUPS: SidebarGroup[] = [
  {
    title: "Menu Utama",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]
  },
  {
    title: "Kesantrian",
    items: [
      { label: "Data Santri", href: "/dashboard/students", icon: Users },
      { label: "Mutakhorijin", href: "/dashboard/mutakhorijin", icon: GraduationCap }
    ]
  },
  {
    title: "Keasramaan",
    items: [
      { label: "Struktur Pengurus", href: "/dashboard/struktur", icon: Users },
      { label: "Karya Tulis", href: "/dashboard/karya", icon: BookOpen },
      { label: "Organisasi", href: "/dashboard/organization", icon: Building2 },
      { label: "Jadwal Kegiatan", href: "/dashboard/schedules", icon: CalendarClock },
      { label: "Pimpinan / Leaders", href: "/dashboard/leaders", icon: UserCheck }
    ]
  },
  {
    title: "Konten",
    items: [
      { label: "Prestasi / Achievements", href: "/dashboard/achievements", icon: Trophy },
      { label: "Alumni", href: "/dashboard/alumni", icon: GraduationCap },
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

export type SidebarProps = {
  userRole?: string | null
  isOpen?: boolean
  setIsOpen?: Dispatch<SetStateAction<boolean>>
}

export default function Sidebar({ userRole, isOpen = false, setIsOpen }: SidebarProps) {
  const pathname = usePathname()
  const [loadingSignOut, setLoadingSignOut] = useState(false)

  async function handleSignOut() {
    try {
      setLoadingSignOut(true)
      await signOut({ callbackUrl: "/login" })
    } catch (err) {
      console.error("Sign out failed:", err)
      setLoadingSignOut(false)
    }
  }

  const closeDrawer = () => {
    if (setIsOpen) setIsOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeDrawer}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <aside
  className={`fixed top-0 left-0 z-40 h-full w-64 transform bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform
    md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    flex flex-col   /* <-- tambah ini */
  `}>
        {/* HEADER LOGO */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            AT
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">Takhossus</h1>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </div>

        {/* MENU LIST */}
        <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
          {MENU_GROUPS.map((group, idx) => {
            if (group.title === "Sistem" && userRole !== "Super Admin") return null

            return (
              <div key={idx}>
                <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
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
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                          ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "hover:bg-slate-800 hover:text-white"}`}
                        onClick={closeDrawer}
                      >
                        <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleSignOut}
            disabled={loadingSignOut}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Sign out"
          >
            <LogOut size={18} />
            {loadingSignOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  )
}
