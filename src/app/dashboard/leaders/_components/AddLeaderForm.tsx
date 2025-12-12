'use client'

import { useState, useActionState, useEffect } from 'react'
import { createLeader } from '@/app/actions/settings'
import { Plus, X, UploadCloud, Loader2 } from 'lucide-react'

export default function AddLeaderForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createLeader, null)
  
  // State Upload
  const [preview, setPreview] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
      setPreview(null)
      setPhotoUrl('')
    }
  }, [state])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'asrama_unsigned')

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST', body: formData
      })
      const data = await res.json()
      if (data.secure_url) setPhotoUrl(data.secure_url)
    } catch (error) {
      alert('Gagal upload foto')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
        <Plus size={16} /> Tambah Pimpinan
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Tambah Pimpinan</h3>
              <button onClick={() => setIsOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <form action={formAction} className="p-6 space-y-4">
              <input type="hidden" name="photoUrl" value={photoUrl} />

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                <input name="name" type="text" required className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tahun Mulai</label>
                  <input name="periodStart" type="number" placeholder="2010" required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tahun Selesai</label>
                  <input name="periodEnd" type="number" placeholder="Kosongkan jika aktif" className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>

              {/* Upload Area */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Foto Profil</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center overflow-hidden">
                  {uploading ? <Loader2 className="animate-spin text-blue-600"/> : preview ? (
                    <img src={preview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <UploadCloud size={20} /> <span className="text-[10px]">Upload Foto</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Biografi Singkat</label>
                <textarea name="bio" rows={3} className="w-full px-3 py-2 border rounded-lg"></textarea>
              </div>

              <button type="submit" disabled={isPending || uploading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold disabled:bg-gray-300">
                {isPending ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}