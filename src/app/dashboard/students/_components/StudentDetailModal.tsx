'use client'

import { useState, useActionState, useEffect } from 'react'
import { X, User, UploadCloud, Loader2, Save, Eye } from 'lucide-react'
// Import action baru kita
import { uploadStudentPhotoAction } from '@/app/actions/student' 

export default function StudentDetailModal({ student }: { student: any }) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Gunakan Server Action State
  const [state, formAction, isPending] = useActionState(uploadStudentPhotoAction, null)
  
  // State Preview Lokal (Hanya untuk tampilan sebelum disave)
  const [preview, setPreview] = useState<string | null>(student.photo)
  const [hasNewFile, setHasNewFile] = useState(false)

  // Efek samping kalau sukses
  useEffect(() => {
    if (state?.success) {
      alert(state.message)
      setHasNewFile(false) // Reset tombol simpan
      // Jangan tutup modal biar admin bisa lihat hasilnya
    } else if (state?.message) {
      alert(`Gagal: ${state.message}`)
    }
  }, [state])

  // Handle Pilih File (Preview Only)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setHasNewFile(true) // Munculkan tombol simpan
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"
        title="Lihat Detail & Foto"
      >
        <Eye size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Detail Santri</h3>
                  <p className="text-xs text-gray-500 font-mono">{student.nis}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* KOLOM KIRI: FORM UPLOAD FOTO */}
                <div className="w-full md:w-1/3 flex flex-col gap-3">
                  
                  {/* Kita bungkus area foto dengan FORM Server Action */}
                  <form action={formAction} className="flex flex-col gap-3">
                    <input type="hidden" name="studentId" value={student.id} />
                    
                    <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner group">
                      <img 
                        src={preview || "https://via.placeholder.com/300x400?text=No+Photo"} 
                        alt={student.name} 
                        className="w-full h-full object-cover" 
                      />
                      
                      {/* Input File Overlay */}
                      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-200">
                        <UploadCloud size={32} className="mb-2" />
                        <span className="text-xs font-bold">Ganti Foto</span>
                        {/* Name="file" penting agar terbaca di Server Action */}
                        <input type="file" name="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>

                    {/* Tombol Simpan (Hanya muncul jika user memilih file baru) */}
                    {hasNewFile && (
                      <button 
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-md animate-pulse disabled:bg-gray-400"
                      >
                        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isPending ? 'Mengupload...' : 'Simpan Foto'}
                      </button>
                    )}
                  </form>
                  
                  <div className="text-center mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {student.status}
                    </span>
                  </div>
                </div>

                {/* KOLOM KANAN: DATA DIRI (Read Only) */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <InfoRow label="Nama Lengkap" value={student.name} />
                    <InfoRow label="NIS / ID" value={student.nis} />
                    <InfoRow label="Asrama & Kamar" value={`${student.activeDormitory} - ${student.dormitoryRoom || '-'}`} />
                    <InfoRow label="Kelas Formal" value={student.formalClass || '-'} />
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow label="Tempat Lahir" value={student.placeOfBirth || '-'} />
                      <InfoRow label="Tanggal Lahir" value={student.dateOfBirth || '-'} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoRow label="Angkatan Masuk" value={student.entryYear} />
                      <InfoRow label="Nama Ayah" value={student.fatherName || '-'} />
                    </div>
                    <InfoRow label="Nama Ibu" value={student.motherName || '-'} />
                    <InfoRow label="Alamat Domisili" value={student.address || '-'} />
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t text-right">
              <button onClick={() => setIsOpen(false)} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg text-sm">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function InfoRow({ label, value }: { label: string, value: any }) {
  return (
    <div className="border-b border-gray-100 pb-2">
      <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}