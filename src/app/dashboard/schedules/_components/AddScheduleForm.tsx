'use client'

import { useState, useActionState, useEffect } from 'react'
import { createSchedule } from '@/app/actions/settings'
import { Plus, X } from 'lucide-react'

export default function AddScheduleForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createSchedule, null)

  useEffect(() => {
    if (state?.success) setIsOpen(false)
  }, [state])

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
        <Plus size={16} /> Tambah Jadwal
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Input Jadwal</h3>
              <button onClick={() => setIsOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <form action={formAction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Jam Mulai</label>
                  <input name="startTime" type="time" required className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Jam Selesai</label>
                  <input name="endTime" type="time" required className="w-full px-3 py-2 border rounded-lg font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Kegiatan</label>
                <input name="activity" type="text" required placeholder="Contoh: Sholat Subuh" className="w-full px-3 py-2 border rounded-lg" />
              </div>

              <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold disabled:bg-gray-300">
                {isPending ? 'Menyimpan...' : 'Simpan Jadwal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}