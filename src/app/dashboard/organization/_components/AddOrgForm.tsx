'use client'

import { useState, useActionState, useEffect } from 'react'
import { createOrganization } from '@/app/actions/settings'
import { Plus, X, UploadCloud, Loader2 } from 'lucide-react'

export default function AddOrgForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createOrganization, null)
  
  // State Upload Logo
  const [preview, setPreview] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
      setPreview(null)
      setLogoUrl('')
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
      if (data.secure_url) setLogoUrl(data.secure_url)
    } catch (error) {
      alert('Gagal upload logo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
        <Plus size={16} /> Tambah Divisi
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Tambah Divisi Organisasi</h3>
              <button onClick={() => setIsOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <form action={formAction} className="p-6 space-y-4">
              <input type="hidden" name="logoUrl" value={logoUrl} />

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Divisi</label>
                <input name="name" type="text" required placeholder="Contoh: Divisi Keamanan" className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Tugas</label>
                <textarea name="description" rows={2} required className="w-full px-3 py-2 border rounded-lg"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Urutan Tampil</label>
                <input name="order" type="number" defaultValue={0} className="w-full px-3 py-2 border rounded-lg" />
              </div>

              {/* Upload Logo */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Logo Divisi (Opsional)</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center overflow-hidden">
                  {uploading ? <Loader2 className="animate-spin text-blue-600"/> : preview ? (
                    <img src={preview} className="h-full object-contain" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <UploadCloud size={20} /> <span className="text-[10px]">Upload Logo</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <button type="submit" disabled={isPending || uploading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold disabled:bg-gray-300">
                {isPending ? 'Menyimpan...' : 'Simpan Divisi'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}