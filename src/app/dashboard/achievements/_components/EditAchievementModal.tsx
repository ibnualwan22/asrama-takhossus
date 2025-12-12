'use client'
import { useState, useActionState, useEffect } from 'react'
import { updateAchievement } from '@/app/actions/achievement'
import { Pencil, X, UploadCloud, Loader2 } from 'lucide-react'

export default function EditAchievementModal({ item, students }: { item: any, students: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(updateAchievement, null)
  
  // State
  const [category, setCategory] = useState(item.studentId ? 'SANTRI' : 'ASRAMA')
  const [preview, setPreview] = useState<string | null>(item.photo)

  useEffect(() => { if (state?.success) { setIsOpen(false); alert(state.message) } }, [state])

  // Handle Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-bold"><Pencil size={14}/> Edit</button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b flex justify-between bg-gray-50"><h3 className="font-bold">Edit Prestasi</h3><button onClick={()=>setIsOpen(false)}><X size={20}/></button></div>
            
            <form action={formAction} className="p-6 space-y-4">
              <input type="hidden" name="id" value={item.id} />
              
              {/* INPUT PENTING: URL FOTO LAMA */}
              <input type="hidden" name="oldPhotoUrl" value={item.photo || ''} />
              
              <input type="hidden" name="category" value={category} />

              <div className="text-sm font-bold text-gray-500 bg-gray-100 p-2 rounded text-center">
                Kategori: {category === 'SANTRI' ? 'Individu' : 'Lembaga'}
              </div>

              {category === 'SANTRI' && (
                <div>
                  <label className="block text-xs font-bold mb-1">Santri</label>
                  <select name="studentId" defaultValue={item.studentId} className="w-full border p-2 rounded">
                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}

              <div><label className="block text-xs font-bold mb-1">Judul</label><input name="title" defaultValue={item.title} className="w-full border p-2 rounded"/></div>
              
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-xs font-bold mb-1">Tingkat</label><select name="level" defaultValue={item.level} className="w-full border p-2 rounded"><option>Kecamatan</option><option>Kabupaten</option><option>Provinsi</option><option>Nasional</option></select></div>
                <div><label className="block text-xs font-bold mb-1">Tahun</label><input name="year" type="number" defaultValue={item.year} className="w-full border p-2 rounded"/></div>
              </div>

              {/* Upload Foto (Optional saat Edit) */}
              <div className="relative h-32 border-2 border-dashed rounded flex items-center justify-center bg-gray-50 overflow-hidden group">
                 {preview ? <img src={preview} className="w-full h-full object-cover"/> : <UploadCloud className="text-gray-400"/>}
                 <input type="file" name="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
                 
                 {/* Overlay Text */}
                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 text-white font-bold transition-opacity pointer-events-none">
                    Klik untuk ganti
                 </div>
              </div>

              <button disabled={isPending} className="w-full bg-blue-600 text-white p-2 rounded font-bold flex justify-center gap-2">
                {isPending ? <Loader2 className="animate-spin"/> : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}