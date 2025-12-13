'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ArticleSlider({ posts }: { posts: any[] }) {
  const [current, setCurrent] = useState(0)

  // Auto Slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posts.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [posts.length])

  const next = () => setCurrent((prev) => (prev + 1) % posts.length)
  const prev = () => setCurrent((prev) => (prev - 1 + posts.length) % posts.length)

  if (posts.length === 0) return null

  const post = posts[current]

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-3">
           <div>
              <span className="text-blue-600 font-bold tracking-widest text-xs uppercase bg-blue-50 px-3 py-1 rounded-full">Kabar Pesantren</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">Berita Terbaru</h2>
           </div>
           <Link href="/artikel" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition">
              Lihat Semua Berita <ArrowRight size={16} />
           </Link>
        </div>

        {/* SLIDER CARD */}
        <div className="relative group rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl bg-slate-900 aspect-[4/3] sm:aspect-[16/9] md:aspect-[2.5/1]">
           
           {/* Background Image */}
           <div 
             className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform group-hover:scale-105"
             style={{ backgroundImage: `url(${post.thumbnail || '/placeholder-news.jpg'})` }}
           >
             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
           </div>

           {/* Content */}
           <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-12 w-full">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-2 text-blue-300 text-xs sm:text-sm mb-2 md:mb-3">
                 <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                 <span className="text-xs sm:text-sm">{new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                 <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                 <span className="uppercase text-xs font-bold tracking-wider">{post.type}</span>
              </div>
              
              {/* Title */}
              <Link href={`/artikel/${post.slug}`}>
                 <h3 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight hover:text-blue-400 transition-colors cursor-pointer mb-2 md:mb-4 line-clamp-2 md:line-clamp-3">
                    {post.title}
                 </h3>
              </Link>
              
              {/* Excerpt - Hidden on small mobile */}
              <p className="text-gray-300 text-xs sm:text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-3 md:mb-6 hidden sm:block">
                 {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
              </p>

              {/* CTA Button */}
              <Link href={`/artikel/${post.slug}`} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full text-xs sm:text-sm md:text-base font-bold transition shadow-lg">
                 Baca Selengkapnya
                 <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </Link>
           </div>

           {/* Controls - Larger touch target for mobile */}
           <button 
             onClick={prev} 
             className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white backdrop-blur-md transition-all"
             aria-label="Previous slide"
           >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
           </button>
           <button 
             onClick={next} 
             className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white backdrop-blur-md transition-all"
             aria-label="Next slide"
           >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
           </button>

           {/* Dots Indicator - Adjusted for mobile */}
           <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 flex gap-1.5 sm:gap-2">
              {posts.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all ${
                    current === idx 
                      ? 'w-6 sm:w-8 bg-blue-500' 
                      : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white active:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
           </div>

        </div>

        {/* Mobile View All Button */}
        <div className="mt-4 md:mt-6 md:hidden text-center">
            <Link href="/artikel" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 active:text-blue-800">
              Lihat Semua Berita <ArrowRight size={16} />
            </Link>
        </div>

      </div>
    </section>
  )
}