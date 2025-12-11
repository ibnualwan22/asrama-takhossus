// src/app/dashboard/layout.tsx
import { auth } from "@/auth"
import DashboardShell from "@/components/DashboardShell"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) redirect('/login')

  return (
    <DashboardShell 
      userRole={(session.user as any).role} 
      userName={session.user?.name || 'User'}
    >
      {children}
    </DashboardShell>
  )
}