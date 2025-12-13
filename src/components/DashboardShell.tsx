'use client'

import React from "react"
import Sidebar from "@/components/Sidebar"

type DashboardShellProps = {
  children: React.ReactNode
  user: any
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 1. Sidebar */}
      <Sidebar user={user} />

      {/* 2. Konten Utama */}
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300 w-full relative">
        
        {/* PERBAIKAN DI SINI:
            - pt-20: Memberi jarak 80px di atas KHUSUS MOBILE agar tombol menu tidak menabrak konten.
            - md:pt-6: Di Desktop jarak atas kembali normal (24px).
        */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-4 pb-20 pt-20 md:p-6">
           {children}
        </main>

      </div>
    </div>
  )
}