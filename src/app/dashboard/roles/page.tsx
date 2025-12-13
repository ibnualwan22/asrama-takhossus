import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import RoleManager from "./_components/RoleManager"

const prisma = new PrismaClient()

export const metadata = {
  title: "Manajemen Role & Akses",
}

export default async function RolesPage() {
  const session = await auth()
  const userRole = (session?.user as any)?.role

  // --- PERBAIKAN DI SINI ---
  // Kita cek .name (karena role adalah object)
  if (userRole?.name !== 'Super Admin') {
    return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center text-red-600 bg-red-50 p-8 rounded-xl border border-red-200 shadow-sm max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-2">Akses Ditolak 🚫</h1>
                <p className="text-red-500">
                    Halaman ini hanya untuk <strong>Super Admin</strong>.<br/>
                    Role Anda saat ini: <strong>{userRole?.name || 'Tidak Terdeteksi'}</strong>
                </p>
            </div>
        </div>
    )
  }

  // 2. Fetch Data (Server Side)
  const roles = await prisma.role.findMany({
    include: { permissions: true }, 
    orderBy: { name: 'asc' }
  })

  const allPermissions = await prisma.permission.findMany({
    orderBy: { action: 'asc' }
  })

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 border-b pb-4">
         <h1 className="text-2xl font-extrabold text-gray-900">Konfigurasi Hak Akses</h1>
         <p className="text-gray-500 text-sm mt-1">Kelola role dan centang izin yang boleh dilakukan.</p>
      </div>

      <RoleManager roles={roles} allPermissions={allPermissions} />
    </div>
  )
}