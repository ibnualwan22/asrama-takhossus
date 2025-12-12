// src/app/dashboard/schedules/page.tsx
import { PrismaClient } from "@prisma/client"
import AddScheduleForm from "./_components/AddScheduleForm" // Buat form simple: Start, End, Activity
import { Trash2, Clock } from "lucide-react"
import { deleteSchedule } from "@/app/actions/settings"

const prisma = new PrismaClient()

export default async function SchedulePage() {
  const schedules = await prisma.dailySchedule.findMany({ orderBy: { startTime: 'asc' } })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold">Jadwal Kegiatan Harian</h1>
        <AddScheduleForm />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-4">Waktu</th>
              <th className="px-6 py-4">Kegiatan</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {schedules.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 font-bold font-mono text-blue-600 flex items-center gap-2">
                  <Clock size={14} /> {s.startTime} - {s.endTime}
                </td>
                <td className="px-6 py-4 font-medium">{s.activity}</td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteSchedule.bind(null, s.id)}>
                    <button className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}