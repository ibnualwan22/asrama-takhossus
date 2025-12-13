import { getDailySchedules } from "@/app/actions/public-data"
import { Clock } from "lucide-react"

export const metadata = {
  title: "Jadwal Kegiatan Harian",
}

export const revalidate = 60

export default async function KegiatanPage() {
  const schedules = await getDailySchedules()

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        
        <div className="text-center mb-12">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase bg-blue-50 px-3 py-1 rounded-full">Daily Routine</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-3">Jadwal Kegiatan Harian</h1>
          <p className="text-gray-500 mt-2">Disiplin adalah kunci kesuksesan santri.</p>
        </div>

        {/* TIMELINE VISUAL */}
        <div className="relative border-l-2 border-blue-100 ml-6 md:ml-10 space-y-8 py-4">
           {schedules.map((item, idx) => (
             <div key={item.id} className="relative pl-8 md:pl-12 group">
                
                {/* Dot Connector */}
                <div className="absolute -left-[9px] top-1 w-5 h-5 bg-white border-4 border-blue-200 rounded-full group-hover:border-blue-500 transition-colors z-10"></div>
                
                {/* Time Card */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                   <div className="min-w-[120px]">
                      <span className="flex items-center gap-2 text-blue-600 font-bold font-mono text-lg">
                        <Clock size={18} />
                        {item.startTime} - {item.endTime}
                      </span>
                   </div>
                   
                   {/* Activity Card */}
                   <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                      <h3 className="font-bold text-gray-800 text-lg">{item.activity}</h3>
                   </div>
                </div>

             </div>
           ))}

           {schedules.length === 0 && (
              <div className="pl-12 text-gray-400 italic">Jadwal belum diatur.</div>
           )}
        </div>

        <div className="mt-12 p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm text-center border border-yellow-100">
           * Jadwal dapat berubah sewaktu-waktu menyesuaikan agenda asrama.
        </div>

      </div>
    </div>
  )
}