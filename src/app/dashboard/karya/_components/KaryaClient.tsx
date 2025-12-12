'use client'

import { useState } from "react"
import { Plus, Trash2, Edit, Eye, BookOpen } from "lucide-react"
import { deleteKarya } from "@/app/actions/karya"
import KaryaModal from "./KaryaModal"
import KaryaDetail from "./KaryaDetail"

export default function KaryaClient({ dataKarya }: { dataKarya: any[] }) {
  const [modalType, setModalType] = useState<'add' | 'edit' | 'detail' | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const openAdd = () => { setSelectedItem(null); setModalType('add'); }
  const openEdit = (item: any) => { setSelectedItem(item); setModalType('edit'); }
  const openDetail = (item: any) => { setSelectedItem(item); setModalType('detail'); }
  const closeModal = () => { setModalType(null); setSelectedItem(null); }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Karya Asrama</h1>
          <p className="text-gray-500 text-sm">Daftar kitab dan karya tulis hasil santri.</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow-sm transition">
          <Plus size={18} /> Tambah Karya
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dataKarya.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col overflow-hidden group">
            
            {/* Cover Image Area */}
            <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center p-4">
              {item.image ? (
                <img src={item.image} alt={item.title} className="h-full w-auto object-contain shadow-sm group-hover:scale-105 transition duration-300" />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                    <BookOpen size={32} />
                    <span className="text-xs mt-2">No Cover</span>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3rem]" title={item.title}>
                {item.title}
              </h3>
              <p className="text-sm text-blue-600 font-medium mb-1">{item.author}</p>
              <p className="text-xs text-gray-500 mb-4">{item.year}</p>
              
              <div className="mt-auto flex gap-2 pt-3 border-t">
                 <button onClick={() => openDetail(item)} className="flex-1 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded text-center transition">
                    Detail
                 </button>
                 <button onClick={() => openEdit(item)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition" title="Edit">
                    <Edit size={16} />
                 </button>
                 <button 
  onClick={async () => {
    if (confirm("Apakah Anda yakin ingin menghapus karya ini?")) {
      await deleteKarya(item.id)
    }
  }}
  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" 
  title="Hapus"
>
    <Trash2 size={16} />
</button>
              </div>
            </div>
          </div>
        ))}
        
        {dataKarya.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed rounded-xl">
                Belum ada data karya yang ditambahkan.
            </div>
        )}
      </div>

      <KaryaModal 
        isOpen={modalType === 'add' || modalType === 'edit'} 
        onClose={closeModal} 
        existingData={selectedItem}
      />
      
      <KaryaDetail 
        isOpen={modalType === 'detail'} 
        onClose={closeModal} 
        data={selectedItem}
      />
    </>
  )
}