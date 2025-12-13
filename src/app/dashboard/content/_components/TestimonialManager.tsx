'use client'

import { useState, useActionState, useEffect } from 'react'
import { createTestimonial, deleteTestimonial } from '@/app/actions/testimonial'
import { Trash2, Upload, Loader2, MessageSquareQuote } from 'lucide-react'

export default function TestimonialManager({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData)
  const [state, formAction, isPending] = useActionState(createTestimonial, null)

  useEffect(() => {
    if(state?.success) { 
        alert(state.message); 
        window.location.reload(); 
    }
  }, [state])

  const handleDelete = async (id: string) => {
    if(confirm('Hapus testimoni ini?')) {
       await deleteTestimonial(id)
       setData(data.filter(item => item.id !== id))
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 mb-4">
         <div className="p-2 bg-green-100 text-green-600 rounded-lg"><MessageSquareQuote size={20}/></div>
         <h2 className="text-lg font-bold">Manajemen Testimoni</h2>
      </div>

      {/* Form Upload */}
      <form action={formAction} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-lg border border-dashed">
         <div>
            <label className="text-xs font-bold block mb-1">Nama</label>
            <input name="name" required className="w-full border p-2 rounded text-sm" placeholder="Nama Wali/Alumni"/>
         </div>
         <div>
            <label className="text-xs font-bold block mb-1">Role/Status</label>
            <input name="role" defaultValue="Wali Santri" className="w-full border p-2 rounded text-sm"/>
         </div>
         <div>
            <label className="text-xs font-bold block mb-1">Screenshot WA</label>
            <input type="file" name="file" required accept="image/*" className="w-full text-xs"/>
         </div>
         <button disabled={isPending} className="bg-green-600 text-white px-4 py-2 rounded font-bold text-sm w-full">
            {isPending ? 'Mengupload...' : 'Upload'}
         </button>
      </form>

      {/* List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((item) => (
            <div key={item.id} className="relative group border rounded-lg overflow-hidden">
               <img src={item.image} className="w-full h-32 object-cover" />
               <div className="p-2 bg-white">
                  <p className="font-bold text-xs truncate">{item.name}</p>
               </div>
               <button onClick={() => handleDelete(item.id)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                 <Trash2 size={12} />
               </button>
            </div>
        ))}
      </div>
    </div>
  )
}