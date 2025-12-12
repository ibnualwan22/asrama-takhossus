'use client'
import { useState } from 'react'
import { X, Eye, User, Award } from 'lucide-react'

export default function OrgDetailModal({ org }: { org: any }) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Ambil struktur aktif
  const currentStruct = org.history?.[0]

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"><Eye size={16}/></button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in-95">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden p-6 relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X size={24}/></button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border">
                 {org.logo ? <img src={org.logo} className="w-full h-full object-contain"/> : <Award size={32} className="text-gray-400"/>}
              </div>
              <div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${org.category === 'KEILMUAN' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{org.category}</span>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-1">{org.name}</h2>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 bg-gray-50 p-3 rounded-lg border">{org.description}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><User size={20}/></div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Ketua Organisasi</p>
                  <p className="font-bold text-gray-900">{currentStruct?.leader?.name || 'Belum dipilih'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600"><Award size={20}/></div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Pembimbing</p>
                  <p className="font-bold text-gray-900">{currentStruct?.advisor?.name || 'Belum dipilih'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}