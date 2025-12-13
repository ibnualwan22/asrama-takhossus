import { getAlumni } from "@/app/actions/alumni"
import AddAlumniForm from "./_components/AddAlumniForm"
import EditAlumniModal from "./_components/EditAlumniModal"
import AlumniDetailModal from "./_components/AlumniDetailModal"
import ReactivateButton from "./_components/ReactivateButton"
import { hasPermission } from "@/lib/auth-guard" // Import Security
import { Search } from "lucide-react"

export const metadata = {
  title: "Data Alumni",
}

export default async function AlumniPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string; page?: string }> 
}) {
  const params = await searchParams
  const query = params.query || ''
  const currentPage = Number(params.page) || 1

  // 1. CEK IZIN DI SERVER
  const canCreate = await hasPermission("student.create") // <--- Tambah ini
  const canUpdate = await hasPermission("student.update") // Izin Edit Data
  const canMutate = await hasPermission("student.mutate") // Izin Reactivate

  const { data, totalPages } = await getAlumni(query, currentPage)

  return (
    <div className="space-y-6">
      {/* HEADER & PENCARIAN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900">Database Alumni</h1>
           <p className="text-gray-500 text-sm font-medium">Data lulusan dan santri yang telah boyong.</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
           <form className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                name="query"
                defaultValue={query}
                placeholder="Cari nama / alamat..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
           </form>
           {/* Tombol Add Manual bisa Anda proteksi juga jika mau dengan student.create */}
           <AddAlumniForm canCreate={canCreate} />
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-4 font-bold text-center w-14">No</th>
                <th className="px-6 py-4 font-bold">Nama Alumni</th>
                <th className="px-6 py-4 font-bold text-center">Masuk</th>
                <th className="px-6 py-4 font-bold text-center">Lulus/Keluar</th>
                <th className="px-6 py-4 font-bold text-center">Angkatan</th>
                <th className="px-6 py-4 font-bold">Domisili</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((alumni, index) => (
                <tr key={alumni.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-center text-gray-500">
                    {(currentPage - 1) * 20 + index + 1}
                  </td>
                  <td className="px-6 py-3">
                    <div className="font-bold text-gray-900">{alumni.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{alumni.nis}</div>
                  </td>
                  <td className="px-6 py-3 text-center font-mono text-gray-600">
                    {alumni.entryYear}
                  </td>
                  <td className="px-6 py-3 text-center font-mono text-gray-600">
                    {alumni.graduationYear || '-'}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {alumni.mutakhorijinBatch ? (
                       <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                         Ke-{alumni.mutakhorijinBatch}
                       </span>
                    ) : (
                       <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-600 truncate max-w-[150px]" title={alumni.address || ''}>
                    {alumni.address || '-'}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {alumni.status === 'ALUMNI_GRADUATED' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          Lulus
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          Boyong
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-center items-center gap-2">
                       <AlumniDetailModal alumni={alumni} />
                       
                       {/* KIRIM STATUS IZIN KE TOMBOL EDIT */}
                       <EditAlumniModal alumni={alumni} canUpdate={canUpdate} />
                       
                       {/* KIRIM STATUS IZIN KE TOMBOL REACTIVATE */}
                       <ReactivateButton id={alumni.id} name={alumni.name} canMutate={canMutate} />
                    </div>
                  </td>
                </tr>
              ))}
              
              {data.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    Tidak ada data alumni yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}