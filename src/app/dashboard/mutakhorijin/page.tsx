// src/app/dashboard/mutakhorijin/page.tsx
import { auth } from "@/auth"
import { PrismaClient, StudentStatus } from "@prisma/client"
import { Users } from "lucide-react"
import MutakhorijinAction from "./_components/MutakhorijinAction"
// import AddMutakhorijinForm from "./_components/AddMutakhorijinForm" (Opsional, buat mirip AddAlumniForm tapi statusnya MUTAKHORIJIN)

const prisma = new PrismaClient()

export default async function MutakhorijinPage() {
  const data = await prisma.student.findMany({
    where: { status: StudentStatus.MUTAKHORIJIN },
    orderBy: { graduationYear: 'desc' } // Urut berdasarkan Angkatan
  })

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
             <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Data Mutakhorijin</h1>
            <p className="text-gray-500 text-sm font-medium">Santri lulus akademik yang masih di asrama</p>
          </div>
        </div>
        {/* Tambahkan tombol Add Manual disini jika perlu */}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-900 text-white">
  <tr>
    <th className="px-6 py-4 font-bold">Nama</th>
    <th className="px-6 py-4 font-bold text-center">Tahun Masuk</th>
    <th className="px-6 py-4 font-bold text-center">Angkatan Mutakhorijin</th>
    <th className="px-6 py-4 font-bold text-right">Aksi</th>
  </tr>
</thead>
<tbody>
  {data.map((item) => (
    <tr key={item.id}>
       <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
       <td className="px-6 py-4 text-center">{item.entryYear}</td>
       <td className="px-6 py-4 text-center font-bold text-purple-600 text-lg">
         {item.mutakhorijinBatch}
       </td>
       <td className="px-6 py-4 text-right">
         <MutakhorijinAction student={item} />
       </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  )
}