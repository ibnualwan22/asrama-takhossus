// src/lib/auth-guard.ts
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function hasPermission(actionCode: string): Promise<boolean> {
  const session = await auth()
  
  // 1. Ambil Username dari session
  // Kita pakai casting (as any) karena default tipe NextAuth biasanya email/name
  const username = (session?.user as any)?.username 

  if (!username) {
      console.log("⛔ AuthGuard: Username tidak ditemukan di session.")
      return false
  }

  // 2. Cari User berdasarkan USERNAME (Bukan Email)
  const user = await prisma.user.findUnique({
    where: { username: username }, // <--- PERBAIKAN UTAMA DI SINI
    include: {
      role: {
        include: {
          permissions: true 
        }
      }
    }
  })

  if (!user || !user.role) {
      console.log("⛔ AuthGuard: User tidak ditemukan di Database.")
      return false
  }

  // 3. Bypass Super Admin
  if (user.role.name === 'Super Admin') return true

  // 4. Cek Permission
  const hasAccess = user.role.permissions.some((perm) => perm.action === actionCode)
  
  // Debugging (Opsional: Hapus jika sudah fix)
  if (!hasAccess) {
      console.log(`⛔ Akses Ditolak untuk ${username}. Butuh: ${actionCode}`)
  }

  return hasAccess
}