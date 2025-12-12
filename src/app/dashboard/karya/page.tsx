import { PrismaClient } from "@prisma/client"
import KaryaClient from "./_components/KaryaClient"

const prisma = new PrismaClient()

export const metadata = {
  title: "Karya Santri",
}

export default async function KaryaPage() {
  // Ambil data dari database, urutkan dari yang terbaru (createdAt)
  const dataKarya = await prisma.karya.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-6">
      <KaryaClient dataKarya={dataKarya} />
    </div>
  )
}