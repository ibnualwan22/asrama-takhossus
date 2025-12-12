'use client'

import { useState, useEffect } from "react"
import { X, Upload, Save, Book } from "lucide-react"
import { saveKarya } from "@/app/actions/karya"

type Props = {
  isOpen: boolean
  onClose: () => void
  existingData?: any
}

export default function KaryaModal({ isOpen, onClose, existingData }: Props) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  // Reset form saat modal dibuka/tutup atau data berubah
  useEffect(() => {
    if (existingData) {
      setPreview(existingData.image || null)
    } else {
      setPreview(null)
    }
  }, [existingData, isOpen])

  if (!isOpen) return null

  // Handle Preview Image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const res = await saveKarya(formData)
    setLoading(false)
    
    if (res.success) {
      onClose()
    } else {
      alert(res.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            <Book size={20} className="text-blue-600" />
            {existingData ? "Edit Karya" : "Tambah Karya Baru"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form action={handleSubmit} className="space-y-4">
            
            {existingData && <input type="hidden" name="id" value={existingData.id} />}

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Nama Kitab / Karya</label>
              <input 
                type="text" name="title" required 
                defaultValue={existingData?.title}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Contoh: Terjemah Alfiyah..." 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Penyusun</label>
                <input 
                  type="text" name="author" required 
                  defaultValue={existingData?.author}
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Nama Penyusun/Tim" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Tahun Terbit</label>
                <input 
                  type="number" name="year" required 
                  defaultValue={existingData?.year || new Date().getFullYear()}
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Deskripsi Singkat</label>
              <textarea 
                name="description" rows={3}
                defaultValue={existingData?.description}
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Jelaskan isi kitab..." 
              ></textarea>
            </div>

            {/* Upload Foto */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Foto Sampul</label>
              <div className="flex items-start gap-4 p-3 border border-dashed rounded-lg bg-gray-50">
                <div className="w-20 h-28 bg-gray-200 rounded border flex-shrink-0 overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center p-1">No Cover</div>
                  )}
                </div>
                <div className="flex-1">
                  <input type="file" name="file" accept="image/*" onChange={handleFileChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-2"/>
                  <p className="text-xs text-gray-400">Format: JPG, PNG. Maks 2MB.</p>
                </div>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Menyimpan..." : <><Save size={18} /> Simpan Data</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}