'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      
      {/* BACKGROUND TETAP SAMA */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed animate-in fade-in duration-1000"
        style={{ backgroundImage: "url('https://res.cloudinary.com/devfcmzyj/image/upload/v1765636182/IMG-20240421-WA0034_znpem8.jpg')" }} 
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/80 to-primary-800/60" />
      </div>

      {/* KONTEN TENGAH - KITA NAIKKAN SEDIKIT */}
      {/* Ubah 'mt-16' jadi '-mt-10' atau 'pb-20' untuk menaikkan posisi visual */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white flex flex-col items-center justify-center gap-6 -mt-10 md:-mt-16">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-secondary-400/30 text-secondary-300 font-bold text-xs md:text-sm tracking-[0.2em] uppercase shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse shadow-[0_0_10px_#eab308]"></span>
          #TampilBeda
        </div>

        {/* Judul */}
        <div className="space-y-2 md:space-y-4 max-w-5xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] drop-shadow-2xl">
            Asrama <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500">Takhossus</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-primary-100 tracking-wider">
            Pasca Amtsilati — Jepara
          </p>
        </div>

        {/* Slogan */}
        <div className="max-w-2xl mx-auto py-6 border-t border-white/10 mt-4">
            <p className="text-lg md:text-2xl font-serif italic text-white/90">
              "Berilmu Amaliyyah, Beramal Ilmiyyah"
            </p>
        </div>

        {/* Tombol CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            href="/program" 
            className="w-full sm:w-auto px-8 py-4 bg-secondary-500 hover:bg-secondary-400 text-primary-950 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,179,8,0.3)] flex items-center justify-center gap-2"
          >
            Lihat Program <ArrowRight size={20} />
          </Link>
          
          <Link 
            href="/karya" 
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/20 border border-white/30 rounded-full font-bold text-lg text-white transition-all hover:scale-105 flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <BookOpen size={20} /> Karya Santri
          </Link>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-secondary-400 flex flex-col items-center gap-2 opacity-80">
        <span className="text-[10px] font-bold tracking-widest uppercase">Scroll Down</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-secondary-400 to-transparent"></div>
      </div>
    </section>
  )
}

// 'use client'

// export default function Hero() {
//   return (
//     <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      
//       {/* BACKGROUND */}
//       <div 
//         className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed animate-in fade-in duration-1000"
//         style={{ backgroundImage: "url('https://res.cloudinary.com/devfcmzyj/image/upload/v1765636182/IMG-20240421-WA0034_znpem8.jpg')" }} 
//       >
//         <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/80 to-primary-800/60" />
//       </div>

//       {/* CONTENT */}
//       <div className="relative z-10 container mx-auto px-4 text-center text-white flex flex-col items-center gap-6 -mt-10 md:-mt-16">
        
//         {/* BADGE */}
//         <div className="px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-secondary-400/30 text-secondary-300 font-bold text-xs tracking-[0.3em] uppercase">
//           Website Resmi Asrama Takhossus
//         </div>

//         {/* COMING SOON */}
//         <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-widest drop-shadow-2xl">
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500">
//             Coming Soon
//           </span>
//         </h1>

//         {/* SUBTEXT */}
//         <p className="text-lg md:text-2xl text-primary-100 max-w-2xl">
//           Asrama Takhossus Pasca Amtsilati Jepara  
//           <br />
//           <span className="italic text-white/80">
//             "Beramal Ilmiyyah, Berilmu Amaliyyah"
//           </span>
//         </p>

//       </div>

//       {/* SCROLL INDICATOR */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-secondary-400 opacity-70">
//         <span className="text-[10px] font-bold tracking-widest uppercase">
//           Stay Tuned
//         </span>
//       </div>
//     </section>
//   )
// }
