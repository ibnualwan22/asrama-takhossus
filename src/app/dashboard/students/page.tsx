import { getStudents } from "@/app/actions/student"
import SyncButton from "./_components/SyncButton"
import StudentAction from "./_components/StudentAction"
import StudentDetailModal from "./_components/StudentDetailModal"
import { hasPermission } from "@/lib/auth-guard" // Import
import { Search, Users } from "lucide-react"

export const metadata = {
  title: "Data Santri Aktif",
}

export default async function StudentsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string; page?: string }> 
}) {
  const params = await searchParams
  const query = params.query || ''
  const currentPage = Number(params.page) || 1

  // CEK SEMUA IZIN DISINI
  const canSync = await hasPermission("student.sync")
  const canMutate = await hasPermission("student.mutate") // <--- Izin Baru

  const { data, totalPages } = await getStudents(query, currentPage)

  const formatDate = (date: any) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* HEADER (Sama seperti sebelumnya) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
             <Users className="text-blue-600" /> Data Santri Aktif
           </h1>
           <p className="text-gray-500 text-sm font-medium">
             Manajemen data santri yang masih mukim di asrama.
           </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
           <form className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                name="query"
                defaultValue={query}
                placeholder="Cari nama, NIS, kelas..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
              />
           </form>
           <SyncButton canSync={canSync} />
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-4 font-bold text-center w-14">No</th>
                <th className="px-6 py-4 font-bold">Nama Santri</th>
                <th className="px-6 py-4 font-bold">Asrama / Kamar</th>
                <th className="px-6 py-4 font-bold text-center">Kelas</th>
                <th className="px-6 py-4 font-bold">TTL</th>
                <th className="px-6 py-4 font-bold">Nama Ayah</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-center text-gray-500">
                    {(currentPage - 1) * 20 + index + 1}
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-bold text-gray-900">{student.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{student.nis}</div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-medium text-gray-700">{student.activeDormitory}</div>
                    <div className="text-xs text-blue-600 font-bold">{student.dormitoryRoom || '-'}</div>
                  </td>
                  <td className="px-6 py-3 text-center font-mono font-medium text-gray-600">
                    {student.formalClass || '-'}
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-xs">
                    <div>{student.placeOfBirth || '-'}</div>
                    <div className="text-gray-400">{formatDate(student.dateOfBirth)}</div>
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {student.fatherName || '-'}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-center items-center gap-2">
                       <StudentDetailModal student={student} />
                       
                       {/* KIRIM STATUS IZIN KE TOMBOL */}
                       <StudentAction student={student} canMutate={canMutate} />
                       
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}