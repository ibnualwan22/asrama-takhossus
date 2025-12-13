'use client'

import { useState } from 'react'
import { Search, Book, User, Calendar, Filter } from "lucide-react"

export default function LibraryClient({ initialData }: { initialData: any[] }) {
  const [query, setQuery] = useState('')
  const [filterYear, setFilterYear] = useState('All')

  // Ambil tahun unik dari data untuk filter
  const years = ['All', ...Array.from(new Set(initialData.map(k => k.year))).sort().reverse()]

  // Filter Logic
  const filtered = initialData.filter(item => {
    const matchQuery = item.title.toLowerCase().includes(query.toLowerCase()) || 
                       item.author.toLowerCase().includes(query.toLowerCase())
    const matchYear = filterYear === 'All' || item.year.toString() === filterYear
    return matchQuery && matchYear
  })

  return (
    <div className="pb-20">
      
      {/* 1. HERO SEARCH SECTION */}
      <div className="bg-slate-900 text-white py-16 px-4 mb-10 shadow-xl relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
         <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

         <div className="container mx-auto max-w-4xl text-center relative z-10">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Perpustakaan Digital</h1>
            <p className="text-slate-300 mb-8 text-lg">Jelajahi khazanah keilmuan dan karya tulis santri.</p>
            
            {/* Search Bar Besar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Cari judul buku, kitab, atau penulis..." 
                    className="w-full bg-transparent border-none outline-none text-white placeholder-slate-400 pl-12 pr-4 py-3"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
               </div>
               <div className="relative md:w-48">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select 
                    className="w-full bg-slate-800/50 border-none outline-none text-white pl-10 pr-4 py-3 rounded-xl cursor-pointer appearance-none hover:bg-slate-800"
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                  >
                     {years.map(y => <option key={y} value={y} className="text-slate-900">{y === 'All' ? 'Semua Tahun' : y}</option>)}
                  </select>
               </div>
            </div>
         </div>
      </div>

      {/* 2. GRID BUKU (Tampilan E-Book Store) */}
      <div className="container mx-auto px-4">
        
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-gray-800">Koleksi Buku ({filtered.length})</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
           {filtered.map((book) => (
             <div key={book.id} className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100">
                
                {/* Cover Image Area */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 border-b border-gray-100">
                   {book.image ? (
                     <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                   ) : (
                     // Cover Generator Flat Design
                     <div className="w-full h-full p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <Book size={48} className="text-slate-300 mb-4" />
                        <h3 className="font-serif text-lg font-bold text-slate-700 line-clamp-3">{book.title}</h3>
                     </div>
                   )}
                   
                   {/* Overlay Hover Action */}
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-50 transition">
                         Lihat Detail
                      </button>
                   </div>
                </div>

                {/* Book Info */}
                <div className="p-5 flex flex-col flex-1">
                   <div className="mb-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                        {book.year}
                      </span>
                   </div>
                   <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                      {book.title}
                   </h3>
                   <div className="mt-auto pt-4 flex items-center gap-2 text-gray-500 text-sm border-t border-gray-50">
                      <User size={14} />
                      <span className="truncate">{book.author}</span>
                   </div>
                </div>

             </div>
           ))}
        </div>

        {filtered.length === 0 && (
           <div className="text-center py-20 text-gray-400">
              <Book size={64} className="mx-auto mb-4 text-slate-200" />
              <p>Tidak ada buku yang cocok dengan pencarian Anda.</p>
           </div>
        )}

      </div>
    </div>
  )
}