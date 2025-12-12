// src/app/dashboard/leaders/page.tsx
import { PrismaClient } from "@prisma/client"
import { Trash2, Crown } from "lucide-react"
import { deleteLeader } from "@/app/actions/settings"
// Import Component
import AddLeaderForm from "./_components/AddLeaderForm"
import EditLeaderModal from "./_components/EditLeaderModal"
import LeaderDetailModal from "./_components/LeaderDetailModal"

const prisma = new PrismaClient()

export default async function LeadersPage() {
  // Urutkan dari yang TERLAMA (Ascending) agar nomor urutnya benar (1, 2, 3...)
  const leaders = await prisma.leader.findMany({ orderBy: { periodStart: 'asc' } })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
             <Crown size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Kepala Asrama</h1>
            <p className="text-gray-500 text-sm font-medium">Sejarah pimpinan dari masa ke masa</p>
          </div>
        </div>
        <AddLeaderForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaders.map((leader, index) => {
          const urutan = index + 1 // Kepala Ke-Berapa
          return (
            <div key={leader.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col items-center p-6 text-center group">
              
              {/* Badge Urutan */}
              <div className="mb-4">
                <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  Kepala Daerah Ke-{urutan}
                </span>
              </div>

              {/* Foto Profil Bulat */}
              <div className="w-32 h-32 rounded-full p-1 border-2 border-gray-100 shadow-sm mb-4 relative overflow-hidden group-hover:border-blue-200 transition-colors">
                {leader.photo ? (
                  <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Crown size={32} className="opacity-20"/>
                  </div>
                )}
              </div>

              {/* Info */}
              <h3 className="text-lg font-bold text-gray-900">{leader.name}</h3>
              <p className="text-blue-600 font-bold text-sm mb-2">
                {leader.periodStart} - {leader.periodEnd || 'Sekarang'}
              </p>
              <p className="text-gray-500 text-xs line-clamp-2 mb-6 h-8">
                {leader.bio || 'Tidak ada deskripsi singkat.'}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t border-gray-100 pt-4 w-full justify-center">
                <LeaderDetailModal leader={leader} urutan={urutan} />
                <EditLeaderModal leader={leader} />
                
                {/* Delete Button (Client Component Inline) */}
                <form action={async () => {
                  'use server'
                  await deleteLeader(leader.id)
                }}>
                  <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Hapus">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}