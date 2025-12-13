'use client'

import { useState, useActionState, useEffect } from 'react'
import { updateAlumni } from '@/app/actions/alumni'
import { Pencil, X, Save, Loader2, Lock } from 'lucide-react'

// Tambahkan prop permission
export default function EditAlumniModal({ alumni, canUpdate }: { alumni: any, canUpdate: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(updateAlumni, null)

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
      alert(state.message)
    } else if (state?.message) {
      alert(state.message)
    }
  }, [state])

  // JIKA TIDAK PUNYA IZIN
  if (!canUpdate) {
    return (
      <button disabled className="p-2 text-gray-300 cursor-not-allowed" title="Anda tidak memiliki izin edit">
        <Lock size={18} />
      </button>
    )
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
        title="Edit Data Alumni"
      >
        <Pencil size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Edit Data Alumni</h3>
              <button onClick={() => setIsOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <form action={formAction} className="p-6 space-y-4">
              <input type="hidden" name="id" value={alumni.id} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                  <input name="name" defaultValue={alumni.name} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">NIS</label>
                  <input name="nis" defaultValue={alumni.nis} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Thn Masuk</label>
                  <input name="entryYear" type="number" defaultValue={alumni.entryYear} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Thn Keluar</label>
                  <input name="graduationYear" type="number" defaultValue={alumni.graduationYear || ''} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Angkatan Mtk.</label>
                  <input name="mutakhorijinBatch" type="number" defaultValue={alumni.mutakhorijinBatch || ''} className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Domisili</label>
                <textarea name="address" rows={2} defaultValue={alumni.address || ''} className="w-full px-3 py-2 border rounded-lg"></textarea>
              </div>

              <button type="submit" disabled={isPending} className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold flex justify-center gap-2 items-center">
                 {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}