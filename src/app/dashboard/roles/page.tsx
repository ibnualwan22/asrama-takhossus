import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import RoleManager from "./_components/RoleManager"

const prisma = new PrismaClient()

export const metadata = {
  title: "Manajemen Role & Akses",
}

export default async function RolesPage() {
  const session = await auth()

  // 1. Proteksi Super Admin
  if ((session?.user as any)?.role !== 'Super Admin') {
    return (
        <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl border border-red-200 m-8">
            <h1 className="text-2xl font-bold">Akses Ditolak</h1>
            <p>Halaman ini hanya untuk Super Admin.</p>
        </div>
    )
  }

  // 2. Fetch Data (Server Side)
  // Ambil Role beserta Permissions-nya
  const roles = await prisma.role.findMany({
    include: { permissions: true }, 
    orderBy: { name: 'asc' }
  })

  // Ambil Semua Permission yang tersedia di sistem untuk dijadikan checklist
  const allPermissions = await prisma.permission.findMany({
    orderBy: { action: 'asc' }
  })

  return (
    <div className="p-6">
      <div className="mb-2">
         <h1 className="text-2xl font-extrabold text-gray-900">Konfigurasi Hak Akses</h1>
         <p className="text-gray-500 text-sm">Kelola role dan centang izin yang boleh dilakukan.</p>
      </div>

      <RoleManager roles={roles} allPermissions={allPermissions} />
    </div>
  )
}