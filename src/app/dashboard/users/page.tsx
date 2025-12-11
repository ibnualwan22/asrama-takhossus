// src/app/dashboard/users/page.tsx
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AddUserForm from "./_components/AddUserForm" // Kita akan buat komponen ini
import { Trash2 } from "lucide-react"
import { deleteUser } from "@/app/actions/user"

const prisma = new PrismaClient()

export default async function UsersPage() {
  const session = await auth()
  
  // Proteksi: Hanya Super Admin yang boleh akses
  if ((session?.user as any).role !== 'Super Admin') {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg font-bold">
        ⛔ Akses Ditolak. Halaman ini khusus Super Admin.
      </div>
    )
  }

  // Ambil Data User & Role
  const users = await prisma.user.findMany({
    include: { role: true },
    orderBy: { createdAt: 'desc' }
  })

  const roles = await prisma.role.findMany()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manajemen User</h1>
          <p className="text-gray-500 text-sm font-medium">Kelola akun admin dan hak akses mereka.</p>
        </div>
        
        {/* Tombol Trigger Modal/Form ada di dalam komponen ini */}
        <AddUserForm roles={roles} />
      </div>

      {/* Tabel Users Responsive */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-extrabold text-gray-700">Nama</th>
                <th className="px-6 py-4 font-extrabold text-gray-700">Username</th>
                <th className="px-6 py-4 font-extrabold text-gray-700">Role</th>
                <th className="px-6 py-4 font-extrabold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{user.username}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      {user.role.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <form action={deleteUser.bind(null, user.id)}>
                      <button className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition-colors">
                        <Trash2 size={16} /> Hapus
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}