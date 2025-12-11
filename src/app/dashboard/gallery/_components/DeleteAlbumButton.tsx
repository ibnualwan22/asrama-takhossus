// src/app/dashboard/gallery/_components/DeleteAlbumButton.tsx
'use client' // <--- Wajib pakai ini agar bisa pakai onClick/confirm

import { Trash2 } from "lucide-react"
import { deleteAlbum } from "@/app/actions/gallery"

export default function DeleteAlbumButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        // Panggil server action langsung dari sini
        await deleteAlbum(id)
      }}
      onSubmit={(e) => {
        // Konfirmasi sebelum submit
        if (!confirm('Yakin hapus album ini beserta isinya?')) {
          e.preventDefault()
        }
      }}
    >
      <button 
        type="submit"
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Hapus Album"
      >
        <Trash2 size={18} />
      </button>
    </form>
  )
}