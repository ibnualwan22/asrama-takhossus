import { auth } from "@/auth" // Mengambil session di server
import Sidebar from "@/components/Sidebar" // Pastikan path ini benar
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Ambil Session di Server
  const session = await auth()
  
  // 2. Cek Login
  if (!session) {
    redirect("/login")
  }

  // 3. Siapkan data user (Object) untuk dikirim ke Sidebar
  // Kita kirim seluruh object user agar Sidebar bisa baca .name dan .role
  const userData = session.user 

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 4. Oper data ke Sidebar lewat props 'user' */}
      <Sidebar user={userData} /> 

      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50">
             {children}
          </main>
      </div>
    </div>
  )
}