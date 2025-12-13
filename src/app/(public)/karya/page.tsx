import { PrismaClient } from "@prisma/client"
import LibraryClient from "./_components/LibraryClient" // Kita buat komponen client terpisah di bawah

const prisma = new PrismaClient()

export const metadata = {
  title: "Perpustakaan Digital - Takhossus",
  description: "Koleksi karya tulis dan kitab karya santri."
}

export const revalidate = 60

export default async function KaryaPage() {
  const allKarya = await prisma.karya.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="bg-slate-50 min-h-screen">
      <LibraryClient initialData={allKarya} />
    </div>
  )
}