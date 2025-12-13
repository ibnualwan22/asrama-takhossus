'use client'

import { X, Calendar, User, BookOpen } from "lucide-react"

export default function KaryaDetail({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) {
  if (!isOpen || !data) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in zoom-in-95">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">
        
        <button onClick={onClose} className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full hover:bg-white text-gray-800 z-10 shadow transition">
          <X size={20} />
        </button>

        {/* Kolom Kiri: Gambar */}
        <div className="w-full md:w-5/12 bg-gray-100 flex items-center justify-center p-6">
            <div className="relative shadow-xl rounded-r-lg rounded-l-sm overflow-hidden w-48 aspect-[3/4] bg-white transform rotate-y-12">
                {data.image ? (
                   <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center bg-blue-600 text-white p-4 text-center">
                      <BookOpen size={40} className="mb-2 opacity-50"/>
                      <span className="font-serif font-bold leading-tight">{data.title}</span>
                   </div>
                )}
                {/* Efek Kilau */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 pointer-events-none"></div>
            </div>
        </div>

        {/* Kolom Kanan: Info */}
        <div className="w-full md:w-7/12 p-8 overflow-y-auto">
            <span className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-1 block">Detail Karya</span>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight">{data.title}</h2>
            
            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <User size={16} className="text-blue-500" />
                    <div>
                       <span className="text-xs text-gray-400 block font-bold uppercase">Penyusun</span>
                       <span className="font-semibold">{data.author}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Calendar size={16} className="text-blue-500" />
                    <div>
                       <span className="text-xs text-gray-400 block font-bold uppercase">Tahun Terbit</span>
                       <span className="font-semibold">{data.year}</span>
                    </div>
                </div>
            </div>

            <div className="prose prose-sm text-gray-600">
                <h4 className="text-sm font-bold uppercase text-gray-900 mb-2 border-b pb-1">Sinopsis / Deskripsi</h4>
                <p className="whitespace-pre-line leading-relaxed">
                   {data.description || "Tidak ada deskripsi yang tersedia."}
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}