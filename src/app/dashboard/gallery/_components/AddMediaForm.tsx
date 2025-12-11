// src/app/dashboard/gallery/_components/AddMediaForm.tsx
'use client'

import { useActionState, useState, useEffect } from 'react'
import { addMedia } from '@/app/actions/gallery'
import { Image as ImageIcon, Youtube, Loader2, UploadCloud } from 'lucide-react'

export default function AddMediaForm({ albumId }: { albumId: string }) {
  // State untuk Tab (PHOTO / VIDEO)
  const [activeTab, setActiveTab] = useState<'PHOTO' | 'VIDEO'>('PHOTO')
  const [state, formAction, isPending] = useActionState(addMedia, null)
  
  // State Preview Foto
  const [preview, setPreview] = useState<string | null>(null)

  // Reset form kalau sukses
  useEffect(() => {
    if (state?.success) {
      setPreview(null)
      // Reset input file manual
      const fileInput = document.getElementById('fileInput') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      // Reset input text
      const urlInput = document.getElementById('urlInput') as HTMLInputElement
      if (urlInput) urlInput.value = ''
    }
  }, [state])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h3 className="font-bold text-gray-800 mb-4">Tambah Media Baru</h3>

      {/* Tab Navigasi */}
      <div className="flex gap-2 mb-4 border-b border-gray-100 pb-1">
        <button
          onClick={() => setActiveTab('PHOTO')}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'PHOTO' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ImageIcon size={16} /> Upload Foto
        </button>
        <button
          onClick={() => setActiveTab('VIDEO')}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors flex items-center gap-2 ${
            activeTab === 'VIDEO' ? 'bg-red-50 text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Youtube size={16} /> Link Video
        </button>
      </div>

      <form action={formAction} className="flex flex-col md:flex-row gap-4 items-start">
        <input type="hidden" name="albumId" value={albumId} />
        <input type="hidden" name="type" value={activeTab} />

        <div className="flex-1 w-full">
          {/* INPUT FOTO */}
          {activeTab === 'PHOTO' && (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-32 hover:bg-gray-50 transition-colors overflow-hidden group">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <UploadCloud size={24} className="mb-2" />
                  <span className="text-xs font-bold">Pilih Foto (Max 5MB)</span>
                </div>
              )}
              <input 
                id="fileInput"
                type="file" 
                name="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* INPUT VIDEO */}
          {activeTab === 'VIDEO' && (
            <div>
              <input 
                id="urlInput"
                type="text" 
                name="videoUrl" 
                placeholder="Paste Link YouTube di sini (Contoh: https://youtu.be/...)"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 font-medium text-sm"
              />
              <p className="text-xs text-gray-400 mt-2">*Hanya mendukung link YouTube</p>
            </div>
          )}
          
          {/* Pesan Error */}
          {state?.message && !state.success && (
            <p className="text-red-500 text-xs font-bold mt-2">{state.message}</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className={`h-12 px-6 rounded-lg font-bold text-white shadow-sm transition-all active:scale-95 flex items-center gap-2 disabled:bg-gray-300 ${
            activeTab === 'PHOTO' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isPending && <Loader2 className="animate-spin" size={18} />}
          {isPending ? 'Menyimpan...' : 'Tambahkan'}
        </button>
      </form>
    </div>
  )
}