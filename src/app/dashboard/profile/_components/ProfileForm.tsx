'use client'

import { useActionState, useEffect, useRef } from 'react'
import { changePassword } from '@/app/actions/profile'
import { User, Shield, KeyRound, Loader2, Save } from 'lucide-react'

export default function ProfileForm({ user }: { user: any }) {
  const [state, formAction, isPending] = useActionState(changePassword, null)
  const formRef = useRef<HTMLFormElement>(null)

  // Reset form jika sukses
  useEffect(() => {
    if (state?.success) {
      alert(state.message)
      formRef.current?.reset()
    }
  }, [state])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* KARTU 1: INFO PROFIL (Read Only) */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm font-medium">@{user.username}</p>
            
            <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 uppercase tracking-wide">
                    <Shield size={14} /> {user.role?.name || "User"}
                </span>
            </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                <User size={16}/> Detail Akun
            </h4>
            <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between border-b border-blue-100 pb-1">
                    <span>Terdaftar:</span>
                    <span className="font-mono">{new Date(user.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-bold text-green-600">Aktif</span>
                </div>
            </div>
        </div>
      </div>

      {/* KARTU 2: GANTI PASSWORD */}
      <div className="md:col-span-2">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                    <KeyRound size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Ganti Password</h3>
                    <p className="text-gray-500 text-sm">Amankan akun Anda dengan password yang kuat.</p>
                </div>
            </div>

            <form ref={formRef} action={formAction} className="space-y-5">
                <input type="hidden" name="userId" value={user.id} />

                {/* Alert Error General */}
                {state?.message && !state.success && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-100">
                        {state.message}
                    </div>
                )}

                {/* Password Lama */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password Saat Ini</label>
                    <input 
                        name="currentPassword" 
                        type="password" 
                        required 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {state?.error?.currentPassword && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{state.error.currentPassword}</p>
                    )}
                </div>

                <hr className="border-gray-100" />

                {/* Password Baru */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password Baru</label>
                        <input 
                            name="newPassword" 
                            type="password" 
                            required 
                            minLength={6}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                         {state?.error?.newPassword && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{state.error.newPassword}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Konfirmasi Password Baru</label>
                        <input 
                            name="confirmPassword" 
                            type="password" 
                            required 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                         {state?.error?.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{state.error.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isPending} 
                        className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition disabled:bg-gray-400"
                    >
                        {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isPending ? 'Memproses...' : 'Simpan Password Baru'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}