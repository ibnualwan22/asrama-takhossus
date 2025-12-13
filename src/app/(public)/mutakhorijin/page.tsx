import { PrismaClient } from "@prisma/client"
import { GraduationCap, MapPin, Quote } from "lucide-react"

const prisma = new PrismaClient()
export const revalidate = 60

export const metadata = { title: "Data Mutakhorijin" }

export default async function MutakhorijinPage() {
  const students = await prisma.student.findMany({
    where: { status: 'MUTAKHORIJIN' },
    orderBy: { name: 'asc' }
  })

  // Grouping Data
  const groupedData: Record<number, typeof students> = {}
  students.forEach(student => {
    const batch = student.mutakhorijinBatch || 0
    if (!groupedData[batch]) groupedData[batch] = []
    groupedData[batch].push(student)
  })

  // SORTING: Angkatan 1 paling atas (Ascending a - b)
  const sortedBatches = Object.keys(groupedData).map(Number).sort((a, b) => a - b)

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-20">
           <div className="inline-block p-4 rounded-full bg-purple-100 text-purple-600 mb-6">
              <GraduationCap size={48} />
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Mutakhorijin</h1>
           <p className="text-xl text-gray-500 max-w-2xl mx-auto">
             Jejak langkah para lulusan yang telah menyelesaikan masa studi dan pengabdian.
           </p>
        </div>

        <div className="space-y-20">
          {sortedBatches.map((batch) => (
            <div key={batch} className="relative">
               
               {/* Divider Angkatan */}
               <div className="flex items-center gap-6 mb-10">
                  <div className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-xl shadow-lg">
                     {batch === 0 ? 'Lainnya' : `Angkatan Ke-${batch}`}
                  </div>
                  <div className="h-px bg-slate-300 flex-1"></div>
               </div>

               {/* GRID BESAR (2 Kolom) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {groupedData[batch].map((student) => (
                    <div key={student.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start group">
                       
                       {/* Foto Besar */}
                       <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden bg-gray-200 border-4 border-white shadow-md group-hover:scale-105 transition-transform">
                          {student.photo ? (
                            <img src={student.photo} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 text-xs">No Photo</div>
                          )}
                       </div>

                       {/* Info Detail */}
                       <div className="flex-1 text-center sm:text-left space-y-3">
                          <div>
                             <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition">
                               {student.name}
                             </h3>
                             <p className="text-purple-600 font-mono text-sm font-medium mt-1">
                                NIS: {student.nis}
                             </p>
                          </div>
                          
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500">
                             <MapPin size={16} className="shrink-0" />
                             <span className="text-sm line-clamp-1">{student.address || 'Alamat tidak tersedia'}</span>
                          </div>

                          {/* Placeholder Bio/Quote jika nanti ada */}
                          <div className="pt-4 mt-2 border-t border-gray-100">
                             <div className="flex gap-2 text-gray-400 italic text-sm">
                                <Quote size={14} className="rotate-180 shrink-0" />
                                <p className="line-clamp-2">Santri yang berkhidmah dengan hati, insyaAllah akan mendapatkan keberkahan ilmu.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

            </div>
          ))}

          {students.length === 0 && (
             <div className="text-center py-20 text-gray-400">
                Belum ada data mutakhorijin.
             </div>
          )}
        </div>

      </div>
    </div>
  )
}