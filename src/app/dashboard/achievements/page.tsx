// src/app/dashboard/achievements/page.tsx
import { PrismaClient } from "@prisma/client"
import { Trash2, Trophy } from "lucide-react"
import { deleteAchievement } from "@/app/actions/achievement"
import AddAchievementForm from "./_components/AddAchievementForm"

const prisma = new PrismaClient()

export default async function AchievementPage() {
  const achievements = await prisma.achievement.findMany({
    include: { student: true },
    orderBy: { year: 'desc' }
  })
  
  // Kita butuh list santri untuk dropdown di form
  const students = await prisma.student.findMany({ 
    where: { status: 'ACTIVE' }, 
    select: { id: true, name: true, nis: true } 
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold">Prestasi Santri</h1>
        <AddAchievementForm students={students} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl border flex gap-4">
             <div className="w-16 h-16 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600 flex-shrink-0">
               {item.photo ? <img src={item.photo} className="w-full h-full object-cover rounded-lg"/> : <Trophy size={24} />}
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-gray-900">{item.title}</h3>
               <p className="text-xs font-bold text-blue-600 uppercase">{item.level} • {item.year}</p>
               <p className="text-sm text-gray-500 mt-1">Santri: {item.student.name}</p>
             </div>
             <form action={deleteAchievement.bind(null, item.id)}>
                <button className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
             </form>
          </div>
        ))}
      </div>
    </div>
  )
}