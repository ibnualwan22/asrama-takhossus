import { PrismaClient, StudentStatus } from "@prisma/client"
import StructureClient from "./_components/StructureClient"

const prisma = new PrismaClient()

export default async function StructurePage() {
  // 1. Ambil Data Staff + Relasi
  // Kita urutkan berdasarkan 'order' (field baru) lalu nama
  const staffList = await prisma.staff.findMany({
    include: { student: true },
    orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
    ]
  })

  // 2. Ambil Kandidat Mutakhorijin untuk Dropdown
  const candidates = await prisma.student.findMany({
    where: { status: StudentStatus.MUTAKHORIJIN },
    select: { 
        id: true, 
        name: true, 
        mutakhorijinBatch: true,
        photo: true // Ambil foto juga buat preview kalau perlu
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <StructureClient staffList={staffList} candidates={candidates} />
    </div>
  )
}