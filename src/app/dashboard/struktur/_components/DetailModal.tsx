'use client'

import { X } from "lucide-react"

export default function DetailModal({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) {
  if (!isOpen || !data) return null

  // Logic foto:
  const displayPhoto = data.photo || data.student?.photo || "/placeholder-avatar.png"
  const displayName = data.student ? data.student.name : data.name

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative">
        <button onClick={onClose} className="absolute top-3 right-3 bg-white/50 p-1 rounded-full hover:bg-white text-gray-800 z-10">
          <X size={20} />
        </button>

        {/* Foto Besar */}
        <div className="h-64 w-full bg-gray-200 relative">
             <img src={displayPhoto} alt={displayName} className="w-full h-full object-cover" />
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                <h2 className="text-white text-xl font-bold">{displayName}</h2>
                <p className="text-blue-300 font-medium">{data.position}</p>
             </div>
        </div>

        <div className="p-5 space-y-4">
            <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">Status Data</span>
                {data.studentId ? (
                     <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-bold">Mutakhorijin</span>
                ) : (
                     <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded font-bold">Manual Input</span>
                )}
            </div>
            
            <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">Urutan Tampilan</span>
                <span className="font-medium">#{data.order}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">Terdaftar Sejak</span>
                <span className="font-medium text-sm">{new Date(data.createdAt).toLocaleDateString("id-ID")}</span>
            </div>

            {data.student && (
                <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
                    <p><strong>Info Alumni:</strong></p>
                    <p>Angkatan: {data.student.mutakhorijinBatch || '-'}</p>
                    <p>NIS: {data.student.nis}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}