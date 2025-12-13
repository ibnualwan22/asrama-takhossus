import { PrismaClient } from "@prisma/client"
import StructureClient from "./_components/StructureClient"

const prisma = new PrismaClient()

// PERUBAHAN: searchParams sekarang adalah Promise
export default async function StructurePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ year?: string }> 
}) {
  const currentYear = new Date().getFullYear()
  
  // 1. AWAIT DULU searchParams-nya
  const resolvedParams = await searchParams
  const selectedYear = resolvedParams.year ? parseInt(resolvedParams.year) : currentYear

  // 2. Ambil Data Staff SESUAI TAHUN YANG DIPILIH
  const staffList = await prisma.staff.findMany({
    where: {
      OR: [
        { periodStart: selectedYear }, 
        { AND: [{ periodStart: { lt: selectedYear } }, { periodEnd: null }] },
        { AND: [{ periodStart: { lt: selectedYear } }, { periodEnd: { gte: selectedYear } }] }
      ]
    },
    include: { student: true },
    orderBy: [
        { isActive: 'desc' }, 
        { order: 'asc' }      
    ]
  })

  // 3. Ambil Kandidat Mutakhorijin (Untuk Dropdown Add)
  const candidates = await prisma.student.findMany({
    where: { status: 'MUTAKHORIJIN' }, 
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
      <StructureClient 
         staffList={staffList} 
         candidates={candidates} 
         year={selectedYear} 
      />
    </div>
  )
}