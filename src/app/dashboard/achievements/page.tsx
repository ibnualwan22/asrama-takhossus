// src/app/dashboard/achievements/page.tsx

import { PrismaClient } from "@prisma/client"
import { Trophy, Medal } from "lucide-react"
// Hapus import deleteAchievement dari sini karena sudah dipindah ke komponen tombol
import AddAchievementForm from "./_components/AddAchievementForm"
import EditAchievementModal from "./_components/EditAchievementModal"
import AchievementDetailModal from "./_components/AchievementDetailModal"
import DeleteAchievementButton from "./_components/DeleteAchievementButton" // <--- IMPORT INI

const prisma = new PrismaClient()

export default async function AchievementPage() {
  // ... (kode fetch data tetap sama) ...
  const achievements = await prisma.achievement.findMany({
    include: { student: true },
    orderBy: { year: 'desc' }
  })
  
  const students = await prisma.student.findMany({ 
    where: { status: 'ACTIVE' }, 
    select: { id: true, name: true, nis: true } 
  })

  return (
    <div className="space-y-6">
      {/* ... (Header tetap sama) ... */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
             <Trophy size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Prestasi</h1>
            <p className="text-gray-500 text-sm font-medium">Rekam jejak prestasi santri & asrama</p>
          </div>
        </div>
        <AddAchievementForm students={students} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col group">
            
            {/* ... (Bagian Foto & Konten tetap sama) ... */}
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              {/* ... gambar ... */}
              {item.photo ? (
                <img src={item.photo} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Medal size={48} className="opacity-20 mb-2"/>
                  <span className="text-xs font-bold">No Image</span>
                </div>
              )}
              {/* ... badge kategori ... */}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              {/* ... judul dan info ... */}
              <div className="mb-3">
                <span className="text-[10px] font-extrabold text-yellow-600 bg-yellow-50 px-2 py-1 rounded border border-yellow-200 uppercase tracking-wide">
                  {item.level} • {item.year}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-2">
                {item.studentId ? <>👤 {item.student?.name}</> : <>🏫 Asrama Takhossus</>}
              </p>
              
              {/* UPDATE BAGIAN INI: Footer Aksi */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                <div className="flex gap-3">
                  <AchievementDetailModal item={item} />
                  <EditAchievementModal item={item} students={students} />
                </div>
                
                {/* GANTI FORM MANUAL DENGAN KOMPONEN TOMBOL */}
                <DeleteAchievementButton id={item.id} />
                
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}