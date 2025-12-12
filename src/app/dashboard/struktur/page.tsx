import { PrismaClient } from "@prisma/client"
import StructureClient from "./_components/StructureClient"

const prisma = new PrismaClient()

// Menerima parameter ?year=2024 dari URL
export default async function StructurePage({ searchParams }: { searchParams: { year?: string } }) {
  const currentYear = new Date().getFullYear()
  const selectedYear = searchParams.year ? parseInt(searchParams.year) : currentYear

  // 1. Ambil Data Staff SESUAI TAHUN YANG DIPILIH
  // Logic: Ambil staff yang periodenya mencakup tahun yang dipilih
  const staffList = await prisma.staff.findMany({
    where: {
      OR: [
        { periodStart: selectedYear }, // Mulai tahun ini
        // Atau mulai sebelum tahun ini, TAPI belum selesai (masih aktif)
        { AND: [{ periodStart: { lt: selectedYear } }, { periodEnd: null }] },
        // Atau mulai sebelum tahun ini, DAN selesai setelah tahun ini
        { AND: [{ periodStart: { lt: selectedYear } }, { periodEnd: { gte: selectedYear } }] }
      ]
    },
    include: { student: true },
    orderBy: [
        { isActive: 'desc' }, // Yang aktif di atas
        { order: 'asc' }      // Lalu urutkan sesuai nomor urut
    ]
  })

  // 2. Ambil Kandidat Mutakhorijin (Untuk Dropdown Add)
  const candidates = await prisma.student.findMany({
    where: { status: 'MUTAKHORIJIN' }, // Pastikan enum string sesuai prisma anda
    select: { 
        id: true, 
        name: true, 
        mutakhorijinBatch: true,
        photo: true 
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
       {/* Kirim data ke Client Component */}
      <StructureClient 
         staffList={staffList} 
         candidates={candidates} 
         year={selectedYear} 
      />
    </div>
  )
}