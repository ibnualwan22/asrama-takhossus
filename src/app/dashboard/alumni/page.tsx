// src/app/dashboard/alumni/page.tsx
import { auth } from "@/auth"
import { getAlumni } from "@/app/actions/alumni"
import { Search, GraduationCap } from "lucide-react"
import AddAlumniForm from "./_components/AddAlumniForm";

export default async function AlumniPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string }
}) {
  const session = await auth()
  // Await searchParams untuk Next.js 15
  const params = await searchParams 
  const query = params?.query || ''
  const currentPage = Number(params?.page) || 1

  const { data: alumni, total } = await getAlumni(query, currentPage)

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
                <th className="px-6 py-4 font-bold">Nama Alumni</th>
                <th className="px-6 py-4 font-bold text-center">Tahun Masuk</th>
                <th className="px-6 py-4 font-bold text-center">Tahun Keluar</th>
                <th className="px-6 py-4 font-bold text-center">Angkatan Mutakhorijin</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alumni.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {item.name}
                    <div className="text-xs text-gray-500 font-normal">{item.address}</div>
                  </td>
                  
                  {/* 1. TAHUN MASUK */}
                  <td className="px-6 py-4 text-center text-gray-600">
                    {item.entryYear}
                  </td>
                  
                  {/* 2. TAHUN KELUAR (graduationYear) */}
                  <td className="px-6 py-4 text-center font-bold text-gray-800">
                    {item.graduationYear || '-'}
                  </td>

                  {/* 3. ANGKATAN MUTAKHORIJIN */}
                  <td className="px-6 py-4 text-center">
                    {item.mutakhorijinBatch ? (
                       <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">
                         Ke-{item.mutakhorijinBatch}
                       </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {item.status === 'ALUMNI_GRADUATED' ? (
                      <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded border border-green-200">
                        Lulusan
                      </span>
                    ) : (
                      <span className="text-gray-500 font-bold text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200">
                        Boyong
                      </span>
                    )}
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