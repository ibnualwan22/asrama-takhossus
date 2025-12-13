import { PrismaClient } from "@prisma/client"
import OrgTabs from "@/components/public/OrgTabs"

const prisma = new PrismaClient()

export const metadata = {
  title: "Organisasi Santri - Asrama Takhossus",
  description: "Wadah pengembangan minat dan bakat santri."
}

export const revalidate = 60

export default async function OrganisasiPage() {
  // Ambil data organisasi beserta struktur aktifnya
  const organizations = await prisma.organization.findMany({
    include: {
      // PERBAIKAN: Gunakan 'history' bukan 'periods'
      history: {
        where: { isActive: true }, 
        include: {
          leader: { select: { name: true } },
          advisor: { select: { name: true } }
        }
      }
    },
    orderBy: { order: 'asc' }
  })

  const formattedOrgs = organizations.map(org => ({
    ...org,
    category: org.category as 'KEILMUAN' | 'KESENIAN',
    // Pastikan history ikut terbawa (spread operator ...org sudah membawanya, tapi ini untuk memastikan tipe)
  }))

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      
      {/* Header Halaman */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Organisasi Santri
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Kami percaya bahwa potensi santri tidak hanya diasah di dalam kelas, 
          tetapi juga melalui ruang-ruang kreasi dan organisasi.
        </p>
      </div>

      {/* Tabs & Content */}
      <div className="container mx-auto px-4">
         <OrgTabs organizations={formattedOrgs} />
      </div>

    </div>
  )
}