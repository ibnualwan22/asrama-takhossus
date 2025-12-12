// src/app/dashboard/students/page.tsx
import { auth } from "@/auth"
import { getStudents } from "@/app/actions/student"
import SyncButton from "./_components/SyncButton"
import { Search, ShieldAlert } from "lucide-react" // Tambah icon ShieldAlert
import StudentAction from "./_components/StudentAction"
import StudentDetailModal from "./_components/StudentDetailModal"
import { hasPermission } from "@/lib/auth-guard" // Import Helper Guard

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string }
}) {
  const session = await auth()
  
  // 1. CEK PERMISSION: AKSES HALAMAN (READ)
  // Pastikan di database tabel Permission ada data: action='student.read'
  const canRead = await hasPermission("student.read")

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-red-50 rounded-xl border border-red-200 m-6">
        <ShieldAlert size={48} className="text-red-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Akses Ditolak</h1>
        <p className="text-gray-600 mt-2">Anda tidak memiliki izin untuk melihat Data Santri.</p>
      </div>
    )
  }

  // 2. CEK PERMISSION: AKSI SPESIFIK
  // Kita cek izin lain untuk mengontrol visibilitas tombol
  const canSync = await hasPermission("student.create") // Izin untuk Sync/Tambah
  const canManage = await hasPermission("student.update") // Izin untuk Edit/Mutasi

  const params = await searchParams 
  const query = params?.query || ''
  const currentPage = Number(params?.page) || 1
  const pageSize = 20

  const numberOffset = (currentPage - 1) * pageSize
  
  const { data: students, total, totalPages } = await getStudents(query, currentPage)
  
  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Data Santri Aktif</h1>
          <p className="text-gray-500 text-sm font-medium">Total: <span className="text-blue-600 font-bold">{total}</span> Santri Takhossus</p>
        </div>
        
        {/* Tombol Sync - HANYA MUNCUL JIKA PUNYA IZIN */}
        {canSync && (
           <SyncButton />
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <form className="w-full md:w-1/3">
          <input
            name="query"
            defaultValue={query}
            placeholder="Cari nama, NIS, atau kota..."
            className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
        </form>
      </div>

      {/* Tabel Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-4 font-bold text-center w-16">No</th>
                <th className="px-6 py-4 font-bold">Santri</th>
                <th className="px-6 py-4 font-bold">Kamar/Kelas</th>
                <th className="px-6 py-4 font-bold">TTL</th>
                <th className="px-6 py-4 font-bold">Wali</th>
                <th className="px-6 py-4 font-bold">Angkatan</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500 italic">
                    Belum ada data. Silakan tekan tombol Sync Data SIGAP.
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                    
                    <td className="px-4 py-4 text-center font-bold text-gray-500">
                      {numberOffset + index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300">
                          {student.photo ? (
                            <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-[10px] text-center p-1">
                              NO FOTO
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-extrabold text-gray-900">{student.name}</p>
                          <p className="text-xs text-blue-600 font-mono font-bold">{student.nis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{student.activeDormitory}</p>
                      <p className="text-xs text-gray-500">{student.dormitoryRoom} - {student.formalClass}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="font-medium">{student.placeOfBirth || '-'}</p>
                      <p className="text-xs text-gray-500">{student.dateOfBirth || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="font-bold text-xs uppercase">{student.fatherName || '-'}</p>
                      <p className="text-xs text-gray-500">{student.address || '-'}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {student.entryYear}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Tombol Detail (Umumnya boleh dilihat jika bisa read) */}
                        <StudentDetailModal student={student} />
                        
                        {/* Tombol Mutasi/Edit - HANYA JIKA PUNYA IZIN MANAGE/UPDATE */}
                        {canManage && (
                           <StudentAction student={student} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
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