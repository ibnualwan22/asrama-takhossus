// src/app/dashboard/page.tsx
import { auth } from "@/auth"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Ahlan wa Sahlan, {session?.user?.name}! 👋
        </h1>
        <p className="text-blue-100 opacity-90 font-medium">
          Selamat datang di Sistem Informasi Manajemen Asrama Takhossus. 
          Anda login sebagai <span className="bg-white/20 px-2 py-0.5 rounded font-bold">{(session?.user as any).role}</span>
        </p>
      </div>

      {/* Statistik Cards (Dummy Dulu) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Santri', value: '1,240', color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Total Alumni', value: '856', color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Artikel Terbit', value: '42', color: 'bg-orange-50 text-orange-700' },
          { label: 'Galeri Foto', value: '18', color: 'bg-pink-50 text-pink-700' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl shadow-sm border border-gray-100 ${stat.color}`}>
            <p className="text-sm font-bold uppercase opacity-70">{stat.label}</p>
            <p className="text-3xl font-extrabold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Aktivitas Terbaru</h3>
        <p className="text-gray-500 italic">Belum ada log aktivitas.</p>
      </div>
    </div>
  )
}