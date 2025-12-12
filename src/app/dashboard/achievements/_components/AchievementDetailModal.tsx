'use client'
import { useState } from 'react'
import { X, Eye } from 'lucide-react'

export default function AchievementDetailModal({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-gray-600 hover:text-gray-900 flex items-center gap-1 text-xs font-bold"><Eye size={14}/> Detail</button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in-95">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center">
              {item.photo ? <img src={item.photo} className="w-full h-full object-cover"/> : <div className="text-gray-400 font-bold">No Image</div>}
            </div>
            <div className="w-full md:w-1/2 p-6 relative">
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={24}/></button>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{item.title}</h2>
              <div className="space-y-4 mt-4">
                <div className="border-b pb-2"><p className="text-xs text-gray-500 font-bold">PERAIH PRESTASI</p><p className="font-medium text-lg text-blue-600">{item.student ? item.student.name : 'Asrama Takhossus'}</p></div>
                <div className="border-b pb-2"><p className="text-xs text-gray-500 font-bold">TINGKAT</p><p className="font-medium">{item.level}</p></div>
                <div className="border-b pb-2"><p className="text-xs text-gray-500 font-bold">TAHUN</p><p className="font-medium">{item.year}</p></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}