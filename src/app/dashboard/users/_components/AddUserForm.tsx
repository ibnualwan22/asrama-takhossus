// src/app/dashboard/users/_components/AddUserForm.tsx
'use client'

import { useState, useActionState, useEffect } from 'react'
import { createUser } from '@/app/actions/user'
import { Plus, X } from 'lucide-react'

export default function AddUserForm({ roles }: { roles: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  
  // PERBAIKAN: Gunakan useActionState (Standard React 19/Next 15)
  // [state, actionFunction, isPending]
  const [state, formAction, isPending] = useActionState(createUser, null)

  // Efek Samping: Pantau jika state berubah sukses, baru tutup modal
  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
      // Opsional: Reset form atau beri notifikasi toast
    }
  }, [state])

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
      >
        <Plus size={18} /> Tambah Admin
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-extrabold text-lg text-gray-800">Tambah User Baru</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                type="button"
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Hubungkan formAction ke sini */}
            <form action={formAction} className="p-6 space-y-4">
              
              {/* Tampilkan Pesan Error/Sukses jika ada */}
              {state?.message && !state.success && (
                <div className="bg-red-100 text-red-700 p-3 rounded text-sm font-bold">
                  {state.message}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                <input name="name" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium" />
                {state?.error?.name && <p className="text-red-500 text-xs mt-1">{state.error.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                <input name="username" type="text" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium" />
                {state?.error?.username && <p className="text-red-500 text-xs mt-1">{state.error.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                <input name="password" type="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium" />
                {state?.error?.password && <p className="text-red-500 text-xs mt-1">{state.error.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                <select name="roleId" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-medium">
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors disabled:bg-blue-300 flex justify-center"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}