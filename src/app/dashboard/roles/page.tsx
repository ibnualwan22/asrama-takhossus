import { PrismaClient } from "@prisma/client"
import { CheckCircle2, XCircle } from "lucide-react"

const prisma = new PrismaClient()

export default async function RolePage() {
  const roles = await prisma.role.findMany({
    include: { permissions: true }
  })
  
  // List permission ini idealnya dinamis, tapi untuk tampilan kita list dulu
  const allPermissions = await prisma.permission.findMany()

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold">Manajemen Role & Hak Akses</h1>
        <p className="text-gray-500">Super Admin memiliki akses penuh secara default.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold">{role.name}</h3>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-bold">
                {role.permissions.length} Izin
              </span>
            </div>
            
            <div className="space-y-2 h-48 overflow-y-auto pr-2 border-t pt-4">
              {allPermissions.map((perm) => {
                const hasPerm = role.permissions.some(p => p.id === perm.id)
                return (
                  <div key={perm.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-gray-50">
                    <span className="text-gray-700">{perm.description || perm.action}</span>
                    {hasPerm ? (
                      <CheckCircle2 className="text-green-500 w-5 h-5" />
                    ) : (
                      <XCircle className="text-gray-300 w-5 h-5" />
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Note: Fitur Edit Checkbox Permission akan sangat kompleks jika dibuat sekarang.
                Untuk saat ini, tampilan ini berfungsi untuk AUDIT (Melihat siapa boleh apa).
            */}
            <button className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg font-bold text-sm disabled:opacity-50" disabled>
              Edit Hak Akses (Coming Soon)
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}