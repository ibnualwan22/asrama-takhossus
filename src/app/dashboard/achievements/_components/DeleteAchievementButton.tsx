'use client' // <--- WAJIB ADA

import { Trash2 } from "lucide-react"
import { deleteAchievement } from "@/app/actions/achievement"

export default function DeleteAchievementButton({ id }: { id: string }) {
  return (
    <form action={deleteAchievement.bind(null, id)}>
      <button 
        type="submit"
        className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-bold transition-colors"
        onClick={(e) => { 
          // Interaktivitas ini hanya bisa jalan di Client Component
          if(!confirm('Yakin ingin menghapus prestasi ini?')) {
            e.preventDefault() 
          }
        }}
      >
        <Trash2 size={14} /> Hapus
      </button>
    </form>
  )
}