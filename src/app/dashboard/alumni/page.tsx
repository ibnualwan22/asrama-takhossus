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
                <th className="px-6 py-4 font-bold">Angkatan Masuk</th>
                {/* Judul Kolom Disesuaikan */}
                <th className="px-6 py-4 font-bold">Keterangan Lulus/Keluar</th> 
                <th className="px-6 py-4 font-bold">Domisili</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alumni.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Belum ada data alumni.</td></tr>
              ) : (
                alumni.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.entryYear} <span className="text-xs text-gray-400">(A-{item.entryYear?.toString().slice(-2)})</span>
                    </td>
                    
                    {/* LOGIKA TAMPILAN BARU */}
                    <td className="px-6 py-4">
                      {item.status === 'ALUMNI_GRADUATED' ? (
                        <div>
                          <p className="font-bold text-indigo-700">Angkatan ke-{item.graduationYear}</p>
                          <p className="text-xs text-gray-500">Mutakhorijin</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-bold text-gray-700">Tahun {item.graduationYear}</p>
                          <p className="text-xs text-gray-500">Berhenti/Boyong</p>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{item.address || '-'}</td>
                    <td className="px-6 py-4">
                      {item.status === 'ALUMNI_GRADUATED' ? (
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
                          Mutakhorijin
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                          Boyong
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}