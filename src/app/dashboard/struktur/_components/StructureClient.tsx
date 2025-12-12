'use client'

import { useState } from "react"
import { Plus, Trash2, Edit, Eye } from "lucide-react"
import { deleteStaff } from "@/app/actions/structure"
import StaffModal from "./StaffModal"
import DetailModal from "./DetailModal"

type Props = {
  staffList: any[]
  candidates: any[]
}

export default function StructureClient({ staffList, candidates }: Props) {
  const [modalType, setModalType] = useState<'add' | 'edit' | 'detail' | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)

  // Handlers
  const openAdd = () => { setSelectedStaff(null); setModalType('add'); }
  const openEdit = (staff: any) => { setSelectedStaff(staff); setModalType('edit'); }
  const openDetail = (staff: any) => { setSelectedStaff(staff); setModalType('detail'); }
  const closeModal = () => { setModalType(null); setSelectedStaff(null); }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Struktur Kepengurusan</h1>
          <p className="text-gray-500 text-sm font-medium">Manajemen pengurus asrama.</p>
        </div>
        
        {/* Tombol Tambah */}
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition shadow-sm">
          <Plus size={18} /> Tambah Pengurus
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700 w-16">No</th>
                <th className="px-6 py-4 font-bold text-gray-700">Foto</th>
                <th className="px-6 py-4 font-bold text-gray-700">Nama</th>
                <th className="px-6 py-4 font-bold text-gray-700">Jabatan</th>
                <th className="px-6 py-4 font-bold text-gray-700">Urutan</th>
                <th className="px-6 py-4 font-bold text-gray-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staffList.map((staff, idx) => {
                const displayName = staff.student ? staff.student.name : staff.name
                const displayPhoto = staff.photo || staff.student?.photo || "/placeholder-avatar.png"

                return (
                  <tr key={staff.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-3">
                        <img src={displayPhoto} alt="Foto" className="w-10 h-10 rounded-full object-cover border bg-gray-100" />
                    </td>
                    <td className="px-6 py-3 font-bold text-gray-900">
                        {displayName}
                        {staff.studentId && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-bold">Mutakhorijin</span>
                        )}
                    </td>
                    <td className="px-6 py-3 text-blue-600 font-medium">{staff.position}</td>
                    <td className="px-6 py-3 font-mono">{staff.order}</td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center gap-2">
                        {/* Detail */}
                        <button onClick={() => openDetail(staff)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Detail">
                          <Eye size={18} />
                        </button>
                        
                        {/* Edit */}
                        <button onClick={() => openEdit(staff)} className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded transition" title="Edit">
                          <Edit size={18} />
                        </button>

                        {/* Delete */}
                        <form action={deleteStaff.bind(null, staff.id)} onSubmit={(e) => !confirm("Hapus pengurus ini?") && e.preventDefault()}>
                          <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition" title="Hapus">
                            <Trash2 size={18} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {staffList.length === 0 && (
                 <tr><td colSpan={6} className="text-center py-8 text-gray-400">Belum ada data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <StaffModal 
        isOpen={modalType === 'add' || modalType === 'edit'} 
        onClose={closeModal} 
        candidates={candidates} 
        existingData={modalType === 'edit' ? selectedStaff : undefined}
      />
      
      <DetailModal 
        isOpen={modalType === 'detail'} 
        onClose={closeModal} 
        data={selectedStaff} 
      />
    </>
  )
}