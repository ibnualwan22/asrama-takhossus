'use client'

import { Phone, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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
    <section className="py-20 bg-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-secondary-600 font-bold tracking-widest uppercase text-xs mb-2 block">Kepengurusan</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-950 mb-4">
              Pengurus Asrama
            </h2>
            <p className="text-gray-500">
              Dikelola oleh asatidz dan pengurus yang berdedikasi.
            </p>
          </div>
          
          <Link href="/pengurus" className="hidden md:flex items-center gap-2 text-primary-700 font-bold hover:text-secondary-600 transition">
             Lihat Struktur Lengkap <ArrowRight size={18} />
          </Link>
        </div>

        {/* SLIDER (Scroll Snap) */}
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {staffList.map((staff) => (
            <div key={staff.id} className="snap-center shrink-0 w-[280px] md:w-[300px] bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              
              {/* Foto */}
              <div className="h-72 overflow-hidden bg-gray-100 relative">
                {staff.photo ? (
                  <img 
                    src={staff.photo} 
                    alt={staff.name || 'Pengurus'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={64} /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="font-bold text-lg leading-tight">{staff.name}</h3>
                  <p className="text-xs text-secondary-400 font-bold uppercase tracking-wider mt-1">{staff.position}</p>
                </div>
              </div>

              {/* Tombol WA */}
              <div className="p-4 border-t border-gray-100">
                  {staff.whatsapp ? (
                    <a href={`https://wa.me/${staff.whatsapp}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-600 hover:text-white transition-colors text-sm font-bold">
                      <Phone size={16} /> Hubungi
                    </a>
                  ) : (
                    <button disabled className="flex items-center justify-center gap-2 w-full py-2 bg-gray-50 text-gray-400 rounded-lg text-sm font-bold cursor-not-allowed">
                       <Phone size={16} /> Tidak Tersedia
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 md:hidden text-center">
            <Link href="/pengurus" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-100 text-primary-800 rounded-full font-bold text-sm">
              Lihat Struktur Lengkap <ArrowRight size={16} />
            </Link>
        </div>

      </div>
    </section>
  )
}