'use client'

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { createRole } from "@/app/actions/role"
import RoleCard from "./RoleCard"

export default function RoleManager({ roles, allPermissions }: { roles: any[], allPermissions: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAddRole(formData: FormData) {
    setLoading(true)
    await createRole(formData)
    setLoading(false)
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
           {/* Judul di handle di page.tsx */}
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm shadow transition"
        >
          <Plus size={18} /> Buat Role Baru
        </button>
      </div>

      {/* GRID ROLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {roles.map((role) => (
            <RoleCard key={role.id} role={role} allPermissions={allPermissions} />
        ))}
      </div>

      {/* MODAL TAMBAH ROLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Tambah Role</h3>
                    <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
                </div>
                <form action={handleAddRole} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-700 block mb-1">Nama Role</label>
                        <input name="name" type="text" className="w-full border rounded p-2 text-sm" placeholder="Contoh: Musyrif" required />
                    </div>
                    <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                </form>
            </div>
        </div>
      )}
    </>
  )
}