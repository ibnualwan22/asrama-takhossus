'use client'

import React from "react"
import Sidebar from "@/components/Sidebar" // Pastikan path import ini benar

type DashboardShellProps = {
  children: React.ReactNode
  user: any // Menerima object user lengkap dari layout
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* KITA PERBAIKI BAGIAN INI:
        Sidebar sekarang mengurus state 'isOpen' sendiri secara internal.
        Kita cukup kirim data 'user' saja.
      */}
      <Sidebar user={user} />

      {/* Area Konten Utama */}
      {/* md:pl-64 memberikan margin kiri agar konten tidak tertutup Sidebar di layar desktop */}
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 min-h-screen">
           {children}
        </main>
      </div>
    </div>
  )
}