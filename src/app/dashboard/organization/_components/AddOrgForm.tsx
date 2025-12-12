'use client'

import { useState, useActionState, useEffect } from 'react'
import { createOrganization } from '@/app/actions/settings'
import { Plus, X, UploadCloud, Loader2 } from 'lucide-react'

// Terima props students & staff
export default function AddOrgForm({ students, staff }: { students: any[], staff: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(createOrganization, null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (state?.success) { setIsOpen(false); setPreview(null); alert(state.message) }
  }, [state])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(file) setPreview(URL.createObjectURL(file))
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm">
        <Plus size={16} /> Tambah Organisasi
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between bg-gray-50">
              <h3 className="font-bold text-lg">Organisasi Baru</h3>
              <button onClick={() => setIsOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <form action={formAction} className="p-6 space-y-4 overflow-y-auto">
              
              {/* Nama & Kategori */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Organisasi</label>
                  <input name="name" required className="w-full px-3 py-2 border rounded-lg" placeholder="Contoh: Tim Hadroh" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                  <select name="category" className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="KEILMUAN">Keilmuan (Akademik)</option>
                    <option value="KESENIAN">Kesenian (Minat Bakat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi</label>
                <textarea name="description" rows={2} required className="w-full px-3 py-2 border rounded-lg"></textarea>
              </div>

              {/* Ketua & Pembimbing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Ketua (Santri)</label>
                  <select name="leaderId" className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="">-- Pilih Santri --</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pembimbing</label>
                  <select name="advisorId" className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="">-- Pilih Pengurus --</option>
                    {staff.length === 0 && <option disabled>Data Pengurus Kosong</option>}
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Logo & Urutan */}
              <div className="flex gap-4">
                <div className="w-24 shrink-0">
                   <label className="block text-xs font-bold text-gray-700 mb-1">Logo</label>
                   <div className="relative border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center bg-gray-50 overflow-hidden">
                      {preview ? <img src={preview} className="h-full object-contain"/> : <UploadCloud size={20} className="text-gray-400"/>}
                      <input type="file" name="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
                   </div>
                </div>
                <div className="flex-1">
                   <label className="block text-xs font-bold text-gray-700 mb-1">Urutan Tampil</label>
                   <input name="order" type="number" defaultValue={0} className="w-full px-3 py-2 border rounded-lg" />
                   <p className="text-[10px] text-gray-400 mt-1">Semakin kecil angkanya, semakin di atas posisinya.</p>
                </div>
              </div>

              <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">
                {isPending ? <Loader2 className="animate-spin mx-auto"/> : 'Simpan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}