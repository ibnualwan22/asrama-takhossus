import { getAchievements } from "@/app/actions/public-data"
import { Trophy, Medal, Star } from "lucide-react"

export const metadata = {
  title: "Prestasi Santri",
}

export const revalidate = 60

export default async function PrestasiPage() {
  const achievements = await getAchievements()

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="text-center mb-16">
           <Trophy className="mx-auto text-amber-500 mb-4" size={48} />
           <h1 className="text-4xl font-extrabold text-gray-900">Hall of Fame</h1>
           <p className="text-gray-500 mt-2 text-lg">Jejak prestasi santri Takhossus di kancah regional dan nasional.</p>
        </div>

        <div className="grid gap-4">
           {achievements.map((item, idx) => (
             <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                
                {/* Icon / Foto */}
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100">
                   {item.photo ? (
                     <img src={item.photo} alt="Foto" className="w-full h-full object-cover rounded-full" />
                   ) : (
                     <Medal size={32} />
                   )}
                </div>

                <div className="flex-1 text-center md:text-left">
                   <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                      <h3 className="font-bold text-xl text-gray-900">{item.title}</h3>
                      <span className="px-3 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full w-fit mx-auto md:mx-0">
                        {item.level}
                      </span>
                   </div>
                   <p className="text-gray-600 font-medium">
                      {item.student?.name || "Tim Takhossus"}
                   </p>
                </div>

                <div className="text-right shrink-0">
                   <span className="block text-3xl font-extrabold text-gray-200">{item.year}</span>
                </div>
             </div>
           ))}

           {achievements.length === 0 && (
              <div className="text-center py-12 text-gray-400">Belum ada data prestasi.</div>
           )}
        </div>

      </div>
    </div>
  )
}