'use client'

import { useState, useActionState, useEffect } from 'react'
import { MoreVertical, XCircle, AlertTriangle, Lock } from 'lucide-react'
import { mutateStudent } from '@/app/actions/student-mutation'

// Terima props permission
export default function StudentAction({ student, canMutate }: { student: any, canMutate: boolean }) {
  const [isOpen, setIsOpen] = useState(false) 
  const [modalOpen, setModalOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(mutateStudent, null)

  useEffect(() => {
    if (state?.success) {
      setModalOpen(false)
      setIsOpen(false)
      alert(state.message) // Tambahkan alert feedback
    } else if (state?.message) {
      alert(state.message)
    }
  }, [state])

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden py-1">
            
            {/* CEK IZIN DI UI: Jika tidak punya izin, tombol dimatikan/disembunyikan */}
            {canMutate ? (
              <button 
                onClick={() => { setModalOpen(true); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold flex items-center gap-2"
              >
                <XCircle size={16} />
                Non-aktifkan / Alumni
              </button>
            ) : (
              <div className="w-full text-left px-4 py-3 text-sm text-gray-400 font-medium flex items-center gap-2 cursor-not-allowed bg-gray-50">
                <Lock size={16} />
                Akses Terkunci
              </div>
            )}
            
            {/* Tombol edit atau menu lain bisa ditaruh disini */}
          </div>
        </>
      )}

      {/* Modal Mutasi hanya dirender jika punya izin */}
      {modalOpen && canMutate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden p-6">
            <div className="flex items-center gap-3 mb-4 text-yellow-600">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-extrabold text-gray-900">Konfirmasi Status</h3>
            </div>
            
            <p className="text-gray-600 mb-6 text-sm">
              Anda akan menonaktifkan santri <strong>{student.name}</strong>. 
              Pilih status akhirnya:
            </p>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="studentId" value={student.id} />
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Aksi</label>
                <select 
                  name="statusType" 
                  className="w-full p-2 border rounded-lg font-medium" 
                  required
                  onChange={(e) => {
                     const label = document.getElementById('numberLabel')
                     if(label) {
                       label.innerText = e.target.value === 'MUTAKHORIJIN' 
                         ? 'Angkatan Mutakhorijin Ke-' 
                         : 'Tahun Keluar / Boyong'
                     }
                  }}
                >
                  <option value="MUTAKHORIJIN">Lulus (Pindah ke Mutakhorijin)</option>
                  <option value="DROPOUT">Boyong / Berhenti (Pindah ke Alumni)</option>
                </select>
              </div>

              <div>
                <label id="numberLabel" className="block text-sm font-bold text-gray-700 mb-2">
                  Angkatan Mutakhorijin Ke-
                </label>
                <input 
                  type="number" 
                  name="inputNumber" 
                  defaultValue={new Date().getFullYear()}
                  className="w-full p-2 border rounded-lg font-medium" 
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="flex-1 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-red-300"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}