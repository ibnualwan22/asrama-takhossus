import { getLeaders } from "@/app/actions/public-data"
import { User, Quote } from "lucide-react"

export const metadata = {
  title: "Profil & Pimpinan - Asrama Takhossus",
}

export const revalidate = 60

export default async function ProfilPage() {
  const leaders = await getLeaders()

  return (
    <div className="bg-slate-50 min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Tentang Kami</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Asrama Takhossus adalah wadah pendidikan yang memadukan tradisi salaf dengan kompetensi modern. 
            Kami berkomitmen mencetak kader ulama yang intelek dan pemimpin yang berkarakter.
          </p>
        </div>

        {/* VISI MISI (Static) */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                 <span className="w-8 h-1 bg-blue-600 rounded-full"></span> Visi
              </h3>
              <p className="text-gray-700 italic font-serif text-lg">
                "Terwujudnya generasi santri yang beramal ilmiyyah, berilmu amaliyyah, dan berakhlakul karimah."
              </p>
           </div>
           <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                 <span className="w-8 h-1 bg-green-600 rounded-full"></span> Misi
              </h3>
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                 <li>Menyelenggarakan pendidikan kitab kuning yang mendalam.</li>
                 <li>Mengembangkan potensi kepemimpinan dan organisasi.</li>
                 <li>Membekali santri dengan kemampuan bahasa dan teknologi.</li>
              </ul>
           </div>
        </div>

        {/* SECTION PIMPINAN / KEPALA DAERAH */}
        <div className="mb-12">
           <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Pimpinan & Kepala Daerah</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader) => (
                <div key={leader.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300 group">
                   {/* Foto */}
                   <div className="h-80 bg-gray-200 relative overflow-hidden">
                      {leader.photo ? (
                        <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                           <User size={64} />
                        </div>
                      )}
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                         <h3 className="text-xl font-bold">{leader.name}</h3>
                         <p className="text-sm text-blue-300 font-medium">
                            Periode {leader.periodStart} {leader.periodEnd ? `- ${leader.periodEnd}` : '(Sekarang)'}
                         </p>
                      </div>
                   </div>
                   
                   {/* Bio / Quote */}
                   <div className="p-6 relative">
                      <Quote className="absolute top-4 right-4 text-gray-100 rotate-180" size={40} />
                      <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                        {leader.bio || "Tidak ada biografi."}
                      </p>
                   </div>
                </div>
              ))}
              
              {leaders.length === 0 && (
                 <div className="col-span-full text-center py-10 text-gray-400">
                    Belum ada data pimpinan yang ditambahkan.
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  )
}