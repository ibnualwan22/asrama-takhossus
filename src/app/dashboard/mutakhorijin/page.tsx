import { getMutakhorijin } from "@/app/actions/mutakhorijin"
import GraduateButton from "./_components/GraduateButton"
import { hasPermission } from "@/lib/auth-guard" // Import Security
import { Search, GraduationCap } from "lucide-react"

export default async function MutakhorijinPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string; page?: string }> 
}) {
  const params = await searchParams
  const query = params.query || ''
  const currentPage = Number(params.page) || 1

  // 1. CEK IZIN
  const canMutate = await hasPermission("student.mutate")

  const { data, totalPages } = await getMutakhorijin(query, currentPage)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
           <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
             <GraduationCap className="text-purple-600" /> Data Mutakhorijin
           </h1>
           <p className="text-gray-500 text-sm">Santri kelas akhir/pengabdian yang belum resmi menjadi alumni.</p>
        </div>
        
        {/* Search Bar Sederhana */}
        <form className="relative w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input name="query" defaultValue={query} placeholder="Cari..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none" />
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-4 text-center w-14">No</th>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4 text-center">Angkatan Mutakhorijin</th>
                <th className="px-6 py-4">Asrama Terakhir</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((m, index) => (
                <tr key={m.id} className="hover:bg-gray-50">
                   <td className="px-4 py-3 text-center text-gray-500">{(currentPage - 1) * 20 + index + 1}</td>
                   <td className="px-6 py-3 font-bold text-gray-900">
                      {m.name}
                      <div className="text-xs text-gray-400 font-mono font-normal">{m.nis}</div>
                   </td>
                   <td className="px-6 py-3 text-center">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                        Ke-{m.mutakhorijinBatch}
                      </span>
                   </td>
                   <td className="px-6 py-3 text-gray-600">{m.activeDormitory}</td>
                   <td className="px-6 py-3 text-center">
                      {/* KIRIM IZIN KE TOMBOL */}
                      <GraduateButton student={m} canMutate={canMutate} />
                   </td>
                </tr>
              ))}
              {data.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-400">Tidak ada data.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>      
    </div>
  )
}