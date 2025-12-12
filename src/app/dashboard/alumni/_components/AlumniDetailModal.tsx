'use client'

import { useState, useActionState, useEffect } from 'react'
import { X, User, UploadCloud, Loader2, Save, Eye } from 'lucide-react'
// Kita pakai action upload yg sama dengan santri karena tabelnya sama
import { uploadStudentPhotoAction } from '@/app/actions/student' 

export default function AlumniDetailModal({ alumni }: { alumni: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(uploadStudentPhotoAction, null)
  const [preview, setPreview] = useState<string | null>(alumni.photo)
  const [hasNewFile, setHasNewFile] = useState(false)

  useEffect(() => {
    if (state?.success) {
      alert(state.message)
      setHasNewFile(false)
    }
  }, [state])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setHasNewFile(true)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Lihat Detail & Foto"
      >
        <Eye size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="font-bold text-lg text-gray-900">Detail Alumni</h3>
              <button onClick={() => setIsOpen(false)}><X size={24} className="text-gray-400" /></button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Bagian Foto & Upload */}
                <div className="w-full md:w-1/3 flex flex-col gap-3">
                  <form action={formAction} className="flex flex-col gap-3">
                    <input type="hidden" name="studentId" value={alumni.id} />
                    <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner group">
                      <img src={preview || "https://via.placeholder.com/300x400?text=No+Photo"} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                        <UploadCloud size={32} className="mb-2" />
                        <span className="text-xs font-bold">Ganti Foto</span>
                        <input type="file" name="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                    {hasNewFile && (
                      <button type="submit" disabled={isPending} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                        {isPending ? <Loader2 size={16} className="animate-spin" /> : 'Simpan Foto'}
                      </button>
                    )}
                  </form>
                </div>

                {/* Bagian Data */}
                <div className="flex-1 space-y-4">
                    <InfoRow label="Nama Lengkap" value={alumni.name} />
                    <InfoRow label="NIS / ID" value={alumni.nis} />
                    <div className="grid grid-cols-2 gap-4">
                       <InfoRow label="Tahun Masuk" value={alumni.entryYear} />
                       <InfoRow label="Tahun Keluar" value={alumni.graduationYear || '-'} />
                    </div>
                    <InfoRow label="Angkatan Mutakhorijin" value={alumni.mutakhorijinBatch ? `Ke-${alumni.mutakhorijinBatch}` : '-'} />
                    <InfoRow label="Domisili" value={alumni.address || '-'} />
                    <InfoRow label="Status Saat Ini" value={alumni.status} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function InfoRow({ label, value }: any) {
  return (
    <div className="border-b border-gray-100 pb-2">
      <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}