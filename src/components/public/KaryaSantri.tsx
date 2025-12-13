'use client'

import Link from 'next/link'
import { Book, ArrowRight } from 'lucide-react'

// Kita definisikan tipe data yang diterima dari database
type Karya = {
  id: string
  title: string
  author: string
  year: number
  description: string | null
  image: string | null
}

export default function KaryaSantri({ karyaList }: { karyaList: Karya[] }) {
  
  // Warna-warna background untuk cover buku jika tidak ada gambar
  const bgColors = [
    "bg-blue-700",
    "bg-emerald-700",
    "bg-rose-700",
    "bg-amber-700",
    "bg-purple-700",
    "bg-cyan-700",
  ]

  return (
    <section id="karya" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      
      {/* Background Pattern Abstrak */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
           <div className="max-w-2xl">
              <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-3 block">
                Literasi & Riset
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Karya Tulis & <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Khazanah Keilmuan
                </span>
              </h2>
           </div>
           
           <Link href="/karya" className="group px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-slate-900 transition-all font-bold flex items-center gap-2">
              Lihat Perpustakaan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
           </Link>
        </div>

        {/* GRID BUKU 3D */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16 mt-8">
           {karyaList.map((book, idx) => {
             // Pilih warna background random berdasarkan urutan
             const bgClass = bgColors[idx % bgColors.length]

             return (
               <div key={book.id} className="group relative perspective-1000 w-full max-w-[200px] mx-auto cursor-pointer">
                  
                  {/* WADAH BUKU (3D Wrapper) */}
                  <div className="relative aspect-[2/3] transition-all duration-500 transform-style-3d group-hover:-translate-y-4 group-hover:rotate-y-[-15deg] group-hover:shadow-2xl">
                     
                     {/* 1. LAYER DEPAN (COVER) */}
                     <div className={`absolute inset-0 rounded-r-md rounded-l-sm shadow-xl z-10 overflow-hidden ${book.image ? 'bg-white' : bgClass}`}>
                        
                        {book.image ? (
                           // KASUS A: Ada Gambar Upload
                           <img 
                             src={book.image} 
                             alt={book.title} 
                             className="w-full h-full object-cover"
                           />
                        ) : (
                           // KASUS B: Tidak Ada Gambar (Cover Generator)
                           <div className="w-full h-full p-5 flex flex-col justify-between border-l-4 border-white/10 relative">
                              {/* Tekstur Kertas Halus */}
                              <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay"></div>
                              
                              {/* Judul Buku */}
                              <div className="space-y-4 z-10">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                   <Book size={14} className="text-white" />
                                </div>
                                <h3 className="font-serif text-lg font-bold leading-snug text-white line-clamp-4 pt-2 border-t border-white/20 mt-2">
                                   {book.title}
                                </h3>
                              </div>

                              {/* Info Penulis & Tahun */}
                              <div className="z-10 space-y-1">
                                <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">PENYUSUN</p>
                                <p className="text-xs text-white font-medium truncate">{book.author}</p>
                                <p className="text-[10px] text-white/50 mt-1">{book.year}</p>
                              </div>
                           </div>
                        )}

                        {/* Efek Kilau Cahaya (Glossy) */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/10 pointer-events-none"></div>
                        
                        {/* Garis Lipatan Buku Kiri */}
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-black/20 z-20"></div>
                     </div>

                     {/* 2. LAYER SAMPING (PUNGGUNG BUKU) - Memberi efek tebal */}
                     <div className="absolute left-0 top-1 bottom-1 w-[12px] -translate-x-[11px] translate-z-[-2px] rotate-y-[-90deg] bg-slate-200 rounded-l-sm border-r border-slate-300 shadow-inner"></div>

                     {/* 3. LAYER BELAKANG (KERTAS) */}
                     <div className="absolute inset-y-1 right-1 w-[10px] bg-white translate-z-[-5px] translate-x-[-2px] rotate-y-[-5deg] shadow-sm rounded-r-sm"></div>

                  </div>

                  {/* INFO DI BAWAH BUKU (Hover Only) */}
                  <div className="mt-6 text-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <h4 className="text-sm font-bold truncate px-2">{book.title}</h4>
                      <p className="text-xs text-slate-400">{book.year}</p>
                  </div>
                  
                  {/* Shadow Lantai */}
                  <div className="absolute -bottom-6 left-4 right-4 h-4 bg-black/50 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-110"></div>
               </div>
             )
           })}

           {/* Placeholder jika belum ada data */}
           {karyaList.length === 0 && (
             <div className="col-span-full py-16 text-center border border-dashed border-slate-700 rounded-xl bg-slate-800/50">
               <Book size={48} className="mx-auto text-slate-600 mb-4" />
               <p className="text-slate-400 font-bold">Belum ada karya yang ditambahkan.</p>
               <p className="text-slate-600 text-sm mt-1">Silakan tambah data melalui Admin Panel.</p>
             </div>
           )}
        </div>

      </div>
    </section>
  )
}