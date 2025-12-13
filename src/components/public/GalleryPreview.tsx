'use client'

import Link from 'next/link'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'

export default function GalleryPreview({ galleries }: { galleries: any[] }) {
  if (galleries.length === 0) return null

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Galeri Kegiatan</h2>
          <p className="text-gray-500 mt-2">Dokumentasi momen berharga santri Takhossus.</p>
        </div>

        {/* Grid Album */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
           {galleries.map((album) => (
             <Link key={album.id} href={`/galeri/${album.id}`} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-200 block shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                {/* Cover Image (Item pertama) */}
                {album.items[0] ? (
                  <img src={album.items[0].url} alt={album.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon size={32} />
                  </div>
                )}

                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity flex flex-col justify-end p-4">
                   <h3 className="text-white font-bold text-lg leading-tight mb-1">{album.title}</h3>
                   <p className="text-gray-300 text-xs">{album._count.items} Foto</p>
                </div>
             </Link>
           ))}
        </div>

        {/* Button View All */}
        <div className="text-center">
           <Link href="/galeri" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-slate-900 text-slate-900 font-bold hover:bg-slate-900 hover:text-white transition-colors">
              Lihat Semua Album <ArrowRight size={18} />
           </Link>
        </div>

      </div>
    </section>
  )
}