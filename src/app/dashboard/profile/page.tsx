import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import ProfileForm from "./_components/ProfileForm"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

export const metadata = {
  title: "Profil Saya",
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Ambil data fresh dari database (karena session mungkin datanya lama/tidak lengkap)
  // Kita cari berdasarkan username (asumsi username unik) atau ID jika tersimpan di session
  const user = await prisma.user.findFirst({
    where: { 
        username: session.user.name as string // Sesuaikan jika session.user.name menyimpan username
        // ATAU jika session menyimpan email/id, sesuaikan querynya
    },
    include: {
        role: true // Ambil nama role
    }
  })

  if (!user) {
    return <div className="p-8 text-center text-red-500">Data user tidak ditemukan.</div>
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-gray-900">Profil Akun</h1>
          <p className="text-gray-500 text-sm">Kelola informasi akun dan keamanan login Anda.</p>
       </div>

       <ProfileForm user={user} />
    </div>
  )
}