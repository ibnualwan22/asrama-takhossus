// src/app/dashboard/mutakhorijin/page.tsx

import { auth } from "@/auth"
import { Users } from "lucide-react"
import { getMutakhorijin } from "@/app/actions/mutakhorijin" // Import fetcher baru
// Import Components
import MutakhorijinAction from "./_components/MutakhorijinAction" // Tombol Boyong
import EditMutakhorijinModal from "./_components/EditMutakhorijinModal"
import MutakhorijinDetailModal from "./_components/MutakhorijinDetailModal"
import DeleteMutakhorijinButton from "./_components/DeleteMutakhorijinButton"
import ReactivateButton from "../alumni/_components/ReactivateButton" // Reuse dari Alumni (Sama logicnya)

export default async function MutakhorijinPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string }
}) {
  const params = await searchParams
  const query = params?.query || ''
  const currentPage = Number(params?.page) || 1
  const pageSize = 20
  const numberOffset = (currentPage - 1) * pageSize

  // Fetch data
  const { data, total, totalPages } = await getMutakhorijin(query, currentPage)

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
             <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Data Mutakhorijin</h1>
            <p className="text-gray-500 text-sm font-medium">Total: {total} Santri Pengabdian</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-4 font-bold text-center w-16">No</th>
                <th className="px-6 py-4 font-bold">Nama</th>
                <th className="px-6 py-4 font-bold text-center">Tahun Masuk</th>
                <th className="px-6 py-4 font-bold text-center">Angkatan Mutakhorijin</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada data.</td></tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* 1. NUMBERING */}
                    <td className="px-4 py-4 text-center font-bold text-gray-500">
                      {numberOffset + index + 1}
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900">
                      {item.name}
                      <div className="text-xs text-gray-500 font-normal">{item.address || 'Belum ada alamat'}</div>
                    </td>
                    
                    <td className="px-6 py-4 text-center text-gray-600">{item.entryYear}</td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold border border-purple-200">
                        Ke-{item.mutakhorijinBatch}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* A. Detail & Foto */}
                        <MutakhorijinDetailModal student={item} />
                        
                        {/* B. Edit */}
                        <EditMutakhorijinModal student={item} />
                        
                        {/* C. Reactivate (Balikin ke Santri) */}
                        <ReactivateButton id={item.id} name={item.name} />

                        {/* D. Boyong (Pindah ke Alumni) */}
                        <MutakhorijinAction student={item} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
       {/* Pagination (Sama seperti halaman lain) */}
       <div className="flex justify-center gap-2">
         {currentPage > 1 && (
           <a href={`?page=${currentPage - 1}&query=${query}`} className="px-4 py-2 bg-white border rounded hover:bg-gray-50 font-bold">Prev</a>
         )}
         <span className="px-4 py-2 text-gray-500 font-bold">Halaman {currentPage} dari {totalPages || 1}</span>
         {currentPage < totalPages && (
           <a href={`?page=${currentPage + 1}&query=${query}`} className="px-4 py-2 bg-white border rounded hover:bg-gray-50 font-bold">Next</a>
         )}
      </div>
    </div>
  )
}