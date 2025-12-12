'use client'

import { useState, useActionState, useEffect } from 'react'
import { createAchievement } from '@/app/actions/achievement'
import { Plus, X, UploadCloud, Loader2, Trophy } from 'lucide-react'

export default function AddAchievementForm({ students }: { students: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createAchievement, null)
  
  // State UI
  const [category, setCategory] = useState('SANTRI')
  const [preview, setPreview] = useState<string | null>(null)
  
  // Reset Form
  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
      setPreview(null)
      alert(state.message)
    } else if (state?.message) {
      alert(state.message)
    }
  }, [state])

  // Handle Preview Only (Tidak ada upload di sini)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow hover:bg-gray-800">
        <Plus size={16} /> Input Prestasi
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20}/> Prestasi Baru
              </h3>
              <button onClick={() => setIsOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            {/* FORM LANGSUNG KE SERVER ACTION */}
            <form action={formAction} className="p-6 space-y-4 overflow-y-auto">
              
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button type="button" onClick={() => setCategory('SANTRI')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${category === 'SANTRI' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Santri</button>
                <button type="button" onClick={() => setCategory('ASRAMA')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${category === 'ASRAMA' ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}>Asrama</button>
              </div>
              <input type="hidden" name="category" value={category} />

              {category === 'SANTRI' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Santri</label>
                  <select name="studentId" className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="">-- Pilih Santri --</option>
                    {students.map((s) => (<option key={s.id} value={s.id}>{s.name} ({s.nis})</option>))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Prestasi</label>
                <input name="title" type="text" required placeholder="Contoh: Juara 1..." className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tingkat</label>
                  <select name="level" className="w-full px-3 py-2 border rounded-lg">
                    <option value="Kecamatan">Kecamatan</option>
                    <option value="Kabupaten">Kabupaten</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tahun</label>
                  <input name="year" type="number" defaultValue={new Date().getFullYear()} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>

              {/* Upload Dokumentasi (Server Side) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Dokumentasi</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center overflow-hidden bg-gray-50">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <UploadCloud size={24} /> <span className="text-[10px]">Pilih Foto</span>
                    </div>
                  )}
                  {/* Name="file" wajib ada agar dibaca server action */}
                  <input type="file" name="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold disabled:bg-gray-300 flex items-center justify-center gap-2">
                {isPending ? <Loader2 className="animate-spin" /> : 'Simpan Prestasi'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}