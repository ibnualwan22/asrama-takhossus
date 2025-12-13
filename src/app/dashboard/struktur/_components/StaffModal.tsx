'use client'

import { useState, useEffect } from "react"
import { X, Upload, Save, CalendarRange } from "lucide-react"
import { saveStaff } from "@/app/actions/structure"

type Props = {
  isOpen: boolean
  onClose: () => void
  candidates: any[]
  existingData?: any
  defaultYear?: number
}

export default function StaffModal({ isOpen, onClose, candidates, existingData, defaultYear }: Props) {
  const [source, setSource] = useState<'database' | 'manual'>('database')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (existingData) {
      setSource(existingData.studentId ? 'database' : 'manual')
      setPreview(existingData.photo || existingData.student?.photo || null)
    } else {
      setSource('database')
      setPreview(null)
    }
  }, [existingData, isOpen])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await saveStaff(formData)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <h3 className="font-bold text-lg text-gray-800">
            {existingData ? "Edit Pengurus" : "Tambah Pengurus Baru"}
          </h3>
          <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
        </div>

        <div className="overflow-y-auto p-6">
          <form action={handleSubmit} className="space-y-5">
            {existingData && <input type="hidden" name="id" value={existingData.id} />}

            {/* Sumber Data Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button type="button" onClick={() => setSource("database")} className={`flex-1 text-sm py-2 rounded-md font-medium transition ${source === 'database' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Mutakhorijin</button>
              <button type="button" onClick={() => setSource("manual")} className={`flex-1 text-sm py-2 rounded-md font-medium transition ${source === 'manual' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Manual Input</button>
              <input type="hidden" name="source" value={source} />
            </div>

            {/* Input Nama */}
            {source === 'database' ? (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Pilih Alumni</label>
                <select name="studentId" defaultValue={existingData?.studentId || ""} className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Cari Nama --</option>
                  {candidates.map((c) => (<option key={c.id} value={c.id}>{c.name} {c.mutakhorijinBatch ? `(Angk. ${c.mutakhorijinBatch})` : ''}</option>))}
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Nama Lengkap</label>
                <input type="text" name="manualName" defaultValue={existingData?.name || ""} className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500" placeholder="Nama pengurus..." />
              </div>
            )}

            {/* Jabatan & Urutan */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-700">Jabatan</label>
                <input type="text" name="position" required defaultValue={existingData?.position || ""} className="w-full border rounded-lg p-3 text-sm" placeholder="Contoh: Ketua" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Urutan</label>
                <input type="number" name="order" defaultValue={existingData?.order || 0} className="w-full border rounded-lg p-3 text-sm" />
              </div>
            </div>
            <div className="space-y-1">
  <label className="text-xs font-bold text-gray-700">Nomor WhatsApp (Opsional)</label>
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">+62</span>
    <input 
      type="text" 
      name="whatsapp" 
      defaultValue={existingData?.whatsapp?.replace(/^62/, '') || ""} 
      className="w-full border rounded-lg p-3 pl-12 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
      placeholder="8123xxxx (Langsung terhubung)" 
    />
  </div>
  <p className="text-[10px] text-gray-400">Nomor ini akan menjadi tombol "Hubungi" di halaman depan.</p>
</div>

            {/* --- INPUT MASA BAKTI (BARU) --- */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-3">
               <div className="flex items-center gap-2 text-blue-800 mb-1">
                  <CalendarRange size={16} />
                  <span className="text-xs font-extrabold uppercase">Masa Bakti</span>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1 block">Tahun Mulai</label>
                    <input type="number" name="periodStart" defaultValue={existingData?.periodStart || defaultYear} required className="w-full border border-blue-200 rounded-lg p-2 text-sm font-bold text-blue-900" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1 block">Selesai (Opsional)</label>
                    <input type="number" name="periodEnd" defaultValue={existingData?.periodEnd || ""} placeholder="Masih aktif..." className="w-full border border-blue-200 rounded-lg p-2 text-sm" />
                  </div>
               </div>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isActive" defaultChecked={existingData ? existingData.isActive : true} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-xs font-bold text-gray-700">Status Aktif Menjabat</span>
               </label>
            </div>

            {/* Upload Foto */}
            <div className="flex items-center gap-4 border-t pt-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                {preview ? <img src={preview} className="w-full h-full object-cover" /> : <div className="text-[10px] flex items-center justify-center h-full">No Img</div>}
              </div>
              <input type="file" name="file" accept="image/*" onChange={handleFileChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>

            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
              {loading ? "Menyimpan..." : <><Save size={18} /> Simpan Data</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}