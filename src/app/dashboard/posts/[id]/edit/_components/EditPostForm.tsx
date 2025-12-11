'use client'

import { useActionState, useState, useEffect } from 'react'
import { updatePost } from '@/app/actions/post' // Panggil server action baru
import { ArrowLeft, UploadCloud, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EditPostForm({ post }: { post: any }) {
  const router = useRouter()
  // Gunakan useActionState untuk handling loading state otomatis
  const [state, formAction, isPending] = useActionState(updatePost, null)
  
  // State hanya untuk PREVIEW LOKAL di browser, tidak untuk upload
  const [preview, setPreview] = useState<string | null>(post.thumbnail)

  useEffect(() => {
    if (state?.success) {
      alert('Perubahan berhasil disimpan!')
      router.push('/dashboard/posts')
    }
  }, [state, router])

  // Fungsi ini HANYA untuk menampilkan preview gambar yang dipilih di browser
  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
  }

  // Fungsi untuk menghapus/mereset gambar di preview
  const handleRemoveImage = () => {
    setPreview(null) 
    // Reset input file agar jika disubmit, dianggap tidak ada file
    const fileInput = document.getElementById('fileInput') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/posts" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-bold">
        <ArrowLeft size={20} className="mr-2" /> Batal Edit
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Edit Artikel</h1>

        {/* FORM SUBMIT LANGSUNG KE SERVER ACTION */}
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={post.id} />
          
          {/* PENTING: Input Hidden untuk URL Lama */}
          {/* Jika user tidak memilih file baru, server akan memakai nilai ini */}
          <input type="hidden" name="oldThumbnailUrl" value={post.thumbnail || ''} />

          {/* Tampilkan Error dari Server jika ada */}
          {state?.message && !state.success && (
             <div className="bg-red-100 text-red-700 p-3 rounded font-bold border border-red-200">
                {state.message}
             </div>
          )}

          {/* Judul */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Judul Artikel</label>
            <input name="title" type="text" defaultValue={post.title} className="w-full px-4 py-3 border border-gray-200 rounded-lg font-bold text-lg" required />
            {state?.error?.title && <p className="text-red-500 text-xs mt-1">{state.error.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
              <select name="type" defaultValue={post.type} className="w-full px-4 py-3 border border-gray-200 rounded-lg font-medium">
                <option value="ARTICLE">Artikel Umum</option>
                <option value="NEWS">Berita Kegiatan</option>
                <option value="ANNOUNCEMENT">Pengumuman</option>
              </select>
            </div>

            {/* Upload Area (Hanya Preview) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gambar Utama</label>
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-[120px] hover:bg-gray-50 overflow-hidden group bg-gray-50">
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    {/* Tombol X untuk menghapus gambar */}
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-sm z-10"
                      title="Hapus Gambar"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <UploadCloud size={24} className="mb-1" />
                    <span className="text-xs font-bold">Ganti Gambar</span>
                  </div>
                )}
                
                {/* Input File Fisik - name="file" WAJIB ADA */}
                <input 
                  id="fileInput"
                  type="file" 
                  name="file" 
                  accept="image/*" 
                  onChange={handleFilePreview} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-1">*Biarkan kosong jika tidak ingin mengubah gambar.</p>
            </div>
          </div>

          {/* Konten */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Isi Konten</label>
            <textarea name="content" rows={10} defaultValue={post.content} className="w-full px-4 py-3 border border-gray-200 rounded-lg font-medium" required></textarea>
            {state?.error?.content && <p className="text-red-500 text-xs mt-1">{state.error.content}</p>}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg disabled:bg-blue-300 flex items-center gap-2"
            >
              {isPending && <Loader2 className="animate-spin" size={18} />}
              {isPending ? 'Menyimpan ke Server...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}