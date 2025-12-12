// src/app/dashboard/page.tsx
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Users, GraduationCap, Newspaper, Image as ImageIcon, Briefcase, Crown } from "lucide-react"
import DashboardCharts from "@/components/DashboardCharts"

const prisma = new PrismaClient()

// Agar data selalu fresh (Realtime) saat di-refresh
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()

  // --- 1. AMBIL TOTAL COUNT (Realtime) ---
  const [
    totalStudents,
    totalAlumni,
    totalArticles,
    totalGallery,
    totalOrg,
    totalLeaders
  ] = await prisma.$transaction([
    prisma.student.count({ where: { status: 'ACTIVE' } }),
    prisma.student.count({ where: { status: { in: ['ALUMNI_GRADUATED', 'ALUMNI_DROPOUT'] } } }),
    prisma.post.count(),
    prisma.galleryItem.count({ where: { type: 'PHOTO' } }), // Hitung foto saja
    prisma.organization.count(),
    prisma.leader.count(),
  ])

  // --- 2. OLAH DATA UNTUK GRAFIK ---

  // A. Data Santri per Tahun Masuk (Entry Year)
  const studentsByYearRaw = await prisma.student.groupBy({
    by: ['entryYear'],
    where: { status: 'ACTIVE' },
    _count: { entryYear: true },
    orderBy: { entryYear: 'asc' },
  })
  const studentChartData = studentsByYearRaw.map(item => ({
    year: item.entryYear.toString(),
    count: item._count.entryYear
  }))

  // B. Data Alumni per Tahun Lulus (Graduation Year)
  const alumniByYearRaw = await prisma.student.groupBy({
    by: ['graduationYear'],
    where: { status: { in: ['ALUMNI_GRADUATED', 'ALUMNI_DROPOUT'] }, graduationYear: { not: null } },
    _count: { graduationYear: true },
    orderBy: { graduationYear: 'asc' },
  })
  const alumniChartData = alumniByYearRaw.map(item => ({
    year: item.graduationYear?.toString() || 'Unknown',
    count: item._count.graduationYear
  }))

  // C. Data Konten per Bulan (Tahun Ini)
  // Prisma tidak support groupBy Date secara mudah, kita fetch select createdAt lalu olah di JS
  const currentYear = new Date().getFullYear()
  const startOfYear = new Date(currentYear, 0, 1)
  const endOfYear = new Date(currentYear, 11, 31)

  const [postsRaw, galleryRaw] = await prisma.$transaction([
    prisma.post.findMany({ 
      where: { createdAt: { gte: startOfYear, lte: endOfYear } },
      select: { createdAt: true }
    }),
    prisma.galleryItem.findMany({ 
      where: { createdAt: { gte: startOfYear, lte: endOfYear } },
      select: { createdAt: true }
    })
  ])

  // Helper function untuk group by month
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
  const contentMap = new Map()

  // Inisialisasi map dengan 0
  months.forEach(m => contentMap.set(m, { articles: 0, gallery: 0 }))

  // Hitung Artikel
  postsRaw.forEach(p => {
    const m = months[p.createdAt.getMonth()]
    const val = contentMap.get(m)
    contentMap.set(m, { ...val, articles: val.articles + 1 })
  })

  // Hitung Galeri
  galleryRaw.forEach(g => {
    const m = months[g.createdAt.getMonth()]
    const val = contentMap.get(m)
    contentMap.set(m, { ...val, gallery: val.gallery + 1 })
  })

  // Convert Map ke Array untuk Recharts
  const contentChartData = Array.from(contentMap, ([month, val]) => ({
    month,
    articles: val.articles,
    gallery: val.gallery
  }))

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Ahlan wa Sahlan, {session?.user?.name}! 👋
        </h1>
        <p className="text-gray-300 opacity-90 font-medium">
          Dashboard Monitoring Sistem Informasi Asrama Takhossus
        </p>
      </div>

      {/* Statistik Cards (REALTIME DATA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Santri Aktif" value={totalStudents} color="bg-blue-50 text-blue-700" icon={Users} />
        <StatCard label="Total Alumni" value={totalAlumni} color="bg-purple-50 text-purple-700" icon={GraduationCap} />
        <StatCard label="Artikel Terbit" value={totalArticles} color="bg-orange-50 text-orange-700" icon={Newspaper} />
        <StatCard label="Total Foto Galeri" value={totalGallery} color="bg-pink-50 text-pink-700" icon={ImageIcon} />
        <StatCard label="Divisi Organisasi" value={totalOrg} color="bg-emerald-50 text-emerald-700" icon={Briefcase} />
        <StatCard label="Pimpinan/Kepala" value={totalLeaders} color="bg-yellow-50 text-yellow-700" icon={Crown} />
      </div>

      {/* Grafik Component */}
      <DashboardCharts 
        studentData={studentChartData}
        alumniData={alumniChartData}
        contentData={contentChartData}
      />
    </div>
  )
}

// Komponen Kecil untuk Card
function StatCard({ label, value, color, icon: Icon }: any) {
  return (
    <div className={`p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 ${color}`}>
      <div className="p-3 bg-white/50 rounded-lg">
        <Icon size={28} />
      </div>
      <div>
        <p className="text-sm font-bold uppercase opacity-70">{label}</p>
        <p className="text-3xl font-extrabold mt-1">{value}</p>
      </div>
    </div>
  )
}