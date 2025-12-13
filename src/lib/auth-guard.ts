// src/lib/auth-guard.ts
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"

const prisma = new PrismaClient()

/**
 * Cek apakah user yang sedang login memiliki izin tertentu.
 * Mengembalikan TRUE/FALSE (Tidak redirect).
 * Cocok untuk menyembunyikan Tombol di UI.
 */
export async function hasPermission(action: string) {
  const session = await auth()
  
  // 1. Cek Login
  if (!session || !session.user) {
    console.log(`[AuthGuard] User belum login.`)
    return false
  }

  // 2. Ambil User + Role + Permission Langsung dari DB (Fresh Data)
  // Kita cari berdasarkan username atau email dari session
  const user = await prisma.user.findFirst({
    where: { 
        OR: [
            { username: session.user.name as string }, // Asumsi session.user.name = username
            // { id: session.user.id } // Jika Anda sudah setup ID di session
        ]
    },
    include: {
      role: {
        include: { permissions: true }
      }
    }
  })

  if (!user || !user.role) {
    console.log(`[AuthGuard] User/Role tidak ditemukan di DB.`)
    return false
  }

  // 3. BYPASS SUPER ADMIN
  // Super Admin selalu boleh ngapain aja
  if (user.role.name === 'Super Admin') return true

  // 4. Cek Permission Spesifik
  const hasAccess = user.role.permissions.some(p => p.action === action)
  
  if (!hasAccess) {
    console.log(`[AuthGuard] GAGAL: User '${user.username}' (Role: ${user.role.name}) mencoba akses '${action}' tapi tidak punya izin.`)
  }

  return hasAccess
}

/**
 * Cek izin, jika GAGAL langsung tendang (Redirect).
 * Cocok untuk memproteksi Server Action atau Halaman Utuh.
 */
export async function requirePermission(action: string) {
  const allowed = await hasPermission(action)
  
  if (!allowed) {
    // Jika dipanggil di Server Action, throw error agar ditangkap blok catch
    throw new Error(`AKSES DITOLAK: Anda tidak memiliki izin '${action}'.`)
  }
}