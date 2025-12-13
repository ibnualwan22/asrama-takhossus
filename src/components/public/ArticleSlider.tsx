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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
           <div>
              <span className="text-blue-600 font-bold tracking-widest text-xs uppercase bg-blue-50 px-3 py-1 rounded-full">Kabar Pesantren</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Berita Terbaru</h2>
           </div>
           <Link href="/artikel" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition">
              Lihat Semua Berita <ArrowRight size={16} />
           </Link>
        </div>

        {/* SLIDER CARD */}
        <div className="relative group rounded-2xl overflow-hidden shadow-2xl bg-slate-900 aspect-[2/1] md:aspect-[2.5/1]">
           
           {/* Background Image */}
           <div 
             className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform hover:scale-105"
             style={{ backgroundImage: `url(${post.thumbnail || '/placeholder-news.jpg'})` }}
           >
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
           </div>

           {/* Content */}
           <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-2/3">
              <div className="flex items-center gap-2 text-blue-300 text-sm mb-3">
                 <Calendar size={14} />
                 <span>{new Date(post.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                 <span className="w-1 h-1 bg-gray-500 rounded-full mx-2"></span>
                 <span className="uppercase text-xs font-bold tracking-wider">{post.type}</span>
              </div>
              
              <Link href={`/artikel/${post.slug}`}>
                 <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight hover:text-blue-400 transition-colors cursor-pointer mb-4">
                    {post.title}
                 </h3>
              </Link>
              
              <p className="text-gray-300 line-clamp-2 md:line-clamp-3 mb-6 hidden md:block">
                 {post.content.replace(/<[^>]*>?/gm, '') /* Strip HTML tags simple */}
              </p>

              <Link href={`/artikel/${post.slug}`} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition">
                 Baca Selengkapnya
              </Link>
           </div>

           {/* Controls */}
           <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
              <ChevronLeft size={24} />
           </button>
           <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
              <ChevronRight size={24} />
           </button>

           {/* Dots Indicator */}
           <div className="absolute bottom-6 right-6 flex gap-2">
              {posts.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'w-8 bg-blue-500' : 'bg-white/50 hover:bg-white'}`}
                />
              ))}
           </div>

        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 md:hidden text-center">
            <Link href="/artikel" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600">
              Lihat Semua Berita <ArrowRight size={16} />
            </Link>
        </div>

      </div>
    </section>
  )
}