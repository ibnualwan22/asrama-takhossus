// src/app/dashboard/leaders/page.tsx
import { PrismaClient } from "@prisma/client"
import AddLeaderForm from "./_components/AddLeaderForm" // Buat komponen ini nanti
import { Trash2 } from "lucide-react"
import { deleteLeader } from "@/app/actions/settings"

const prisma = new PrismaClient()

export default async function LeadersPage() {
  const leaders = await prisma.leader.findMany({ orderBy: { periodStart: 'desc' } })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold">Kepala Asrama & Pimpinan</h1>
        <AddLeaderForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaders.map((leader) => (
          <div key={leader.id} className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-3 overflow-hidden">
              {leader.photo ? <img src={leader.photo} className="w-full h-full object-cover"/> : null}
            </div>
            <h3 className="font-bold text-lg">{leader.name}</h3>
            <p className="text-sm text-blue-600 font-bold">
              {leader.periodStart} - {leader.periodEnd || 'Sekarang'}
            </p>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{leader.bio}</p>
            
            <form action={deleteLeader.bind(null, leader.id)} className="mt-4">
              <button className="text-red-500 text-xs font-bold flex items-center justify-center gap-1 mx-auto hover:underline">
                <Trash2 size={12} /> Hapus
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}