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

  useEffect(() => {
    if (existingData) {
      setPreview(existingData.image || null)
    } else {
      setPreview(null)
    }
  }, [existingData, isOpen])

  if (!isOpen) return null

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">
            {existingData ? 'Edit Karya' : 'Tambah Karya Baru'}
          </h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {existingData && <input type="hidden" name="id" value={existingData.id} />}
          {existingData && <input type="hidden" name="oldImage" value={existingData.image || ''} />}

          {/* JUDUL */}
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Judul Kitab/Karya</label>
            <input 
              name="title" 
              defaultValue={existingData?.title} 
              required 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Contoh: Risalah Takhossus"
            />
          </div>

          {/* PENULIS & TAHUN (Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Penyusun</label>
                <input 
                  name="author" 
                  defaultValue={existingData?.author} 
                  required 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Nama / Angkatan"
                />
            </div>
            <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Tahun Terbit</label>
                <input 
                  name="year" 
                  type="number"
                  defaultValue={existingData?.year || new Date().getFullYear()} 
                  required 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
          </div>

          {/* DESKRIPSI (Textarea) */}
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Deskripsi Singkat</label>
            <textarea 
              name="description" 
              rows={3}
              defaultValue={existingData?.description} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Jelaskan isi kitab secara singkat..."
            ></textarea>
          </div>

          {/* FOTO SAMPUL */}
          <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Sampul Buku</label>
              <div className="flex items-center gap-4 p-3 border border-dashed rounded-lg bg-gray-50">
                <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0 border">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><Book size={20}/></div>
                  )}
                </div>
                <div className="flex-1">
                   <input 
                     type="file" 
                     name="file" 
                     accept="image/*" 
                     onChange={handleFileChange} 
                     className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                   />
                   <p className="text-[10px] text-gray-400 mt-1">Format: JPG/PNG, Max 2MB.</p>
                </div>
              </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-2 transition disabled:bg-blue-300"
          >
            {loading ? 'Menyimpan...' : <><Save size={18}/> Simpan Data</>}
          </button>
        </form>
      </div>
    </div>
  )
}