'use client'

import { useState, useActionState, useEffect } from 'react'
import { graduateMutakhorijin } from '@/app/actions/student-mutation'
import { LogOut, Loader2 } from 'lucide-react'

export default function MutakhorijinAction({ student }: { student: any }) {
  const [state, formAction, isPending] = useActionState(graduateMutakhorijin, null)
  
  const handleBoyong = async () => {
    if(confirm(`Apakah ${student.name} sudah resmi boyong dari asrama? Data akan dipindah ke menu Alumni.`)) {
      // Kita butuh trigger form action secara programatis atau bungkus dalam form
      // Cara paling mudah pakai button submit di dalam form invisible
    }
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="studentId" value={student.id} />
      <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
      Tahun Keluar Asrama (Boyong)
    </label>
    <input 
      type="number" 
      name="exitYear" // Pastikan namanya exitYear sesuai server action baru
      defaultValue={new Date().getFullYear()} 
      required
      className="w-full px-4 py-2 border rounded-lg font-bold text-lg focus:ring-2 focus:ring-purple-500"
    />
  </div>
      <button 
        type="submit" 
        disabled={isPending}
        onClick={(e) => {
           if(!confirm(`Jadikan ${student.name} sebagai Alumni (Sudah Boyong)?`)) e.preventDefault()
        }}
        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
        Boyong (Jadi Alumni)
      </button>
    </form>
  )
}