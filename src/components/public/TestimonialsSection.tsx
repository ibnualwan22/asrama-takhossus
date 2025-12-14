'use client'

import { Quote } from 'lucide-react'
import React from 'react'

type TestimonialProps = {
  testimonials: {
    id: string
    name: string
    role: string
    image: string
  }[]
}

export default function TestimonialsSection({ testimonials }: TestimonialProps) {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)

  if (testimonials.length === 0) return null

  return (
    <>
      {/* Modal untuk full image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-sm"
              onClick={() => setSelectedImage(null)}
            >
              ✕ Tutup
            </button>
            <img 
              src={selectedImage} 
              alt="Testimoni" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Kata Mereka
            </h2>
            <p className="text-gray-500">
              Apa kata wali santri dan alumni tentang Asrama Takhossus.
            </p>
          </div>

          {/* Horizontal Scroll Container (Pengganti Carousel Kompleks) */}
          <div className="flex overflow-x-auto pb-8 gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {testimonials.map((item) => (
              <div 
                key={item.id} 
                className="snap-center shrink-0 w-[280px] sm:w-[300px] md:w-[350px] bg-slate-50 rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                {/* Image Container (Screenshot WA style) */}
                <div 
                  className="aspect-[9/16] w-full overflow-hidden rounded-xl mb-4 bg-gray-200 relative border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(item.image)}
                >
                   <img 
                     src={item.image} 
                     alt={item.name} 
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute top-2 right-2 bg-white/80 backdrop-blur rounded-full p-1.5 text-green-600">
                      <Quote size={14} fill="currentColor" />
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors">
                     <span className="text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
                       Klik untuk perbesar
                     </span>
                   </div>
                </div>
                
                <div className="text-center">
                   <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.name}</h4>
                   <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-center text-xs md:text-sm text-gray-400 mt-4">
             Geser untuk melihat testimoni lainnya &rarr;
          </p>

        </div>
      </section>
    </>
  )
}