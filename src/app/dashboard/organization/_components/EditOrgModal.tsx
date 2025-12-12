'use client'

import { useState, useActionState, useEffect } from 'react'
import { updateOrganization } from '@/app/actions/settings'
import { Pencil, X, UploadCloud, Loader2 } from 'lucide-react'

export default function EditOrgModal({ org, students, staff }: { org: any, students: any[], staff: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(updateOrganization, null)
  const [preview, setPreview] = useState<string | null>(org.logo)

  useEffect(() => { 
    if (state?.success) { 
      setIsOpen(false)
      alert(state.message) 
    } 
  }, [state])
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file) setPreview(URL.createObjectURL(file))
  }

  // AMBIL DATA STRUKTUR SAAT INI (HISTORY[0])
  // Karena di server kita sudah sort/filter history yang aktif
  const currentStruct = org.history?.[0] || {}

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors" 
        title="Edit Organisasi"
      >
        <Pencil size={18}/>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b flex justify-between bg-gray-50 items-center">
              <h3 className="font-bold text-lg text-gray-800">Edit Organisasi</h3>
              <button onClick={()=>setIsOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
            </div>

            <form action={formAction} className="p-6 space-y-4 overflow-y-auto">
              <input type="hidden" name="id" value={org.id} />
              <input type="hidden" name="oldLogoUrl" value={org.logo || ''} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold mb-1 block text-gray-700">Nama</label>
                  <input name="name" defaultValue={org.name} className="w-full border p-2 rounded-lg" />
                </div>
                <div>
                  <label className="text-xs font-bold mb-1 block text-gray-700">Kategori</label>
                  <select name="category" defaultValue={org.category} className="w-full border p-2 rounded-lg bg-white">
                    <option value="KEILMUAN">Keilmuan</option>
                    <option value="KESENIAN">Kesenian</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold mb-1 block text-gray-700">Deskripsi</label>
                <textarea name="description" defaultValue={org.description} rows={2} className="w-full border p-2 rounded-lg"/>
              </div>

              {/* AREA UPDATE STRUKTUR */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 space-y-3">
                <div className="text-xs font-extrabold text-yellow-800 uppercase tracking-wide border-b border-yellow-200 pb-2 mb-2">
                    Update Struktur Aktif
                </div>

                {/* Input Tahun Periode */}
                <div>
                    <label className="text-xs font-bold mb-1 block text-yellow-900">Tahun Periode</label>
                    <input 
                      name="periodStart" 
                      type="number" 
                      defaultValue={currentStruct.periodStart || new Date().getFullYear()} 
                      className="w-full border border-yellow-300 p-2 rounded-lg font-bold text-yellow-900 bg-white focus:ring-2 focus:ring-yellow-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold mb-1 block text-yellow-900">Ketua</label>
                    <select name="leaderId" defaultValue={currentStruct.leaderId || ''} className="w-full border border-yellow-300 p-2 rounded-lg bg-white">
                        <option value="">-- Kosong --</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1 block text-yellow-900">Pembimbing</label>
                    <select name="advisorId" defaultValue={currentStruct.advisorId || ''} className="w-full border border-yellow-300 p-2 rounded-lg bg-white">
                        <option value="">-- Kosong --</option>
                        {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-center pt-2">
                 <div className="relative w-16 h-16 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition">
                    {preview ? <img src={preview} className="h-full w-full object-contain"/> : <UploadCloud size={16} className="text-gray-400"/>}
                    <input type="file" name="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
                 </div>
                 <div className="flex-1">
                    <label className="text-xs font-bold mb-1 block text-gray-700">Urutan</label>
                    <input name="order" type="number" defaultValue={org.order} className="w-full border p-2 rounded-lg"/>
                 </div>
              </div>

              <button disabled={isPending} className="w-full bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-lg font-bold flex justify-center gap-2 items-center transition disabled:bg-orange-300">
                {isPending ? <Loader2 className="animate-spin" size={18}/> : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}