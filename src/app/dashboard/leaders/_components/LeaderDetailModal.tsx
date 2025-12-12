'use client'
import { useState } from 'react'
import { X, Eye } from 'lucide-react'

export default function LeaderDetailModal({ leader, urutan }: { leader: any, urutan: number }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg" title="Detail"><Eye size={16}/></button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in-95">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-gray-100 flex items-center justify-center p-4">
              <div className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                 {leader.photo ? <img src={leader.photo} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gray-300 flex items-center justify-center font-bold text-gray-500">No Foto</div>}
              </div>
            </div>
            <div className="w-full md:w-2/3 p-8 relative">
              <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={24}/></button>
              <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold mb-2">Kepala Asrama Ke-{urutan}</div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{leader.name}</h2>
              <p className="text-blue-600 font-bold mb-6 text-lg">{leader.periodStart} - {leader.periodEnd || 'Sekarang'}</p>
              
              <div className="prose prose-sm text-gray-600">
                <h4 className="font-bold text-gray-900 mb-2">Biografi / Profil Singkat</h4>
                <p>{leader.bio || "Belum ada biografi yang ditambahkan."}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}