'use client'

import { Phone, User } from 'lucide-react'

// Definisikan tipe data sesuai database
type StaffProps = {
  staffList: {
    id: string
    name: string | null
    position: string
    photo: string | null
    whatsapp: string | null
  }[]
}

export default function PengurusSection({ staffList }: StaffProps) {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Struktur Pengurus
          </h2>
          <p className="text-gray-500">
            Dikelola oleh asatidz dan pengurus yang berdedikasi.
          </p>
        </div>

        {/* Grid Pengurus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {staffList.map((staff) => (
            <div key={staff.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100">
              
              {/* Foto Profile */}
              <div className="h-64 overflow-hidden bg-gray-200 relative">
                {staff.photo ? (
                  <img 
                    src={staff.photo} 
                    alt={staff.name || 'Pengurus'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User size={64} />
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                
                {/* Nama & Jabatan di atas foto (Style Modern) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg leading-tight">{staff.name}</h3>
                  <p className="text-xs text-blue-300 uppercase tracking-wider font-bold mt-1">
                    {staff.position}
                  </p>
                </div>
              </div>

              {/* Tombol Kontak WA */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                {staff.whatsapp ? (
                  <a 
                    href={`https://wa.me/${staff.whatsapp}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-green-200 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm font-bold shadow-sm"
                  >
                    <Phone size={16} /> Hubungi
                  </a>
                ) : (
                  <button disabled className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-bold cursor-not-allowed">
                     <Phone size={16} /> Tidak Tersedia
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}