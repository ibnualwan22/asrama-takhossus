// src/app/dashboard/posts/create/page.tsx
'use client'

import { useActionState, useState, useEffect } from 'react' // Tambah useState
import { createPost } from '@/app/actions/post'
import { ArrowLeft, UploadCloud, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CreatePostPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createPost, null)
  
  // STATE BARU UNTUK PREVIEW
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (state?.success) {
      alert('Artikel berhasil dibuat!')
      router.push('/dashboard/posts')
    }
  }, [state, router])

  // FUNGSI HANDLE PREVIEW
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard/posts" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-bold transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Kembali
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Tulis Artikel Baru</h1>

        <form action={formAction} className="space-y-6">
          
          {state?.message && !state.success && (
             <div className="bg-red-100 text-red-700 p-3 rounded font-bold">{state.message}</div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Judul Artikel</label>
            <input 
              name="title" 
              type="text" 
              placeholder="Contoh: Kegiatan Rihlah Santri 2024"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold text-lg"
              required 
            />
            {state?.error?.title && <p className="text-red-500 text-xs mt-1">{state.error.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
              <select name="type" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium">
                <option value="ARTICLE">Artikel Umum</option>
                <option value="NEWS">Berita Kegiatan</option>
                <option value="ANNOUNCEMENT">Pengumuman</option>
              </select>
            </div>

            {/* AREA UPLOAD DENGAN PREVIEW */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gambar Utama (Thumbnail)</label>
              
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-[120px] hover:bg-gray-50 transition-colors overflow-hidden group">
                
                {/* JIKA ADA PREVIEW, TAMPILKAN GAMBAR */}
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setPreview(null)
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  /* JIKA BELUM ADA, TAMPILKAN ICON UPLOAD */
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 pointer-events-none">
                    <UploadCloud size={24} className="mb-1" />
                    <span className="text-xs font-bold">Klik untuk upload gambar</span>
                  </div>
                )}

                {/* INPUT FILE (Invisible tapi bisa diklik) */}
                <input 
                  type="file" 
                  name="file" 
                  accept="image/*"
                  onChange={handleImageChange} // Panggil fungsi preview
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Isi Konten</label>
            <textarea 
              name="content" 
              rows={10} 
              placeholder="Tulis isi artikel di sini..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium leading-relaxed"
              required
            ></textarea>
             {state?.error?.content && <p className="text-red-500 text-xs mt-1">{state.error.content}</p>}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg active:scale-95 transition-all disabled:bg-blue-300"
            >
              {isPending ? 'Menerbitkan...' : 'Terbitkan Artikel'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}