// src/app/dashboard/students/page.tsx
import { auth } from "@/auth"
import { getStudents } from "@/app/actions/student"
import SyncButton from "./_components/SyncButton"
import { Search } from "lucide-react"
import StudentAction from "./_components/StudentAction"

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string }
}) {
  const session = await auth()
  
  // Ambil parameter URL untuk search & pagination
  // Note: di Next.js 15, searchParams mungkin perlu diawait, tapi di 15.0.3 basic object
  const params = await searchParams 
  const query = params?.query || ''
  const currentPage = Number(params?.page) || 1

  // Fetch data dari database lokal
  const { data: students, total, totalPages } = await getStudents(query, currentPage)

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Data Santri Aktif</h1>
          <p className="text-gray-500 text-sm font-medium">Total: <span className="text-blue-600 font-bold">{total}</span> Santri Takhossus</p>
        </div>
        
        {/* Tombol Sync - Hanya untuk role tertentu jika mau dibatasi */}
        <SyncButton />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        {/* Form Search Sederhana dengan Form Method GET */}
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
                <th className="px-6 py-4 font-bold">Santri</th>
                <th className="px-6 py-4 font-bold">Kamar/Kelas</th>
                <th className="px-6 py-4 font-bold">TTL</th>
                <th className="px-6 py-4 font-bold">Wali</th>
                <th className="px-6 py-4 font-bold">Angkatan</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th> {/* Tambah Header Ini */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 italic">
                    Belum ada data. Silakan tekan tombol Sync Data SIGAP.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {student.photo ? (
                            <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold text-xs">
                              FOTO
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
                      <p className="font-medium">{student.placeOfBirth}</p>
                      <p className="text-xs text-gray-500">{student.dateOfBirth}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <p className="font-bold text-xs uppercase">{student.fatherName}</p>
                      <p className="text-xs text-gray-500">{student.address}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {student.entryYear}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                        Aktif
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <StudentAction student={student} />
                    </td>
                  </tr>
                  
                ))
              )}
            </tbody>
            
          </table>
        </div>
      </div>
      
      {/* Pagination Sederhana (Next/Prev) */}
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