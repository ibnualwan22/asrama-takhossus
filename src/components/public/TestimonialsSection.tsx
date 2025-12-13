'use client'

import { Quote } from 'lucide-react'

type TestimonialProps = {
  testimonials: {
    id: string
    name: string
    role: string
    image: string
  }[]
}

export default function TestimonialsSection({ testimonials }: TestimonialProps) {
  if (testimonials.length === 0) return null

  return (
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
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="snap-center shrink-0 w-[300px] md:w-[350px] bg-slate-50 rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Image Container (Screenshot WA style) */}
              <div className="aspect-[9/16] w-full overflow-hidden rounded-xl mb-4 bg-gray-200 relative border border-gray-200">
                 <img 
                   src={item.image} 
                   alt={item.name} 
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute top-2 right-2 bg-white/80 backdrop-blur rounded-full p-1.5 text-green-600">
                    <Quote size={14} fill="currentColor" />
                 </div>
              </div>
              
              <div className="text-center">
                 <h4 className="font-bold text-gray-900">{item.name}</h4>
                 <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-4">
           Geser untuk melihat testimoni lainnya &rarr;
        </p>

      </div>
    </section>
  )
}