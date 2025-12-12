'use client'

import { useState, useActionState, useEffect } from 'react'
import { createOrganization } from '@/app/actions/settings'
import { Plus, X, UploadCloud, Loader2 } from 'lucide-react'

export default function AddOrgForm({ students, staff }: { students: any[], staff: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  // useActionState: [state, action, isPending]
  const [state, formAction, isPending] = useActionState(createOrganization, null)
  const [preview, setPreview] = useState<string | null>(null)

  // Tutup modal jika sukses
  useEffect(() => {
    if (state?.success) { 
      setIsOpen(false)
      setPreview(null)
      alert(state.message) 
    } else if (state?.message) {
      alert(state.message)
    }
  }, [state])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) setPreview(URL.createObjectURL(file))
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow hover:bg-gray-800 transition"
      >
        <Plus size={16} /> Tambah Organisasi
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">Organisasi Baru</h3>
              <button onClick={() => setIsOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
            </div>

            <form action={formAction} className="p-6 space-y-4 overflow-y-auto">
              
              {/* Nama & Kategori */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Organisasi</label>
                  <input name="name" required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Tim Hadroh" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                  <select name="category" className="w-full px-3 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
                    <option value="KEILMUAN">Keilmuan (Akademik)</option>
                    <option value="KESENIAN">Kesenian (Minat Bakat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi</label>
                <textarea name="description" rows={2} required className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
              </div>

              {/* STRUKTUR & MASA BAKTI */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
                 <div className="text-xs font-extrabold text-blue-800 uppercase tracking-wide border-b border-blue-200 pb-2 mb-2">
                    Struktur Awal & Masa Bakti
                 </div>
                 
                 {/* Input Tahun Periode */}
                 <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Tahun Periode</label>
                    <input 
                      name="periodStart" 
                      type="number" 
                      defaultValue={new Date().getFullYear()} 
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg font-bold text-blue-900 focus:ring-2 focus:ring-blue-500" 
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Ketua (Santri)</label>
                      <select name="leaderId" className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Pilih Santri --</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Pembimbing</label>
                      <select name="advisorId" className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500">
                        <option value="">-- Pilih Pengurus --</option>
                        {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                 </div>
              </div>

              {/* Logo & Urutan */}
              <div className="flex gap-4 items-start pt-2">
                <div className="w-24 shrink-0">
                   <label className="block text-xs font-bold text-gray-700 mb-1">Logo</label>
                   <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center bg-gray-50 overflow-hidden hover:bg-gray-100 transition">
                      {preview ? <img src={preview} className="h-full w-full object-contain"/> : <UploadCloud size={20} className="text-gray-400"/>}
                      <input type="file" name="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
                   </div>
                </div>
                <div className="flex-1">
                   <label className="block text-xs font-bold text-gray-700 mb-1">Urutan Tampil</label>
                   <input name="order" type="number" defaultValue={0} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                   <p className="text-[10px] text-gray-400 mt-1">Semakin kecil angkanya, semakin di atas posisinya.</p>
                </div>
              </div>

              <button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 mt-2 transition disabled:bg-blue-300">
                {isPending ? <Loader2 className="animate-spin" size={18}/> : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}