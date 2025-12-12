import DashboardShell from "@/components/DashboardShell" 
import { auth } from "@/auth" 
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Proteksi sederhana jika belum login
  if (!session) {
    redirect("/login")
  }

  const userRole = (session?.user as any)?.role || "User"
  const userName = session?.user?.name || "Admin"

  // Kita bungkus children dengan DashboardShell
  // Shell ini yang akan mengatur Sidebar & Header
  return (
    <DashboardShell userRole={userRole} userName={userName}>
      {children}
    </DashboardShell>
  )
}