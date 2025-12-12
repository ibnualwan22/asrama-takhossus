'use client'

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { addStaff } from "@/app/actions/structure"

// Definisikan tipe data props
type Props = {
  candidates: {
    id: string
    name: string
    mutakhorijinBatch: number | null
  }[]
}

export default function AddStaffForm({ candidates }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [source, setSource] = useState<'database' | 'manual'>('database')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    await addStaff(formData)
    setIsLoading(false)
    setIsOpen(false) // Tutup modal setelah simpan
  }

  return (
    <>
      {/* Tombol Trigger Modal */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-colors"
      >
        <Plus size={18} /> Tambah Pengurus
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-800">Tambah Struktur Baru</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form action={handleSubmit} className="p-4 space-y-4">
              
              {/* Toggle Source */}
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSource("database")}
                  className={`flex-1 text-sm py-1.5 rounded-md font-medium transition ${source === 'database' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                >
                  Mutakhorijin
                </button>
                <button
                  type="button"
                  onClick={() => setSource("manual")}
                  className={`flex-1 text-sm py-1.5 rounded-md font-medium transition ${source === 'manual' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                >
                  Input Manual
                </button>
                <input type="hidden" name="source" value={source} />
              </div>

              {/* Input Conditional */}
              {source === 'database' ? (
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Pilih Alumni</label>
                  <select name="studentId" className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">-- Cari Nama --</option>
                    {candidates.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.mutakhorijinBatch ? `(Angk. ${c.mutakhorijinBatch})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Nama Lengkap</label>
                  <input type="text" name="manualName" className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama pengurus..." />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Jabatan</label>
                <input type="text" name="position" required className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Ketua Asrama" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">URL Foto (Opsional)</label>
                <input type="text" name="photoUrl" className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                <p className="text-xs text-gray-400">Biarkan kosong jika ingin menggunakan foto database (jika ada).</p>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition mt-2"
              >
                {isLoading ? "Menyimpan..." : "Simpan Data"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}