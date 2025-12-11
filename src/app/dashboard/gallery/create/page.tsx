// src/app/dashboard/gallery/create/page.tsx
'use client'

import { useActionState, useEffect } from 'react'
import { createAlbum } from '@/app/actions/gallery'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CreateAlbumPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createAlbum, null)

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard/gallery')
    }
  }, [state, router])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/dashboard/gallery" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-bold transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Kembali
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Buat Album Baru</h1>

        <form action={formAction} className="space-y-6">
          {state?.message && !state.success && (
            <div className="bg-red-100 text-red-700 p-3 rounded font-bold">{state.message}</div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Album</label>
            <input 
              name="title" 
              type="text" 
              placeholder="Contoh: Rihlah Akbar 2025" 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-bold"
              required 
            />
             {state?.error?.title && <p className="text-red-500 text-xs mt-1">{state.error.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi (Opsional)</label>
            <textarea 
              name="description" 
              rows={3}
              placeholder="Keterangan singkat tentang kegiatan ini..." 
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg disabled:bg-blue-300 flex items-center gap-2"
            >
              {isPending && <Loader2 className="animate-spin" size={18} />}
              {isPending ? 'Membuat...' : 'Buat Album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}