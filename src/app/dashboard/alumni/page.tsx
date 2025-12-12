// src/app/dashboard/alumni/page.tsx
import { auth } from "@/auth"
import { getAlumni } from "@/app/actions/alumni"
import { Search, GraduationCap } from "lucide-react"
import AddAlumniForm from "./_components/AddAlumniForm";
import EditAlumniModal from "./_components/EditAlumniModal" // <--- Import
import ReactivateButton from "./_components/ReactivateButton" // <--- Import
import AlumniDetailModal from "./_components/AlumniDetailModal"

export default async function AlumniPage({ searchParams }: { searchParams: { query?: string; page?: string } }) {
  const params = await searchParams
  const query = params?.query || ''
  const currentPage = Number(params?.page) || 1
  const pageSize = 20
  
  // Logic Numbering
  const numberOffset = (currentPage - 1) * pageSize

  const { data: alumni, total, totalPages } = await getAlumni(query, currentPage)

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg">
             <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Database Alumni</h1>
            <p className="text-gray-500 text-sm font-medium">Data Mutakhorijin & Santri Non-Aktif</p>
          </div>
        </div>
        <AddAlumniForm />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-4 font-bold text-center w-16">No</th>
                <th className="px-6 py-4 font-bold">Nama Alumni</th>
                <th className="px-6 py-4 font-bold text-center">Masuk</th>
                <th className="px-6 py-4 font-bold text-center">Keluar</th>
                <th className="px-6 py-4 font-bold text-center">Mutakhorijin</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th> {/* Kolom Aksi */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alumni.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {/* 1. NUMBERING */}
                  <td className="px-4 py-4 text-center font-bold text-gray-500">
                    {numberOffset + index + 1}
                  </td>

                  <td className="px-6 py-4 font-bold text-gray-900">
                    {item.name}
                    <div className="text-xs text-gray-500 font-normal">{item.address}</div>
                  </td>
                  
                  <td className="px-6 py-4 text-center text-gray-600">{item.entryYear}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-800">{item.graduationYear || '-'}</td>
                  
                  <td className="px-6 py-4 text-center">
                    {item.mutakhorijinBatch ? (
                       <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">
                         Ke-{item.mutakhorijinBatch}
                       </span>
                    ) : <span className="text-gray-400">-</span>}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {item.status === 'ALUMNI_GRADUATED' ? (
                      <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded border border-green-200">Lulusan</span>
                    ) : (
                      <span className="text-gray-500 font-bold text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200">Boyong</span>
                    )}
                  </td>

                  {/* KOLOM AKSI LENGKAP */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* 2 & 5. Modal Detail & Upload Foto */}
                      <AlumniDetailModal alumni={item} />
                      
                      {/* 3. Tombol Edit */}
                      <EditAlumniModal alumni={item} />

                      {/* 4. Tombol Aktifkan Kembali */}
                      <ReactivateButton id={item.id} name={item.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}