'use client'

import { useState, useActionState, useEffect } from 'react'
import { updateMutakhorijin } from '@/app/actions/mutakhorijin'
import { Pencil, X, Save, Loader2 } from 'lucide-react'

export default function EditMutakhorijinModal({ student }: { student: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(updateMutakhorijin, null)

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
      alert(state.message)
    }
  }, [state])

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg" title="Edit Data">
        <Pencil size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between bg-gray-50">
              <h3 className="font-bold text-lg">Edit Mutakhorijin</h3>
              <button onClick={() => setIsOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form action={formAction} className="p-6 space-y-4">
              <input type="hidden" name="id" value={student.id} />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama</label>
                  <input name="name" defaultValue={student.name} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">NIS</label>
                  <input name="nis" defaultValue={student.nis} required className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tahun Masuk</label>
                  <input name="entryYear" type="number" defaultValue={student.entryYear} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Angkatan Mutakhorijin</label>
                  <input name="mutakhorijinBatch" type="number" defaultValue={student.mutakhorijinBatch || ''} required className="w-full px-3 py-2 border rounded-lg font-bold text-purple-700" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Domisili</label>
                <textarea name="address" rows={2} defaultValue={student.address || ''} className="w-full px-3 py-2 border rounded-lg"></textarea>
              </div>

              <button type="submit" disabled={isPending} className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold flex justify-center gap-2">
                 {isPending ? <Loader2 className="animate-spin" /> : <Save size={18} />} Simpan
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}