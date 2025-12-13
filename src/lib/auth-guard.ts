import { auth } from "@/auth" // Pastikan import dari konfigurasi v5
import { redirect } from "next/navigation"

// Fungsi Helper untuk Cek Izin (Return Boolean)
export async function hasPermission(permission: string): Promise<boolean> {
  const session = await auth()
  
  // 1. Cek Login
  if (!session || !session.user) return false

  const userRole = (session.user as any).role
  
  // 2. GOD MODE: Jika Role adalah "Super Admin", IZINKAN SEMUANYA
  // Pastikan nama ini SAMA PERSIS dengan di Database (Case Sensitive)
  if (userRole?.name === "Super Admin") {
    return true
  }

  // 3. Cek Permission Spesifik (Untuk role biasa seperti 'Pengurus', 'Admin', dll)
  const permissions = userRole?.permissions || []
  return permissions.some((p: any) => p.action === permission)
}

// Fungsi Utama Guard (Throw Error jika gagal)
// Digunakan di Server Actions (seperti di file alumni.ts, student.ts yang Anda kirim)
export async function requirePermission(permission: string) {
  const isAllowed = await hasPermission(permission)

  if (!isAllowed) {
    throw new Error(`Akses Ditolak: Anda tidak memiliki izin '${permission}'.`)
  }
}