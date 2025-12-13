import { getAllMutakhorijinPublic } from "@/app/actions/public-data" // Import fungsi baru
import { GraduationCap, MapPin, Quote } from "lucide-react"

export const revalidate = 60
export const metadata = { title: "Data Mutakhorijin" }

export default async function MutakhorijinPage() {
  // 1. Ambil data gabungan (Aktif + Alumni)
  const students = await getAllMutakhorijinPublic()

  // 2. Grouping Data by Batch
  // Record<number, typeof students>
  const groupedData: Record<number, typeof students> = {}
  
  students.forEach(student => {
    // Jika batch null, kita masukkan ke grup 0 (Lainnya)
    const batch = student.mutakhorijinBatch || 0
    
    if (!groupedData[batch]) {
        groupedData[batch] = []
    }
    groupedData[batch].push(student)
  })

  // 3. SORTING BATCH: Angkatan 1 paling atas (Ascending)
  // Kita filter agar hanya angka yang valid
  const sortedBatches = Object.keys(groupedData)
    .map(Number)
    .sort((a, b) => {
        // Logika: 0 (Lainnya) taruh paling bawah, sisanya urut kecil ke besar
        if (a === 0) return 1
        if (b === 0) return -1
        return a - b
    })

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-20">
           <div className="inline-block p-4 rounded-full bg-purple-100 text-purple-600 mb-6 shadow-sm">
              <GraduationCap size={48} />
           </div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Mutakhorijin</h1>
           <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
             Jejak langkah para lulusan Takhossus yang telah menyelesaikan masa studi dan pengabdian.
           </p>
        </div>

        <div className="space-y-20">
          {sortedBatches.map((batch) => (
            <div key={batch} className="relative">
               
               {/* Divider Angkatan */}
               <div className="flex items-center gap-6 mb-10 sticky top-20 z-10">
                  <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-lg shadow-xl border-2 border-slate-700">
                     {batch === 0 ? 'Angkatan Lainnya' : `Angkatan Ke-${batch}`}
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-slate-900/20 to-transparent flex-1 rounded-full"></div>
               </div>

               {/* GRID BESAR (2 Kolom) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {groupedData[batch].map((student) => (
                    <div key={student.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start group">
                        
                        {/* Foto Besar */}
                        <div className="relative w-32 h-32 sm:w-36 sm:h-36 shrink-0 rounded-2xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg group-hover:shadow-purple-500/20 transition-all">
                           {student.photo ? (
                             <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 text-xs font-medium">No Photo</div>
                           )}
                           
                           {/* Badge Status Kecil di Foto */}
                           <div className={`absolute bottom-0 inset-x-0 py-1 text-[10px] text-center font-bold text-white uppercase tracking-wider ${student.status === 'MUTAKHORIJIN' ? 'bg-green-500/90' : 'bg-blue-500/90'}`}>
                              {student.status === 'MUTAKHORIJIN' ? 'Aktif' : 'Alumni'}
                           </div>
                        </div>

                        {/* Info Detail */}
                        <div className="flex-1 text-center sm:text-left space-y-3 w-full">
                           <div>
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition line-clamp-2">
                                {student.name}
                              </h3>
                              
                           </div>
                           
                           <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500">
                              <MapPin size={16} className="shrink-0 text-gray-400" />
                              <span className="text-sm line-clamp-1">{student.address || 'Alamat belum diisi'}</span>
                           </div>

                           {/* Quote / Bio */}
                           <div className="pt-4 mt-2 border-t border-gray-100 relative">
                              <Quote size={20} className="absolute -top-3 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 text-gray-200 bg-white px-1" />
                              <p className="text-gray-400 italic text-sm leading-relaxed line-clamp-2">
                                 "Santri yang berkhidmah dengan hati, insyaAllah akan mendapatkan keberkahan ilmu."
                              </p>
                           </div>
                        </div>
                    </div>
                  ))}
               </div>

            </div>
          ))}

          {sortedBatches.length === 0 && (
             <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <GraduationCap size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Belum ada data</h3>
                <p className="text-gray-500 text-sm">Data mutakhorijin belum tersedia saat ini.</p>
             </div>
          )}
        </div>

      </div>
    </div>
  )
}