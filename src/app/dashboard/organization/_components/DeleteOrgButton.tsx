'use client' // <--- Wajib pakai ini

import { Trash2 } from "lucide-react"
import { deleteOrganization } from "@/app/actions/settings"

export default function DeleteOrgButton({ id }: { id: string }) {
  return (
    <form
      action={deleteOrganization.bind(null, id)}
      onSubmit={(e) => {
        // Konfirmasi di sisi Client (Browser)
        if (!confirm('Yakin ingin menghapus organisasi ini beserta riwayatnya?')) {
          e.preventDefault()
        }
      }}
    >
      <button 
        type="submit" 
        className="text-gray-400 hover:text-red-600 transition-colors p-1"
        title="Hapus Permanen"
      >
        <Trash2 size={16} />
      </button>
    </form>
  )
}