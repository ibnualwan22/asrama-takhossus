'use client'
import { useState, useActionState, useEffect } from 'react'
import { updateLeader } from '@/app/actions/settings'
import { Pencil, X, Save, UploadCloud, Loader2 } from 'lucide-react'

export default function EditLeaderModal({ leader }: { leader: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(updateLeader, null)
  const [preview, setPreview] = useState<string | null>(leader.photo)

  useEffect(() => { if (state?.success) { setIsOpen(false); alert(state.message) } }, [state])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(file) setPreview(URL.createObjectURL(file))
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-orange-500 hover:bg-orange-50 p-2 rounded-lg" title="Edit"><Pencil size={16}/></button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between bg-gray-50"><h3 className="font-bold">Edit Pimpinan</h3><button onClick={()=>setIsOpen(false)}><X size={20}/></button></div>
            <form action={formAction} className="p-6 space-y-4">
              <input type="hidden" name="id" value={leader.id} />
              <input type="hidden" name="oldPhotoUrl" value={leader.photo || ''} />

              <div><label className="block text-xs font-bold mb-1">Nama</label><input name="name" defaultValue={leader.name} className="w-full border p-2 rounded"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold mb-1">Mulai</label><input name="periodStart" type="number" defaultValue={leader.periodStart} className="w-full border p-2 rounded"/></div>
                <div><label className="block text-xs font-bold mb-1">Selesai</label><input name="periodEnd" type="number" defaultValue={leader.periodEnd || ''} className="w-full border p-2 rounded"/></div>
              </div>
              
              <div className="relative h-24 border-2 border-dashed rounded flex items-center justify-center bg-gray-50 overflow-hidden">
                 {preview ? <img src={preview} className="w-full h-full object-cover"/> : <UploadCloud className="text-gray-400"/>}
                 <input type="file" name="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
              </div>

              <div><label className="block text-xs font-bold mb-1">Bio</label><textarea name="bio" rows={3} defaultValue={leader.bio} className="w-full border p-2 rounded"/></div>
              <button disabled={isPending} className="w-full bg-orange-600 text-white p-2 rounded font-bold">{isPending ? <Loader2 className="animate-spin"/> : 'Simpan Perubahan'}</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}