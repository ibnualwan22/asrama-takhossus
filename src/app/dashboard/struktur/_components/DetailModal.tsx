'use client'

import { X, Calendar, Briefcase, UserCheck } from "lucide-react"

export default function DetailModal({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any }) {
  if (!isOpen || !data) return null

  // Logic Tampilan Foto & Nama
  const displayPhoto = data.photo || data.student?.photo || "/placeholder-avatar.png"
  const displayName = data.student ? data.student.name : data.name
  
  // Logic Tampilan Periode
  const periodString = data.periodEnd 
    ? `${data.periodStart} - ${data.periodEnd}` 
    : `${data.periodStart} - Sekarang`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in-95">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white p-1.5 rounded-full transition z-10 backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        {/* Header Foto Besar */}
        <div className="h-72 w-full bg-gray-200 relative shrink-0">
             <img src={displayPhoto} alt={displayName} className="w-full h-full object-cover" />
             
             {/* Gradient Overlay untuk Teks */}
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-20">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${data.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                        {data.isActive ? 'Aktif' : 'Demisioner'}
                    </span>
                    {data.studentId && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-500 text-white">
                            Mutakhorijin
                        </span>
                    )}
                </div>
                <h2 className="text-white text-2xl font-extrabold leading-tight">{displayName}</h2>
             </div>
        </div>

        {/* Body Informasi */}
        <div className="p-6 space-y-5 overflow-y-auto bg-white">
            
            {/* Info Jabatan */}
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Briefcase size={20} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Jabatan</p>
                    <p className="text-lg font-bold text-gray-900">{data.position}</p>
                </div>
            </div>

            {/* Info Masa Bakti */}
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 shrink-0">
                    <Calendar size={20} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Masa Bakti</p>
                    <p className="text-lg font-bold text-gray-900 font-mono">{periodString}</p>
                </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Info Tambahan (Jika berasal dari Alumni/Database) */}
            {data.student ? (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                    <div className="flex items-center gap-2 text-gray-800 font-bold text-sm mb-2">
                        <UserCheck size={16} className="text-blue-500"/> Data Akademik
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Angkatan Mutakhorijin</span>
                        <span className="font-medium">Ke-{data.student.mutakhorijinBatch || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">NIS</span>
                        <span className="font-mono font-medium">{data.student.nis}</span>
                    </div>
                </div>
            ) : (
                <div className="text-center text-xs text-gray-400 italic">
                    *Data ini diinput secara manual (Bukan Alumni).
                </div>
            )}
        </div>

      </div>
    </div>
  )
}