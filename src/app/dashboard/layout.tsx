import DashboardShell from "@/components/DashboardShell" // Kita pakai lagi Shell ini
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

  // KUNCI PERBAIKAN:
  // Kita tidak lagi memecah role/name secara manual.
  // Kita ambil seluruh object user dari session.
  const userData = session.user 

  return (
    // Kita panggil DashboardShell (agar responsive),
    // TAPI kita kirim props 'user' (bukan userRole/userName lagi)
    <DashboardShell user={userData}>
      {children}
    </DashboardShell>
  )
}