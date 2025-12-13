'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      
      {/* 1. BACKGROUND IMAGE (Ganti '/hero-bg.jpg' dengan foto asrama yang bagus) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=2074&auto=format&fit=crop')" }} // Placeholder Asrama
      >
        {/* Overlay Gelap agar tulisan terbaca */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/90" />
      </div>

      {/* 2. KONTEN TENGAH */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white space-y-8 animate-in fade-in zoom-in duration-1000">
        
        {/* Badge / Hashtag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 font-bold text-sm tracking-widest uppercase mb-4 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          #TampilBeda
        </div>

        {/* Judul Besar */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Asrama <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Takhossus</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-slate-300 tracking-wide">
            Pasca Amtsilati — Jepara
          </p>
        </div>

        {/* Slogan (Request no. 13) */}
        <div className="max-w-2xl mx-auto border-t border-white/10 pt-8 mt-8">
            <p className="text-lg md:text-xl font-medium italic text-slate-200">
              "Beramal Ilmiyyah, Berilmu Amaliyyah"
            </p>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Mencetak generasi santri yang tidak hanya pandai membaca kitab kuning, 
              tetapi juga siap terjun ke masyarakat dengan kompetensi modern dan akhlak mulia.
            </p>
        </div>

        {/* Tombol CTA (Call to Action) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/program" 
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full font-bold text-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center gap-2"
          >
            Lihat Program <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/karya" 
            className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-full font-bold text-white transition-all hover:scale-105 flex items-center gap-2"
          >
            <BookOpen size={20} /> Karya Santri
          </Link>
        </div>

      </div>
    </section>
  )
}