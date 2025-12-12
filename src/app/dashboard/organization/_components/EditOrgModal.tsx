'use client'
import { useState, useActionState, useEffect } from 'react'
import { updateOrganization } from '@/app/actions/settings'
import { Pencil, X, Save, UploadCloud, Loader2 } from 'lucide-react'

export default function EditOrgModal({ org, students, staff }: { org: any, students: any[], staff: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(updateOrganization, null)
  const [preview, setPreview] = useState<string | null>(org.logo)

  useEffect(() => { if (state?.success) { setIsOpen(false); alert(state.message) } }, [state])
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(file) setPreview(URL.createObjectURL(file))
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-orange-500 hover:bg-orange-50 p-2 rounded-lg"><Pencil size={16}/></button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between bg-gray-50"><h3 className="font-bold">Edit Organisasi</h3><button onClick={()=>setIsOpen(false)}><X size={20}/></button></div>
            <form action={formAction} className="p-6 space-y-4">
              <input type="hidden" name="id" value={org.id} />
              <input type="hidden" name="oldLogoUrl" value={org.logo || ''} />

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold mb-1 block">Nama</label><input name="name" defaultValue={org.name} className="w-full border p-2 rounded"/></div>
                <div><label className="text-xs font-bold mb-1 block">Kategori</label>
                  <select name="category" defaultValue={org.category} className="w-full border p-2 rounded">
                    <option value="KEILMUAN">Keilmuan</option><option value="KESENIAN">Kesenian</option>
                  </select>
                </div>
              </div>
              
              <div><label className="text-xs font-bold mb-1 block">Deskripsi</label><textarea name="description" defaultValue={org.description} rows={2} className="w-full border p-2 rounded"/></div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold mb-1 block">Ketua</label>
                  <select name="leaderId" defaultValue={org.leaderId || ''} className="w-full border p-2 rounded">
                    <option value="">-- Kosong --</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div><label className="text-xs font-bold mb-1 block">Pembimbing</label>
                  <select name="advisorId" defaultValue={org.advisorId || ''} className="w-full border p-2 rounded">
                    <option value="">-- Kosong --</option>{staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                 <div className="relative w-16 h-16 border rounded flex items-center justify-center overflow-hidden">
                    {preview ? <img src={preview} className="h-full object-contain"/> : <UploadCloud size={16}/>}
                    <input type="file" name="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
                 </div>
                 <div className="flex-1"><label className="text-xs font-bold mb-1 block">Urutan</label><input name="order" type="number" defaultValue={org.order} className="w-full border p-2 rounded"/></div>
              </div>

              <button disabled={isPending} className="w-full bg-orange-600 text-white p-2 rounded font-bold">{isPending ? <Loader2 className="animate-spin mx-auto"/> : 'Simpan Perubahan'}</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}