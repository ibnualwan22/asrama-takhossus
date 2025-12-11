// src/app/dashboard/gallery/_components/DeleteMediaButton.tsx
'use client'

import { Trash2 } from "lucide-react"
import { deleteMedia } from "@/app/actions/gallery"

export default function DeleteMediaButton({ id, albumId }: { id: string, albumId: string }) {
  return (
    <button
      onClick={async () => {
        if (confirm('Hapus media ini?')) {
          await deleteMedia(id, albumId)
        }
      }}
      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm hover:bg-red-700"
      title="Hapus"
    >
      <Trash2 size={16} />
    </button>
  )
}