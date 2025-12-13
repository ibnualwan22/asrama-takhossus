'use client'

import { useState, useActionState, useEffect } from 'react'
import { GraduationCap, Lock, CheckCircle2 } from 'lucide-react'
import { graduateMutakhorijin } from '@/app/actions/mutakhorijin'

export default function GraduateButton({ student, canMutate }: { student: any, canMutate: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(graduateMutakhorijin, null)

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
      alert(state.message)
    }
  }, [state])

  // KUNCI JIKA TIDAK ADA IZIN
  if (!canMutate) {
    return (
      <button disabled className="p-2 text-gray-300 cursor-not-allowed" title="Akses Dikunci">
        <Lock size={18} />
      </button>
    )
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
        title="Jadikan Alumni (Lulus)"
      >
        <GraduationCap size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Konfirmasi Kelulusan</h3>
            <p className="text-sm text-gray-600 mb-4">
              Apakah <strong>{student.name}</strong> sudah resmi boyong/lulus tahun ini?
            </p>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="studentId" value={student.id} />
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tahun Lulus / Boyong</label>
                <input 
                  name="graduationYear" 
                  type="number" 
                  defaultValue={new Date().getFullYear()} 
                  className="w-full px-3 py-2 border rounded-lg font-bold text-purple-700"
                />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold text-sm">Batal</button>
                <button type="submit" disabled={isPending} className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm flex justify-center items-center gap-2">
                   {isPending ? 'Menyimpan...' : <><CheckCircle2 size={16}/> Sahkan Alumni</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}