'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Edit, Eye, Calendar, Filter } from "lucide-react"
import { deleteStaff } from "@/app/actions/structure"
import StaffModal from "./StaffModal"
import DetailModal from "./DetailModal"

type Props = {
  staffList: any[]
  candidates: any[]
  year: number
}

export default function StructureClient({ staffList, candidates, year }: Props) {
  const router = useRouter()
  const [modalType, setModalType] = useState<'add' | 'edit' | 'detail' | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)

  // Handlers Modal
  const openAdd = () => { setSelectedStaff(null); setModalType('add'); }
  const openEdit = (staff: any) => { setSelectedStaff(staff); setModalType('edit'); }
  const openDetail = (staff: any) => { setSelectedStaff(staff); setModalType('detail'); }
  const closeModal = () => { setModalType(null); setSelectedStaff(null); }

  // Handler Ganti Tahun
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/dashboard/struktur?year=${e.target.value}`)
  }

  // Generate List Tahun (Contoh: 5 tahun ke belakang s/d 1 tahun ke depan)
  const currentYear = new Date().getFullYear()
  const years = Array.from({length: 7}, (_, i) => currentYear - 5 + i).reverse()

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Struktur Kepengurusan</h1>
          <p className="text-gray-500 text-sm font-medium">Manajemen pengurus asrama per periode.</p>
        </div>
        
        <div className="flex gap-3">
          {/* FILTER TAHUN */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Calendar size={16} />
             </div>
             <select 
               value={year} 
               onChange={handleYearChange}
               className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer"
             >
                {years.map(y => (
                  <option key={y} value={y}>Periode {y}</option>
                ))}
             </select>
          </div>

          <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition shadow-sm">
            <Plus size={18} /> Tambah
          </button>
        </div>
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
                <th className="px-6 py-4 font-bold text-gray-700">Masa Bakti</th>
                <th className="px-6 py-4 font-bold text-gray-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staffList.map((staff, idx) => {
                const displayName = staff.student ? staff.student.name : staff.name
                const displayPhoto = staff.photo || staff.student?.photo || "/placeholder-avatar.png"

                return (
                  <tr key={staff.id} className={`hover:bg-gray-50 transition ${!staff.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
                    <td className="px-6 py-3 text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-3">
                        <img src={displayPhoto} alt="Foto" className="w-10 h-10 rounded-full object-cover border bg-gray-100" />
                    </td>
                    <td className="px-6 py-3 font-bold text-gray-900">
                        {displayName}
                        {staff.studentId && (
                          <span className="ml-2 text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-bold uppercase">Alumni</span>
                        )}
                    </td>
                    <td className="px-6 py-3 text-blue-600 font-medium">{staff.position}</td>
                    <td className="px-6 py-3">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs font-bold">
                            {staff.periodStart} {staff.periodEnd ? `- ${staff.periodEnd}` : '- Skrg'}
                        </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => openDetail(staff)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"><Eye size={18}/></button>
                        <button onClick={() => openEdit(staff)} className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded transition"><Edit size={18}/></button>
                        <form action={deleteStaff.bind(null, staff.id)} onSubmit={(e) => !confirm("Hapus pengurus ini?") && e.preventDefault()}>
                          <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"><Trash2 size={18}/></button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {staffList.length === 0 && (
                 <tr><td colSpan={6} className="text-center py-12 text-gray-400 font-medium">Tidak ada pengurus di tahun {year}.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StaffModal 
        isOpen={modalType === 'add' || modalType === 'edit'} 
        onClose={closeModal} 
        candidates={candidates} 
        existingData={modalType === 'edit' ? selectedStaff : undefined}
        defaultYear={year} // Kirim tahun aktif agar default inputnya sesuai
      />
      
      <DetailModal isOpen={modalType === 'detail'} onClose={closeModal} data={selectedStaff} />
    </>
  )
}