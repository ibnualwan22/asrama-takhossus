'use client'

import { useState, useTransition } from "react"
import { Trash2, ShieldAlert, Check, Loader2 } from "lucide-react"
import { deleteRole, togglePermission } from "@/app/actions/role"

type Props = {
  role: any           // Data Role + Permissions yang dimiliki
  allPermissions: any[] // Daftar semua permission yang tersedia di DB
}

export default function RoleCard({ role, allPermissions }: Props) {
  const [isPending, startTransition] = useTransition()
  
  // Proteksi: Super Admin
  const isSuperAdmin = role.name === 'Super Admin'

  // Fungsi Handle Checkbox
  const handleToggle = (permissionId: string, currentStatus: boolean) => {
    // Jalankan server action di background tanpa refresh halaman penuh
    startTransition(async () => {
        await togglePermission(role.id, permissionId, !currentStatus)
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      
      {/* HEADER CARD */}
      <div className="p-5 border-b bg-gray-50 flex justify-between items-start rounded-t-xl">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            {role.name}
            {isSuperAdmin && <ShieldAlert size={16} className="text-red-600"/>}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-1">
             {role.permissions.length} Akses Diberikan
          </p>
        </div>

        {/* Tombol Hapus Role (Kecuali Super Admin) */}
        {!isSuperAdmin && (
            <button 
                onClick={async () => {
                    if(confirm("Hapus role ini? User dengan role ini akan kehilangan akses.")) {
                        await deleteRole(role.id)
                    }
                }}
                className="text-gray-400 hover:text-red-600 transition"
            >
                <Trash2 size={18} />
            </button>
        )}
      </div>

      {/* BODY CARD (CHECKLIST PERMISSION) */}
      <div className="p-2 flex-1 overflow-y-auto max-h-[400px]">
        {allPermissions.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-4">Belum ada data permission di database.</p>
        ) : (
            <div className="space-y-1">
                {allPermissions.map((perm) => {
                    // Cek apakah role ini punya permission ini
                    const isChecked = role.permissions.some((p: any) => p.id === perm.id)

                    return (
                        <label 
                            key={perm.id} 
                            className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all ${isChecked ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50 border border-transparent'}`}
                        >
                            <div className="relative flex items-center mt-0.5">
                                <input 
                                    type="checkbox" 
                                    checked={isChecked}
                                    disabled={isPending} // Disable saat loading
                                    onChange={() => handleToggle(perm.id, isChecked)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-blue-600 checked:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                                />
                                <Check size={12} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            
                            <div className="flex-1">
                                <p className={`text-sm font-semibold ${isChecked ? 'text-blue-800' : 'text-gray-700'}`}>
                                    {perm.action} 
                                    {/* Indikator Loading per item (opsional, tp complex) */}
                                </p>
                                {perm.description && (
                                    <p className="text-xs text-gray-500 leading-tight mt-0.5">{perm.description}</p>
                                )}
                            </div>
                        </label>
                    )
                })}
            </div>
        )}
      </div>

      {/* FOOTER (Loading Indicator) */}
      {isPending && (
          <div className="bg-blue-50 p-1 text-center text-xs text-blue-600 font-bold flex justify-center items-center gap-2 animate-pulse rounded-b-xl">
              <Loader2 size={12} className="animate-spin" /> Menyimpan Perubahan...
          </div>
      )}
    </div>
  )
}