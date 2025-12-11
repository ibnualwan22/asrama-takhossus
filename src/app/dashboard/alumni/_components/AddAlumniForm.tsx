// src/app/dashboard/alumni/_components/AddAlumniForm.tsx
'use client'

import { useState, useActionState, useEffect } from 'react'
import { createManualAlumni } from '@/app/actions/alumni'
import { Plus, X, UserPlus } from 'lucide-react'

export default function AddAlumniForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createManualAlumni, null)

  // Tutup modal jika sukses
  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
    }
  }, [state])

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 text-sm"
      >
        <UserPlus size={18} /> Tambah Manual
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-extrabold text-lg text-gray-800">Input Data Alumni Manual</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form action={formAction} className="p-6 space-y-4">
              
              {state?.message && !state.success && (
                <div className="bg-red-100 text-red-700 p-3 rounded text-sm font-bold border border-red-200">
                  {state.message}
                </div>
              )}

              {/* Baris 1: Nama & NIS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                  <input name="name" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">NIS (Manual)</label>
                  <input name="nis" type="text" placeholder="Contoh: MAN-001" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium" />
                </div>
              </div>

              {/* Baris 2: Tahun */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tahun Masuk</label>
                  <input name="entryYear" type="number" placeholder="20XX" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Angkatan/Tahun Keluar</label>
                  <input name="graduationYear" type="number" placeholder="20XX" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium" />
                </div>
              </div>

              {/* Status & Alamat */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status Alumni</label>
                <select name="status" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium">
                  <option value="ALUMNI_GRADUATED">Mutakhorijin (Lulus)</option>
                  <option value="ALUMNI_DROPOUT">Boyong / Berhenti</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Alamat / Domisili</label>
                <textarea name="address" rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:bg-blue-300 flex justify-center items-center gap-2"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Data Alumni'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}