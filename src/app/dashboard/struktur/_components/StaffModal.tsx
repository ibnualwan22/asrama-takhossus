'use client'

import { useState, useEffect } from "react"
import { X, Upload, Save } from "lucide-react"
import { saveStaff } from "@/app/actions/structure"

type Candidate = { id: string; name: string; mutakhorijinBatch: number | null }

type Props = {
  isOpen: boolean
  onClose: () => void
  candidates: Candidate[]
  existingData?: any // Data staff yang mau diedit (opsional)
}

export default function StaffModal({ isOpen, onClose, candidates, existingData }: Props) {
  const [source, setSource] = useState<'database' | 'manual'>('database')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  // Isi form jika mode Edit
  useEffect(() => {
    if (existingData) {
      setSource(existingData.studentId ? 'database' : 'manual')
      setPreview(existingData.photo || existingData.student?.photo || null)
    } else {
      setSource('database')
      setPreview(null)
    }
  }, [existingData])

  if (!isOpen) return null

  // Handle Preview Foto Saat Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await saveStaff(formData)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">
            {existingData ? "Edit Pengurus" : "Tambah Pengurus Baru"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6">
          <form action={handleSubmit} className="space-y-5">
            
            {/* Hidden ID untuk Edit Mode */}
            {existingData && <input type="hidden" name="id" value={existingData.id} />}

            {/* Toggle Source */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button type="button" onClick={() => setSource("database")} className={`flex-1 text-sm py-2 rounded-md font-medium transition ${source === 'database' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>
                Mutakhorijin
              </button>
              <button type="button" onClick={() => setSource("manual")} className={`flex-1 text-sm py-2 rounded-md font-medium transition ${source === 'manual' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>
                Manual Input
              </button>
              <input type="hidden" name="source" value={source} />
            </div>

            {/* Nama Input */}
            {source === 'database' ? (
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Pilih Alumni</label>
                <select 
                  name="studentId" 
                  defaultValue={existingData?.studentId || ""}
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- Cari Nama --</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.mutakhorijinBatch ? `(Angk. ${c.mutakhorijinBatch})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Nama Lengkap</label>
                <input 
                  type="text" name="manualName" 
                  defaultValue={existingData?.name || ""}
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Nama pengurus..." 
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-bold text-gray-700">Jabatan</label>
                <input 
                  type="text" name="position" required 
                  defaultValue={existingData?.position || ""}
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Contoh: Ketua" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Urutan</label>
                <input 
                  type="number" name="order" 
                  defaultValue={existingData?.order || 0}
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            {/* Upload Foto */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Foto Profil</label>
              
              <div className="flex items-center gap-4">
                {/* Preview Image */}
                <div className="w-16 h-16 rounded-full bg-gray-200 border overflow-hidden flex-shrink-0">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Img</div>
                  )}
                </div>
                
                {/* File Input */}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <Upload size={18} className="text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Klik untuk upload foto baru</span>
                  </div>
                  <input type="file" name="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-gray-500">*Kosongkan jika tidak ingin mengubah foto.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? "Menyimpan..." : (
                <><Save size={18} /> Simpan Data</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}