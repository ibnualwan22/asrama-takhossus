'use client'

import { X, Calendar, User } from "lucide-react"

export default function KaryaDetail({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) {
  if (!isOpen || !data) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">
        
        <button onClick={onClose} className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full hover:bg-white text-gray-800 z-10 shadow">
          <X size={20} />
        </button>

        {/* Kolom Kiri: Gambar */}
        <div className="w-full md:w-5/12 bg-gray-100 flex items-center justify-center p-4">
            <div className="relative shadow-lg rounded-lg overflow-hidden max-h-[400px]">
                <img 
                    src={data.image || "/placeholder-book.jpg"} 
                    alt={data.title} 
                    className="w-full h-auto object-contain" 
                />
            </div>
        </div>

        {/* Kolom Kanan: Info */}
        <div className="w-full md:w-7/12 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h2>
            
            <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} className="text-blue-500" />
                    <span className="font-semibold">Penyusun:</span> {data.author}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="font-semibold">Tahun Terbit:</span> {data.year}
                </div>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700">
                <h4 className="text-sm font-bold uppercase text-gray-400 mb-1">Deskripsi</h4>
                <p className="whitespace-pre-wrap leading-relaxed">{data.description || "Tidak ada deskripsi."}</p>
            </div>
        </div>
      </div>
    </div>
  )
}