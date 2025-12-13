'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function LightboxClient({ items }: { items: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      {/* Grid Foto */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="break-inside-avoid rounded-lg overflow-hidden cursor-zoom-in group relative"
            onClick={() => setSelectedImage(item.url)}
          >
            <img src={item.url} alt="Gallery" className="w-full h-auto object-cover group-hover:opacity-90 transition" />
          </div>
        ))}
      </div>

      {/* MODAL LIGHTBOX */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)} // Klik luar untuk tutup
        >
          <button className="absolute top-5 right-5 text-white p-2 bg-white/10 rounded-full hover:bg-white/20">
             <X size={32} />
          </button>
          
          <img 
             src={selectedImage} 
             className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
             onClick={(e) => e.stopPropagation()} // Klik gambar jangan tutup
          />
        </div>
      )}
    </>
  )
}