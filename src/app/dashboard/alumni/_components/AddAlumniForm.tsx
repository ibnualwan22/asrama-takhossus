'use client'

import { useState, useActionState, useEffect } from 'react'
import { createManualAlumni } from '@/app/actions/alumni'
import { Plus, X, Save, Loader2, Lock } from 'lucide-react'

// Terima prop permission
export default function AddAlumniForm({ canCreate }: { canCreate: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createManualAlumni, null)

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
      alert(state.message)
    } else if (state?.message) {
      alert(state.message)
    }
  }, [state])

  // JIKA TIDAK PUNYA IZIN CREATE
  if (!canCreate) {
    return (
      <button 
        disabled 
        className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm cursor-not-allowed"
        title="Anda tidak memiliki izin menambah data"
      >
        <Lock size={16} /> Tambah
      </button>
    )
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-colors shadow-sm"
      >
        <Plus size={18} /> Tambah Manual
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Tambah Alumni Manual</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form action={formAction} className="p-6 space-y-4 overflow-y-auto">
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800 mb-2">
                <strong>Info:</strong> Fitur ini untuk menambahkan alumni lama yang datanya tidak ada di SIGAP.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap</label>
                  <input name="name" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nama..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">NIS (Manual)</label>
                  <input name="nis" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Contoh: ALM001" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tahun Masuk</label>
                  <input name="entryYear" type="number" defaultValue={2018} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tahun Keluar/Lulus</label>
                  <input name="graduationYear" type="number" defaultValue={2024} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Status Akhir</label>
                <select name="status" className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
                  <option value="ALUMNI_GRADUATED">Lulus (Mutakhorijin)</option>
                  <option value="ALUMNI_DROPOUT">Boyong / Berhenti</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Alamat Domisili</label>
                <textarea name="address" rows={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Alamat saat ini..."></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isPending} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 mt-2 transition disabled:bg-blue-300"
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Simpan Data
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}